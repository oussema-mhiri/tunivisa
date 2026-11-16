import { randomUUID } from 'node:crypto'
import { buildCacheKey, getCached, setCached } from '../lib/cache.js'
import { applyCors, isOriginAllowed } from '../lib/cors.js'
import {
  buildGeminiContents,
  buildGroqMessages,
  buildSystemPrompt,
  buildUserPrompt,
  defaultSuggestions,
  fallbackAnswer,
} from '../lib/prompt.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { retrieve } from '../lib/retrieval.js'
import { generateWithGemini } from '../lib/providers/gemini.js'
import { generateWithGroq } from '../lib/providers/groq.js'
import { HttpError, parseChatRequest } from '../lib/validate.js'

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

function requestLabel(retrieved) {
  const country = retrieved.docs.find((doc) => doc.countryCode === retrieved.countryCode && doc.countryName)
  const visa = retrieved.docs.find((doc) => doc.visaType === retrieved.visaType && doc.visaTypeLabel)
  return {
    countryName: country?.countryName || null,
    visaTypeLabel: visa?.visaTypeLabel || null,
  }
}

export default async function handler(req, res) {
  const requestId = randomUUID()
  const startedAt = Date.now()
  res.setHeader('X-Request-Id', requestId)
  res.setHeader('Cache-Control', 'no-store')
  applyCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.', code: 'method_not_allowed', requestId })
    return
  }

  if (req.headers.origin && !isOriginAllowed(req.headers.origin)) {
    res.status(403).json({ error: 'Origin not allowed.', code: 'origin_not_allowed', requestId })
    return
  }

  let payload
  try {
    payload = parseChatRequest(req.body)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message, code: error.code, requestId })
      return
    }
    res.status(400).json({ error: 'Invalid request.', code: 'invalid_request', requestId })
    return
  }

  const rateLimit = await checkRateLimit(clientIp(req))
  if (!rateLimit.ok) {
    res.setHeader('Retry-After', String(rateLimit.retryAfter || 60))
    res.status(429).json({
      error: 'Too many requests. Please try again shortly.',
      code: 'rate_limited',
      requestId,
    })
    return
  }

  const retrieved = retrieve(payload.message, payload.context)
  const cacheKey = buildCacheKey(payload)
  const cached = await getCached(cacheKey)

  if (cached?.answer) {
    res.status(200).json({ ...cached, provider: 'cache', cached: true, requestId })
    return
  }

  const system = buildSystemPrompt(payload.language)
  const prompt = buildUserPrompt({ message: payload.message, context: retrieved.context })
  const labels = requestLabel(retrieved)

  let result
  let provider

  try {
    result = await generateWithGemini({
      system,
      contents: buildGeminiContents({ history: payload.history, prompt }),
    })
    provider = 'gemini'
  } catch (geminiError) {
    console.warn(
      JSON.stringify({
        event: 'chat_provider_error',
        requestId,
        provider: 'gemini',
        status: geminiError.status || null,
        message: geminiError.message,
      }),
    )

    try {
      result = await generateWithGroq({
        messages: buildGroqMessages({ system, history: payload.history, prompt }),
      })
      provider = 'groq'
    } catch (groqError) {
      console.error(
        JSON.stringify({
          event: 'chat_providers_unavailable',
          requestId,
          gemini: geminiError.message,
          groq: groqError.message,
        }),
      )
      res.status(503).json({
        error: 'The visa assistant is temporarily unavailable. Please try again later.',
        code: 'providers_unavailable',
        requestId,
      })
      return
    }
  }

  const answer = result.answer || fallbackAnswer(payload.language)
  const response = {
    answer,
    sources: retrieved.sources,
    suggestedFollowUps:
      result.suggestedFollowUps?.length > 0
        ? result.suggestedFollowUps
        : defaultSuggestions(payload.language, labels),
    relatedLinks: retrieved.relatedLinks,
  }

  await setCached(cacheKey, response)

  console.log(
    JSON.stringify({
      event: 'chat_response',
      requestId,
      provider,
      language: payload.language,
      hasCountry: Boolean(retrieved.countryCode),
      hasVisaType: Boolean(retrieved.visaType),
      docs: retrieved.docs.length,
      latencyMs: Date.now() - startedAt,
    }),
  )

  res.status(200).json({ ...response, provider, cached: false, requestId })
}
