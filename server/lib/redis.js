const REDIS_TIMEOUT_MS = 1800

export function hasRedis() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

export async function redisCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const response = await fetch(url.replace(/\/$/, ''), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
    })

    if (!response.ok) return null
    const data = await response.json()
    return data?.result ?? null
  } catch {
    return null
  }
}

export async function redisGet(key) {
  return redisCommand(['GET', key])
}

export async function redisSet(key, value, ttlSeconds) {
  return redisCommand(['SET', key, value, 'EX', ttlSeconds])
}

export async function incrementWithTtl(key, ttlSeconds) {
  const count = await redisCommand(['INCR', key])
  if (count === null) return null
  if (Number(count) === 1) await redisCommand(['EXPIRE', key, ttlSeconds])
  return Number(count)
}
