import { motion } from 'framer-motion'
import { cn } from '../utils/formatters'

export default function StatCard({ icon: Icon, label, value, sub, accent = 'brand', index = 0 }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-celadon-50 text-celadon-700',
    warning: 'bg-warning-50 text-warning-700',
    info: 'bg-info-50 text-info-700',
    danger: 'bg-danger-50 text-danger-700',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="card flex items-start gap-4 p-5 transition-shadow duration-200"
    >
      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', accents[accent])}>
        <Icon className="h-5.5 w-5.5" strokeWidth={2} aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-4xl leading-none tracking-[-0.03em] text-ink-900">{value}</p>
        <p className="mt-1 text-xs font-bold tracking-[0.06em] text-ink-600 uppercase">{label}</p>
        {sub && <p className="mt-1 text-[11px] text-ink-400">{sub}</p>}
      </div>
    </motion.div>
  )
}
