import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/LanguageContext'
import ChatSources from './ChatSources'
import ChatSuggestions from './ChatSuggestions'

export default function ChatMessage({ message, showSuggestions = false, onSuggestion }) {
  const { t } = useI18n()
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm dark:bg-brand-800">
          <span className="sr-only">{t('chat.userLabel')}: </span>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-ink-100 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-ink-800 shadow-sm">
        <span className="sr-only">{t('chat.assistantLabel')}: </span>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

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
      </div>
    </div>
  )
}
