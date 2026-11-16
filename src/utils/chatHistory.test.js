import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CHAT_HISTORY_MAX_CONVERSATIONS,
  CHAT_HISTORY_MAX_MESSAGES,
  createConversation,
  deriveConversationTitle,
  loadChatHistory,
  serializeChatHistory,
} from './chatHistory.js'

test('deriveConversationTitle uses first user message and truncates', () => {
  const title = deriveConversationTitle([
    { role: 'assistant', content: 'hi' },
    { role: 'user', content: '  What documents do I need for a long stay student visa in France please?  ' },
  ], 'en')
  assert.ok(title.startsWith('What documents'))
  assert.ok(title.length <= 60)
})

test('serializeChatHistory and loadChatHistory round-trip', () => {
  const conv = createConversation('en', { countryCode: 'fr' })
  conv.messages = [
    { id: 'u1', role: 'user', content: 'Hello' },
    { id: 'a1', role: 'assistant', content: 'Hi', requestId: 'r1', feedback: 'up', sources: [{ title: 's', url: 'u' }], suggestedFollowUps: ['x'], relatedLinks: [] },
  ]
  const state = { version: 1, activeId: conv.id, conversations: [conv] }
  const raw = serializeChatHistory(state)
  const loaded = loadChatHistory(raw, 'en')
  assert.equal(loaded.activeId, conv.id)
  assert.equal(loaded.conversations.length, 1)
  assert.equal(loaded.conversations[0].messages[1].feedback, 'up')
  assert.equal(loaded.conversations[0].messages[1].requestId, 'r1')
})

test('loadChatHistory enforces limits and sanitizes', () => {
  const messages = Array.from({ length: CHAT_HISTORY_MAX_MESSAGES + 10 }, (_, i) => ({
    id: `m${i}`,
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: `msg ${i}`,
    feedback: 'invalid',
  }))
  const conversations = Array.from({ length: CHAT_HISTORY_MAX_CONVERSATIONS + 5 }, (_, i) => ({
    id: `c${i}`,
    title: `C${i}`,
    createdAt: i,
    updatedAt: i,
    language: 'en',
    context: {},
    messages: i === 0 ? messages : [],
  }))
  const loaded = loadChatHistory(JSON.stringify({ version: 1, activeId: 'c0', conversations }), 'en')
  assert.equal(loaded.conversations.length, CHAT_HISTORY_MAX_CONVERSATIONS)
  assert.equal(loaded.conversations.find((c) => c.id === 'c0').messages.length, CHAT_HISTORY_MAX_MESSAGES)
  assert.equal(loaded.conversations.find((c) => c.id === 'c0').messages[1].feedback, null)
})
