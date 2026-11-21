const DEFAULT_ORIGINS = ['https://oussema-mhiri.github.io', 'http://localhost:5173']

function toOrigin(value) {
  const host = String(value || '')
    .split(',')[0]
    .trim()
    .replace(/\/+$/, '')
  if (!host) return ''
  if (/^https?:\/\//i.test(host)) return host
  return `https://${host}`
}

function requestOrigins(req) {
  if (!process.env.VERCEL) return []
  const headers = (req && req.headers) || {}
  return [headers['x-forwarded-host'], headers.host].map(toOrigin)
}

export function allowedOrigins(req) {
  const configured = String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
  const platformOrigins = [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ...requestOrigins(req),
  ].map(toOrigin)
  const defaults = configured.length > 0 ? [] : DEFAULT_ORIGINS

  return [...new Set([...configured, ...defaults, ...platformOrigins].filter(Boolean))]
}

export function isOriginAllowed(origin, req) {
  if (!origin) return true
  return allowedOrigins(req).includes(origin)
}

export function applyCors(req, res) {
  const origin = req.headers.origin
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (origin && isOriginAllowed(origin, req)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
}
