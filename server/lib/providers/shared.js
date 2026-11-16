export class ProviderError extends Error {
  constructor(provider, message, { status = null, retryable = true } = {}) {
    super(message)
    this.name = 'ProviderError'
    this.provider = provider
    this.status = status
    this.retryable = retryable
  }
}

export async function fetchWithTimeout(url, options = {}) {
  const timeout = Number(process.env.PROVIDER_TIMEOUT_MS || 11000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export function parseModelJson(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Provider returned an empty response.')
  }

  let text = content.trim()
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Provider response did not contain a JSON object.')
  }

  return JSON.parse(text.slice(start, end + 1))
}

export function normalizeModelResult(data) {
  const answer = String(data?.answer || '')
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
    .slice(0, 4000)

  if (!answer) throw new Error('Provider returned an empty answer.')

  const suggestedFollowUps = Array.isArray(data?.suggestedFollowUps)
    ? data.suggestedFollowUps
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .slice(0, 3)
        .map((item) => item.slice(0, 160))
    : []

  return {
    answer,
    suggestedFollowUps,
  }
}
