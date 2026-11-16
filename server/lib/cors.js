const DEFAULT_ORIGINS = ['https://oussema-mhiri.github.io', 'http://localhost:5173']

export function allowedOrigins() {
  const configured = String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return configured.length > 0 ? configured : DEFAULT_ORIGINS
}

export function isOriginAllowed(origin) {
  if (!origin) return true
  return allowedOrigins().includes(origin)
}

export function applyCors(req, res) {
  const origin = req.headers.origin
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Max-Age', '86400')

  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
}
