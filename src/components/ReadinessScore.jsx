import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { cn } from '../utils/formatters'

const CIRCLE_RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

function scoreColor(score) {
  if (score >= 80) return 'var(--color-celadon-500)'
  if (score >= 60) return 'var(--color-warning-500)'
  if (score >= 40) return 'var(--color-warning-600)'
  return 'var(--color-danger-600)'
}

export default function ReadinessScore({ score, breakdown, className }) {
  const pct = Math.max(0, Math.min(100, Math.round(score || 0)))
  const color = scoreColor(pct)

  const breakdownItems = breakdown || [
    { label: 'Financial documents', value: 70 },
    { label: 'Travel purpose', value: 80 },
    { label: 'Accommodation', value: 60 },
    { label: 'Supporting documents', value: 75 },
    { label: 'Travel history', value: 50 },
  ]

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-100 px-5 py-4">
        <h2 className="font-display text-lg font-bold text-ink-900">Application readiness</h2>
        <p className="mt-0.5 flex items-start gap-1.5 text-sm text-ink-500">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-info-500" aria-hidden="true" />
          This score is not a prediction of visa approval — it highlights what to prepare.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="relative mx-auto h-36 w-36 sm:h-40 sm:w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`Application readiness score ${pct} out of 100`}>
            <circle cx="60" cy="60" r={CIRCLE_RADIUS} fill="none" stroke="var(--color-ink-200)" strokeWidth="10" />
            <motion.circle
              cx="60"
              cy="60"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - pct / 100) }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-bold text-ink-900">{pct}</span>
            <span className="text-xs font-medium text-ink-400">/ 100</span>
          </div>
        </div>

        <div className="space-y-4">
          {breakdownItems.map((item, i) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-ink-700">{item.label}</span>
                <span className="font-semibold text-ink-900">{item.value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200/70">
                <motion.div
                  className={cn('h-full rounded-full', item.value >= 70 ? 'bg-success-500' : item.value >= 45 ? 'bg-warning-500' : 'bg-danger-500')}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
