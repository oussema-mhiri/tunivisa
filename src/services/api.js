// -----------------------------------------------------------------------------
// TuniVisa API service layer.
// -----------------------------------------------------------------------------
// Every piece of data the UI needs flows through this module. Today it is
// backed by the bundled MOCK data (see src/data). To connect a real backend,
// set VITE_USE_MOCK=false (and optionally VITE_API_URL) in a `.env` file — the
// same function signatures already match a Node.js + Express REST API, e.g.:
//
//   GET  /api/countries
//   GET  /api/countries/:code
//   GET  /api/countries?search=&status=&region=&sort=
//   GET  /api/countries/:code/visa-rules
//   GET  /api/countries/:code/visa/:visaType
//   GET  /api/countries/:code/embassy
//   GET  /api/countries/:code/visa/:visaType/documents
//   GET  /api/popular-countries
//   GET  /api/visa-statistics
//   GET  /api/map
//   GET  /api/visa-types
//
// The mock adapter simulates network latency so the UI exercises its loading,
// error and empty states just like it would against the real API.
// -----------------------------------------------------------------------------

import { COUNTRIES, POPULAR_DESTINATIONS } from '../data/countries'
import { VISA_TYPES } from '../data/visaTypes'
import { getDocuments } from '../data/documents'
import { getEmbassy as getEmbassyData } from '../data/embassies'
import { buildVisaRule, buildAllVisaRules } from '../data/visaRules'
import { ALL_MAP_COUNTRIES, WORLD_MAP_DATA } from '../data/mapData'
import { flagEmoji, STATUS_ORDER, VISA_STATUSES } from '../utils/countryMeta'
import { REGIONS } from '../utils/countryMeta'

const API_BASE = import.meta.env.VITE_API_URL || '/api'
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const ORIGIN_COUNTRY = { code: 'tn', name: 'Tunisia', flag: '🇹🇳', nationality: 'Tunisian' }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomLatency(min = 320, max = 650) {
  return min + Math.floor(Math.random() * (max - min))
}

async function mockResponse(data, { min, max } = {}) {
  await delay(randomLatency(min, max))
  return data
}

async function apiRequest(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = new Error(`API ${res.status} for ${path}`)
    error.status = res.status
    throw error
  }
  return res.json()
}

/**
 * Normalises a map entry (status key) into a full country shape.
 */
function normalizeMapEntry(entry) {
  return {
    code: entry.code,
    name: entry.name,
    region: entry.region,
    visaStatus: entry.status,
    maxStayDays: entry.maxStayDays,
    flag: flagEmoji(entry.code),
    detailed: entry.detailed,
    home: entry.home,
  }
}

/** Every country we know about: the 20 detailed profiles + the wider map set. */
function allCountries() {
  const seen = new Set()
  const out = []

  for (const c of COUNTRIES) {
    seen.add(c.code)
    out.push({ ...c, flag: c.flag || flagEmoji(c.code), detailed: true })
  }

  for (const entry of ALL_MAP_COUNTRIES) {
    if (seen.has(entry.code) || entry.home) continue
    seen.add(entry.code)
    out.push(normalizeMapEntry(entry))
  }

  return out
}

function findCountry(code) {
  const detailed = COUNTRIES.find((c) => c.code === String(code).toLowerCase())
  if (detailed) return { ...detailed, flag: detailed.flag || flagEmoji(detailed.code), detailed: true }
  const mapEntry = ALL_MAP_COUNTRIES.find((c) => c.code === String(code).toLowerCase())
  if (mapEntry) return normalizeMapEntry(mapEntry)
  return null
}

function countryToRuleSource(country) {
  return {
    code: country.code,
    name: country.name,
    visaStatus: country.visaStatus,
    maxStayDays: country.maxStayDays,
    region: country.region,
  }
}

// ---------------------------------------------------------------------------
// Public API (mock-backed today)
// ---------------------------------------------------------------------------

export async function getCountries() {
  if (!USE_MOCK) return apiRequest('/countries')
  return mockResponse(allCountries())
}

export async function getCountry(code) {
  if (!USE_MOCK) return apiRequest(`/countries/${code}`)
  await delay(randomLatency(260, 500))
  return findCountry(code)
}

export async function searchCountries(query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return mockResponse([])

  const results = allCountries()
    .filter((c) => c.name.toLowerCase().includes(q) || c.code === q || (c.capital || '').toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (!USE_MOCK) return apiRequest(`/countries?search=${encodeURIComponent(q)}`)
  return mockResponse(results)
}

export async function getVisaRules(countryCode) {
  const country = findCountry(countryCode)
  if (!country) return null
  if (!USE_MOCK) return apiRequest(`/countries/${countryCode}/visa-rules`)
  return mockResponse(buildAllVisaRules(countryToRuleSource(country)))
}

export async function getVisaDetails(countryCode, visaType) {
  const country = findCountry(countryCode)
  if (!country) return null

  if (!USE_MOCK) return apiRequest(`/countries/${countryCode}/visa/${visaType}`)

  const rule = buildVisaRule(countryToRuleSource(country), visaType)
  const documents = getDocuments(rule.documents)
  const embassy = country.detailed ? getEmbassy(country.code) : null
  const links = rule.links

  return mockResponse({ country, rule, documents, embassy, links, isMock: true })
}

export async function getCountryComparison({ codes = [], visaType = 'tourism' } = {}) {
  const normalized = [...new Set((codes || []).map((c) => String(c || '').toLowerCase()).filter(Boolean))].slice(0, 4)
  if (!USE_MOCK) {
    return apiRequest(`/compare?countries=${normalized.join(',')}&purpose=${encodeURIComponent(visaType)}`)
  }
  const details = await Promise.all(
    normalized.map(async (code) => {
      const country = findCountry(code)
      if (!country) return null
      const rule = buildVisaRule(countryToRuleSource(country), visaType)
      const documents = getDocuments(rule.documents)
      const embassy = country.detailed ? await getEmbassy(country.code) : null
      return { country, rule, documents, embassy }
    }),
  )
  return mockResponse(details.filter(Boolean), { min: 180, max: 360 })
}

export async function getEmbassy(countryCode) {
  if (!USE_MOCK) return apiRequest(`/countries/${countryCode}/embassy`)
  return mockResponse(getEmbassyData(countryCode))
}

export async function getVisaDocuments(countryCode, visaType) {
  const country = findCountry(countryCode)
  if (!country) return null
  if (!USE_MOCK) return apiRequest(`/countries/${countryCode}/visa/${visaType}/documents`)
  const rule = buildVisaRule(countryToRuleSource(country), visaType)
  return mockResponse(getDocuments(rule.documents))
}

export async function getPopularCountries() {
  if (!USE_MOCK) return apiRequest('/popular-countries')
  const popular = POPULAR_DESTINATIONS.map((code) => findCountry(code)).filter(Boolean)
  return mockResponse(popular)
}

export async function getVisaStatistics() {
  if (!USE_MOCK) return apiRequest('/visa-statistics')

  const counts = {
    visa_free: 0,
    visa_on_arrival: 0,
    evisa_eta: 0,
    visa_required: 0,
    no_admission: 0,
    unknown: 0,
  }

  for (const entry of ALL_MAP_COUNTRIES) {
    if (entry.status && counts[entry.status] !== undefined) counts[entry.status] += 1
    else counts.unknown += 1
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const percentages = Object.fromEntries(
    Object.entries(counts).map(([key, value]) => [key, total ? Math.round((value / total) * 100) : 0]),
  )

  return mockResponse({
    counts,
    total,
    percentages,
    note: 'Based on our tracked map dataset; 20 destinations have full verified guides.',
  })
}

export async function getMapData() {
  if (!USE_MOCK) return apiRequest('/map')
  return mockResponse(WORLD_MAP_DATA, { min: 200, max: 400 })
}

export async function getVisaTypes() {
  if (!USE_MOCK) return apiRequest('/visa-types')
  return mockResponse(VISA_TYPES, { min: 150, max: 300 })
}

export async function getRegions() {
  if (!USE_MOCK) return apiRequest('/regions')
  return mockResponse(REGIONS, { min: 100, max: 200 })
}

/** Search across countries, visa types and travel purposes (command palette). */
export async function globalSearch(query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return { countries: [], visaTypes: [], purposes: [] }

  const countries = (await searchCountries(q)).slice(0, 6)

  const visaTypes = VISA_TYPES.filter((t) => {
    const hay = `${t.label} ${t.shortLabel} ${t.description}`.toLowerCase()
    return hay.includes(q)
  }).slice(0, 4)

  const purposes = VISA_TYPES.filter((t) => t.label.toLowerCase().includes(q)).map((t) => t.id).slice(0, 4)

  return { countries, visaTypes, purposes }
}

export const VISASUPPORT = {
  STATUS_ORDER,
  VISA_STATUSES,
}
