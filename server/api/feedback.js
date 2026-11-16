import { randomUUID } from 'node:crypto'
import { applyCors, isOriginAllowed } from '../lib/cors.js'
import { storeFeedback } from '../lib/feedback.js'
import { checkRateLimit } from '../lib/rateLimit.js'
import { HttpError, parseFeedbackRequest } from '../lib/validate.js'

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

export default async function handler(req, res) {
  const requestId = randomUUID()
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
    payload = parseFeedbackRequest(req.body)
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message, code: error.code, requestId })
      return
    }
    res.status(400).json({ error: 'Invalid request.', code: 'invalid_request', requestId })
    return
  }

  const rateLimit = await checkRateLimit(`feedback:${clientIp(req)}`)
  if (!rateLimit.ok) {
    res.setHeader('Retry-After', String(rateLimit.retryAfter || 60))
    res.status(429).json({ error: 'Too many requests.', code: 'rate_limited', requestId })
    return
  }

  const entry = {
    requestId: payload.requestId,
    vote: payload.vote,
    messageId: payload.messageId || null,
    context: payload.context || {},
    receivedAt: new Date().toISOString(),
  }

  const result = await storeFeedback(entry)
  if (!result.stored) {
    res.status(202).json({ ok: true, stored: false, requestId })
    return
  }

  res.status(200).json({ ok: true, stored: true, requestId })
}
