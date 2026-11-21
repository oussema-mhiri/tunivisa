import { useMemo, useState } from 'react'
import { ExternalLink, SearchX, ShieldAlert } from 'lucide-react'
import Flag from '../../components/Flag'
import VerificationBadge from '../../components/VerificationBadge'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import { buildAdminSources } from '../../data/admin'
import { formatDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import { useI18n } from '../../i18n/LanguageContext'
import { useDebounce } from '../../hooks/useDebounce'
import { useSeo } from '../../hooks/useSeo'

const STATUS_KEYS = ['verified', 'needs_review', 'expired']

export default function AdminSourcesPage() {
  const { t } = useI18n()
  useSeo({ title: t('admin.sourcesSeoTitle'), description: t('admin.sourcesSeoDescription') })
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const debouncedQuery = useDebounce(query, 200)

  const all = useMemo(() => buildAdminSources(), [])

  const rows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return all
      .filter((s) => (q ? s.name.toLowerCase().includes(q) || s.code === q : true))
      .filter((s) => (filter === 'all' ? true : s.status === filter))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [all, debouncedQuery, filter])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={query} onChange={setQuery} placeholder={t('admin.searchSources')} className="sm:max-w-xs" />
        <div className="flex items-center gap-2" role="group" aria-label={t('admin.filterVerification')}>
          {[{ key: 'all', label: t('common.all') }, ...STATUS_KEYS.map((k) => ({ key: k, label: t(`verification.${k}`) }))].map(
            (opt) => (
              <button
                key={opt.key}
                type="button"
                aria-pressed={filter === opt.key}
                onClick={() => setFilter(opt.key)}
                className={`inline-flex items-center rounded-none border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === opt.key
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                }`}
              >
                {opt.label}
              </button>
            ),
          )}
        </div>
      </div>

      {rows.length === 0 && (
        <EmptyState
          icon={SearchX}
          title={t('admin.noSourcesMatch')}
          text={t('admin.noSourcesText')}
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
            >
              {t('common.clearFilters')}
            </button>
          }
        />
      )}

      {rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">{t('admin.tableSourcesCaption')}</caption>
              <thead>
                <tr className="border-b border-ink-200/80 bg-ink-50/70 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  <th scope="col" className="px-5 py-3.5">{t('common.source')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('common.country')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colCategory')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('common.lastVerified')}</th>
                  <th scope="col" className="px-5 py-3.5">{t('admin.colVerification')}</th>
                  <th scope="col" className="px-5 py-3.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((s) => (
                  <tr key={s.code} className="transition-colors hover:bg-ink-50/60">
                    <td className="max-w-[260px] px-5 py-3.5">
                      <span className="block truncate font-semibold text-ink-800">{s.name}</span>
                      <a
                        href={s.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-brand-600 hover:text-brand-700"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{s.url || t('admin.noUrl')}</span>
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2 font-medium text-ink-700">
                        <Flag code={s.code} size="md" />
                        {s.code.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-ink-600">{s.category}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-ink-600">{formatDate(s.lastVerified)}</td>
                    <td className="px-5 py-3.5">
                      <VerificationBadge status={s.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toast.info(t('admin.reverifyDemo', { name: s.name }))}
                        className="btn-secondary h-9 px-3 text-xs"
                        aria-label={`${t('admin.reverify')} ${s.name}`}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('admin.reverify')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-ink-400">
        {t('admin.showingSources', { shown: rows.length, total: all.length })}
      </p>
    </div>
  )
}
