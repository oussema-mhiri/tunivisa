import { KNOWLEDGE } from '../data/knowledge.js'
import { COUNTRY_ALIASES, VISA_TYPE_KEYWORDS } from './aliases.js'

const MAX_SELECTED_DOCS = 6
const MAX_CONTEXT_CHARS = 6500
const MAX_DOC_CHARS = 2200

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'what', 'which', 'who', 'how', 'are', 'can', 'does', 'did',
  'need', 'needs', 'required', 'require', 'about', 'into', 'your', 'you', 'have', 'has', 'was', 'were', 'will',
  'les', 'des', 'une', 'aux', 'pour', 'avec', 'dans', 'que', 'qui', 'quel', 'quelle', 'quels', 'quelles',
  'est', 'sont', 'comment', 'combien', 'faut', 'il', 'elle', 'ils', 'elles', 'mon', 'ma', 'mes', 'votre', 'vos',
  'notre', 'nos', 'sur', 'sous', 'par', 'pas', 'plus', 'moins', 'aussi', 'mais', 'donc', 'alors', 'quand',
])

const DOCS = KNOWLEDGE.map((doc) => {
  const titleText = normalizeText(doc.title)
  const searchText = normalizeText(
    [doc.title, doc.countryName, doc.visaTypeLabel, doc.text, ...(doc.keywords || [])].filter(Boolean).join(' '),
  )
  return { ...doc, titleText, searchText }
})

const COUNTRY_DOC_CODES = new Set(DOCS.filter((doc) => doc.type === 'country').map((doc) => doc.countryCode))

const DOCUMENT_IDS = new Set(DOCS.filter((doc) => doc.type === 'document').map((doc) => doc.documentId))
const DOC_IDS_BY_VISA_TYPE = (() => {
  const map = new Map()
  for (const doc of DOCS) {
    if (doc.type !== 'visa' || !doc.visaType) continue
    const ids = (doc.keywords || []).filter((keyword) => DOCUMENT_IDS.has(keyword))
    if (!map.has(doc.visaType)) map.set(doc.visaType, new Set())
    for (const id of ids) map.get(doc.visaType).add(id)
  }
  return map
})()

function buildCountryNames() {
  const names = new Map()
  for (const doc of DOCS) {
    if (!doc.countryCode || !doc.countryName) continue
    if (doc.type !== 'country' && doc.type !== 'map') continue
    const normalized = normalizeText(doc.countryName)
    if (normalized) names.set(normalized, doc.countryCode)
  }
  return names
}

const COUNTRY_NAMES = buildCountryNames()

const ALIASES = (() => {
  const entries = new Map()

  for (const [name, code] of COUNTRY_NAMES.entries()) {
    entries.set(name, code)
  }

  for (const [code, aliases] of Object.entries(COUNTRY_ALIASES)) {
    for (const alias of aliases) {
      const normalized = normalizeText(alias)
      if (normalized) entries.set(normalized, code)
    }
  }

  return [...entries.entries()]
    .map(([phrase, code]) => ({ phrase, code }))
    .sort((a, b) => b.phrase.length - a.phrase.length)
})()

const VISA_KEYWORDS = Object.entries(VISA_TYPE_KEYWORDS).flatMap(([id, keywords]) =>
  keywords.map((keyword) => ({ id, phrase: normalizeText(keyword) })).filter((item) => item.phrase),
)

const STATUS_KEYWORDS = {
  visa_free: ['visa free', 'sans visa', 'visa gratuit', 'voyager sans visa', 'no visa', 'where can i travel', 'ou voyager'],
  visa_on_arrival: ['visa on arrival', 'visa a l arrivee', 'visa at arrival'],
  evisa_eta: ['evisa', 'e visa', 'eta', 'electronic visa', 'visa electronique'],
  visa_required: ['visa required', 'visa requis', 'need a visa', 'besoin d un visa'],
}

const STATUS_PHRASES = Object.entries(STATUS_KEYWORDS).flatMap(([id, keywords]) =>
  keywords.map((keyword) => ({ id, phrase: normalizeText(keyword) })).filter((item) => item.phrase),
)

export const KNOWN_COUNTRY_CODES = new Set(DOCS.map((doc) => doc.countryCode).filter(Boolean))
export const KNOWN_VISA_TYPES = new Set(Object.keys(VISA_TYPE_KEYWORDS))

export const KNOWLEDGE_STATS = {
  documents: KNOWLEDGE.length,
  countries: COUNTRY_DOC_CODES.size,
  mapCountries: DOCS.filter((doc) => doc.type === 'map').length,
}

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function hasPhrase(haystack, phrase) {
  if (!phrase) return false
  let index = haystack.indexOf(phrase)

  while (index !== -1) {
    const beforeOk = index === 0 || haystack[index - 1] === ' '
    const afterIndex = index + phrase.length
    const afterOk = afterIndex === haystack.length || haystack[afterIndex] === ' '
    if (beforeOk && afterOk) return true
    index = haystack.indexOf(phrase, index + 1)
  }

  return false
}

function tokenize(query) {
  return [...new Set(normalizeText(query).split(' ').filter((token) => token.length > 2 && !STOP_WORDS.has(token)))]
}

function normalizeCountryCode(value) {
  const code = String(value || '').trim().toLowerCase()
  return KNOWN_COUNTRY_CODES.has(code) ? code : null
}

function normalizeVisaType(value) {
  const type = String(value || '').trim().toLowerCase()
  return KNOWN_VISA_TYPES.has(type) ? type : null
}

export function detectCountry(query, context = {}) {
  const normalized = normalizeText(query)
  let best = null

  for (const alias of ALIASES) {
    if (!hasPhrase(normalized, alias.phrase)) continue
    if (!best || alias.phrase.length > best.phrase.length) best = alias
  }

  if (best) return best.code
  return normalizeCountryCode(context.countryCode)
}

export function detectStatusIntent(query) {
  const normalized = normalizeText(query)
  let best = null

  for (const keyword of STATUS_PHRASES) {
    if (!hasPhrase(normalized, keyword.phrase)) continue
    if (!best || keyword.phrase.length > best.phrase.length) best = keyword
  }

  return best?.id || null
}

export function detectVisaType(query, context = {}) {
  const normalized = normalizeText(query)
  let best = null

  for (const keyword of VISA_KEYWORDS) {
    if (!hasPhrase(normalized, keyword.phrase)) continue
    if (!best || keyword.phrase.length > best.phrase.length) best = keyword
  }

  if (best) return best.id
  return normalizeVisaType(context.visaType)
}

function hasAny(normalized, words) {
  return words.some((word) => hasPhrase(normalized, word))
}

function scoreDoc(doc, normalizedQuery, tokens, countryCode, visaType) {
  let score = 0

  const typeBoost = {
    overview: 0.5,
    country: 3,
    visa: 3,
    map: 1,
    visaType: 2,
    status: 2,
    document: 1,
    embassy: 1,
  }
  score += typeBoost[doc.type] || 0

  if (countryCode) {
    if (doc.countryCode === countryCode) score += 14
    else if (doc.countryCode) score -= 20
    if (doc.type === 'status') score -= 8
  }

  if (visaType) {
    if (doc.visaType === visaType) score += 9
    if (doc.type === 'visa' && doc.countryCode === countryCode && doc.visaType !== visaType) score -= 5
  }

  if (!countryCode && doc.type === 'visa') score -= 8
  if (!visaType && doc.type === 'visa' && !['tourism', 'business', 'study'].includes(doc.visaType)) score -= 4
  if (!visaType && doc.type === 'visa' && doc.visaType === 'tourism') score += 2
  if (!visaType && doc.type === 'visaType') {
    if (doc.visaType === 'tourism') score += 2
    else if (doc.visaType === 'business') score += 1
    else if (!['study'].includes(doc.visaType)) score -= 1
  }
  if (visaType && doc.type === 'document') {
    score += DOC_IDS_BY_VISA_TYPE.get(visaType)?.has(doc.documentId) ? 4.5 : -3
  }

  if (countryCode && COUNTRY_DOC_CODES.has(countryCode) && doc.type === 'map' && doc.countryCode === countryCode) {
    score -= 10
  }

  let tokenScore = 0
  for (const token of tokens) {
    if (doc.searchText.includes(token)) tokenScore += 1.2
  }
  score += Math.min(tokenScore, 6)

  const docWords = [
    'document',
    'documents',
    'pieces',
    'justificatif',
    'justificatifs',
    'checklist',
    'required documents',
    'documents requis',
  ]
  const wantsDocuments = hasAny(normalizedQuery, docWords)
  if (wantsDocuments) {
    if (doc.type === 'visa' || doc.type === 'document') score += 2.5
  }
  if (!wantsDocuments && doc.type === 'document') score -= 6

  const feeWords = ['fee', 'fees', 'frais', 'cout', 'couts', 'price', 'prix', 'combien', 'pay', 'payer']
  if (hasAny(normalizedQuery, feeWords) && doc.type === 'visa') score += 2.5

  const timeWords = ['processing', 'traitement', 'delai', 'delais', 'how long', 'combien de temps', 'wait']
  if (hasAny(normalizedQuery, timeWords) && doc.type === 'visa') score += 2.5

  const embassyWords = ['embassy', 'ambassade', 'consulate', 'consulat', 'appointment', 'rendez vous', 'contact', 'telephone']
  if (hasAny(normalizedQuery, embassyWords) && doc.type === 'embassy') score += 8

  const statusWords = [
    'status',
    'statut',
    'visa free',
    'sans visa',
    'visa on arrival',
    'visa a l arrivee',
    'evisa',
    'eta',
    'visa required',
    'visa requis',
    'entry',
    'entrer',
    'overstay',
    'where can i travel',
    'ou voyager',
  ]
  if (hasAny(normalizedQuery, statusWords) && (doc.type === 'country' || doc.type === 'map')) score += 3
  if (hasAny(normalizedQuery, statusWords) && doc.type === 'status') score += 12
  if (!countryCode && hasAny(normalizedQuery, statusWords) && doc.type === 'country') score -= 4

  if (doc.titleText && tokens.some((token) => doc.titleText.includes(token))) score += 1.5

  return score
}

function dedupeDocs(docs) {
  const seen = new Set()
  return docs.filter((doc) => {
    if (!doc || seen.has(doc.id)) return false
    seen.add(doc.id)
    return true
  })
}

function selectDocs(scored, countryCode, visaType, statusIntent) {
  const selected = []

  const exactVisa = visaType
    ? DOCS.find((doc) => doc.type === 'visa' && doc.countryCode === countryCode && doc.visaType === visaType)
    : null
  const countryDoc = countryCode ? DOCS.find((doc) => doc.type === 'country' && doc.countryCode === countryCode) : null

  if (exactVisa) selected.push(exactVisa)
  if (countryDoc && !selected.includes(countryDoc)) selected.push(countryDoc)

  for (const doc of scored) {
    if (selected.length >= MAX_SELECTED_DOCS) break
    if (doc.type === 'status' && (!statusIntent || doc.status !== statusIntent)) continue
    if (statusIntent && doc.type !== 'status') continue
    if (!countryCode && doc.type === 'visa') continue
    if (!visaType && doc.type === 'visaType' && !['tourism', 'business', 'study'].includes(doc.visaType)) continue
    if (
      countryCode &&
      !visaType &&
      doc.type === 'visa' &&
      !['tourism', 'business', 'study'].includes(doc.visaType)
    ) {
      continue
    }
    if (visaType && doc.type === 'visa' && doc.countryCode === countryCode && doc.visaType !== visaType) continue
    if (
      countryCode &&
      COUNTRY_DOC_CODES.has(countryCode) &&
      doc.type === 'map' &&
      doc.countryCode === countryCode
    ) {
      continue
    }
    if (!selected.includes(doc)) selected.push(doc)
  }

  if (selected.length === 0) {
    const overview = DOCS.find((doc) => doc.type === 'overview')
    if (overview) selected.push(overview)
  }

  return selected.slice(0, MAX_SELECTED_DOCS)
}

function truncate(text, maxLength) {
  const value = String(text || '').trim()
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).trimEnd()}.`
}

export function sourceListFromDocs(docs, limit = 4) {
  const seen = new Set()
  const sources = []

  for (const doc of docs) {
    for (const source of doc.sources || []) {
      if (!source?.url || !/^https?:\/\//i.test(source.url)) continue
      const key = source.url.replace(/#.*$/, '')
      if (seen.has(key)) continue
      seen.add(key)
      sources.push({
        title: String(source.title || doc.title || 'Official source').slice(0, 160),
        url: source.url,
        lastVerified: source.lastVerified || doc.lastVerified || null,
      })
      if (sources.length >= limit) return sources
    }
  }

  return sources
}

export function relatedLinksFromDocs(docs, limit = 4) {
  const seen = new Set()
  const links = []

  for (const doc of docs) {
    if (!doc.route || !doc.route.startsWith('/') || seen.has(doc.route)) continue
    seen.add(doc.route)
    links.push({
      label: doc.title.replace(/\s+-\s+visa document$/i, '').slice(0, 80),
      to: doc.route,
    })
    if (links.length >= limit) break
  }

  return links
}

export function retrieve(query, context = {}) {
  const normalizedQuery = normalizeText(query)
  const tokens = tokenize(query)
  const countryCode = detectCountry(query, context)
  const visaType = detectVisaType(query, context)
  const statusIntent = countryCode ? null : detectStatusIntent(query)

  const scored = DOCS.map((doc) => ({
    doc,
    score: scoreDoc(doc, normalizedQuery, tokens, countryCode, visaType),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
    .map((item) => item.doc)

  const docs = selectDocs(scored, countryCode, visaType, statusIntent)
  const blocks = []
  let usedChars = 0

  for (const [index, doc] of docs.entries()) {
    const block = [
      `[${index + 1}] ${doc.title}`,
      doc.countryName ? `Country: ${doc.countryName}` : null,
      doc.visaTypeLabel ? `Visa purpose: ${doc.visaTypeLabel}` : null,
      doc.route ? `TuniVisa route: ${doc.route}` : null,
      `Last verified: ${doc.lastVerified || 'not available'}`,
      truncate(doc.text, MAX_DOC_CHARS),
    ]
      .filter(Boolean)
      .join('\n')

    if (blocks.length > 0 && usedChars + block.length > MAX_CONTEXT_CHARS) break
    blocks.push(block)
    usedChars += block.length
  }

  return {
    query: String(query || '').trim(),
    countryCode,
    visaType,
    statusIntent,
    docs,
    context: blocks.join('\n\n---\n\n'),
    sources: sourceListFromDocs(docs),
    relatedLinks: relatedLinksFromDocs(docs),
  }
}
