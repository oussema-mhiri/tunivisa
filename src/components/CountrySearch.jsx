import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Plane } from 'lucide-react'
import SearchBar from './SearchBar'
import Flag from './Flag'
import VisaStatusBadge from './VisaStatusBadge'
import { searchCountries } from '../services/api'
import { useDebounce } from '../hooks/useDebounce'
import { useApp } from '../context/AppContext'
import { SUGGESTED_COUNTRIES } from '../data/countries'
import { cn } from '../utils/formatters'

export default function CountrySearch({
  onSelect,
  size = 'md',
  placeholder,
  showSuggested = true,
  className,
  autoFocus = false,
}) {
  const navigate = useNavigate()
  const { addRecentSearch } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const debouncedQuery = useDebounce(query, 200)
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    if (!debouncedQuery.trim()) {
      setResults([])
      setLoading(false)
      setOpen(false)
      return
    }
    setLoading(true)
    setOpen(true)
    searchCountries(debouncedQuery).then((res) => {
      if (!cancelled) {
        setResults(res)
        setLoading(false)
        setActive(-1)
      }
    })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const suggestions = useMemo(() => {
    const map = new Map(results.map((c) => [c.code, c]))
    return SUGGESTED_COUNTRIES
      .map((name) => map.get(name.toLowerCase().slice(0, 2)) || null)
      .filter(Boolean)
      .slice(0, 6)
  }, [results])

  const visible = query.trim() ? results : suggestions

  const selectCountry = (country) => {
    addRecentSearch(country.name)
    setOpen(false)
    setQuery('')
    if (onSelect) onSelect(country)
    else navigate(`/countries/${country.code}`)
  }

  const handleKeyDown = (e) => {
    if (!visible.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % visible.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + visible.length) % visible.length)
    } else if (e.key === 'Enter') {
      if (active >= 0 && visible[active]) {
        e.preventDefault()
        selectCountry(visible[active])
      }
    }
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <SearchBar
        value={query}
        onChange={setQuery}
        size={size}
        placeholder={placeholder || 'Search a country…'}
        autoFocus={autoFocus}
        ariaLabel="Search countries"
        onKeyDown={handleKeyDown}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full z-30 mt-2 max-h-[45vh] w-full overflow-y-auto overscroll-contain rounded-2xl border border-ink-200 bg-white shadow-pop"
            role="listbox"
            aria-label="Country suggestions"
          >
            {loading && (
              <div className="flex items-center gap-2 px-4 py-3.5 text-sm text-ink-500">
                <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden="true" />
                Searching…
              </div>
            )}

            {!loading && visible.length === 0 && (
              <p className="px-4 py-4 text-sm text-ink-500">
                No countries match “{query}”. Try a different spelling.
              </p>
            )}

            {!loading &&
              visible.map((country, i) => (
                <button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => selectCountry(country)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                    i === active ? 'bg-brand-50' : 'hover:bg-ink-50',
                    i !== visible.length - 1 && 'border-b border-ink-100',
                  )}
                >
                  <Flag code={country.code} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-900">{country.name}</span>
                    <span className="block text-xs text-ink-400">{country.region}</span>
                  </span>
                  <VisaStatusBadge status={country.visaStatus} />
                </button>
              ))}

            {!loading && visible.length > 0 && (
              <div className="flex items-center gap-1.5 border-t border-ink-100 bg-ink-50 px-4 py-2 text-xs text-ink-400">
                <Plane className="h-3.5 w-3.5" aria-hidden="true" />
                {query.trim() ? 'Enter to open the highlighted country' : 'Popular searches for Tunisians'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
