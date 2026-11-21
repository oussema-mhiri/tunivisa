import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Heart, History, Save } from 'lucide-react'
import Flag from '../components/Flag'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { getCountries, getVisaDetails } from '../services/api'
import { useSeo } from '../hooks/useSeo'
import { useI18n } from '../i18n/LanguageContext'

export default function MySpacePage() {
  const { t } = useI18n()
  useSeo({
    title: t('mySpace.seoTitle'),
    path: '/my-space',
    description: t('mySpace.seoDescription'),
  })
  const { saved, recentSearches, clearRecentSearches, checklists } = useApp()
  const [allCountries, setAllCountries] = useState([])
  const [savedCountries, setSavedCountries] = useState([])
  const [checklistDetails, setChecklistDetails] = useState([])

  useEffect(() => {
    getCountries().then(setAllCountries)
  }, [])

  useEffect(() => {
    setSavedCountries(allCountries.filter((c) => saved.includes(c.code)))
  }, [saved, allCountries])

  useEffect(() => {
    let cancelled = false
    const keys = Object.keys(checklists)
    Promise.all(
      keys.map((key) => {
        const [code, visaType] = key.split(':')
        return getVisaDetails(code, visaType).then((data) => (data ? { ...data, done: checklists[key].length } : null))
      }),
    ).then((rows) => {
      if (!cancelled) setChecklistDetails(rows.filter(Boolean))
    })
    return () => {
      cancelled = true
    }
  }, [checklists])

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">{t('mySpace.eyebrow')}</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        {t('mySpace.title')}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">
        {t('mySpace.subtitle')}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="saved-dest">
          <div className="flex items-center justify-between gap-3">
            <h2 id="saved-dest" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <Heart className="h-5 w-5 text-danger-500" aria-hidden="true" />
              {t('mySpace.savedDestinations')}
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">{saved.length}</span>
            </h2>
            <Link to="/saved" className="btn-secondary h-9 px-3 text-xs">
              {t('mySpace.viewAll')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {savedCountries.length === 0 ? (
            <EmptyState
              icon={Heart}
              title={t('mySpace.noSavedTitle')}
              text={t('mySpace.noSavedText')}
              action={<Link to="/countries" className="btn-primary">{t('mySpace.exploreCountries')}</Link>}
            />
          ) : (
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {savedCountries.slice(0, 6).map((c) => (
                <li key={c.code}>
                  <Link
                    to={`/countries/${c.code}`}
                    className="flex items-center gap-3 rounded-xl border border-ink-200/70 bg-white p-3 transition-all hover:border-brand-200 hover:shadow-card-hover"
                  >
                    <Flag code={c.code} size="md" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-800">{c.name}</span>
                    <ArrowRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6" aria-labelledby="saved-checklists">
          <h2 id="saved-checklists" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
            <ClipboardCheck className="h-5 w-5 text-success-600" aria-hidden="true" />
            {t('mySpace.savedChecklists')}
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">{checklistDetails.length}</span>
          </h2>
          {checklistDetails.length === 0 ? (
            <p className="mt-4 rounded-xl bg-ink-50 px-4 py-4 text-sm text-ink-500">
              {t('mySpace.noChecklists')}
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {checklistDetails.map(({ country, rule, documents, done }) => (
                <li key={`${country.code}:${rule.visaType}`}>
                  <Link
                    to={`/countries/${country.code}/visa/${rule.visaType}`}
                    className="flex items-center gap-3 rounded-xl border border-ink-200/70 bg-white p-3.5 transition-all hover:border-brand-200 hover:shadow-card-hover"
                  >
                    <Flag code={country.code} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{t('mySpace.visaLabel', { name: country.name, type: t(`purpose.short.${rule.visaType}`) })}</p>
                      <p className="text-xs text-ink-400">{t('mySpace.documentsCompleted', { done, total: documents.length })}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6 lg:col-span-2" aria-labelledby="recent-searches">
          <div className="flex items-center justify-between gap-3">
            <h2 id="recent-searches" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <History className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('mySpace.recentSearches')}
            </h2>
            {recentSearches.length > 0 && (
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-xs font-semibold text-ink-400 transition-colors hover:text-danger-600"
              >
                {t('mySpace.clearAll')}
              </button>
            )}
          </div>
          {recentSearches.length === 0 ? (
            <p className="mt-4 rounded-xl bg-ink-50 px-4 py-4 text-sm text-ink-500">
              {t('mySpace.recentEmpty')}
            </p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <li key={term}>
                  <Link
                    to={`/countries?q=${encodeURIComponent(term)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    <Save className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
                    {term}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
