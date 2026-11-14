import { visaStatusMeta } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

export default function VisaStatusBadge({ status, size = 'sm', showDot = true, className }) {
  const meta = visaStatusMeta(status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.08em] uppercase ring-1 ring-inset',
        meta.chip,
        size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1 text-xs',
        className,
      )}
    >
      {showDot && <span aria-hidden="true" className={cn('h-1.5 w-1.5', meta.dot)} />}
      {meta.label}
    </span>
  )
}
