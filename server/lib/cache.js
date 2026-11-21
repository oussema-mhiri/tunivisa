import { createHash } from 'node:crypto'
import { KNOWLEDGE_META } from '../data/knowledge.js'
import { redisGet, redisSet } from './redis.js'

const CACHE_TTL_SECONDS = 60 * 60 * 24
const CACHE_VERSION = `v2-${KNOWLEDGE_META.generatedAt}`

export function buildCacheKey({ message, language, context, history }) {
  if (history && history.length > 0) return null

  const payload = [
    CACHE_VERSION,
    language,
    context?.countryCode || '',
    context?.visaType || '',
    String(message || '').toLowerCase().replace(/\s+/g, ' ').trim(),
  ].join('|')
  const hash = createHash('sha256').update(payload).digest('hex')
  return `tunivisa:chat:${CACHE_VERSION}:${hash}`
}

export async function getCached(key) {
  if (!key) return null
  const raw = await redisGet(key)
  if (!raw || typeof raw !== 'string') return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function setCached(key, value) {
  if (!key) return
  await redisSet(key, JSON.stringify(value), CACHE_TTL_SECONDS)
}
