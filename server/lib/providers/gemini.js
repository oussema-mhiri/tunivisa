import { GEMINI_RESPONSE_SCHEMA } from '../prompt.js'
import { fetchWithTimeout, normalizeModelResult, parseModelJson, ProviderError } from './shared.js'
import { createSseParser } from '../stream.js'

export async function generateWithGemini({ system, contents }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new ProviderError('gemini', 'GEMINI_API_KEY is not configured.', { retryable: false })
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`

  let response
  try {
    response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 700,
          responseMimeType: 'application/json',
          responseSchema: GEMINI_RESPONSE_SCHEMA,
        },
      }),
    })
  } catch (error) {
    throw new ProviderError('gemini', `Gemini request failed: ${error.name || 'network error'}`)
  }

  if (!response.ok) {
    throw new ProviderError('gemini', `Gemini request failed with status ${response.status}.`, {
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
    })
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ProviderError('gemini', 'Gemini returned invalid JSON.')
  }

  const text = (payload?.candidates?.[0]?.content?.parts || [])
    .map((part) => part?.text)
    .filter(Boolean)
    .join('')

  if (!text) {
    throw new ProviderError('gemini', 'Gemini returned no text content.')
  }

  try {
    return normalizeModelResult(parseModelJson(text))
  } catch (error) {
    throw new ProviderError('gemini', `Gemini returned an invalid answer: ${error.message}`)
  }
}

export async function streamGemini({ system, contents, signal, onDelta, onFirstToken }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new ProviderError('gemini', 'GEMINI_API_KEY is not configured.', { retryable: false })
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`

  let response
  try {
    response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 700,
        },
      }),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ProviderError('gemini', `Gemini stream failed: ${error.name || 'network error'}`)
  }

  if (!response.ok) {
    throw new ProviderError('gemini', `Gemini stream failed with status ${response.status}.`, {
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
    })
  }

  const reader = response.body?.getReader()
  if (!reader) throw new ProviderError('gemini', 'Gemini stream body unavailable.')

  let text = ''
  let first = false
  const parser = createSseParser(({ data }) => {
    if (!data || data === '[DONE]') return
    let payload
    try {
      payload = JSON.parse(data)
    } catch {
      return
    }
    const parts = payload?.candidates?.[0]?.content?.parts || []
    for (const part of parts) {
      const chunk = part?.text
      if (!chunk) continue
      if (!first) {
        first = true
        onFirstToken?.()
      }
      text += chunk
      onDelta?.(chunk)
    }
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

  return { text }
}
