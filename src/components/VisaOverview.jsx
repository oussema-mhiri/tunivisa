import { BadgeCheck, CalendarClock, CreditCard, ListChecks, Repeat, Timer } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'
import { localizedDuration } from '../utils/countryMeta'

const FIELDS = [
  { key: 'visaType', icon: ListChecks },
  { key: 'purpose', icon: BadgeCheck },
  { key: 'duration', icon: CalendarClock },
  { key: 'entries', icon: Repeat },
  { key: 'processingTime', icon: Timer },
  { key: 'fee', icon: CreditCard },
]

export default function VisaOverview({ rule }) {
  const { t } = useI18n()

  const entriesKey = {
    tourism: 'entriesSingleMultiple',
    family: 'entriesSingleMultiple',
    business: 'entriesMultiple',
    study: 'entriesMultiple',
    work: 'entriesMultiple',
    residence: 'entriesMultiple',
    medical: 'entriesSingle',
    transit: 'entriesSingle',
  }[rule.visaType]

  const duration = localizedDuration(rule, t)

  let processingTime = rule.processingTime
  if (rule.visaType === 'transit') {
    processingTime = t('rule.processingTransit')
  } else if (String(rule.processingTime).startsWith('Varies by permit type')) {
    processingTime = t('rule.processingLong')
  } else if (String(rule.processingTime).startsWith('Varies')) {
    processingTime = t('rule.processingVaries')
  }

  let fee = rule.fee
  if (rule.fee === 'None') fee = t('common.none')
  else if (String(rule.fee).startsWith('Varies')) fee = t('rule.feeVaries')

  const values = {
    visaType: t(`purpose.short.${rule.visaType}`),
    purpose: t(`purpose.${rule.visaType}`),
    duration,
    entries: entriesKey ? t(`rule.${entriesKey}`) : rule.entries,
    processingTime,
    fee,
    applicationMethod: rule.mode ? t(`rule.method.${rule.mode}`) : rule.applicationMethod,
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-100 px-5 py-4">
        <h2 className="font-display text-lg font-bold text-ink-900">{t('overview.title')}</h2>
        <p className="mt-0.5 text-sm text-ink-500">
          {t('overview.subtitle', { type: rule.visaTypeLabel, country: rule.countryName })}
        </p>
      </div>
      <dl className="grid divide-y divide-ink-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
        {FIELDS.map(({ key, icon: Icon }) => (
          <div key={key} className="flex items-start gap-3 px-5 py-4 sm:border-b sm:border-ink-100 lg:[&:nth-last-child(-n+2)]:border-b-0">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-medium tracking-wide text-ink-400 uppercase">{t(`overview.${key}`)}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink-800">{values[key]}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  )
}
