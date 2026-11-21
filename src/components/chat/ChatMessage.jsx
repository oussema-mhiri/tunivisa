import { ArrowUpRight, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/LanguageContext'
import ChatSources from './ChatSources'
import ChatSuggestions from './ChatSuggestions'
import { cn } from '../../utils/formatters'

export default function ChatMessage({ message, showSuggestions = false, onSuggestion, onFeedback }) {
  const { lang, t } = useI18n()
  const isUser = message.role === 'user'
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  if (isUser) {
    return (
      <div className="flex justify-end" dir={dir}>
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm dark:bg-brand-800">
          <span className="sr-only">{t('chat.userLabel')}: </span>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    )
  }

  const feedback = message.feedback || null

  return (
    <div className="flex justify-start" dir={dir}>
      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-ink-100 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-800 shadow-sm">
        <span className="sr-only">{t('chat.assistantLabel')}: </span>
        <p className="whitespace-pre-wrap break-words" dir={dir} aria-live={message.streaming ? 'polite' : undefined}>
          {message.content}
          {message.streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-brand-500 align-[-2px]" aria-hidden="true" />}
        </p>

        <ChatSources sources={message.sources} />

        {message.relatedLinks?.length ? (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
              {t('chat.related')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {message.relatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {showSuggestions ? <ChatSuggestions items={message.suggestedFollowUps} onSelect={onSuggestion} /> : null}

        {message.requestId ? (
          <div className="mt-2 flex items-center gap-1 border-t border-ink-100 pt-2">
            <span className="mr-1 text-[11px] text-ink-400">{t('chat.feedbackLabel')}</span>
            <button
              type="button"
              aria-label={t('chat.feedbackUp')}
              aria-pressed={feedback === 'up'}
              onClick={() => onFeedback?.(message, 'up')}
              className={cn(
                'rounded-md p-1 transition-colors',
                feedback === 'up' ? 'bg-celadon-100 text-celadon-700' : 'text-ink-400 hover:bg-ink-100 hover:text-ink-600',
              )}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={t('chat.feedbackDown')}
              aria-pressed={feedback === 'down'}
              onClick={() => onFeedback?.(message, 'down')}
              className={cn(
                'rounded-md p-1 transition-colors',
                feedback === 'down' ? 'bg-danger-100 text-danger-700' : 'text-ink-400 hover:bg-ink-100 hover:text-ink-600',
              )}
            >
              <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
