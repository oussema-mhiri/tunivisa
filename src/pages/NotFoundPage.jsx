import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Compass, Home, MapPin, Search } from 'lucide-react'
import Flag from '../components/Flag'
import { getCountries } from '../services/api'
import { useSeo } from '../hooks/useSeo'
import { cn } from '../utils/formatters'

const DEFAULT_SUGGESTIONS = ['France', 'Turkey', 'Italy', 'Japan']

export default function NotFoundPage({
  icon: Icon = Compass,
  title = 'Page not found',
  text = "The page you're looking for doesn't exist or may have been moved.",
}) {
  useSeo({
    noindex: true,
    title: '404 — Page not found',
    description: 'The TuniVisa page you are looking for could not be found. Head back to explore visa guides.',
  })

  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    let cancelled = false
    getCountries().then((all) => {
      if (cancelled) return
      const matches = DEFAULT_SUGGESTIONS
        .map((name) => all.find((c) => c.name === name))
        .filter(Boolean)
      if (matches.length) setSuggestions(matches)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container-page flex flex-col items-center py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="hidden" aria-hidden="true" />
        <div className="flex h-24 w-24 items-center justify-center rounded-none border border-ink-200/70 bg-white shadow-card">
          <Icon className="h-10 w-10 text-brand-600" strokeWidth={1.75} aria-hidden="true" />
        </div>
        <span className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-none bg-ink-900 font-display text-sm font-bold text-white shadow-pop">
          404
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mt-8 max-w-xl text-center"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-500">{text}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Link to="/" className="btn-primary">
          <Home className="h-4.5 w-4.5" aria-hidden="true" />
          Back to home
        </Link>
        <Link to="/countries" className="btn-secondary">
          <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
          Explore countries
        </Link>
      </motion.div>

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="mt-12 w-full max-w-2xl"
        >
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <Search className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Popular destinations instead
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {suggestions.map((country) => (
              <Link
                key={country.code}
                to={`/countries/${country.code}`}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-none border border-ink-200/80 bg-white p-4',
                  'text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover',
                )}
              >
                <span className="text-3xl" aria-hidden="true">
                  <Flag code={country.code} size="lg" />
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-ink-700 group-hover:text-brand-700">
                  <MapPin className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
                  {country.name}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
