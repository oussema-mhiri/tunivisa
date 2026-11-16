export function initSse(res, { requestId } = {}) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  if (requestId) res.setHeader('X-Request-Id', requestId)
  if (typeof res.flushHeaders === 'function') res.flushHeaders()
}

export function writeSseEvent(res, event, data) {
  if (res.writableEnded || res.destroyed) return
  const payload = typeof data === 'string' ? data : JSON.stringify(data ?? {})
  res.write(`event: ${event}\ndata: ${payload}\n\n`)
}

export function endSse(res) {
  if (!res.writableEnded) res.end()
}

export function createSseParser(onEvent) {
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
      if (dataLines.length || (eventName && eventName !== 'message')) dispatch()
    },
  }
}
