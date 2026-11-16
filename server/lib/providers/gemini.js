import { GEMINI_RESPONSE_SCHEMA } from '../prompt.js'
import { fetchWithTimeout, normalizeModelResult, parseModelJson, ProviderError } from './shared.js'

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
