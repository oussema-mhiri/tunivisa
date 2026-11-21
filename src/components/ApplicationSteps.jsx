import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'

export default function ApplicationSteps({ steps, mode, compact = false }) {
  const { t } = useI18n()
  return (
    <ol className="relative">
      <span
        className="absolute top-4 bottom-4 left-[15px] w-px bg-ink-200 sm:left-[19px]"
        aria-hidden="true"
      />
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.25, delay: Math.min(i * 0.06, 0.4) }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          <span
            className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm ring-4 ring-brand-50"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div className="pt-0.5">
            <h3 className="font-display text-sm font-bold text-ink-900">
              {mode ? t(`steps.${mode}.${i + 1}Title`) : step.title}
            </h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-500">
              {mode ? t(`steps.${mode}.${i + 1}Text`) : step.text}
            </p>
          </div>
          {i === steps.length - 1 && (
            <span className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-success-50 text-success-600" aria-hidden="true">
              <Check className="h-4 w-4" />
            </span>
          )}
        </motion.li>
      ))}
    </ol>
  )
}
