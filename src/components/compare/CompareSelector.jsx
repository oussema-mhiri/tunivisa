import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { VISA_TYPES } from '../../data/visaTypes'
import { useI18n } from '../../i18n/LanguageContext'
import Flag from '../Flag'
import { cn } from '../../utils/formatters'

export default function CompareSelector({ countries = [], selectedCodes = [], visaType = 'tourism', onChange }) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [activeSlot, setActiveSlot] = useState(null)

  const selected = selectedCodes.map((code) => countries.find((c) => c.code === code)).filter(Boolean)
  const slots = [0, 1, 2, 3]

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries.slice(0, 8)
    return countries
      .filter((c) => c.name.toLowerCase().includes(q) || c.code.includes(q) || (c.capital || '').toLowerCase().includes(q))
      .slice(0, 8)
  }, [countries, query])

  function updateCodes(nextCodes) {
    onChange({ codes: nextCodes, visaType })
  }

  function addCountry(code) {
    if (selectedCodes.includes(code)) return
    let next = [...selectedCodes]
    if (activeSlot != null && activeSlot < 4) {
      next[activeSlot] = code
    } else if (next.length < 4) {
      next.push(code)
    } else {
      next[3] = code
    }
    next = [...new Set(next.filter(Boolean))].slice(0, 4)
    updateCodes(next)
    setQuery('')
    setActiveSlot(null)
  }

  function removeCountry(code) {
    updateCodes(selectedCodes.filter((c) => c !== code))
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <label className="block text-sm font-semibold text-ink-800">{t('compare.selectCountries')}</label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {slots.map((i) => {
              const country = selected[i]
              return (
                <div key={i} className="relative">
                  {country ? (
                    <div className="flex h-11 items-center justify-between gap-2 rounded-xl border border-ink-200 bg-white px-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <Flag code={country.code} size="sm" />
                        <span className="truncate text-sm font-medium text-ink-800">{country.name}</span>
                      </span>
                      <button type="button" onClick={() => removeCountry(country.code)} className="rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label={`Remove ${country.name}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveSlot(activeSlot === i ? null : i)}
                      disabled={selectedCodes.length >= 4 && activeSlot !== i}
                      className={cn(
                        'h-11 w-full rounded-xl border border-dashed px-3 text-left text-sm font-medium transition-colors',
                        activeSlot === i ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-500 hover:border-brand-300 hover:bg-brand-50/50',
                        selectedCodes.length >= 4 && activeSlot !== i && 'opacity-50',
                      )}
                    >
                      {t('compare.addCountry')}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {activeSlot != null && (
            <div className="mt-3 rounded-xl border border-ink-200 bg-white p-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('compare.searchCountry')}
                className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                autoFocus
              />
              <ul className="mt-2 max-h-56 overflow-auto">
                {matches.map((c) => {
                  const disabled = selectedCodes.includes(c.code)
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => addCountry(c.code)}
                        className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm', disabled ? 'opacity-40' : 'hover:bg-brand-50')}
                      >
                        <Flag code={c.code} size="sm" />
                        <span className="font-medium text-ink-800">{c.name}</span>
                        <span className="ml-auto text-xs text-ink-400">{c.code.toUpperCase()}</span>
                      </button>
                    </li>
                  )
                })}
                {matches.length === 0 && <li className="px-2 py-3 text-sm text-ink-500">{t('countries.noResultsTitle')}</li>}
              </ul>
            </div>
          )}
          <p className="mt-2 text-xs text-ink-500">{t('compare.hint')}</p>
        </div>

        <div className="min-w-[220px]">
          <label htmlFor="compare-purpose" className="block text-sm font-semibold text-ink-800">{t('compare.purpose')}</label>
          <select
            id="compare-purpose"
            value={visaType}
            onChange={(e) => onChange({ codes: selectedCodes, visaType: e.target.value })}
            className="mt-2 h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            {VISA_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.shortLabel || type.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
