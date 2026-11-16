import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutGrid, List, SearchX } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import CountryCard from '../components/CountryCard'
import EmptyState from '../components/EmptyState'
import { SkeletonList } from '../components/Skeleton'
import { getCountries } from '../services/api'
import { useDebounce } from '../hooks/useDebounce'
import { useSeo } from '../hooks/useSeo'
import { useI18n } from '../i18n/LanguageContext'
import { visaStatusMeta, STATUS_ORDER, REGIONS } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

const PAGE_SIZE = 12

export default function CountriesPage() {
  const { t } = useI18n()
  useSeo({
    title: 'Explore countries',
    description: 'Search and filter every destination with visa information for Tunisian passport holders.',
  })

  const [countries, setCountries] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [region, setRegion] = useState('all')
  const [sort, setSort] = useState('asc')
  const [view, setView] = useState('grid')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [searchParams] = useSearchParams()
  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    const q = searchParams.get('q')
    const nextStatus = searchParams.get('status')
    const nextRegion = searchParams.get('region')

    if (q) setQuery(q)
    if (nextStatus && STATUS_ORDER.includes(nextStatus)) setStatus(nextStatus)
    if (nextRegion && REGIONS.includes(nextRegion)) setRegion(nextRegion)
  }, [searchParams])

  useEffect(() => {
    let cancelled = false
    getCountries().then((data) => {
      if (!cancelled) setCountries(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [debouncedQuery, status, region, sort])

  const filtered = useMemo(() => {
    if (!countries) return []
    const q = debouncedQuery.trim().toLowerCase()
    return countries
      .filter((c) => (q ? c.name.toLowerCase().includes(q) || (c.capital || '').toLowerCase().includes(q) || c.code === q : true))
      .filter((c) => (status === 'all' ? true : c.visaStatus === status))
      .filter((c) => (region === 'all' ? true : c.region === region))
      .sort((a, b) =>
        sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
      )
  }, [countries, debouncedQuery, status, region, sort])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setRegion('all')
    setSort('asc')
  }

  return (
    <div className="container-page max-w-[86rem] py-12 sm:py-16">
      <div className="zc-page-head flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end lg:pl-8">
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">{t('nav.explore')}</p>
          <h1 className="zc-page-title mt-2 font-display text-ink-900">
            {t('countries.title')}
          </h1>
          <p className="mt-2 text-sm text-ink-500 sm:text-base">
            {t('countries.subtitle')}{' '}
            {countries && <span className="font-semibold text-ink-700">({filtered.length} {t('countries.results')})</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('grid')}
            aria-pressed={view === 'grid'}
            aria-label={t('countries.gridView')}
            className={cn('btn h-10 w-10 p-0', view === 'grid' ? 'btn-primary' : 'btn-secondary')}
          >
            <LayoutGrid className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
            aria-label={t('countries.listView')}
            className={cn('btn h-10 w-10 p-0', view === 'list' ? 'btn-primary' : 'btn-secondary')}
          >
            <List className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t('countries.searchPlaceholder')}
            className="lg:max-w-md"
          />
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="status-filter" className="sr-only">Filter by visa status</label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.filter((s) => s !== 'unknown').map((s) => (
                <option key={s} value={s}>{visaStatusMeta(s).label}</option>
              ))}
            </select>

            <label htmlFor="region-filter" className="sr-only">Filter by region</label>
            <select
              id="region-filter"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <label htmlFor="sort" className="sr-only">Sort countries</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input w-auto"
            >
              <option value="asc">{t('countries.sortAlpha')}</option>
              <option value="desc">{t('countries.sortAlphaDesc')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by visa status">
          {['all', ...STATUS_ORDER.filter((s) => s !== 'unknown')].map((key) => {
            const active = status === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setStatus(key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors',
                  active
                    ? key === 'all'
                      ? 'border-transparent bg-ink-900 text-paper'
                      : cn('border-transparent ring-2 ring-brand-500/25', visaStatusMeta(key).chip)
                    : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                )}
              >
                {key === 'all' ? t('common.all') : visaStatusMeta(key).label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        {!countries && <SkeletonList items={9} />}

        {countries && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <EmptyState
              icon={SearchX}
              title={t('countries.noResultsTitle')}
              text={t('countries.noResultsText')}
              action={
                <button type="button" onClick={clearFilters} className="btn-primary">
                  {t('countries.clearFilters')}
                </button>
              }
            />
          </motion.div>
        )}

        {countries && filtered.length > 0 && view === 'grid' && (
          <div className="zc-country-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((country, i) => (
              <CountryCard key={country.code} country={country} index={i} />
            ))}
          </div>
        )}

        {countries && filtered.length > 0 && view === 'list' && (
          <div className="space-y-3">
            {shown.map((country, i) => (
              <CountryCard key={country.code} country={country} layout="list" index={i} />
            ))}
          </div>
        )}
      </div>

      {countries && hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="btn-secondary"
          >
            {t('countries.loadMore')} ({filtered.length - visible} left)
          </button>
        </div>
      )}
    </div>
  )
}
