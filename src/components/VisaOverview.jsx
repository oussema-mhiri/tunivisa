import { BadgeCheck, CalendarClock, CreditCard, ListChecks, Repeat, Timer } from 'lucide-react'

const FIELDS = [
  { key: 'visaType', label: 'Visa type', icon: ListChecks },
  { key: 'purpose', label: 'Purpose', icon: BadgeCheck },
  { key: 'duration', label: 'Duration', icon: CalendarClock },
  { key: 'entries', label: 'Entries', icon: Repeat },
  { key: 'processingTime', label: 'Processing time', icon: Timer },
  { key: 'fee', label: 'Fee', icon: CreditCard },
]

export default function VisaOverview({ rule }) {
  const purposeLabel = rule.visaTypeLabel
  const values = {
    visaType: rule.visaTypeLabel,
    purpose: rule.purpose || purposeLabel,
    duration: rule.duration,
    entries: rule.entries,
    processingTime: rule.processingTime,
    fee: rule.fee,
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-100 px-5 py-4">
        <h2 className="font-display text-lg font-bold text-ink-900">Visa Overview</h2>
        <p className="mt-0.5 text-sm text-ink-500">
          Key details for a {rule.visaTypeLabel.toLowerCase()} visa to {rule.countryName}.
        </p>
      </div>
      <dl className="grid divide-y divide-ink-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
        {FIELDS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-start gap-3 px-5 py-4 sm:border-b sm:border-ink-100 lg:[&:nth-last-child(-n+2)]:border-b-0">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-brand-50 text-brand-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-medium tracking-wide text-ink-400 uppercase">{label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink-800">{values[key]}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
