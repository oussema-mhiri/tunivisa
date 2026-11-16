import assert from 'node:assert/strict'
import test from 'node:test'
import {
  detectCountry,
  detectStatusIntent,
  detectVisaType,
  normalizeText,
  retrieve,
} from './retrieval.js'

test('normalizes accents and punctuation', () => {
  assert.equal(normalizeText('  Étudiant à Paris ? '), 'etudiant a paris')
  assert.equal(normalizeText("Côte d'Ivoire"), 'cote d ivoire')
})

test('detects countries from French, English and city aliases', () => {
  assert.equal(detectCountry('visa pour la France'), 'fr')
  assert.equal(detectCountry('travail en Allemagne'), 'de')
  assert.equal(detectCountry('fly to New York'), 'us')
  assert.equal(detectCountry('ambassade du Japon'), 'jp')
  assert.equal(detectCountry('Bali visa'), 'id')
  assert.equal(detectCountry('pays sans visa'), null)
})

test('detects visa purposes from natural language', () => {
  assert.equal(detectVisaType('Quels documents pour un visa étudiant ?'), 'study')
  assert.equal(detectVisaType('je veux travailler au Canada'), 'work')
  assert.equal(detectVisaType('business meeting in Dubai'), 'business')
  assert.equal(detectVisaType('traitement médical'), 'medical')
  assert.equal(detectVisaType('How does the readiness score work?'), null)
  assert.equal(detectVisaType('do I need a visa?'), null)
})

test('detects status-list intent', () => {
  assert.equal(detectStatusIntent('pays sans visa'), 'visa_free')
  assert.equal(detectStatusIntent('visa on arrival countries'), 'visa_on_arrival')
  assert.equal(detectStatusIntent('eVisa destinations'), 'evisa_eta')
  assert.equal(detectStatusIntent('France'), null)
})

test('retrieves the exact country and visa purpose first', () => {
  const result = retrieve('Quels documents pour un visa étudiant en France ?')

  assert.equal(result.countryCode, 'fr')
  assert.equal(result.visaType, 'study')
  assert.equal(result.docs[0].id, 'visa:fr:study')
  assert.ok(result.docs.some((doc) => doc.id === 'country:fr'))
  assert.ok(result.docs.some((doc) => doc.id === 'document:acceptance_letter'))
  assert.ok(result.sources.some((source) => source.url.includes('france-visas.gouv.fr')))
})

test('keeps generic country questions focused on useful visa purposes', () => {
  const result = retrieve('Do I need a visa for Turkey?')
  const ids = result.docs.map((doc) => doc.id)

  assert.equal(result.countryCode, 'tr')
  assert.ok(ids.includes('country:tr'))
  assert.ok(ids.includes('visa:tr:tourism'))
  assert.ok(!ids.includes('visa:tr:medical'))
  assert.ok(!ids.includes('visa:tr:residence'))
})

test('answers generic checklist questions without inventing a country', () => {
  const result = retrieve('Quels sont les documents pour un visa étudiant ?')
  const ids = result.docs.map((doc) => doc.id)

  assert.equal(result.countryCode, null)
  assert.equal(result.visaType, 'study')
  assert.ok(ids.includes('type:study'))
  assert.ok(ids.includes('document:acceptance_letter'))
  assert.ok(!ids.some((id) => id.startsWith('visa:fr:')))
})

test('uses the aggregate list for status questions', () => {
  const result = retrieve('pays sans visa')

  assert.equal(result.statusIntent, 'visa_free')
  assert.deepEqual(
    result.docs.map((doc) => doc.id),
    ['status:visa_free'],
  )
  assert.match(result.context, /visa-free access/)
})

test('supports map-only destinations', () => {
  const result = retrieve('Bali visa')

  assert.equal(result.countryCode, 'id')
  assert.equal(result.docs[0].id, 'map:id')
  assert.ok(result.relatedLinks.some((link) => link.to === '/countries/id'))
})

test('keeps context under the configured budget', () => {
  const result = retrieve('documents for a student visa in France')
  assert.ok(result.context.length > 0)
  assert.ok(result.context.length <= 7000)
})

test('returns only safe internal related links', () => {
  const result = retrieve('ambassade du Japon')
  assert.ok(result.relatedLinks.length > 0)
  assert.ok(result.relatedLinks.every((link) => link.to.startsWith('/')))
})
