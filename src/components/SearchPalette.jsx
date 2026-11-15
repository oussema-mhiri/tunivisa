import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CornerDownLeft, Loader2, Plane, Search } from 'lucide-react'
import Flag from './Flag'
import VisaStatusBadge from './VisaStatusBadge'
import { globalSearch } from '../services/api'
import { useDebounce } from '../hooks/useDebounce'
import { useApp } from '../context/AppContext'
import { VISA_TYPES } from '../data/visaTypes'
import { cn } from '../utils/formatters'

function ResultRow({ active, onHover, onClick, children }) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
        active ? 'bg-brand-50' : 'hover:bg-ink-50',
      )}
    >
      {children}
    </button>
  )
}

export default function SearchPalette() {
  const navigate = useNavigate()
  const { addRecentSearch } = useApp()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ countries: [], visaTypes: [], purposes: [] })
  const [loading, setLoading] = useState(false)
  const debounced = useDebounce(query, 220)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const openPalette = () => setOpen(true)
  const closePalette = () => {
    setOpen(false)
    setQuery('')
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => openPalette()
    document.addEventListener('keydown', onKey)
    document.addEventListener('tunivisa:open-search', onOpen)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('tunivisa:open-search', onOpen)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setResults({ countries: [], visaTypes: [], purposes: [] })
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open || !debounced.trim()) {
      setResults({ countries: [], visaTypes: [], purposes: [] })
      setLoading(false)
      return
    }
    setLoading(true)
    const id = window.setTimeout(() => {
      globalSearch(debounced).then((res) => {
        setResults(res)
        setLoading(false)
        setActiveIndex(0)
      })
    }, 120)
    return () => window.clearTimeout(id)
  }, [debounced, open])

  const flatItems = [
    ...results.countries.map((c) => ({ type: 'country', payload: c })),
    ...results.visaTypes.map((t) => ({ type: 'visa', payload: t })),
    ...results.purposes.map((id) => ({ type: 'purpose', payload: VISA_TYPES.find((v) => v.id === id) })),
  ]

  const go = (item) => {
    if (!item) return
    if (item.type === 'country') {
      addRecentSearch(item.payload.name)
      navigate(`/countries/${item.payload.code}`)
    } else {
      navigate(`/assistant?purpose=${item.payload.id}`)
    }
    closePalette()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, Math.max(flatItems.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flatItems[activeIndex])
    }
  }

  const groups = [
    {
      key: 'countries',
      label: 'Countries',
      items: results.countries,
      toItem: (c) => ({ type: 'country', payload: c }),
      render: (c) => (
        <>
          <Flag code={c.code} size="md" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{c.name}</span>
          <VisaStatusBadge status={c.visaStatus} />
        </>
      ),
    },
    {
      key: 'visaTypes',
      label: 'Visa types',
      items: results.visaTypes,
      toItem: (t) => ({ type: 'visa', payload: t }),
      render: (t) => (
        <>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Plane className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{t.label}</span>
          <span className="text-xs text-ink-400">{t.shortLabel}</span>
        </>
      ),
    },
    {
      key: 'purposes',
      label: 'Travel purposes',
      items: results.purposes,
      toItem: (t) => ({ type: 'purpose', payload: t }),
      render: (t) => (
        <>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 text-success-600">
            <Plane className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{t.label}</span>
          <span className="text-xs text-ink-400">Ask the assistant</span>
        </>
      ),
    },
  ]

  let flatIndex = 0

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-ink-900/50 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
          onClick={closePalette}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-pop"
          >
            <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
              <Search className="h-5 w-5 text-ink-400" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search countries, visa types, travel purposes…"
                className="w-full bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
                aria-label="Search TuniVisa"
              />
              <button
                type="button"
                onClick={closePalette}
                className="rounded-lg border border-ink-200 px-1.5 py-0.5 text-xs font-semibold text-ink-400 hover:text-ink-600"
                aria-label="Close search"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              {!query.trim() && (
                <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-500">
                  <CornerDownLeft className="h-4 w-4 text-ink-400" aria-hidden="true" />
                  Type to search countries, visa types and travel purposes…
                </div>
              )}

              {query.trim() && loading && (
                <div className="flex items-center gap-2.5 px-4 py-4 text-sm text-ink-500">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" aria-hidden="true" />
                  Searching…
                </div>
              )}

              {query.trim() && !loading && flatItems.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-ink-500">
                  No results for “{query}”. Try another search.
                </p>
              )}

              {!loading &&
                groups.map((group) => {
                  if (group.items.length === 0) return null
                  return (
                    <div key={group.key}>
                      <p className="px-4 pt-2 pb-1 text-[11px] font-bold tracking-wider text-ink-400 uppercase">
                        {group.label}
                      </p>
                      {group.items.map((item, i) => {
                        const idx = flatIndex++
                        const active = idx === activeIndex
                        return (
                          <ResultRow
                            key={`${group.key}-${i}`}
                            active={active}
                            onHover={() => setActiveIndex(idx)}
                            onClick={() => go(group.toItem(item))}
                          >
                            {group.render(item)}
                            <ArrowRight
                              className={cn('h-4 w-4 text-ink-300', active && 'text-brand-500')}
                              aria-hidden="true"
                            />
                          </ResultRow>
                        )
                      })}
                    </div>
                  )
                })}
            </div>

            <div className="hidden items-center gap-4 border-t border-ink-100 bg-ink-50 px-4 py-2 text-[11px] font-medium text-ink-400 sm:flex">
              <span className="flex items-center gap-1"><kbd className="rounded-lg border border-ink-200 bg-white px-1">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="rounded-lg border border-ink-200 bg-white px-1">↵</kbd> Select</span>
              <span className="flex items-center gap-1"><kbd className="rounded-lg border border-ink-200 bg-white px-1">ESC</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
