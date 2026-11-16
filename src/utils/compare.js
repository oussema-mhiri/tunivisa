import { formatMaxStay, visaStatusMeta } from './countryMeta.js'

export const SCHENGEN_CODES = new Set([
  'at', 'be', 'bg', 'hr', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu', 'is',
  'it', 'lv', 'li', 'lt', 'lu', 'mt', 'nl', 'no', 'pl', 'pt', 'ro', 'sk', 'si',
  'es', 'se', 'ch',
])

export function isSchengenShortStayComparison(codes = [], visaType = 'tourism') {
  const shortStay = ['tourism', 'business', 'family', 'medical', 'transit']
  const normalized = codes.map((c) => String(c || '').toLowerCase()).filter(Boolean)
  return (
    shortStay.includes(visaType) &&
    normalized.length >= 2 &&
    normalized.every((code) => SCHENGEN_CODES.has(code))
  )
}

function valueKey(value) {
  if (value == null) return 'null'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function row(id, label, values) {
  const keys = values.map((v) => valueKey(v.raw ?? v.display))
  const different = new Set(keys).size > 1
  return { id, label, values, different }
}

export function buildComparison({ items = [], visaType = 'tourism' } = {}) {
  const countries = items.map((item) => item.country).filter(Boolean)
  const codes = countries.map((c) => c.code)

  const rows = [
    row(
      'status',
      'Status',
      items.map((item) => ({
        code: item.country.code,
        raw: item.rule?.status || item.country.visaStatus || 'unknown',
        display: visaStatusMeta(item.rule?.status || item.country.visaStatus).label,
        meta: visaStatusMeta(item.rule?.status || item.country.visaStatus),
      })),
    ),
    row(
      'maxStay',
      'Maximum stay',
      items.map((item) => {
        const days = item.rule?.maxStayDays ?? item.country.maxStayDays ?? null
        const display = item.rule?.duration || formatMaxStay(days)
        return { code: item.country.code, raw: days ?? display, display }
      }),
    ),
    row(
      'fee',
      'Fee',
      items.map((item) => ({
        code: item.country.code,
        raw: item.rule?.fee || 'Varies',
        display: item.rule?.fee || 'Varies',
      })),
    ),
    row(
      'processing',
      'Processing time',
      items.map((item) => ({
        code: item.country.code,
        raw: item.rule?.processingTime || 'Varies',
        display: item.rule?.processingTime || 'Varies',
      })),
    ),
    row(
      'method',
      'Application method',
      items.map((item) => ({
        code: item.country.code,
        raw: item.rule?.applicationMethod || 'Varies',
        display: item.rule?.applicationMethod || 'Varies',
      })),
    ),
    row(
      'documents',
      'Documents',
      items.map((item) => {
        const count = Array.isArray(item.documents)
          ? item.documents.length
          : Array.isArray(item.rule?.documents)
            ? item.rule.documents.length
            : 0
        return { code: item.country.code, raw: count, display: String(count) }
      }),
    ),
    row(
      'lastVerified',
      'Last verified',
      items.map((item) => ({
        code: item.country.code,
        raw: item.rule?.lastVerified || '',
        display: item.rule?.lastVerified || 'N/A',
      })),
    ),
    row(
      'source',
      'Official source',
      items.map((item) => ({
        code: item.country.code,
        raw: item.rule?.officialSource || '',
        display: item.rule?.officialSource || 'Official government source',
        href: item.rule?.links?.visaApplication || item.rule?.links?.government || null,
      })),
    ),
    row(
      'embassy',
      'Embassy / centre',
      items.map((item) => ({
        code: item.country.code,
        raw: item.embassy?.name || '',
        display: item.embassy?.name || 'Not listed',
        href: item.embassy?.website || null,
      })),
    ),
  ]

  return {
    codes,
    countries,
    visaType,
    rows,
    schengenNote: isSchengenShortStayComparison(codes, visaType),
  }
}
