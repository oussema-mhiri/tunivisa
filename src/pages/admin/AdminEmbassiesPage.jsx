import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, ExternalLink, SearchX } from 'lucide-react'
import Flag from '../../components/Flag'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import { EMBASSIES } from '../../data/embassies'
import { useDebounce } from '../../hooks/useDebounce'
import { useI18n } from '../../i18n/LanguageContext'
import { useSeo } from '../../hooks/useSeo'

export default function AdminEmbassiesPage() {
  const { t } = useI18n()
  useSeo({ title: t('admin.embassiesSeoTitle'), description: t('admin.embassiesSeoDescription') })
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  const rows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return EMBASSIES.filter((e) =>
      q
        ? e.name.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.countryCode === q ||
          e.type.toLowerCase().includes(q)
        : true,
    ).sort((a, b) => a.countryCode.localeCompare(b.countryCode))
  }, [debouncedQuery])

  return (
    <div className="space-y-5">
      <SearchBar value={query} onChange={setQuery} placeholder={t('admin.searchEmbassies')} className="sm:max-w-xs" />

      {rows.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={t('admin.noEmbassyMatch')}
          text={t('admin.noEmbassyText')}
          action={
            <button type="button" className="btn-primary" onClick={() => setQuery('')}>
              {t('common.clearSearch')}
            </button>
          }
        />
      )}

      {rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">{t('admin.tableEmbassiesCaption')}</caption>
              <thead>
                <tr className="border-b border-ink-200/80 bg-ink-50/70 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  <th scope="col" className="px-5 py-3.5">{t('common.country')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colMission')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colType')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('embassy.city')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('embassy.phone')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colWebsite')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((e) => (
                  <tr key={e.countryCode} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-5 py-3.5">
                      <Link to={`/countries/${e.countryCode}`} className="group flex items-center gap-3">
                        <Flag code={e.countryCode} size="md" />
                        <span className="truncate font-semibold text-ink-800 group-hover:text-brand-700">
                          {e.countryCode.toUpperCase()}
                        </span>
                      </Link>
                    </td>
                    <td className="max-w-[240px] px-5 py-3.5">
                      <span className="block truncate font-medium text-ink-800">{e.name}</span>
                      <span className="block text-xs text-ink-400">{e.address}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-ink-600">
                        <Building2 className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
                        {e.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-600">{e.city}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-ink-600">{e.phone}</td>
                    <td className="px-5 py-3.5">
                      <a
                        href={e.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        {t('admin.visitSite')}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-ink-400">
        {t('admin.showingEmbassies', { shown: rows.length, total: EMBASSIES.length })}
      </p>
    </div>
  )
}
