import { STATUS_ORDER, visaStatusMeta } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

export default function VisaStatusLegend({ compact = false, className }) {
  const items = STATUS_ORDER
  return (
    <ul className={cn(compact ? 'flex flex-wrap items-center gap-x-4 gap-y-2' : 'space-y-2', className)}>
      {items.map((key) => {
        const meta = visaStatusMeta(key)
        return (
          <li key={key} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className={cn(
                'shrink-0 rounded-full border border-ink-900/15',
                compact ? 'h-2.5 w-2.5' : 'h-3 w-3',
                meta.dot,
              )}
            />
            <span className={cn('font-medium text-ink-700', compact ? 'text-xs' : 'text-sm')}>{meta.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
