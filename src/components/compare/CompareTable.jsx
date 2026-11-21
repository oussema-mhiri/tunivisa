import Flag from '../Flag'
import VisaStatusBadge from '../VisaStatusBadge'
import { useI18n } from '../../i18n/LanguageContext'
import { cn } from '../../utils/formatters'

function CellContent({ value, rowId }) {
  const { t } = useI18n()
  if (rowId === 'status' && value?.meta) {
    return <VisaStatusBadge status={value.raw} />
  }
  let display = value?.display ?? '—'
  if (['fee', 'processing', 'method'].includes(rowId) && display === 'Varies') display = t('country.varies')
  if (rowId === 'maxStay' && (display === 'Not specified' || display === 'Varies')) display = t('country.notSpecified')
  if (rowId === 'lastVerified' && display === 'N/A') display = t('compare.na')
  if (rowId === 'source' && display === 'Official government source') display = t('country.officialGovernmentSource')
  if (rowId === 'embassy' && display === 'Not listed') display = t('compare.notListed')
  if (value?.href && value.display && value.display !== 'Not listed') {
    return (
      <a href={value.href} target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-800">
        {display}
      </a>
    )
  }
  return <span className="text-sm text-ink-700">{display}</span>
}

export default function CompareTable({ comparison, onlyDifferences = false }) {
  const { t } = useI18n()
  if (!comparison) return null
  const rows = onlyDifferences ? comparison.rows.filter((r) => r.different) : comparison.rows

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50/70">
              <th className="sticky left-0 z-10 bg-ink-50/95 px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500 backdrop-blur">
                {t('compare.criteria')}
              </th>
              {comparison.countries.map((country) => (
                <th key={country.code} className="min-w-[220px] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Flag code={country.code} size="sm" />
                    <span className="font-display text-sm font-semibold text-ink-900">{country.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className={cn('border-b border-ink-100 last:border-b-0', row.different && 'bg-warning-50/40')}>
                <th className="sticky left-0 z-10 bg-white px-4 py-3 align-top text-sm font-semibold text-ink-700">
                  <span className="flex items-center gap-2">
                    {t(`compare.row${row.id.charAt(0).toUpperCase()}${row.id.slice(1)}`)}
                    {row.different && <span className="h-1.5 w-1.5 rounded-full bg-warning-500" title={t('compare.different')} />}
                  </span>
                </th>
                {row.values.map((value) => (
                  <td key={value.code} className={cn('px-4 py-3 align-top', row.different && 'font-medium')}>
                    <CellContent value={value} rowId={row.id} />
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={comparison.countries.length + 1} className="px-4 py-8 text-center text-sm text-ink-500">
                  {t('compare.noDifferences')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
