import Flag from '../Flag'
import VisaStatusBadge from '../VisaStatusBadge'
import { useI18n } from '../../i18n/LanguageContext'
import { cn } from '../../utils/formatters'

function Value({ row, value }) {
  if (row.id === 'status' && value?.meta) return <VisaStatusBadge status={value.raw} />
  if (value?.href && value.display && value.display !== 'Not listed') {
    return <a href={value.href} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-700 underline">{value.display}</a>
  }
  return <span className="text-sm text-ink-700">{value?.display ?? '—'}</span>
}

export default function CompareCard({ comparison, onlyDifferences = false }) {
  const { t } = useI18n()
  if (!comparison) return null
  const rows = onlyDifferences ? comparison.rows.filter((r) => r.different) : comparison.rows

  return (
    <div className="grid gap-4 md:hidden">
      {comparison.countries.map((country) => (
        <div key={country.code} className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-4 py-3">
            <Flag code={country.code} size="sm" />
            <h3 className="font-display text-base font-semibold text-ink-900">{country.name}</h3>
          </div>
          <dl className="divide-y divide-ink-100">
            {rows.map((row) => {
              const value = row.values.find((v) => v.code === country.code)
              return (
                <div key={row.id} className={cn('grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 px-4 py-3', row.different && 'bg-warning-50/40')}>
                  <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">
                    {row.label}
                    {row.different && <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-warning-500 align-middle" />}
                  </dt>
                  <dd><Value row={row} value={value} /></dd>
                </div>
              )
            })}
            {rows.length === 0 && <div className="px-4 py-6 text-center text-sm text-ink-500">{t('compare.noDifferences')}</div>}
          </dl>
        </div>
      ))}
    </div>
  )
}
