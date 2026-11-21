import assert from 'node:assert/strict'
import test from 'node:test'
import { buildKnowledgeAnswer, buildStreamingSystemPrompt, buildSystemPrompt, defaultSuggestions, fallbackAnswer } from './prompt.js'

const ARABIC = /[\u0600-\u06ff]/

test('builds Arabic system prompts', () => {
  assert.match(buildSystemPrompt('ar'), /Answer in Arabic/)
  assert.match(buildStreamingSystemPrompt('ar'), /Answer in Arabic/)
})

test('returns Arabic suggestions, fallbacks and knowledge answers', () => {
  const suggestions = defaultSuggestions('ar')
  assert.equal(suggestions.length, 3)
  assert.ok(suggestions.every((item) => ARABIC.test(item)))
  assert.match(fallbackAnswer('ar'), ARABIC)

  const answer = buildKnowledgeAnswer({
    language: 'ar',
    retrieved: { docs: [{ title: 'France', text: 'A visa is required.' }] },
  })
  assert.match(answer, ARABIC)
  assert.match(answer, /France/)
})
