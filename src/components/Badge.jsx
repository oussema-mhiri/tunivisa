import { cn } from '../utils/formatters'

const TONES = {
  gray: 'bg-ink-100 text-ink-700 ring-ink-300/50',
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  success: 'bg-success-50 text-success-700 ring-success-600/20',
  warning: 'bg-warning-50 text-warning-700 ring-warning-600/20',
  danger: 'bg-danger-50 text-danger-700 ring-danger-600/20',
  info: 'bg-info-50 text-info-600 ring-info-600/20',
}

export default function Badge({ children, tone = 'gray', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        TONES[tone] || TONES.gray,
        className,
      )}
    >
      {children}
    </span>
  )
}
