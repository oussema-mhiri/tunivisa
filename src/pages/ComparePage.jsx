import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, Scale } from 'lucide-react'
import CompareSelector from '../components/compare/CompareSelector'
import CompareTable from '../components/compare/CompareTable'
import CompareCard from '../components/compare/CompareCard'
import { Skeleton } from '../components/Skeleton'
import { getCountries, getCountryComparison } from '../services/api'
import { buildComparison } from '../utils/compare'
import { VISA_TYPE_IDS } from '../data/visaTypes'
import { useI18n } from '../i18n/LanguageContext'
import { useSeo } from '../hooks/useSeo'

const DEFAULT_CODES = ['fr', 'it', 'es']
const DEFAULT_PURPOSE = 'tourism'

function parseCodes(param) {
  return [...new Set(String(param || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean))].slice(0, 4)
}

export default function ComparePage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const [countries, setCountries] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [onlyDifferences, setOnlyDifferences] = useState(false)

  const codes = parseCodes(searchParams.get('countries'))
  const selectedCodes = codes.length ? codes : DEFAULT_CODES
  const rawPurpose = String(searchParams.get('purpose') || DEFAULT_PURPOSE).toLowerCase()
  const visaType = VISA_TYPE_IDS.includes(rawPurpose) ? rawPurpose : DEFAULT_PURPOSE

  useSeo({
    title: t('compare.seoTitle'),
    description: t('compare.seoDescription'),
  })

  useEffect(() => {
    let cancelled = false
    getCountries().then((data) => {
      if (!cancelled) setCountries(data || [])
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const current = parseCodes(searchParams.get('countries'))
    const currentPurpose = String(searchParams.get('purpose') || '').toLowerCase()
    if (current.length >= 2 && current.length <= 4 && VISA_TYPE_IDS.includes(currentPurpose)) return
    const next = new URLSearchParams(searchParams)
    if (current.length < 2) next.set('countries', DEFAULT_CODES.join(','))
    if (!VISA_TYPE_IDS.includes(currentPurpose)) next.set('purpose', DEFAULT_PURPOSE)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    let cancelled = false
    if (selectedCodes.length < 2) {
      setItems([])
      return undefined
    }
    setLoading(true)
    getCountryComparison({ codes: selectedCodes, visaType })
      .then((data) => {
        if (!cancelled) setItems(data || [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedCodes.join(','), visaType])

  const comparison = useMemo(() => {
    if (!items || items.length < 2) return null
    return buildComparison({ items, visaType })
  }, [items, visaType])

  function handleChange({ codes: nextCodes, visaType: nextPurpose }) {
    const cleaned = [...new Set((nextCodes || []).map((c) => String(c).toLowerCase()))].slice(0, 4)
    const params = new URLSearchParams(searchParams)
    params.set('countries', (cleaned.length ? cleaned : DEFAULT_CODES).join(','))
    params.set('purpose', VISA_TYPE_IDS.includes(nextPurpose) ? nextPurpose : DEFAULT_PURPOSE)
    setSearchParams(params)
  }

  return (
    <div className="container-page max-w-7xl py-10 sm:py-14">
      <div className="mb-8">
        <span className="zc-tag mb-4 inline-flex items-center gap-2"><Scale className="h-3.5 w-3.5" aria-hidden="true" />{t('nav.compare')}</span>
        <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">{t('compare.title')}</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-500">{t('compare.subtitle')}</p>
      </div>

      <CompareSelector countries={countries} selectedCodes={selectedCodes} visaType={visaType} onChange={handleChange} />

      {comparison && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
            <input type="checkbox" checked={onlyDifferences} onChange={(e) => setOnlyDifferences(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
            {t('compare.onlyDifferences')}
          </label>
          {comparison.schengenNote && (
            <div className="flex items-start gap-2 rounded-xl border border-info-200 bg-info-50 px-3 py-2 text-sm text-info-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{t('compare.schengenNote')}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        )}
        {!loading && comparison && (
          <>
            <CompareTable comparison={comparison} onlyDifferences={onlyDifferences} />
            <CompareCard comparison={comparison} onlyDifferences={onlyDifferences} />
          </>
        )}
        {!loading && !comparison && (
          <div className="card p-8 text-center text-sm text-ink-500">{t('compare.needTwo')}</div>
        )}
      </div>
    </div>
  )
}
