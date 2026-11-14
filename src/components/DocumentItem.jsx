import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Info } from 'lucide-react'
import Badge from './Badge'
import { cn } from '../utils/formatters'

export default function DocumentItem({ doc, checked, onToggle, expandable = true }) {
  const [open, setOpen] = useState(false)
  const toggleDetails = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (expandable) setOpen((o) => !o)
  }

  return (
    <div
      className={cn(
        'rounded-none border transition-colors',
        checked ? 'border-success-500/40 bg-success-50/40' : 'border-ink-200/80 bg-white',
      )}
    >
      <div className="flex items-center gap-3 p-3.5 sm:p-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={onToggle}
          aria-label={`Mark "${doc.label}" as ${checked ? 'not completed' : 'completed'}`}
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-none border-2 transition-all duration-200',
            checked
              ? 'border-success-500 bg-success-500 text-white'
              : 'border-ink-300 bg-white text-transparent hover:border-brand-400',
          )}
        >
          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn('text-sm font-semibold', checked ? 'text-ink-500 line-through' : 'text-ink-900')}>
              {doc.label}
            </p>
            <Badge tone={doc.required ? 'danger' : 'gray'}>{doc.required ? 'Required' : 'Optional'}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-ink-500">{doc.description}</p>
        </div>

        {expandable && doc.details && (
          <button
            type="button"
            onClick={toggleDetails}
            aria-expanded={open}
            aria-label={`More information about ${doc.label}`}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-none transition-colors',
              open ? 'bg-brand-50 text-brand-600' : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700',
            )}
          >
            <Info className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 rounded-none border border-brand-200/60 bg-brand-50/60 px-4 py-3 text-sm leading-relaxed text-ink-600">
              {doc.details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
