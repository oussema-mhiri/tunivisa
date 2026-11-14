import { CalendarCheck2, ShieldCheck } from 'lucide-react'
import { formatDate } from '../utils/formatters'

export default function LastVerified({ date, source }) {
  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-600">
          <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink-900">Last verified: {formatDate(date)}</p>
          <p className="text-xs text-ink-500">Source: {source}</p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 rounded-xl bg-warning-50 px-4 py-3 sm:max-w-md">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warning-600" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-warning-700">
          Visa requirements can change. Always verify the information on the official government website
          before applying.
        </p>
      </div>
    </div>
  )
}
