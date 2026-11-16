import assert from 'node:assert/strict'
import test from 'node:test'
import { GEMINI_RESPONSE_SCHEMA, GROQ_RESPONSE_SCHEMA } from '../prompt.js'
import { normalizeModelResult, parseModelJson } from './shared.js'

test('parses JSON wrapped in markdown fences', () => {
  const parsed = parseModelJson('```json\n{"answer":"Hello","suggestedFollowUps":[]}\n```')
  assert.equal(parsed.answer, 'Hello')
})

test('normalizes model output and caps follow-up suggestions', () => {
  const result = normalizeModelResult({
    answer: '  Answer text.  ',
    suggestedFollowUps: ['One', '', 'Two', 'Three', 'Four'],
  })

  assert.equal(result.answer, 'Answer text.')
  assert.deepEqual(result.suggestedFollowUps, ['One', 'Two', 'Three'])
})

test('rejects empty model answers', () => {
  assert.throws(() => normalizeModelResult({ answer: '   ' }), /empty answer/i)
})

test('builds strict Groq and uppercase Gemini schemas', () => {
  assert.equal(GROQ_RESPONSE_SCHEMA.additionalProperties, false)
  assert.equal(GROQ_RESPONSE_SCHEMA.properties.relatedLinks.items.additionalProperties, false)
  assert.equal(GEMINI_RESPONSE_SCHEMA.type, 'OBJECT')
  assert.equal(GEMINI_RESPONSE_SCHEMA.properties.answer.type, 'STRING')
})
