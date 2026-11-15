export const REGIONS = ['Europe', 'Africa', 'Asia', 'Americas', 'Middle East', 'Oceania']

export const VISA_STATUSES = {
  visa_free: {
    key: 'visa_free',
    label: 'Visa Free',
    shortLabel: 'Visa Free',
    description: 'No visa required for stays up to the maximum allowed period.',
    color: 'var(--color-celadon-500)',
    chip: 'bg-celadon-100 text-celadon-900 ring-celadon-700/25',
    dot: 'bg-celadon-500',
    bar: 'bg-celadon-500',
  },
  visa_on_arrival: {
    key: 'visa_on_arrival',
    label: 'Visa on Arrival',
    shortLabel: 'Visa on Arrival',
    description: 'A visa can be obtained upon arrival at the border or airport.',
    color: 'var(--color-warning-500)',
    chip: 'bg-warning-100 text-warning-800 ring-warning-700/25',
    dot: 'bg-warning-500',
    bar: 'bg-warning-500',
  },
  evisa_eta: {
    key: 'evisa_eta',
    label: 'eVisa / eTA',
    shortLabel: 'eVisa / eTA',
    description: 'An electronic visa or travel authorisation must be obtained online before travel.',
    color: 'var(--color-info-600)',
    chip: 'bg-info-100 text-info-700 ring-info-600/25',
    dot: 'bg-info-600',
    bar: 'bg-info-600',
  },
  visa_required: {
    key: 'visa_required',
    label: 'Visa Required',
    shortLabel: 'Visa Required',
    description: 'A visa must be obtained from an embassy or consulate before travel.',
    color: 'var(--color-danger-600)',
    chip: 'bg-danger-600 text-paper ring-danger-700/30',
    dot: 'bg-danger-600',
    bar: 'bg-danger-600',
  },
  unknown: {
    key: 'unknown',
    label: 'Unknown',
    shortLabel: 'Unknown',
    description: 'No data available. Verify with the relevant official source.',
    color: 'var(--color-ink-300)',
    chip: 'bg-ink-100 text-ink-600 ring-ink-900/15',
    dot: 'bg-ink-300',
    bar: 'bg-ink-300',
  },
}

export const STATUS_ORDER = ['visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required', 'unknown']

export function visaStatusMeta(key) {
  return VISA_STATUSES[key] || VISA_STATUSES.unknown
}

export function flagEmoji(code) {
  if (!code) return ''
  const upper = String(code).toUpperCase()
  return Array.from(upper)
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

/**
 * CDN URL for a raster country flag (ISO 3166-1 alpha-2). flagcdn.com serves
 * PNGs at a fixed height; widths 20–2560 are available.
 */
export function flagUrl(code, width = 80) {
  if (!code) return ''
  return `https://flagcdn.com/w${width}/${String(code).toLowerCase()}.png`
}

export function getCountryFlag(country) {
  return country.flag || flagEmoji(country.code)
}

export function formatMaxStay(days) {
  if (!days || days <= 0) return 'Varies'
  if (days >= 365) return `${Math.round(days / 365)} year${days > 365 ? 's' : ''}`
  return `${days} days`
}
