import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = resolve(ROOT, 'server/data/knowledge.js')

const STATUS_LABELS = {
  visa_free: 'Visa-free for Tunisian passport holders',
  visa_on_arrival: 'Visa on arrival for Tunisian passport holders',
  evisa_eta: 'eVisa or eTA available for Tunisian passport holders',
  visa_required: 'Visa required before travel for Tunisian passport holders',
  no_admission: 'No admission for Tunisian passport holders',
  unknown: 'Visa status not confirmed',
}

const STATUS_SHORT = {
  visa_free: 'visa-free access',
  visa_on_arrival: 'visa on arrival',
  evisa_eta: 'eVisa or eTA',
  visa_required: 'visa required before travel',
  no_admission: 'no admission',
  unknown: 'unconfirmed status',
}

const REGION_LABELS = {
  Europe: 'Europe',
  Africa: 'Africa',
  Asia: 'Asia',
  Americas: 'Americas',
  'Middle East': 'Middle East',
  Oceania: 'Oceania',
}

let OFFICIAL_LINKS = {}
let OFFICIAL_SOURCE = {}
let LAST_VERIFIED = {}
let VISA_TYPES = []

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))]
}

function sourceList(countryCode) {
  const links = OFFICIAL_LINKS[countryCode] || {}
  const sourceName = OFFICIAL_SOURCE[countryCode] || 'Official government source'
  const lastVerified = LAST_VERIFIED[countryCode] || '2026-11-14'
  const sources = []

  if (links.visaApplication) {
    sources.push({ title: `${sourceName} - visa application`, url: links.visaApplication, lastVerified })
  }
  if (links.government && links.government !== links.visaApplication) {
    sources.push({ title: `${sourceName} - official information`, url: links.government, lastVerified })
  }

  return sources
}

function makeCountryDoc(country) {
  const status = STATUS_LABELS[country.visaStatus] || STATUS_LABELS.unknown
  const stay = country.maxStayDays ? `The maximum stay is ${country.maxStayDays} days.` : 'The maximum stay varies by entry decision.'
  const source = OFFICIAL_SOURCE[country.code] || 'Official government source'
  const lastVerified = LAST_VERIFIED[country.code] || '2026-11-14'

  return {
    id: `country:${country.code}`,
    type: 'country',
    title: `${country.name} visa requirements`,
    countryCode: country.code,
    countryName: country.name,
    route: `/countries/${country.code}`,
    text: `${country.name} (${country.code.toUpperCase()}) is in ${REGION_LABELS[country.region] || country.region}. For Tunisian passport holders: ${status}. ${stay} ${country.description || ''} TuniVisa has a full destination guide for ${country.name}. Official source: ${source}. Last verified: ${lastVerified}.`,
    keywords: unique([country.name, country.officialName, country.code, country.capital, country.region, country.visaStatus, 'visa', 'requirements', 'stay']),
    sources: sourceList(country.code),
    lastVerified,
  }
}

function makeVisaDoc(country, rule, documents) {
  const type = VISA_TYPES.find((item) => item.id === rule.visaType)
  const typeLabel = type?.shortLabel || rule.visaTypeLabel
  const documentText = documents
    .map((doc) => `${doc.label}${doc.required ? '' : ' (if applicable)'}: ${doc.description} ${doc.details}`)
    .join(' ')
  const steps = rule.steps.map((step, index) => `${index + 1}. ${step.title}: ${step.text}`).join(' ')
  const source = rule.officialSource || OFFICIAL_SOURCE[country.code] || 'Official government source'
  const links = rule.links || {}
  const lastVerified = rule.lastVerified || LAST_VERIFIED[country.code] || '2026-11-14'

  return {
    id: `visa:${country.code}:${rule.visaType}`,
    type: 'visa',
    title: `${country.name} ${typeLabel} for Tunisian passport holders`,
    countryCode: country.code,
    countryName: country.name,
    visaType: rule.visaType,
    visaTypeLabel: typeLabel,
    route: `/countries/${country.code}/visa/${rule.visaType}`,
    text: `${country.name} - ${typeLabel}. Status: ${STATUS_LABELS[rule.status] || rule.status}. Duration: ${rule.duration}. Entries: ${rule.entries}. Fee: ${rule.fee}. Processing time: ${rule.processingTime}. Application method: ${rule.applicationMethod}. Notes: ${rule.notes}. Required documents: ${documentText}. Application steps: ${steps} Official source: ${source}. ${links.visaApplication ? `Visa portal: ${links.visaApplication}.` : ''} Last verified: ${lastVerified}.`,
    keywords: unique([
      country.name,
      country.code,
      rule.visaType,
      typeLabel,
      type?.label,
      rule.status,
      'visa',
      'requirements',
      'documents',
      'fees',
      'fee',
      'processing',
      'application',
      'appointment',
      'checklist',
      ...(rule.documents || []),
    ]),
    sources: sourceList(country.code),
    lastVerified,
  }
}

function makeMapDoc(entry) {
  const stay = entry.maxStayDays ? `Maximum stay: ${entry.maxStayDays} days.` : 'Maximum stay: varies or not confirmed.'
  return {
    id: `map:${entry.code}`,
    type: 'map',
    title: `${entry.name} entry status`,
    countryCode: entry.code,
    countryName: entry.name,
    route: `/countries/${entry.code}`,
    text: `${entry.name} (${entry.code.toUpperCase()}) is covered by the TuniVisa world map, but not by a full destination guide. Status: ${STATUS_LABELS[entry.status] || entry.status}. ${stay} Only the entry status is tracked for this destination. Always confirm the latest rule with the airline and the destination's official government source before booking.`,
    keywords: unique([entry.name, entry.code, entry.region, entry.status, 'visa', 'entry', 'status']),
    sources: [],
    lastVerified: '2026-11-14',
  }
}

function makeVisaTypeDoc(type) {
  return {
    id: `type:${type.id}`,
    type: 'visaType',
    title: `${type.shortLabel} overview`,
    visaType: type.id,
    visaTypeLabel: type.shortLabel,
    route: `/assistant?purpose=${type.id}`,
    text: `${type.shortLabel}: ${type.description} Requirements and fees depend on the destination and are confirmed per country. Long-stay categories such as study, work and residence usually need an admission letter, contract or permit before the visa application. TuniVisa's country guides list the specific documents and steps for the 20 detailed destinations. Always verify the official checklist before applying.`,
    keywords: unique([type.id, type.label, type.shortLabel, type.description, 'visa', 'purpose', 'requirements']),
    sources: [],
    lastVerified: '2026-11-14',
  }
}

function makeDocumentDoc(document) {
  return {
    id: `document:${document.id}`,
    type: 'document',
    title: `${document.label} - visa document`,
    documentId: document.id,
    route: null,
    text: `${document.label}. ${document.description} ${document.details} ${document.required ? 'This document is normally required.' : 'This document is requested only for specific cases.'}`,
    keywords: unique([document.id, document.label, document.description, 'document', 'checklist', 'required']),
    sources: [],
    lastVerified: '2026-11-14',
  }
}

function makeEmbassyDoc(embassy, country) {
  const details = [
    embassy.type ? `Type: ${embassy.type}.` : '',
    embassy.city ? `City: ${embassy.city}.` : '',
    embassy.address ? `Address: ${embassy.address}.` : '',
    embassy.phone ? `Phone: ${embassy.phone}.` : '',
    embassy.email ? `Email: ${embassy.email}.` : '',
    embassy.hours ? `Hours: ${embassy.hours}.` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    id: `embassy:${embassy.countryCode}`,
    type: 'embassy',
    title: `${country.name} embassy or visa centre in Tunisia`,
    countryCode: embassy.countryCode,
    countryName: country.name,
    route: `/countries/${embassy.countryCode}`,
    text: `${embassy.name}. ${details} Contact details can change and appointments may require a booking. Confirm on the official website before travelling to an appointment. Website: ${embassy.website}. Last verified: 2026-11-13.`,
    keywords: unique([
      country.name,
      embassy.countryCode,
      embassy.name,
      embassy.type,
      embassy.city,
      'embassy',
      'ambassade',
      'consulate',
      'consulat',
      'visa centre',
      'appointment',
      'contact',
      'address',
      'phone',
    ]),
    sources: embassy.website ? [{ title: embassy.name, url: embassy.website, lastVerified: '2026-11-13' }] : [],
    lastVerified: '2026-11-13',
  }
}

function makeStatusDoc(status, entries) {
  const names = entries.map((entry) => entry.name).sort((a, b) => a.localeCompare(b))
  const count = names.length
  const statusLabel = STATUS_SHORT[status] || status

  return {
    id: `status:${status}`,
    type: 'status',
    status,
    title: `Destinations with ${statusLabel} for Tunisian passport holders`,
    route: `/countries?status=${status}`,
    text: `TuniVisa currently lists ${count} destinations with ${statusLabel} for Tunisian passport holders: ${names.join(', ')}. This list comes from the TuniVisa world map dataset, last checked on 2026-11-14. It includes map-only destinations without a full TuniVisa guide. Statuses can change and border officers make the final entry decision; always confirm the latest rule with the airline and the destination's official government source before booking.`,
    keywords: unique([
      status,
      statusLabel,
      status === 'visa_free' ? 'visa free countries' : '',
      status === 'visa_free' ? 'sans visa' : '',
      status === 'visa_free' ? 'pays sans visa' : '',
      status === 'visa_on_arrival' ? 'visa on arrival' : '',
      status === 'visa_on_arrival' ? 'visa a l arrivee' : '',
      status === 'evisa_eta' ? 'evisa eta electronic visa' : '',
      status === 'evisa_eta' ? 'e visa' : '',
      status === 'visa_required' ? 'visa required' :
      status === 'no_admission' ? 'no admission' : '',
      status === 'visa_required' ? 'visa requis' :
      status === 'no_admission' ? 'admission refusee' : '',
      'countries',
      'destinations',
      'list',
      'liste',
      'where can i travel',
      'ou voyager',
    ]),
    sources: [],
    lastVerified: '2026-11-14',
  }
}

function makeOverviewDoc(counts) {
  return {
    id: 'overview:tunivisa',
    type: 'overview',
    title: 'About TuniVisa data and limitations',
    route: '/about',
    text: `TuniVisa is an informational visa and travel guide for Tunisian passport holders. It covers ${counts.countries} detailed destination guides, ${counts.visaRules} country-and-purpose visa rules, ${counts.visaTypes} travel purposes, ${counts.documents} reusable document definitions, ${counts.embassies} embassy or visa-centre records and ${counts.mapCountries} destinations on the world map. The 20 detailed guides were checked against official government and embassy sources on 2026-11-14. TuniVisa does not predict visa approval, does not guarantee entry and is not legal advice. Rules can change; always verify with the destination's official government or embassy before booking or applying. Do not share passport numbers, bank details or other sensitive personal data with the assistant.`,
    keywords: unique([
      'tunivisa',
      'about',
      'data',
      'sources',
      'disclaimer',
      'approval',
      'guarantee',
      'tunisian passport',
      'visa',
      'travel',
      'how many countries',
    ]),
    sources: [],
    lastVerified: '2026-11-14',
  }
}

async function main() {
  const vite = await createServer({
    root: ROOT,
    configFile: false,
    appType: 'custom',
    server: { middlewareMode: true },
    logLevel: 'error',
  })

  try {
    const [{ COUNTRIES }, visaTypesModule, { DOCUMENTS, getDocuments }, { EMBASSIES }, visaRules, mapData] =
      await Promise.all([
        vite.ssrLoadModule('/src/data/countries.js'),
        vite.ssrLoadModule('/src/data/visaTypes.js'),
        vite.ssrLoadModule('/src/data/documents.js'),
        vite.ssrLoadModule('/src/data/embassies.js'),
        vite.ssrLoadModule('/src/data/visaRules.js'),
        vite.ssrLoadModule('/src/data/mapData.js'),
      ])

    OFFICIAL_LINKS = visaRules.OFFICIAL_LINKS
    OFFICIAL_SOURCE = visaRules.OFFICIAL_SOURCE
    LAST_VERIFIED = visaRules.LAST_VERIFIED
    VISA_TYPES = visaTypesModule.VISA_TYPES

    const docs = []
    const detailedCodes = new Set(COUNTRIES.map((country) => country.code))
    const mapOnly = mapData.ALL_MAP_COUNTRIES.filter((entry) => !detailedCodes.has(entry.code) && !entry.home)

    for (const country of COUNTRIES) {
      docs.push(makeCountryDoc(country))

      for (const rule of visaRules.buildAllVisaRules(country)) {
        docs.push(makeVisaDoc(country, rule, getDocuments(rule.documents)))
      }

      const embassy = EMBASSIES.find((item) => item.countryCode === country.code)
      if (embassy) docs.push(makeEmbassyDoc(embassy, country))
    }

    for (const entry of mapOnly) docs.push(makeMapDoc(entry))
    for (const status of ['visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required', 'no_admission']) {
      const entries = mapData.ALL_MAP_COUNTRIES.filter((entry) => !entry.home && entry.status === status)
      docs.push(makeStatusDoc(status, entries))
    }
    for (const type of visaTypesModule.VISA_TYPES) docs.push(makeVisaTypeDoc(type))
    for (const document of DOCUMENTS) docs.push(makeDocumentDoc(document))

    const counts = {
      countries: COUNTRIES.length,
      visaRules: COUNTRIES.length * visaTypesModule.VISA_TYPES.length,
      visaTypes: visaTypesModule.VISA_TYPES.length,
      documents: DOCUMENTS.length,
      embassies: EMBASSIES.length,
      mapCountries: mapData.ALL_MAP_COUNTRIES.filter((entry) => !entry.home).length,
      knowledgeDocuments: docs.length,
    }

    docs.unshift(makeOverviewDoc(counts))
    counts.knowledgeDocuments = docs.length

    const meta = {
      generatedAt: new Date().toISOString(),
      dataLastVerified: '2026-11-14',
      ...counts,
    }

    const output = `// Generated by scripts/build-chat-knowledge.mjs. Do not edit by hand.\n// Run: npm run build:knowledge\n\nexport const KNOWLEDGE = ${JSON.stringify(docs, null, 2)}\n\nexport const KNOWLEDGE_META = ${JSON.stringify(meta, null, 2)}\n`

    await mkdir(dirname(OUTPUT), { recursive: true })
    await writeFile(OUTPUT, output, 'utf8')
    console.log(`Wrote ${docs.length} knowledge documents to ${OUTPUT}`)
    console.log(JSON.stringify(meta, null, 2))
  } finally {
    await vite.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

