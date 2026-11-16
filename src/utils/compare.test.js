import assert from 'node:assert/strict'
import test from 'node:test'
import { COUNTRIES } from '../data/countries.js'
import { buildVisaRule } from '../data/visaRules.js'
import { getEmbassy } from '../data/embassies.js'
import { getDocuments } from '../data/documents.js'
import { buildComparison, isSchengenShortStayComparison } from './compare.js'

function find(code) {
  return COUNTRIES.find((c) => c.code === code)
}

function detail(code, visaType = 'tourism') {
  const country = find(code)
  const rule = buildVisaRule(country, visaType)
  return { country, rule, documents: getDocuments(rule.documents), embassy: getEmbassy(code) }
}

test('buildComparison compares Schengen short-stay countries and flags shared rules', () => {
  const comparison = buildComparison({ items: [detail('fr'), detail('it'), detail('es')], visaType: 'tourism' })
  assert.equal(comparison.countries.length, 3)
  assert.equal(comparison.schengenNote, true)
  const status = comparison.rows.find((r) => r.id === 'status')
  const stay = comparison.rows.find((r) => r.id === 'maxStay')
  const fee = comparison.rows.find((r) => r.id === 'fee')
  assert.equal(status.different, false)
  assert.equal(stay.different, false)
  assert.equal(fee.different, false)
  assert.equal(status.values[0].display, 'Visa Required')
})

test('buildComparison highlights differences for non-Schengen countries', () => {
  const comparison = buildComparison({ items: [detail('fr'), detail('tr')], visaType: 'tourism' })
  assert.equal(comparison.schengenNote, false)
  const status = comparison.rows.find((r) => r.id === 'status')
  const fee = comparison.rows.find((r) => r.id === 'fee')
  const method = comparison.rows.find((r) => r.id === 'method')
  assert.equal(status.different, true)
  assert.equal(fee.different, true)
  assert.equal(method.different, true)
})

test('Schengen note applies only to short-stay purposes and Schengen members', () => {
  assert.equal(isSchengenShortStayComparison(['fr', 'it', 'es'], 'tourism'), true)
  assert.equal(isSchengenShortStayComparison(['fr', 'it', 'tr'], 'tourism'), false)
  assert.equal(isSchengenShortStayComparison(['fr', 'it', 'es'], 'study'), false)
})
