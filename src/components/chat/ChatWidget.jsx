import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, History, Loader2, MessageCircle, Plus, Send, ShieldCheck, Trash2, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import { useChatHistory } from '../../hooks/useChatHistory'
import { useI18n } from '../../i18n/LanguageContext'
import { CHAT_ENABLED, sendFeedback } from '../../services/chat'
import { useToast } from '../../context/ToastContext'
import ChatMessage from './ChatMessage'
import ChatSuggestions from './ChatSuggestions'
import { cn } from '../../utils/formatters'

function useChatContext() {
  const { pathname, search } = useLocation()

  return useMemo(() => {
    const match = pathname.match(/\/countries\/([a-z]{2})(?:\/visa\/([a-z]+))?\/?$/i)
    const params = new URLSearchParams(search)
    const countryCode = (match?.[1] || params.get('country') || params.get('countries')?.split(',')[0] || '').toLowerCase()
    const visaType = (match?.[2] || params.get('purpose') || '').toLowerCase()

    return {
      ...(countryCode ? { countryCode } : {}),
      ...(visaType ? { visaType } : {}),
    }
  }, [pathname, search])
}

function errorText(error, t) {
  if (!error) return ''
  if (error.code === 'rate_limited') return t('chat.rateLimited')
  if (error.code === 'timeout') return t('chat.timeout')
  return t('chat.error')
}

export default function ChatWidget() {
  const { pathname } = useLocation()
  const { lang, t } = useI18n()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const toast = useToast()
  const context = useChatContext()
  const {
    conversations,
    activeId,
    messages,
    setMessages,
    updateMessage,
    createNew,
    selectConversation,
    deleteConversation,
    clearAll,
  } = useChatHistory({ language: lang, context })
  const { loading, streaming, error, send, stop, clear } = useChat({ language: lang, context, messages, setMessages })
  const [open, setOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const hidden = pathname.startsWith('/admin')

  const lastAssistantId = useMemo(
    () => [...messages].reverse().find((message) => message.role === 'assistant')?.id || null,
    [messages],
  )

  const starters = useMemo(
    () => [t('chat.starter1'), t('chat.starter2'), t('chat.starter3')],
    [t],
  )

  useEffect(() => {
    if (hidden) setOpen(false)
  }, [hidden])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading, error, open, historyOpen])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (historyOpen) setHistoryOpen(false)
        else setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, historyOpen])

  if (!CHAT_ENABLED || hidden) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || loading) return
    setInput('')
    send(value)
  }

  const handleSuggestion = (value) => {
    if (loading) return
    send(value)
  }

  const handleNew = () => {
    clear()
    createNew()
    setInput('')
    setHistoryOpen(false)
    inputRef.current?.focus()
  }

  const handleClearAll = () => {
    clear()
    clearAll()
    setInput('')
    setHistoryOpen(false)
  }

  const handleFeedback = async (message, vote) => {
    const next = message.feedback === vote ? null : vote
    updateMessage(message.id, { feedback: next })
    if (!next) return
    const result = await sendFeedback({ requestId: message.requestId, vote: next, messageId: message.id, context })
    if (result.ok) {
      toast.success(t('chat.feedbackSaved'))
    } else {
      updateMessage(message.id, { feedback: null })
      toast.error(t('chat.error'))
    }
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.section
            key="chat-panel"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-x-3 bottom-20 top-16 z-50 flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 shadow-pop dark:bg-ink-100 sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[620px] sm:max-h-[calc(100vh-8rem)] sm:w-[400px] sm:max-w-[calc(100vw-2rem)]"
            role="dialog"
            dir={dir}
            aria-label={t('chat.title')}
          >
            <header className="flex items-start justify-between gap-3 bg-ink-900 px-4 py-3 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/25 text-brand-200">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-sm font-semibold">{t('chat.title')}</h2>
                  <p className="truncate text-[11px] text-white/70">{t('chat.subtitle')}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={handleNew}
                  aria-label={t('chat.newConversation')}
                  className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryOpen((v) => !v)}
                  aria-label={t('chat.history')}
                  aria-expanded={historyOpen}
                  className={cn('rounded-full p-1.5 transition-colors hover:bg-white/10 hover:text-white', historyOpen ? 'bg-white/10 text-white' : 'text-white/70')}
                >
                  <History className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('chat.close')}
                  className="rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </header>

            {historyOpen ? (
              <div className="border-b border-ink-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-500">{t('chat.history')}</p>
                  <button type="button" onClick={handleClearAll} className="inline-flex items-center gap-1 text-xs font-medium text-danger-600 hover:text-danger-700">
                    <Trash2 className="h-3.5 w-3.5" /> {t('chat.clearAll')}
                  </button>
                </div>
                <ul className="max-h-40 space-y-1 overflow-auto">
                  {conversations.map((c) => (
                    <li key={c.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => { selectConversation(c.id); setHistoryOpen(false) }}
                        className={cn('min-w-0 flex-1 rounded-lg px-2 py-1.5 text-left text-sm transition-colors', c.id === activeId ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-50')}
                      >
                        <span className="block truncate font-medium">{c.title || t('chat.newConversation')}</span>
                      </button>
                      <button type="button" onClick={() => deleteConversation(c.id)} aria-label={t('chat.deleteConversation')} className="rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-danger-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div
              className="flex-1 space-y-3 overflow-y-auto bg-ink-50 px-3.5 py-4"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.length === 0 ? (
                <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-brand-700">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <h3 className="font-display text-sm font-semibold">{t('chat.welcomeTitle')}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{t('chat.welcome')}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-500">{t('chat.privacy')}</p>
                  <ChatSuggestions items={starters} onSelect={handleSuggestion} />
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    showSuggestions={message.id === lastAssistantId && !loading}
                    onSuggestion={handleSuggestion}
                    onFeedback={handleFeedback}
                  />
                ))
              )}

              {loading ? (
                <div className="flex items-center gap-2 px-1 text-xs text-ink-500" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>{t('chat.thinking')}</span>
                </div>
              ) : null}

              {error ? (
                <div className="flex gap-2 rounded-xl border border-danger-100 bg-danger-50 p-3 text-xs text-danger-700" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{t('chat.errorTitle')}</p>
                    <p className="mt-0.5 leading-relaxed">{errorText(error, t)}</p>
                  </div>
                </div>
              ) : null}

              <div ref={endRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-ink-200 bg-white p-3">
              <div className="flex items-end gap-2">
                <label htmlFor="tunivisa-chat-input" className="sr-only">
                  {t('chat.placeholder')}
                </label>
                <input
                  id="tunivisa-chat-input"
                  ref={inputRef}
                  type="text"
                  dir={dir}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={500}
                  placeholder={t('chat.placeholder')}
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-ink-200 bg-ink-50 px-3 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                />
                {loading || streaming ? (
                  <button
                    type="button"
                    onClick={stop}
                    aria-label={t('chat.stop')}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-700 text-white transition-colors hover:bg-ink-800"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label={t('chat.send')}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-brand-800 dark:hover:bg-brand-900"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="mt-1.5 flex items-start justify-between gap-2 text-[10px] leading-snug text-ink-400">
                <span>{t('chat.disclaimer')}</span>
                {input.length > 420 ? (
                  <span className="whitespace-nowrap">
                    {t('chat.charactersLeft', { count: 500 - input.length })}
                  </span>
                ) : null}
              </div>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t('chat.close') : t('chat.open')}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-pop transition-colors hover:bg-brand-700 dark:bg-brand-800 dark:hover:bg-brand-900 sm:bottom-6 sm:right-6"
        whileTap={{ scale: 0.94 }}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </motion.button>
    </>
  )
}
