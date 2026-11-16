import { GROQ_RESPONSE_SCHEMA } from '../prompt.js'
import { fetchWithTimeout, normalizeModelResult, parseModelJson, ProviderError } from './shared.js'

export async function generateWithGroq({ messages }) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new ProviderError('groq', 'GROQ_API_KEY is not configured.', { retryable: false })
  }

  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'

  let response
  try {
    response = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 700,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'tunivisa_chat',
            strict: true,
            schema: GROQ_RESPONSE_SCHEMA,
          },
        },
      }),
    })
  } catch (error) {
    throw new ProviderError('groq', `Groq request failed: ${error.name || 'network error'}`)
  }

  if (!response.ok) {
    throw new ProviderError('groq', `Groq request failed with status ${response.status}.`, {
      status: response.status,
      retryable: response.status === 429 || response.status >= 500,
    })
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ProviderError('groq', 'Groq returned invalid JSON.')
  }

  const text = payload?.choices?.[0]?.message?.content
  if (!text) {
    throw new ProviderError('groq', 'Groq returned no text content.')
  }

  try {
    return normalizeModelResult(parseModelJson(text))
  } catch (error) {
    throw new ProviderError('groq', `Groq returned an invalid answer: ${error.message}`)
  }
}
