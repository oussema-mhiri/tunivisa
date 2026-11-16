import { hasRedis, redisCommand } from './redis.js'

const FEEDBACK_KEY = 'tunivisa:feedback:events'
const FEEDBACK_TTL_SECONDS = 60 * 60 * 24 * 30

export async function storeFeedback(entry) {
  if (!hasRedis()) {
    return { stored: false }
  }

  const payload = JSON.stringify(entry)
  const pushed = await redisCommand(['RPUSH', FEEDBACK_KEY, payload])
  if (pushed === null) return { stored: false }
  await redisCommand(['EXPIRE', FEEDBACK_KEY, FEEDBACK_TTL_SECONDS])
  return { stored: true }
}
