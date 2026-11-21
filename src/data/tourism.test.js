import assert from 'node:assert/strict'
import test from 'node:test'
import { COUNTRIES } from './countries.js'
import { TOURISM_BY_CODE } from './tourism.js'

const LANGUAGES = ['en', 'fr', 'ar']

test('every detailed country has complete tourism data', () => {
  assert.equal(COUNTRIES.length, 20)

  for (const country of COUNTRIES) {
    const tourism = country.tourism
    assert.ok(country.capital, `${country.code} is missing a capital`)
    assert.ok(tourism, `${country.code} is missing tourism data`)
    assert.ok(tourism.highlights.length >= 3, `${country.code} needs at least 3 highlights`)
    assert.equal(new Set(tourism.highlights).size, tourism.highlights.length)

    for (const lang of LANGUAGES) {
      assert.ok(tourism.tip[lang]?.length > 20, `${country.code} is missing a ${lang} tip`)
      assert.ok(tourism.bestTime[lang]?.length > 3, `${country.code} is missing a ${lang} best time`)
    }
  }
})

test('tourism data covers exactly the detailed countries', () => {
  assert.deepEqual(
    Object.keys(TOURISM_BY_CODE).sort(),
    COUNTRIES.map((country) => country.code).sort(),
  )
})

test('tourism text has no stray non-target scripts', () => {
  for (const tourism of Object.values(TOURISM_BY_CODE)) {
    for (const value of [...tourism.highlights, ...Object.values(tourism.tip), ...Object.values(tourism.bestTime)]) {
      assert.doesNotMatch(value, /[\u3400-\u9fff]/)
    }
  }
})
