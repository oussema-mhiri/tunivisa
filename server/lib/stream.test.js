import assert from 'node:assert/strict'
import test from 'node:test'
import { createSseParser } from './stream.js'

test('createSseParser parses SSE events and multiline data', () => {
  const events = []
  const parser = createSseParser((evt) => events.push(evt))
  parser.push('event: start\ndata: {"requestId":"r1"}\n\n')
  parser.push('event: delta\ndata: {"text":"Hello"}\n\n')
  parser.push('event: delta\ndata: line1\n')
  parser.push('data: line2\n\n')
  parser.push('event: done\ndata: {"provider":"gemini","cached":false}\n\n')
  parser.flush()
  assert.deepEqual(events[0], { event: 'start', data: '{"requestId":"r1"}' })
  assert.deepEqual(events[1], { event: 'delta', data: '{"text":"Hello"}' })
  assert.deepEqual(events[2], { event: 'delta', data: 'line1\nline2' })
  assert.equal(events[3].event, 'done')
})

test('createSseParser handles chunk boundaries and [DONE] payloads', () => {
  const events = []
  const parser = createSseParser((evt) => events.push(evt))
  parser.push('event: del')
  parser.push('ta\ndata: [DONE]\n\n')
  parser.flush()
  assert.deepEqual(events, [{ event: 'delta', data: '[DONE]' }])
})
