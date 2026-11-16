import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../services/chat'

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useChat({ language, context }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const inFlightRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  const send = useCallback(
    async (value) => {
      const message = String(value || '').trim()
      if (!message || inFlightRef.current) return

      const userMessage = { id: makeId(), role: 'user', content: message }
      const history = messages
        .slice(-6)
        .map((item) => ({ role: item.role, content: item.content }))

      setError(null)
      setMessages((current) => [...current, userMessage])
      setLoading(true)
      inFlightRef.current = true

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await sendChatMessage({
          message,
          language,
          history,
          context,
          signal: controller.signal,
        })

        if (!mountedRef.current) return
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: 'assistant',
            content: response.answer,
            sources: response.sources || [],
            suggestedFollowUps: response.suggestedFollowUps || [],
            relatedLinks: response.relatedLinks || [],
            provider: response.provider,
            cached: Boolean(response.cached),
          },
        ])
      } catch (requestError) {
        if (!mountedRef.current || requestError.code === 'aborted') return
        setError(requestError)
      } finally {
        if (mountedRef.current) setLoading(false)
        inFlightRef.current = false
        if (abortRef.current === controller) abortRef.current = null
      }
    },
    [context, language, messages],
  )

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setLoading(false)
  }, [])

  return { messages, loading, error, send, clear }
}
