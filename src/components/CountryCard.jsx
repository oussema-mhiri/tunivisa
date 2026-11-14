import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarClock, Heart, MapPin } from 'lucide-react'
import Flag from './Flag'
import VisaStatusBadge from './VisaStatusBadge'
import { useApp } from '../context/AppContext'
import { formatMaxStay } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

export default function CountryCard({ country, layout = 'grid', index = 0 }) {
  const { isSaved, toggleSaved } = useApp()
  const saved = isSaved(country.code)

  const SaveButton = (
    <button
      type="button"
      onClick={() => toggleSaved(country.code, country.name)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${country.name} from saved` : `Save ${country.name}`}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
        saved
          ? 'bg-danger-50 text-danger-600'
          : 'bg-ink-100/80 text-ink-500 hover:bg-ink-200 hover:text-ink-700',
      )}
    >
      <Heart className={cn('h-4.5 w-4.5', saved && 'fill-current')} aria-hidden="true" />
    </button>
  )

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
        className="card flex items-center gap-4 p-4 transition-shadow duration-200 hover:shadow-card-hover"
      >
        <Flag code={country.code} size="lg" className="rounded-lg" />
        <div className="min-w-0 flex-1">
          <Link to={`/countries/${country.code}`} className="font-display font-bold text-ink-900 hover:text-brand-700">
            {country.name}
          </Link>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {country.region}
            {country.maxStayDays > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-ink-400">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatMaxStay(country.maxStayDays)}
              </span>
            )}
          </p>
        </div>
        <VisaStatusBadge status={country.visaStatus} className="hidden sm:inline-flex" />
        {SaveButton}
        <Link
          to={`/countries/${country.code}`}
          className="btn-secondary hidden md:inline-flex"
          aria-label={`View details for ${country.name}`}
        >
          View details
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-brand-50 via-ink-50 to-ink-100">
        <Flag code={country.code} size="xl" className="drop-shadow-sm" />
        <div className="absolute top-3 right-3">{SaveButton}</div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-ink-900">
              <Link to={`/countries/${country.code}`} className="hover:text-brand-700">
                {country.name}
              </Link>
            </h3>
            <p className="mt-0.5 text-xs font-medium text-ink-400">{country.region}</p>
          </div>
          <VisaStatusBadge status={country.visaStatus} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {country.description ||
            `Visa guidance for Tunisian passport holders travelling to ${country.name}.`}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatMaxStay(country.maxStayDays)}
          </span>
          <Link
            to={`/countries/${country.code}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            aria-label={`View requirements for ${country.name}`}
          >
            View requirements
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
