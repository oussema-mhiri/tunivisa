import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, SearchX } from 'lucide-react'
import Flag from '../../components/Flag'
import VisaStatusBadge from '../../components/VisaStatusBadge'
import VerificationBadge from '../../components/VerificationBadge'
import SearchBar from '../../components/SearchBar'
import EmptyState from '../../components/EmptyState'
import { SkeletonTable } from '../../components/Skeleton'
import { getCountries } from '../../services/api'
import { LAST_VERIFIED, OFFICIAL_SOURCE } from '../../data/visaRules'
import { getVerificationStatus } from '../../data/admin'
import { visaStatusMeta, STATUS_ORDER } from '../../utils/countryMeta'
import { formatDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import { useDebounce } from '../../hooks/useDebounce'
import { useSeo } from '../../hooks/useSeo'

export default function AdminCountriesPage() {
  useSeo({ title: 'Admin — Countries', description: 'Manage the country dataset and verification status.' })
  const toast = useToast()
  const [countries, setCountries] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const debouncedQuery = useDebounce(query, 200)

  useEffect(() => {
    let cancelled = false
    getCountries().then((data) => {
      if (!cancelled) setCountries(data.filter((c) => c.detailed))
    })
    return () => {
      cancelled = true
    }
  }, [])

  const rows = useMemo(() => {
    if (!countries) return []
    const q = debouncedQuery.trim().toLowerCase()
    return countries
      .filter((c) => (q ? c.name.toLowerCase().includes(q) || c.code === q : true))
      .filter((c) => (status === 'all' ? true : c.visaStatus === status))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [countries, debouncedQuery, status])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search countries…"
          className="sm:max-w-xs"
        />
        <label htmlFor="admin-status-filter" className="sr-only">Filter by visa status</label>
        <select
          id="admin-status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All statuses</option>
          {STATUS_ORDER.filter((s) => s !== 'unknown').map((s) => (
            <option key={s} value={s}>{visaStatusMeta(s).label}</option>
          ))}
        </select>
      </div>

      {!countries && <SkeletonTable rows={10} cols={6} />}

      {countries && rows.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No countries match"
          text="Try a different search term or clear the visa status filter."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setQuery('')
                setStatus('all')
              }}
            >
              Clear filters
            </button>
          }
        />
      )}

      {countries && rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Countries, visa status and verification</caption>
              <thead>
                <tr className="border-b border-ink-200/80 bg-ink-50/70 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  <th scope="col" className="px-5 py-3.5">Country</th>
                  <th scope="col" className="px-5 py-3.5">Visa status</th>
                  <th scope="col" className="px-5 py-3.5">Last verified</th>
                  <th scope="col" className="px-5 py-3.5">Source</th>
                  <th scope="col" className="px-5 py-3.5">Verification</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((c) => {
                  const verification = getVerificationStatus(c.code)
                  return (
                    <tr key={c.code} className="transition-colors hover:bg-ink-50/60">
                      <td className="px-5 py-3.5">
                        <Link to={`/countries/${c.code}`} className="group flex items-center gap-3">
                          <Flag code={c.code} size="md" />
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-ink-800 group-hover:text-brand-700">
                              {c.name}
                            </span>
                            <span className="block text-xs text-ink-400">{c.code.toUpperCase()} · {c.region}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <VisaStatusBadge status={c.visaStatus} />
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-ink-600">
                        {formatDate(LAST_VERIFIED[c.code])}
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-ink-500">
                        {OFFICIAL_SOURCE[c.code] || 'Official government source'}
                      </td>
                      <td className="px-5 py-3.5">
                        <VerificationBadge status={verification} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => toast.info(`${c.name}: editing is a demo action — nothing is saved.`)}
                          className="btn-secondary h-9 px-3 text-xs"
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {countries && (
        <p className="text-xs text-ink-400">
          Showing {rows.length} of {countries.length} detailed countries. Edit actions do not persist.
        </p>
      )}
    </div>
  )
}
