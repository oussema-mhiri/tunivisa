export const MAX_MESSAGE_LENGTH = 500
export const MAX_HISTORY_MESSAGES = 6
export const MAX_HISTORY_CONTENT = 1200
export const MAX_BODY_LENGTH = 20000

export class HttpError extends Error {
  constructor(status, message, code = 'bad_request') {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

function parseBody(body) {
  if (!body) throw new HttpError(400, 'Request body is required.', 'missing_body')
  if (typeof body === 'string') {
    if (body.length > MAX_BODY_LENGTH) throw new HttpError(413, 'Request body is too large.', 'body_too_large')
    try {
      return JSON.parse(body)
    } catch {
      throw new HttpError(400, 'Request body must be valid JSON.', 'invalid_json')
    }
  }
  if (typeof body === 'object') return body
  throw new HttpError(400, 'Request body must be a JSON object.', 'invalid_body')
}

function normalizeLanguage(value) {
  const language = String(value || '').trim().toLowerCase()
  return language === 'fr' || language === 'ar' ? language : 'en'
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return []

  return history
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
    .map((item) => ({
      role: item.role,
      content: String(item.content || '').replace(/\s+/g, ' ').trim().slice(0, MAX_HISTORY_CONTENT),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_HISTORY_MESSAGES)
}

function normalizeContext(context) {
  if (!context || typeof context !== 'object') return {}

  const countryCode = String(context.countryCode || '').trim().toLowerCase()
  const visaType = String(context.visaType || '').trim().toLowerCase()

  const out = {}
  if (/^[a-z]{2}$/.test(countryCode)) out.countryCode = countryCode
  if (/^[a-z]{3,20}$/.test(visaType)) out.visaType = visaType
  return out
}

export function parseChatRequest(body) {
  const payload = parseBody(body)
  const message = String(payload.message || '').replace(/\s+/g, ' ').trim()

  if (!message) {
    throw new HttpError(400, 'Message is required.', 'missing_message')
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new HttpError(400, `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`, 'message_too_long')
  }

  return {
    message,
    language: normalizeLanguage(payload.language),
    history: normalizeHistory(payload.history),
    context: normalizeContext(payload.context),
    stream: Boolean(payload.stream),
  }
}

export function parseFeedbackRequest(body) {
  const payload = parseBody(body)
  const requestId = String(payload.requestId || '').trim()
  const vote = String(payload.vote || '').trim().toLowerCase()
  const messageId = payload.messageId == null ? '' : String(payload.messageId).trim()

  if (!requestId || requestId.length > 120) {
    throw new HttpError(400, 'A valid requestId is required.', 'invalid_request_id')
  }
  if (vote !== 'up' && vote !== 'down') {
    throw new HttpError(400, 'A valid vote is required.', 'invalid_vote')
  }
  if (messageId && messageId.length > 120) {
    throw new HttpError(400, 'Invalid messageId.', 'invalid_message_id')
  }

  return {
    requestId,
    vote,
    ...(messageId ? { messageId } : {}),
    context: normalizeContext(payload.context),
  }
}
