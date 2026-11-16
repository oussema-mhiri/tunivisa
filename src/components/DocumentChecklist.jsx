import { motion } from 'framer-motion'
import { ClipboardCheck, Printer, RotateCcw } from 'lucide-react'
import DocumentItem from './DocumentItem'
import ProgressBar from './ProgressBar'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

export default function DocumentChecklist({ countryCode, visaType, documents, compact = false, title }) {
  const { t } = useI18n()
  const { getChecklistDone, toggleChecklistDoc, resetChecklist } = useApp()
  const done = getChecklistDone(countryCode, visaType)
  const doneSet = new Set(done)
  const completed = documents.filter((d) => doneSet.has(d.id)).length
  const pct = documents.length ? Math.round((completed / documents.length) * 100) : 0
  const allDone = documents.length > 0 && completed === documents.length

  return (
    <div className="card overflow-hidden print:border print:shadow-none" id="document-checklist">
      <div className="border-b border-ink-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-none bg-success-50 text-success-600 print:hidden">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">
                {t('checklist.title')}{title ? ` — ${title}` : ''}
              </h2>
              <p className="text-sm text-ink-500">
                {t('checklist.completed', { done: completed, total: documents.length })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-none px-2.5 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-800"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              {t('checklist.print')}
            </button>
            <button
              type="button"
              onClick={() => resetChecklist(countryCode, visaType)}
              className="inline-flex items-center gap-1.5 rounded-none px-2.5 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              {t('checklist.reset')}
            </button>
          </div>
        </div>
        <ProgressBar value={pct} className="mt-4 print:hidden" label={t('checklist.progress')} barClassName={allDone ? 'bg-success-500' : undefined} />
        <div className="mt-2 flex items-center justify-end print:hidden">
          {allDone && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-600"
            >
              <span className="zc-emoji" aria-hidden="true">✓</span> {t('checklist.allDone')}
            </motion.span>
          )}
        </div>
      </div>

      <div className={cn('grid gap-3 p-4 sm:p-5', compact ? 'sm:grid-cols-1' : 'sm:grid-cols-2')}>
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
          >
            <DocumentItem
              doc={doc}
              checked={doneSet.has(doc.id)}
              onToggle={() => toggleChecklistDoc(countryCode, visaType, doc.id)}
            />
          </motion.div>
        ))}
      </div>

      <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-3 print:bg-white">
        <p className="text-xs text-ink-400">
          {t('checklist.savedNote')}
        </p>
      </div>
    </div>
  )
}
