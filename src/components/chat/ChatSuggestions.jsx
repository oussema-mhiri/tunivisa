import { Lightbulb } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageContext'

export default function ChatSuggestions({ items, onSelect }) {
  const { t } = useI18n()
  if (!items?.length) return null

  return (
    <div className="mt-3 border-t border-ink-100 pt-3">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
        {t('chat.suggestions')}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            onClick={() => onSelect(item)}
            className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-left text-[11px] font-medium leading-snug text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-100"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
