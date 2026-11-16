import assert from 'node:assert/strict'
import test from 'node:test'
import { parseChatRequest, parseFeedbackRequest } from './validate.js'

test('parseChatRequest normalizes message, language and history', () => {
  const result = parseChatRequest({
    message: '  Hello  world  ',
    language: 'fr',
    history: [
      { role: 'user', content: ' hi ' },
      { role: 'assistant', content: ' ok ' },
      { role: 'system', content: 'ignore' },
    ],
    context: { countryCode: 'FR', visaType: 'TOURISM' },
  })
  assert.equal(result.message, 'Hello world')
  assert.equal(result.language, 'fr')
  assert.equal(result.history.length, 2)
  assert.deepEqual(result.context, { countryCode: 'fr', visaType: 'tourism' })
})

test('parseFeedbackRequest validates and normalizes payload', () => {
  const result = parseFeedbackRequest({
    requestId: 'req-123',
    vote: 'UP',
    messageId: 'msg-1',
    context: { countryCode: 'FR', visaType: 'tourism', extra: 'x' },
  })
  assert.deepEqual(result, {
    requestId: 'req-123',
    vote: 'up',
    messageId: 'msg-1',
    context: { countryCode: 'fr', visaType: 'tourism' },
  })
})

test('parseFeedbackRequest rejects invalid payloads', () => {
  assert.throws(() => parseFeedbackRequest({ vote: 'up' }), /requestId/i)
  assert.throws(() => parseFeedbackRequest({ requestId: 'r', vote: 'maybe' }), /vote/i)
  assert.throws(() => parseFeedbackRequest({ requestId: '', vote: 'up' }), /requestId/i)
})
