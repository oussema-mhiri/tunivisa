const DEV_API_BASE = 'http://localhost:3000/api'
const CONFIGURED_API_BASE = String(import.meta.env.VITE_CHAT_API_URL || '').trim().replace(/\/$/, '')
const VERCEL_BUILD = typeof __VERCEL_BUILD__ !== 'undefined' && __VERCEL_BUILD__
const API_BASE =
  CONFIGURED_API_BASE || (import.meta.env.DEV ? DEV_API_BASE : VERCEL_BUILD ? '/api' : '')

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

function createSseParser(onEvent) {
  const decoder = new TextDecoder()
  let buffer = ''
  let eventName = 'message'
  let dataLines = []

  function dispatch() {
    if (eventName == null) return
    const data = dataLines.join('\n')
    onEvent({ event: eventName || 'message', data })
    eventName = 'message'
    dataLines = []
  }

  function processLine(line) {
    if (line === '') {
      dispatch()
      return
    }
    if (line.startsWith(':')) return
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim() || 'message'
      return
    }
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^\s/, ''))
    }
  }

  return {
    push(chunk) {
      const text = typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })
      buffer += text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
      let idx
      while ((idx = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, idx)
        buffer = buffer.slice(idx + 1)
        processLine(line)
      }
    },
    flush() {
      const rest = decoder.decode()
      if (rest) buffer += rest
      if (buffer) {
        processLine(buffer)
        buffer = ''
      }
      if (dataLines.length) dispatch()
    },
  }
}

export async function streamChatMessage({ message, language = 'en', history = [], context = {}, signal, onEvent }) {
  if (!API_BASE) {
    throw new ChatServiceError('Chat is not configured.', { code: 'not_configured' })
  }

  const controller = new AbortController()
  const abortFromCaller = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({
        message,
        language,
        history: history.slice(-6),
        context,
        stream: true,
      }),
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    if (!response.ok || !contentType.includes('text/event-stream')) {
      const data = await response.json().catch(() => ({}))
      throw new ChatServiceError(data.error || 'The assistant could not answer right now.', {
        code: data.code || 'request_failed',
        status: response.status,
      })
    }

    const reader = response.body?.getReader()
    if (!reader) throw new ChatServiceError('Streaming not supported.', { code: 'stream_unsupported' })

    let gotToken = false
    const parser = createSseParser((evt) => {
      let data = {}
      if (evt.data) {
        try {
          data = JSON.parse(evt.data)
        } catch {
          data = { raw: evt.data }
        }
      }
      if (evt.event === 'delta' && data.text) gotToken = true
      if (evt.event === 'start' && (data.sources || data.relatedLinks)) gotToken = gotToken || false
      onEvent?.({ event: evt.event, data })
    })

    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) parser.push(value)
      }
      parser.flush()
    } finally {
      reader.releaseLock?.()
    }

    return { gotToken }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ChatServiceError(signal?.aborted ? 'Request cancelled.' : 'The request timed out.', {
        code: signal?.aborted ? 'aborted' : 'timeout',
      })
    }
    if (error instanceof ChatServiceError) throw error
    throw new ChatServiceError('Unable to reach the assistant.', { code: 'network_error' })
  } finally {
    signal?.removeEventListener('abort', abortFromCaller)
  }
}

export async function sendFeedback({ requestId, vote, messageId, context = {} }) {
  if (!API_BASE || !requestId || (vote !== 'up' && vote !== 'down')) {
    return { ok: false, stored: false }
  }
  try {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        vote,
        ...(messageId ? { messageId } : {}),
        ...(context && (context.countryCode || context.visaType) ? { context } : {}),
      }),
    })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok || response.status === 202, stored: Boolean(data.stored), status: response.status }
  } catch {
    return { ok: false, stored: false }
  }
}
