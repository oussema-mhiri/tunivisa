import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarClock, ClipboardCheck, Heart, History, LogOut, Mail, MapPin, Phone, Save, UserRound } from 'lucide-react'
import Flag from '../components/Flag'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { getCountries, getVisaDetails } from '../services/api'
import { formatDate } from '../utils/formatters'
import { useSeo } from '../hooks/useSeo'

export default function ProfilePage() {
  useSeo({ title: 'My profile', description: 'Your TuniVisa profile: personal information, saved destinations and checklists.' })
  const { user, isAuthenticated, profile, saved, recentSearches, clearRecentSearches, logout, checklists } = useApp()
  const location = useLocation()
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const p = profile || { name: user?.name, email: user?.email, nationality: 'Tunisia' }

  const infoItems = [
    { label: 'Full name', value: p.name || '—', icon: UserRound },
    { label: 'Email', value: p.email || '—', icon: Mail },
    { label: 'Nationality', value: p.nationality || 'Tunisia', icon: MapPin },
    { label: 'Member since', value: user?.joined ? formatDate(user.joined) : '—', icon: CalendarClock },
  ]

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">My profile</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Welcome, {p.name?.split(' ')[0] || 'traveler'}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Personal information */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-6"
          aria-labelledby="personal-info"
        >
          <h2 id="personal-info" className="font-display text-lg font-bold text-ink-900">Personal information</h2>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 font-display text-2xl font-bold text-white">
              {(p.name || 'U').charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-semibold text-ink-900">{p.name}</p>
              <p className="text-sm text-ink-500">{p.email}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-3.5 border-t border-ink-100 pt-5">
            {infoItems.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                <dt className="w-28 text-sm text-ink-500">{label}</dt>
                <dd className="text-sm font-semibold text-ink-800">{value}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={logout} className="btn-ghost mt-6 w-full justify-center text-danger-600 hover:bg-danger-50">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </motion.section>

        <div className="space-y-6 lg:col-span-2">
          {/* Saved destinations */}
          <section className="card p-6" aria-labelledby="saved-dest">
            <div className="flex items-center justify-between gap-3">
              <h2 id="saved-dest" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                <Heart className="h-5 w-5 text-danger-500" aria-hidden="true" />
                Saved destinations
                <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">{saved.length}</span>
              </h2>
              <Link to="/saved" className="btn-secondary h-9 px-3 text-xs">
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {savedCountries.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="No saved destinations yet"
                text="Tap the heart on any country card to keep it here for later."
                action={<Link to="/countries" className="btn-primary">Explore countries</Link>}
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

          {/* Saved checklists */}
          <section className="card p-6" aria-labelledby="saved-checklists">
            <h2 id="saved-checklists" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <ClipboardCheck className="h-5 w-5 text-success-600" aria-hidden="true" />
              Saved visa checklists
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">{checklistDetails.length}</span>
            </h2>
            {checklistDetails.length === 0 ? (
              <p className="mt-4 rounded-xl bg-ink-50 px-4 py-4 text-sm text-ink-500">
                No checklists in progress. Open any visa guide and tick off documents as you prepare them.
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
                        <p className="truncate text-sm font-semibold text-ink-800">{country.name} — {rule.visaTypeLabel} Visa</p>
                        <p className="text-xs text-ink-400">{done} of {documents.length} documents completed</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-ink-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent searches */}
          <section className="card p-6" aria-labelledby="recent-searches">
            <div className="flex items-center justify-between gap-3">
              <h2 id="recent-searches" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                <History className="h-5 w-5 text-brand-600" aria-hidden="true" />
                Recent searches
              </h2>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-ink-400 transition-colors hover:text-danger-600"
                >
                  Clear all
                </button>
              )}
            </div>
            {recentSearches.length === 0 ? (
              <p className="mt-4 rounded-xl bg-ink-50 px-4 py-4 text-sm text-ink-500">
                Your recent searches will appear here as you explore the map and country search.
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
    </div>
  )
}
