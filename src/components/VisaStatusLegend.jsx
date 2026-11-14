import { visaStatusMeta } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

export default function VisaStatusLegend({ compact = false, className }) {
  const items = ['visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required', 'unknown']
  return (
    <ul className={cn('space-y-2', compact && 'space-y-1.5', className)}>
      {items.map((key) => {
        const meta = visaStatusMeta(key)
        return (
          <li key={key} className="flex items-center gap-2.5">
            <span aria-hidden="true" className={cn('h-3 w-3 shrink-0 rounded-full', meta.dot)} />
            <span className="text-sm font-medium text-ink-700">{meta.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
