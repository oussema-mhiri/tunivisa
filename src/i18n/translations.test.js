import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_LANGUAGE, DICTIONARIES, LANGUAGES } from './translations.js'

const languageCodes = LANGUAGES.map(({ code }) => code)

function flatten(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return child && typeof child === 'object' ? flatten(child, path) : [[path, child]]
  })
}

const flatDictionaries = Object.fromEntries(
  languageCodes.map((code) => [code, Object.fromEntries(flatten(DICTIONARIES[code]))]),
)

test('dictionaries share an identical key structure', () => {
  assert.ok(languageCodes.includes(DEFAULT_LANGUAGE))
  const reference = Object.keys(flatDictionaries[DEFAULT_LANGUAGE]).sort()

  for (const code of languageCodes) {
    assert.deepEqual(Object.keys(flatDictionaries[code]).sort(), reference, `${code} key mismatch`)
  }
})

test('every translation is a non-empty string', () => {
  for (const code of languageCodes) {
    for (const [key, value] of Object.entries(flatDictionaries[code])) {
      assert.equal(typeof value, 'string', `${code}.${key} is not a string`)
      assert.ok(value.trim().length > 0, `${code}.${key} is empty`)
    }
  }
})

test('Arabic chat translations contain Arabic script', () => {
  const chatKeys = Object.keys(flatDictionaries.ar).filter((key) => key.startsWith('chat.'))
  assert.ok(chatKeys.length > 0)

  for (const key of chatKeys) {
    assert.match(flatDictionaries.ar[key], /\p{Script=Arabic}/u, `ar.${key} has no Arabic text`)
  }
})
