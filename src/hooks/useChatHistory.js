import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CHAT_HISTORY_STORAGE_KEY,
  CHAT_HISTORY_MAX_CONVERSATIONS,
  CHAT_HISTORY_MAX_MESSAGES,
  createConversation,
  defaultConversationTitle,
  deriveConversationTitle,
  loadChatHistory,
  serializeChatHistory,
} from '../utils/chatHistory'

function persist(state) {
  try {
    localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, serializeChatHistory(state))
  } catch {}
}

export function useChatHistory({ language = 'en', context = {} } = {}) {
  const [state, setState] = useState(() => {
    const loaded = typeof window !== 'undefined' ? loadChatHistory(localStorage.getItem(CHAT_HISTORY_STORAGE_KEY), language) : null
    if (loaded && loaded.conversations.length) return loaded
    const conv = createConversation(language, context)
    return { version: 1, activeId: conv.id, conversations: [conv] }
  })

  useEffect(() => {
    persist(state)
  }, [state])

  const activeConversation = useMemo(
    () => state.conversations.find((c) => c.id === state.activeId) || state.conversations[0] || null,
    [state],
  )

  const messages = activeConversation?.messages || []

  const updateActive = useCallback((updater) => {
    setState((prev) => {
      const activeId = prev.activeId || prev.conversations[0]?.id
      if (!activeId) return prev
      const conversations = prev.conversations.map((c) => {
        if (c.id !== activeId) return c
        const next = typeof updater === 'function' ? updater(c) : { ...c, ...updater }
        const msgs = Array.isArray(next.messages) ? next.messages.slice(-CHAT_HISTORY_MAX_MESSAGES) : c.messages
        const hasCustomTitle =
          next.title &&
          next.title !== defaultConversationTitle(c.language) &&
          next.title !== defaultConversationTitle(next.language || c.language)
        const title = hasCustomTitle
          ? next.title
          : deriveConversationTitle(msgs, next.language || c.language, defaultConversationTitle(next.language || c.language))
        return { ...c, ...next, messages: msgs, title, updatedAt: Date.now() }
      })
      conversations.sort((a, b) => b.updatedAt - a.updatedAt)
      return { ...prev, conversations: conversations.slice(0, CHAT_HISTORY_MAX_CONVERSATIONS) }
    })
  }, [])

  const setMessages = useCallback(
    (next) => {
      updateActive((c) => ({ messages: typeof next === 'function' ? next(c.messages) : next }))
    },
    [updateActive],
  )

  const updateMessage = useCallback(
    (id, patch) => {
      updateActive((c) => ({
        messages: c.messages.map((m) =>
          m.id === id ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m,
        ),
      }))
    },
    [updateActive],
  )

  const createNew = useCallback(() => {
    setState((prev) => {
      const conv = createConversation(language, context)
      return {
        version: 1,
        activeId: conv.id,
        conversations: [conv, ...prev.conversations].slice(0, CHAT_HISTORY_MAX_CONVERSATIONS),
      }
    })
  }, [language, context])

  const selectConversation = useCallback((id) => {
    setState((prev) => (prev.conversations.some((c) => c.id === id) ? { ...prev, activeId: id } : prev))
  }, [])

  const deleteConversation = useCallback(
    (id) => {
      setState((prev) => {
        let conversations = prev.conversations.filter((c) => c.id !== id)
        if (conversations.length === 0) conversations = [createConversation(language, context)]
        let activeId = prev.activeId
        if (activeId === id || !conversations.some((c) => c.id === activeId)) activeId = conversations[0].id
        return { version: 1, activeId, conversations }
      })
    },
    [language, context],
  )

  const clearAll = useCallback(() => {
    const conv = createConversation(language, context)
    setState({ version: 1, activeId: conv.id, conversations: [conv] })
  }, [language, context])

  return {
    conversations: state.conversations,
    activeConversation,
    activeId: activeConversation?.id || null,
    messages,
    setMessages,
    updateMessage,
    createNew,
    selectConversation,
    deleteConversation,
    clearAll,
  }
}
