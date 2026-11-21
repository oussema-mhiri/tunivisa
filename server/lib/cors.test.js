import assert from 'node:assert/strict'
import test from 'node:test'
import { allowedOrigins, applyCors, isOriginAllowed } from './cors.js'

const ENV_KEYS = [
  'ALLOWED_ORIGINS',
  'VERCEL',
  'VERCEL_URL',
  'VERCEL_BRANCH_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
]

function withEnv(values, run) {
  const original = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]))
  try {
    for (const key of ENV_KEYS) delete process.env[key]
    Object.assign(process.env, values)
    run()
  } finally {
    for (const key of ENV_KEYS) {
      if (original[key] === undefined) delete process.env[key]
      else process.env[key] = original[key]
    }
  }
}

function response() {
  const headers = {}
  return {
    headers,
    setHeader(key, value) {
      headers[key] = value
    },
  }
}

test('allows default local origins when nothing is configured', () => {
  withEnv({}, () => {
    assert.equal(isOriginAllowed('http://localhost:5173'), true)
    assert.equal(isOriginAllowed('https://oussema-mhiri.github.io'), true)
    assert.equal(isOriginAllowed('https://unknown.example'), false)
  })
})

test('keeps the Vercel production origin when an allowlist is configured', () => {
  withEnv(
    {
      ALLOWED_ORIGINS: 'https://example.com',
      VERCEL: '1',
      VERCEL_PROJECT_PRODUCTION_URL: 'tunivisa.vercel.app',
    },
    () => {
      assert.equal(isOriginAllowed('https://example.com'), true)
      assert.equal(isOriginAllowed('https://tunivisa.vercel.app'), true)
      assert.equal(isOriginAllowed('https://oussema-mhiri.github.io'), false)
    },
  )
})

test('allows Vercel deployment and branch URLs', () => {
  withEnv(
    {
      VERCEL: '1',
      VERCEL_URL: 'tunivisa-qp64mynth-oussema4.vercel.app',
      VERCEL_BRANCH_URL: 'tunivisa-git-main-oussema-mhiri.vercel.app',
    },
    () => {
      assert.equal(isOriginAllowed('https://tunivisa-qp64mynth-oussema4.vercel.app'), true)
      assert.equal(isOriginAllowed('https://tunivisa-git-main-oussema-mhiri.vercel.app'), true)
    },
  )
})

test('allows the current request host on Vercel and sets the CORS header', () => {
  withEnv({ VERCEL: '1', ALLOWED_ORIGINS: 'https://example.com' }, () => {
    const req = {
      headers: {
        origin: 'https://tunivisa.vercel.app',
        'x-forwarded-host': 'tunivisa.vercel.app',
        host: 'tunivisa.vercel.app',
      },
    }
    const res = response()

    assert.equal(isOriginAllowed(req.headers.origin, req), true)
    applyCors(req, res)
    assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://tunivisa.vercel.app')
    assert.equal(res.headers.Vary, 'Origin')
  })
})

test('does not trust the request host outside Vercel', () => {
  withEnv({}, () => {
    const req = {
      headers: { origin: 'https://tunivisa.vercel.app', host: 'tunivisa.vercel.app' },
    }

    assert.equal(isOriginAllowed(req.headers.origin, req), false)
    assert.equal(allowedOrigins(req).includes('https://tunivisa.vercel.app'), false)
  })
})
