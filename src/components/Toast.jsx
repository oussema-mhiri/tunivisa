import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const TONES = {
  success: 'border-success-500/30 bg-success-50 text-success-700',
  error: 'border-danger-500/30 bg-danger-50 text-danger-700',
  info: 'border-brand-500/30 bg-brand-50 text-brand-700',
}

export function Toast({ toast, onDismiss }) {
  const { t } = useI18n()
  const Icon = ICONS[toast.type] || Info
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-pop',
        TONES[toast.type] || TONES.info,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label={t('toast.dismiss')}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function Toaster({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
