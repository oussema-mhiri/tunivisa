import assert from 'node:assert/strict'
import test from 'node:test'
import { KNOWLEDGE_META } from '../data/knowledge.js'
import { buildCacheKey } from './cache.js'

test('cache key is invalidated when the knowledge base is regenerated', () => {
  const params = {
    message: 'Do I need a visa for France?',
    language: 'en',
    context: { countryCode: 'fr' },
    history: [],
  }
  const key = buildCacheKey(params)

  assert.match(key, /^tunivisa:chat:v2-/)
  assert.ok(key.includes(KNOWLEDGE_META.generatedAt))
  assert.equal(buildCacheKey({ ...params, history: [{ role: 'user', content: 'hi' }] }), null)
})
