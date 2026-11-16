import { incrementWithTtl } from './redis.js'

const memoryCounters = new Map()
const LIMITS = {
  perMinute: 12,
  perDay: 80,
  globalPerDay: 1000,
}

function pruneMemory(now = Date.now()) {
  if (memoryCounters.size < 5000) return
  for (const [key, value] of memoryCounters.entries()) {
    if (value.expiresAt <= now) memoryCounters.delete(key)
  }
}

function memoryIncrement(key, ttlSeconds) {
  const now = Date.now()
  pruneMemory(now)

  const current = memoryCounters.get(key)
  if (!current || current.expiresAt <= now) {
    memoryCounters.set(key, { count: 1, expiresAt: now + ttlSeconds * 1000 })
    return 1
  }

  current.count += 1
  return current.count
}

async function increment(key, ttlSeconds) {
  const redisCount = await incrementWithTtl(key, ttlSeconds)
  return redisCount === null ? memoryIncrement(key, ttlSeconds) : redisCount
}

export async function checkRateLimit(ip) {
  if (String(process.env.RATE_LIMIT_DISABLED || '').toLowerCase() === 'true') {
    return { ok: true }
  }

  const now = Date.now()
  const minuteBucket = Math.floor(now / 60000)
  const day = new Date(now).toISOString().slice(0, 10)
  const safeIp = String(ip || 'unknown').replace(/[^a-zA-Z0-9:._-]/g, '_').slice(0, 80)

  const [minuteCount, dayCount, globalCount] = await Promise.all([
    increment(`tunivisa:rl:ip:${safeIp}:m:${minuteBucket}`, 70),
    increment(`tunivisa:rl:ip:${safeIp}:d:${day}`, 90000),
    increment(`tunivisa:rl:global:d:${day}`, 90000),
  ])

  if (minuteCount > LIMITS.perMinute) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((60000 - (now % 60000)) / 1000)),
      reason: 'minute',
    }
  }

  if (dayCount > LIMITS.perDay) {
    return { ok: false, retryAfter: 3600, reason: 'day' }
  }

  if (globalCount > LIMITS.globalPerDay) {
    return { ok: false, retryAfter: 3600, reason: 'global' }
  }

  return { ok: true }
}
