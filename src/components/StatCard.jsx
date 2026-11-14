import { motion } from 'framer-motion'
import { cn } from '../utils/formatters'

export default function StatCard({ icon: Icon, label, value, sub, accent = 'brand', index = 0 }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
    info: 'bg-info-50 text-info-600',
    danger: 'bg-danger-50 text-danger-600',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="card flex items-start gap-4 p-5 transition-shadow duration-200 hover:shadow-card-hover"
    >
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', accents[accent])}>
        <Icon className="h-5.5 w-5.5" strokeWidth={2} aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-3xl font-bold tracking-tight text-ink-900">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-ink-600">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-400">{sub}</p>}
      </div>
    </motion.div>
  )
}
