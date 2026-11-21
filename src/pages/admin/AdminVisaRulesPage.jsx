import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, SearchX } from 'lucide-react'
import Flag from '../../components/Flag'
import VisaStatusBadge from '../../components/VisaStatusBadge'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import { SkeletonTable } from '../../components/Skeleton'
import { getCountries, getVisaRules } from '../../services/api'
import { VISA_TYPES } from '../../data/visaTypes'
import { localizedDuration } from '../../utils/countryMeta'
import { useDebounce } from '../../hooks/useDebounce'
import { useI18n } from '../../i18n/LanguageContext'
import { useSeo } from '../../hooks/useSeo'

export default function AdminVisaRulesPage() {
  const { t } = useI18n()
  useSeo({ title: t('admin.visaRulesSeoTitle'), description: t('admin.visaRulesSeoDescription') })
  const [rows, setRows] = useState(null)
  const [query, setQuery] = useState('')
  const [purpose, setPurpose] = useState('all')
  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const countries = await getCountries()
      const all = await Promise.all(countries.filter((c) => c.detailed).map((c) => getVisaRules(c.code)))
      if (cancelled) return
      setRows(all.flat().filter(Boolean))
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!rows) return []
    const q = debouncedQuery.trim().toLowerCase()
    return rows
      .filter((r) => (q ? r.countryName.toLowerCase().includes(q) || r.countryCode === q : true))
      .filter((r) => (purpose === 'all' ? true : r.visaType === purpose))
      .sort((a, b) => a.countryName.localeCompare(b.countryName) || a.visaTypeLabel.localeCompare(b.visaTypeLabel))
  }, [rows, debouncedQuery, purpose])

  function localizedRuleValue(rule, field) {
    if (field === 'duration') {
      return localizedDuration(rule, t)
    }
    if (field === 'fee') {
      if (rule.fee === 'None') return t('common.none')
      if (String(rule.fee).startsWith('Varies')) return t('rule.feeVaries')
      return rule.fee
    }
    if (field === 'processingTime') {
      if (rule.visaType === 'transit') return t('rule.processingTransit')
      if (String(rule.processingTime).startsWith('Varies by permit type')) return t('rule.processingLong')
      if (String(rule.processingTime).startsWith('Varies')) return t('rule.processingVaries')
      return rule.processingTime
    }
    return rule[field]
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t('admin.searchByCountry')}
          className="sm:max-w-xs"
        />
        <label htmlFor="admin-purpose-filter" className="sr-only">{t('admin.filterPurpose')}</label>
        <select
          id="admin-purpose-filter"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="input w-auto"
        >
          <option value="all">{t('admin.allPurposes')}</option>
          {VISA_TYPES.map((item) => (
            <option key={item.id} value={item.id}>{t(`purpose.${item.id}`)}</option>
          ))}
        </select>
      </div>

      {!rows && <SkeletonTable rows={12} cols={7} />}

      {rows && filtered.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={t('admin.noRulesMatch')}
          text={t('admin.noRulesText')}
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setQuery('')
                setPurpose('all')
              }}
            >
              {t('common.clearFilters')}
            </button>
          }
        />
      )}

      {rows && filtered.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <caption className="sr-only">{t('admin.tableRulesCaption')}</caption>
              <thead>
                <tr className="border-b border-ink-200/80 bg-ink-50/70 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  <th scope="col" className="px-5 py-3.5">{t('common.country')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colPurpose')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colStatus')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colDuration')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colFee')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colProcessing')}</th>
                  <th scope="col" className="px-5 py-3.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((rule) => (
                  <tr key={`${rule.countryCode}:${rule.visaType}`} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-5 py-3.5">
                      <Link to={`/countries/${rule.countryCode}`} className="group flex items-center gap-3">
                        <Flag code={rule.countryCode} size="md" />
                        <span className="truncate font-semibold text-ink-800 group-hover:text-brand-700">
                          {rule.countryName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-ink-600">
                        <FileText className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
                        {t(`purpose.${rule.visaType}`)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <VisaStatusBadge status={rule.status} />
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-3.5 text-ink-600">{localizedRuleValue(rule, 'duration')}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-ink-600">{localizedRuleValue(rule, 'fee')}</td>
                    <td className="px-5 py-3.5 text-ink-600">{localizedRuleValue(rule, 'processingTime')}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/countries/${rule.countryCode}/visa/${rule.visaType}`}
                        className="inline-flex h-9 items-center rounded-none border border-ink-200 bg-white px-3 text-xs font-semibold text-ink-700 shadow-sm transition-colors hover:border-ink-300 hover:bg-ink-100"
                        aria-label={`${t('common.viewDetails')}: ${rule.countryName} — ${t(`purpose.${rule.visaType}`)}`}
                      >
                        {t('admin.viewAction')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rows && (
        <p className="text-xs text-ink-400">
          {t('admin.showingRules', { count: filtered.length })}
        </p>
      )}
    </div>
  )
}
