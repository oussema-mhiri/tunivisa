export const CHAT_HISTORY_STORAGE_KEY = 'tunivisa.chat.conversations.v1'
export const CHAT_HISTORY_MAX_CONVERSATIONS = 20
export const CHAT_HISTORY_MAX_MESSAGES = 50

function makeId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function now() {
  return Date.now()
}

export function defaultConversationTitle(language) {
  return language === 'fr' ? 'Nouvelle conversation' : 'New conversation'
}

export function sanitizeChatMessage(m) {
  if (!m || typeof m !== 'object') return null
  const role = m.role === 'user' ? 'user' : m.role === 'assistant' ? 'assistant' : null
  if (!role || typeof m.content !== 'string') return null
  const base = {
    id: typeof m.id === 'string' ? m.id : makeId(),
    role,
    content: m.content,
  }
  if (role === 'assistant') {
    return {
      ...base,
      sources: Array.isArray(m.sources) ? m.sources : [],
      suggestedFollowUps: Array.isArray(m.suggestedFollowUps) ? m.suggestedFollowUps : [],
      relatedLinks: Array.isArray(m.relatedLinks) ? m.relatedLinks : [],
      provider: typeof m.provider === 'string' ? m.provider : null,
      cached: Boolean(m.cached),
      requestId: typeof m.requestId === 'string' ? m.requestId : null,
      feedback: m.feedback === 'up' || m.feedback === 'down' ? m.feedback : null,
    }
  }
  return base
}

export function sanitizeConversation(c, language = 'en') {
  if (!c || typeof c !== 'object') return null
  const messages = Array.isArray(c.messages)
    ? c.messages.map(sanitizeChatMessage).filter(Boolean).slice(-CHAT_HISTORY_MAX_MESSAGES)
    : []
  return {
    id: typeof c.id === 'string' ? c.id : makeId(),
    title:
      typeof c.title === 'string' && c.title.trim()
        ? c.title.trim().slice(0, 80)
        : defaultConversationTitle(language),
    createdAt: Number.isFinite(c.createdAt) ? c.createdAt : now(),
    updatedAt: Number.isFinite(c.updatedAt) ? c.updatedAt : now(),
    language: c.language === 'fr' ? 'fr' : 'en',
    context: c.context && typeof c.context === 'object' ? c.context : {},
    messages,
  }
}

export function deriveConversationTitle(messages, language = 'en', fallback) {
  const firstUser = (messages || []).find((m) => m.role === 'user' && m.content)
  if (!firstUser) return fallback || defaultConversationTitle(language)
  const text = String(firstUser.content).replace(/\s+/g, ' ').trim()
  return text.length > 60 ? `${text.slice(0, 57)}...` : text
}

export function createConversation(language = 'en', context = {}) {
  const ts = now()
  return {
    id: makeId(),
    title: defaultConversationTitle(language),
    createdAt: ts,
    updatedAt: ts,
    language: language === 'fr' ? 'fr' : 'en',
    context: context || {},
    messages: [],
  }
}

export function loadChatHistory(raw, language = 'en') {
  try {
    if (!raw) return null
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!parsed || typeof parsed !== 'object') return null
    const conversations = Array.isArray(parsed.conversations)
      ? parsed.conversations
          .map((c) => sanitizeConversation(c, language))
          .filter(Boolean)
          .slice(0, CHAT_HISTORY_MAX_CONVERSATIONS)
      : []
    let activeId = typeof parsed.activeId === 'string' ? parsed.activeId : null
    if (!conversations.some((c) => c.id === activeId)) activeId = conversations[0]?.id || null
    if (!conversations.length) return null
    return { version: 1, activeId, conversations }
  } catch {
    return null
  }
}

export function serializeChatHistory(state) {
  return JSON.stringify({
    version: 1,
    activeId: state?.activeId || null,
    conversations: Array.isArray(state?.conversations)
      ? state.conversations.slice(0, CHAT_HISTORY_MAX_CONVERSATIONS)
      : [],
  })
}
