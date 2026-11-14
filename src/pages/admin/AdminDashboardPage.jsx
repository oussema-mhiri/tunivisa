import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Building2, FileCheck2, FileText, Globe2, ShieldCheck } from 'lucide-react'
import StatCard from '../../components/StatCard'
import VerificationBadge from '../../components/VerificationBadge'
import Flag from '../../components/Flag'
import { SkeletonList } from '../../components/Skeleton'
import { getCountries, getVisaRules } from '../../services/api'
import { DOCUMENTS } from '../../data/documents'
import { EMBASSIES } from '../../data/embassies'
import { buildAdminSources, buildAdminStats } from '../../data/admin'
import { formatDate } from '../../utils/formatters'
import { useSeo } from '../../hooks/useSeo'

export default function AdminDashboardPage() {
  useSeo({ title: 'Admin dashboard', description: 'TuniVisa admin overview: countries, visa rules, documents, sources and verification.' })
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const countries = await getCountries()
      const rows = await Promise.all(countries.filter((c) => c.detailed).map((c) => getVisaRules(c.code)))
      if (cancelled) return
      const visaRules = rows.flat().filter(Boolean)
      const sources = buildAdminSources()
      setStats(buildAdminStats({ countries, visaRules, documents: DOCUMENTS, embassies: EMBASSIES, sources }))
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const kpis = [
    { icon: Globe2, label: 'Total countries', value: stats?.totalCountries, accent: 'brand', sub: `${stats?.totalEmbassies ?? '—'} embassy records` },
    { icon: FileText, label: 'Visa rules', value: stats?.totalVisaRules, accent: 'info', sub: '8 purposes per country' },
    { icon: FileCheck2, label: 'Documents', value: stats?.totalDocuments, accent: 'success', sub: 'in the checklist registry' },
    { icon: Building2, label: 'Official sources', value: stats?.totalSources, accent: 'warning', sub: `${stats?.verifiedSources ?? '—'} verified` },
    { icon: AlertTriangle, label: 'Need verification', value: stats?.requiringVerification, accent: 'danger', sub: 'review or expired' },
  ]

  const reviewQueue = stats?.reviewQueue || []
  const expired = stats?.expiredSources || []

  return (
    <div className="space-y-8">
      {!stats && <SkeletonList items={5} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" />}

      {stats && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {kpis.map((kpi, i) => (
              <StatCard key={kpi.label} {...kpi} index={i} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Review queue */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="card p-5"
              aria-labelledby="review-queue"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 id="review-queue" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                  <AlertTriangle className="h-5 w-5 text-warning-500" aria-hidden="true" />
                  Review queue
                </h2>
                <span className="rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-bold text-warning-700">
                  {reviewQueue.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-500">Sources due for a re-check against official government sites.</p>

              <ul className="mt-4 divide-y divide-ink-100">
                {reviewQueue.length === 0 && (
                  <li className="py-6 text-center text-sm text-ink-400">All sources are up to date.</li>
                )}
                {reviewQueue.map((item) => (
                  <li key={item.code} className="flex items-center gap-3 py-3">
                    <Flag code={item.code} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{item.name}</p>
                      <p className="text-xs text-ink-400">Last verified {formatDate(item.lastVerified)}</p>
                    </div>
                    <VerificationBadge status={item.status} />
                    <Link
                      to="/admin/countries"
                      className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Review →
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Recently updated / expired */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="card p-5"
              aria-labelledby="recently-updated"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 id="recently-updated" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                  <ShieldCheck className="h-5 w-5 text-success-600" aria-hidden="true" />
                  Source health
                </h2>
                <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-bold text-success-700">
                  {stats.verifiedSources} verified
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-500">Sources are marked expired when the last check is too old to trust.</p>

              <ul className="mt-4 divide-y divide-ink-100">
                {expired.length === 0 && (
                  <li className="py-6 text-center text-sm text-ink-400">No expired sources.</li>
                )}
                {expired.map((item) => (
                  <li key={item.code} className="flex items-center gap-3 py-3">
                    <Flag code={item.code} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{item.name}</p>
                      <p className="text-xs text-ink-400">Last verified {formatDate(item.lastVerified)}</p>
                    </div>
                    <VerificationBadge status={item.status} />
                    <Link
                      to="/admin/sources"
                      className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Fix →
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>
        </>
      )}
    </div>
  )
}
