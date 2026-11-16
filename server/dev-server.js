import http from 'node:http'
import { loadEnvFile } from 'node:process'
import chatHandler from './api/chat.js'
import feedbackHandler from './api/feedback.js'
import healthHandler from './api/health.js'

try {
  loadEnvFile(new URL('./.env', import.meta.url))
} catch {}

const routes = {
  '/api/chat': chatHandler,
  '/api/feedback': feedbackHandler,
  '/api/health': healthHandler,
}

const MAX_BODY_BYTES = 1024 * 1024

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []

    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body is too large.'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })

    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function decorateResponse(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }

  res.json = (body) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
    res.end(JSON.stringify(body))
  }

  return res
}

const server = http.createServer(async (req, res) => {
  decorateResponse(res)

  const url = new URL(req.url || '/', 'http://127.0.0.1')
  const handler = routes[url.pathname]

  if (!handler) {
    res.status(404).json({ error: 'Not found.' })
    return
  }

  try {
    if (req.method === 'POST') {
      req.body = await readBody(req)
    }
    await handler(req, res)
  } catch (error) {
    console.error(error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error.' })
    } else {
      res.end()
    }
  }
})

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '127.0.0.1'

server.listen(port, host, () => {
  console.log(`TuniVisa chat API listening on http://${host}:${port}`)
  console.log(`Health: http://${host}:${port}/api/health`)
})
