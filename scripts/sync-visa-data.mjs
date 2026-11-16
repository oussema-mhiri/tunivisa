import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_URL =
  process.env.VISA_DATA_URL ||
  'https://raw.githubusercontent.com/imorte/passport-index-data/main/passport-index.json'
const OUTPUT = resolve(ROOT, 'src/data/visaMatrix.generated.js')
const CHECK = process.argv.includes('--check')

const STATUS_MAP = new Map([
  ['visa free', 'visa_free'],
  ['visa-free', 'visa_free'],
  ['visa on arrival', 'visa_on_arrival'],
  ['e-visa', 'evisa_eta'],
  ['evisa', 'evisa_eta'],
  ['eta', 'evisa_eta'],
  ['visa required', 'visa_required'],
  ['no admission', 'no_admission'],
])

function normalizeStatus(raw) {
  const key = String(raw || '').trim().toLowerCase().replace(/\s+/g, ' ')
  const status = STATUS_MAP.get(key)
  if (!status) throw new Error(`Unknown visa status from dataset: "${raw}"`)
  return status
}

function formatValue(value, indent = 0) {
  if (value === null) return 'null'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const pad = ' '.repeat(indent)
    const padIn = ' '.repeat(indent + 2)
    return `[\n${value.map((v) => `${padIn}${formatValue(v, indent + 2)},`).join('\n')}\n${pad}]`
  }
  if (typeof value === 'object') {
    const pad = ' '.repeat(indent)
    const padIn = ' '.repeat(indent + 2)
    const lines = Object.entries(value).map(([key, val]) => {
      const k = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key)
      return `${padIn}${k}: ${formatValue(val, indent + 2)},`
    })
    return `{\n${lines.join('\n')}\n${pad}}`
  }
  return 'null'
}

async function fetchDataset() {
  const res = await fetch(DATA_URL, { headers: { 'user-agent': 'tunivisa-sync' } })
  if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status} ${res.statusText}`)
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Dataset is not valid JSON')
  }
}

async function loadCurrent() {
  const mapData = await import(pathToFileURL(resolve(ROOT, 'src/data/mapData.js')).href)
  const countries = await import(pathToFileURL(resolve(ROOT, 'src/data/countries.js')).href)
  return { mapData, countries }
}

function compareCurated(entries, mapData, countriesMod) {
  const curated = countriesMod.COUNTRIES || []
  const diffs = []
  for (const country of curated) {
    const code = String(country.code || '').toLowerCase()
    const synced = entries[code]
    if (!synced) {
      diffs.push({ code, issue: 'missing in synced dataset' })
      continue
    }
    const currentStatus = country.visaStatus
    const currentStay = country.maxStayDays ?? null
    const syncedStay = synced.maxStayDays ?? null
    if (synced.status !== currentStatus || syncedStay !== currentStay) {
      diffs.push({
        code,
        name: country.name,
        current: { status: currentStatus, maxStayDays: currentStay },
        synced: { status: synced.status, maxStayDays: synced.maxStayDays, rawStatus: synced.rawStatus },
      })
    }
  }

  const knownCodes = new Set((mapData.ALL_MAP_COUNTRIES || []).map((c) => String(c.code).toLowerCase()))
  const newCodes = Object.keys(entries).filter((code) => !knownCodes.has(code))
  return { diffs, newCodes }
}

async function main() {
  const dataset = await fetchDataset()
  if (!dataset || typeof dataset !== 'object' || Array.isArray(dataset)) {
    throw new Error('Dataset root must be an object')
  }

  const tn = dataset.TN || dataset.tn
  if (!tn || typeof tn !== 'object' || Array.isArray(tn)) {
    throw new Error('Dataset does not contain a TN entry map')
  }

  const entries = {}
  for (const [dest, value] of Object.entries(tn)) {
    const code = String(dest).trim().toLowerCase()
    if (!code || code === 'tn') continue
    if (!/^[a-z]{2}$/.test(code)) continue
    if (!value || typeof value !== 'object') throw new Error(`Invalid entry for ${dest}`)
    const status = normalizeStatus(value.status)
    const rawDays = value.days
    const maxStayDays =
      rawDays === undefined || rawDays === null || rawDays === ''
        ? null
        : Number.isFinite(Number(rawDays))
          ? Number(rawDays)
          : null
    entries[code] = { status, maxStayDays, rawStatus: String(value.status || '') }
  }

  const sortedEntries = Object.fromEntries(
    Object.keys(entries)
      .sort()
      .map((k) => [k, entries[k]]),
  )

  let comparison = { diffs: [], newCodes: [] }
  try {
    const { mapData, countries } = await loadCurrent()
    comparison = compareCurated(sortedEntries, mapData, countries)
  } catch (error) {
    console.warn('[sync-visa] comparison skipped:', error.message)
  }

  const baseMeta = {
    source: 'passport-index-dataset',
    url: DATA_URL,
    license: 'MIT',
    version: dataset.version || dataset.last_updated || null,
    origin: 'TN',
    entryCount: Object.keys(sortedEntries).length,
  }

  let existing = null
  try {
    existing = await readFile(OUTPUT, 'utf8')
  } catch {}

  let existingMeta = null
  let existingEntries = null
  if (existing) {
    try {
      const mod = await import(`${pathToFileURL(OUTPUT).href}?t=${Date.now()}`)
      existingMeta = mod.VISA_MATRIX_META || null
      existingEntries = mod.VISA_MATRIX_ENTRIES || null
    } catch {}
  }

  const metaComparable = (m) =>
    m && {
      source: m.source,
      url: m.url,
      license: m.license,
      version: m.version ?? null,
      origin: m.origin,
      entryCount: m.entryCount,
    }

  const same =
    JSON.stringify(metaComparable(existingMeta)) === JSON.stringify(baseMeta) &&
    JSON.stringify(existingEntries) === JSON.stringify(sortedEntries)

  if (CHECK) {
    if (!same) {
      console.error('[sync-visa:check] visa matrix is out of date. Run npm run sync:visa')
      process.exitCode = 1
    } else {
      console.log('[sync-visa:check] visa matrix is up to date')
    }
  } else {
    if (same) {
      console.log('[sync-visa] no changes')
    } else {
      const meta = { ...baseMeta, fetchedAt: new Date().toISOString() }
      const content = `// Auto-generated by scripts/sync-visa-data.mjs. Do not edit by hand.\nexport const VISA_MATRIX_META = ${formatValue(meta, 0)}\n\nexport const VISA_MATRIX_ENTRIES = ${formatValue(sortedEntries, 0)}\n`
      await mkdir(dirname(OUTPUT), { recursive: true })
      await writeFile(OUTPUT, content, 'utf8')
      console.log(`[sync-visa] wrote ${Object.keys(sortedEntries).length} entries to src/data/visaMatrix.generated.js`)
    }
  }

  if (comparison.diffs.length) {
    console.log(`\n[sync-visa] curated differences (${comparison.diffs.length}) - 20 detailed countries kept as curated:`)
    for (const diff of comparison.diffs) {
      console.log(
        ` - ${diff.code}${diff.name ? ` (${diff.name})` : ''}:`,
        JSON.stringify(diff.current || diff.issue),
        '->',
        JSON.stringify(diff.synced || 'n/a'),
      )
    }
  } else {
    console.log('\n[sync-visa] no curated differences for the 20 detailed countries')
  }

  if (comparison.newCodes.length) {
    console.log(`\n[sync-visa] new codes not in mapData.js (not added automatically): ${comparison.newCodes.join(', ')}`)
  } else {
    console.log('\n[sync-visa] no new codes outside mapData.js')
  }
}

main().catch((error) => {
  console.error('[sync-visa] failed:', error.message)
  process.exitCode = 1
})
