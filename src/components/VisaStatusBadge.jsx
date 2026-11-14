import { visaStatusMeta } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

export default function VisaStatusBadge({ status, size = 'sm', showDot = true, className }) {
  const meta = visaStatusMeta(status)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset',
        meta.chip,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
    >
      {showDot && <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />}
      {meta.label}
    </span>
  )
}
