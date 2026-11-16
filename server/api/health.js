import { KNOWLEDGE_META } from '../data/knowledge.js'
import { applyCors } from '../lib/cors.js'

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  applyCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }

  res.status(200).json({
    ok: true,
    service: 'tunivisa-chat-api',
    knowledge: KNOWLEDGE_META,
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      redis: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    },
  })
}
