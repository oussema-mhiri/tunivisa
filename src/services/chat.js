const DEV_API_BASE = 'http://localhost:3000/api'
const CONFIGURED_API_BASE = String(import.meta.env.VITE_CHAT_API_URL || '').trim().replace(/\/$/, '')
const API_BASE = CONFIGURED_API_BASE || (import.meta.env.DEV ? DEV_API_BASE : '')

export const CHAT_ENABLED = Boolean(API_BASE)

export class ChatServiceError extends Error {
  constructor(message, { code = 'chat_error', status = null } = {}) {
    super(message)
    this.name = 'ChatServiceError'
    this.code = code
    this.status = status
  }
}

export async function sendChatMessage({ message, language = 'en', history = [], context = {}, signal }) {
  if (!API_BASE) {
    throw new ChatServiceError('Chat is not configured.', { code: 'not_configured' })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        language,
        history: history.slice(-6),
        context,
      }),
      signal: controller.signal,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new ChatServiceError(data.error || 'The assistant could not answer right now.', {
        code: data.code || 'request_failed',
        status: response.status,
      })
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ChatServiceError(signal?.aborted ? 'Request cancelled.' : 'The request timed out.', {
        code: signal?.aborted ? 'aborted' : 'timeout',
      })
    }
    if (error instanceof ChatServiceError) throw error
    throw new ChatServiceError('Unable to reach the assistant.', { code: 'network_error' })
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}
