import { randomUUID } from 'node:crypto'
import { buildCacheKey, getCached, setCached } from '../lib/cache.js'
import { applyCors, isOriginAllowed } from '../lib/cors.js'
import {
  buildGeminiContents,
  buildGroqMessages,
  buildStreamingSystemPrompt,
  buildStreamingUserPrompt,
  buildSystemPrompt,
  buildUserPrompt,
  defaultSuggestions,
  fallbackAnswer,
} from '../lib/prompt.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { retrieve } from '../lib/retrieval.js'
import { generateWithGemini, streamGemini } from '../lib/providers/gemini.js'
import { generateWithGroq, streamGroq } from '../lib/providers/groq.js'
import { initSse, writeSseEvent, endSse } from '../lib/stream.js'
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

async function handleJson(req, res, { requestId, payload, retrieved, cacheKey, labels, startedAt }) {
  const cached = await getCached(cacheKey)
  if (cached?.answer) {
    res.status(200).json({ ...cached, provider: 'cache', cached: true, requestId })
    return
  }

  const system = buildSystemPrompt(payload.language)
  const prompt = buildUserPrompt({ message: payload.message, context: retrieved.context })

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

async function handleStream(req, res, { requestId, payload, retrieved, cacheKey, labels, startedAt }) {
  const cached = await getCached(cacheKey)
  initSse(res, { requestId })

  if (cached?.answer) {
    writeSseEvent(res, 'start', { requestId, sources: cached.sources || [], relatedLinks: cached.relatedLinks || [] })
    if (cached.answer) writeSseEvent(res, 'delta', { text: cached.answer })
    writeSseEvent(res, 'done', {
      provider: 'cache',
      cached: true,
      suggestedFollowUps: cached.suggestedFollowUps || [],
    })
    endSse(res)
    return
  }

  const system = buildStreamingSystemPrompt(payload.language)
  const prompt = buildStreamingUserPrompt({ message: payload.message, context: retrieved.context })
  const suggestedFollowUps = defaultSuggestions(payload.language, labels)
  let streamed = false
  let provider = null
  let text = ''
  let clientClosed = false
  const abortController = new AbortController()

  req.on?.('close', () => {
    clientClosed = true
    abortController.abort()
  })

  writeSseEvent(res, 'start', { requestId, sources: retrieved.sources || [], relatedLinks: retrieved.relatedLinks || [] })

  const onDelta = (chunk) => {
    streamed = true
    text += chunk
    if (!clientClosed) writeSseEvent(res, 'delta', { text: chunk })
  }

  try {
    provider = 'gemini'
    const result = await streamGemini({
      system,
      contents: buildGeminiContents({ history: payload.history, prompt }),
      signal: abortController.signal,
      onDelta,
    })
    text = result.text || text
  } catch (geminiError) {
    if (!streamed && !clientClosed) {
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
        provider = 'groq'
        const result = await streamGroq({
          messages: buildGroqMessages({ system, history: payload.history, prompt }),
          signal: abortController.signal,
          onDelta,
        })
        text = result.text || text
      } catch (groqError) {
        console.error(
          JSON.stringify({
            event: 'chat_providers_unavailable',
            requestId,
            gemini: geminiError.message,
            groq: groqError.message,
          }),
        )
        writeSseEvent(res, 'error', { code: 'providers_unavailable', message: 'The visa assistant is temporarily unavailable. Please try again later.' })
        endSse(res)
        return
      }
    } else if (!clientClosed) {
      writeSseEvent(res, 'error', { code: 'stream_error', message: 'The response stream was interrupted.' })
      endSse(res)
      return
    } else {
      return
    }
  }

  if (clientClosed) return

  const answer = String(text || '').trim() || fallbackAnswer(payload.language)
  const response = {
    answer,
    sources: retrieved.sources,
    suggestedFollowUps,
    relatedLinks: retrieved.relatedLinks,
  }
  await setCached(cacheKey, response)

  console.log(
    JSON.stringify({
      event: 'chat_response',
      requestId,
      provider,
      stream: true,
      language: payload.language,
      hasCountry: Boolean(retrieved.countryCode),
      hasVisaType: Boolean(retrieved.visaType),
      docs: retrieved.docs.length,
      latencyMs: Date.now() - startedAt,
    }),
  )

  writeSseEvent(res, 'done', { provider, cached: false, suggestedFollowUps })
  endSse(res)
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
  const labels = requestLabel(retrieved)

  if (payload.stream) {
    await handleStream(req, res, { requestId, payload, retrieved, cacheKey, labels, startedAt })
    return
  }

  await handleJson(req, res, { requestId, payload, retrieved, cacheKey, labels, startedAt })
}
