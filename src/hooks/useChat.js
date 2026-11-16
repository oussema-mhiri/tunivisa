import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage, streamChatMessage } from '../services/chat'

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useChat({ language, context, messages, setMessages }) {
  const [internalMessages, internalSetMessages] = useState([])
  const controlled = Array.isArray(messages) && typeof setMessages === 'function'
  const msgs = controlled ? messages : internalMessages
  const setMsgs = controlled ? setMessages : internalSetMessages

  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const inFlightRef = useRef(false)
  const mountedRef = useRef(true)
  const messagesRef = useRef(msgs)

  useEffect(() => {
    messagesRef.current = msgs
  }, [msgs])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  const updateAssistant = useCallback(
    (assistantId, updater) => {
      setMsgs((current) =>
        (current || []).map((m) =>
          m.id === assistantId ? (typeof updater === 'function' ? updater(m) : { ...m, ...updater }) : m,
        ),
      )
    },
    [setMsgs],
  )

  const send = useCallback(
    async (value) => {
      const message = String(value || '').trim()
      if (!message || inFlightRef.current) return

      const userMessage = { id: makeId(), role: 'user', content: message }
      const assistantId = makeId()
      const history = (messagesRef.current || [])
        .slice(-6)
        .map((item) => ({ role: item.role, content: item.content }))

      setError(null)
      setMsgs((current) => [
        ...(current || []),
        userMessage,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          sources: [],
          suggestedFollowUps: [],
          relatedLinks: [],
          provider: null,
          cached: false,
          requestId: null,
          feedback: null,
          streaming: true,
        },
      ])
      setLoading(true)
      setStreaming(true)
      inFlightRef.current = true

      const controller = new AbortController()
      abortRef.current = controller

      let gotFirstToken = false
      let accumulated = ''
      let meta = { sources: [], relatedLinks: [], requestId: null, provider: null, cached: false, suggestedFollowUps: [] }

      try {
        await streamChatMessage({
          message,
          language,
          history,
          context,
          signal: controller.signal,
          onEvent: ({ event, data }) => {
            if (!mountedRef.current) return
            if (event === 'start') {
              meta = {
                ...meta,
                sources: Array.isArray(data.sources) ? data.sources : [],
                relatedLinks: Array.isArray(data.relatedLinks) ? data.relatedLinks : [],
                requestId: data.requestId || null,
              }
              updateAssistant(assistantId, (m) => ({ ...m, ...meta }))
            } else if (event === 'delta') {
              const text = data.text || ''
              if (!text) return
              if (!gotFirstToken) gotFirstToken = true
              accumulated += text
              updateAssistant(assistantId, (m) => ({ ...m, content: (m.content || '') + text, ...meta }))
            } else if (event === 'done') {
              meta = {
                ...meta,
                provider: data.provider || meta.provider,
                cached: Boolean(data.cached),
                suggestedFollowUps: Array.isArray(data.suggestedFollowUps) ? data.suggestedFollowUps : meta.suggestedFollowUps,
              }
              updateAssistant(assistantId, (m) => ({ ...m, ...meta, streaming: false }))
            } else if (event === 'error') {
              throw Object.assign(new Error(data.message || 'Stream error'), { code: data.code || 'stream_error' })
            }
          },
        })

        if (!mountedRef.current) return
        updateAssistant(assistantId, (m) => ({ ...m, ...meta, streaming: false }))
      } catch (requestError) {
        if (!mountedRef.current || requestError.code === 'aborted') {
          if (mountedRef.current && requestError.code === 'aborted') {
            updateAssistant(assistantId, (m) => ({ ...m, streaming: false }))
          }
          // if aborted by user, keep partial; handled by stop
        } else if (!gotFirstToken) {
          // fallback to classic JSON
          try {
            const response = await sendChatMessage({
              message,
              language,
              history,
              context,
              signal: controller.signal,
            })
            if (!mountedRef.current) return
            updateAssistant(assistantId, {
              content: response.answer,
              sources: response.sources || [],
              suggestedFollowUps: response.suggestedFollowUps || [],
              relatedLinks: response.relatedLinks || [],
              provider: response.provider || null,
              cached: Boolean(response.cached),
              requestId: response.requestId || null,
              feedback: null,
              streaming: false,
            })
          } catch (fallbackError) {
            if (!mountedRef.current || fallbackError.code === 'aborted') return
            // remove empty assistant placeholder on total failure
            setMsgs((current) => (current || []).filter((m) => !(m.id === assistantId && !m.content)))
            setError(fallbackError)
          }
        } else {
          setMsgs((current) => (current || []).filter((m) => !(m.id === assistantId && !m.content)))
          setError(requestError)
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false)
          setStreaming(false)
        }
        inFlightRef.current = false
        if (abortRef.current === controller) abortRef.current = null
      }
    },
    [context, language, setMsgs, updateAssistant],
  )

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setMsgs([])
    setError(null)
    setLoading(false)
    setStreaming(false)
  }, [setMsgs])

  return { messages: msgs, loading, streaming, error, send, stop, clear }
}
