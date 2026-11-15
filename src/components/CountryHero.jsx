import { motion } from 'framer-motion'
import { Heart, MapPin } from 'lucide-react'
import Flag from './Flag'
import Badge from './Badge'
import { useApp } from '../context/AppContext'
import { cn } from '../utils/formatters'

export default function CountryHero({ country, demo = false }) {
  const { isSaved, toggleSaved } = useApp()
  const saved = isSaved(country.code)

  return (
    <div className="card zc-country-hero relative overflow-hidden">
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-ink-100 bg-brand-50"
        >
          <Flag code={country.code} size="lg" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-4xl leading-none text-ink-900 sm:text-6xl">
              {country.name}
            </h1>
            {country.detailed && <Badge tone="brand">Full guide</Badge>}
            {demo && <Badge tone="warning">Limited data</Badge>}
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
            {country.capital && (
              <span className="inline-flex items-center gap-1.5">
                <span className="zc-emoji" aria-hidden="true">🏛️</span>
                Capital: <span className="font-medium text-ink-700">{country.capital}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {country.region}
            </span>
            {country.languages && (
              <span className="inline-flex items-center gap-1.5">
                <span className="zc-emoji" aria-hidden="true">💬</span>
                {country.languages.join(', ')}
              </span>
            )}
            {country.currency && (
              <span className="inline-flex items-center gap-1.5">
                <span className="zc-emoji" aria-hidden="true">💰</span>
                {country.currency}
              </span>
            )}
          </p>
          {country.description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">{country.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleSaved(country.code, country.name)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${country.name} from saved` : `Save ${country.name}`}
          className={cn(
            'btn shrink-0',
            saved ? 'btn-danger' : 'btn-secondary',
          )}
        >
          <Heart className={cn('h-4.5 w-4.5', saved && 'fill-current')} aria-hidden="true" />
          {saved ? 'Saved' : 'Save destination'}
        </button>
      </div>
    </div>
  )
}
