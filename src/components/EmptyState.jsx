import { motion } from 'framer-motion'
import { cn } from '../utils/formatters'

const defaultStyles = {
  title: 'font-display text-lg font-bold text-ink-900',
  text: 'mt-1 text-sm leading-relaxed text-ink-500',
}

export default function EmptyState({ icon: Icon, title, text, action, className, styles }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-none border border-dashed border-ink-300/70 bg-white/60 px-6 py-14 text-center',
        className,
      )}
      role="status"
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-none bg-brand-50 text-brand-600">
          <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
        </div>
      )}
      <h3 className={cn(defaultStyles.title, styles?.title)}>{title}</h3>
      {text && <p className={cn(defaultStyles.text, 'max-w-sm', styles?.text)}>{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
