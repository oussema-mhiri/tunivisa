import { motion } from 'framer-motion'
import { ClipboardCheck, RotateCcw } from 'lucide-react'
import DocumentItem from './DocumentItem'
import ProgressBar from './ProgressBar'
import { useApp } from '../context/AppContext'
import { cn } from '../utils/formatters'

export default function DocumentChecklist({ countryCode, visaType, documents, compact = false }) {
  const { getChecklistDone, toggleChecklistDoc, resetChecklist } = useApp()
  const done = getChecklistDone(countryCode, visaType)
  const doneSet = new Set(done)
  const completed = documents.filter((d) => doneSet.has(d.id)).length
  const pct = documents.length ? Math.round((completed / documents.length) * 100) : 0
  const allDone = completed === documents.length

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">Required Documents</h2>
              <p className="text-sm text-ink-500">
                {completed} of {documents.length} documents completed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => resetChecklist(countryCode, visaType)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
        <ProgressBar value={pct} className="mt-4" label="Progress" barClassName={allDone ? 'bg-success-500' : undefined} />
        <div className="mt-2 flex items-center justify-end">
          {allDone && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-600"
            >
              <span aria-hidden="true">🎉</span> Everything ticked off — good luck!
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

      <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-3">
        <p className="text-xs text-ink-400">
          Your progress is saved on this device. It is a personal checklist — it is not submitted anywhere.
        </p>
      </div>
    </div>
  )
}
