import { ExternalLink } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageContext'

export default function ChatSources({ sources }) {
  const { t } = useI18n()
  if (!sources?.length) return null

  return (
    <div className="mt-3 rounded-xl border border-ink-100 bg-ink-50/70 p-2.5">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        {t('chat.sources')}
      </p>
      <ul className="space-y-1.5">
        {sources.map((source) => (
          <li key={source.url || source.title}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-1.5 rounded-md p-1 text-[11px] leading-snug text-brand-700 hover:bg-brand-50 hover:underline"
            >
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="font-medium">{source.title}</span>
                {source.lastVerified ? (
                  <span className="ml-1 block text-ink-400 sm:inline sm:whitespace-nowrap">
                    · {t('chat.verifiedOn', { date: source.lastVerified })}
                  </span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
