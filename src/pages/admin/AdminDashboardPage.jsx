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
import { useI18n } from '../../i18n/LanguageContext'
import { useSeo } from '../../hooks/useSeo'

export default function AdminDashboardPage() {
  const { t } = useI18n()
  useSeo({ title: t('admin.dashboardSeoTitle'), description: t('admin.dashboardSeoDescription') })
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
    { icon: Globe2, label: t('admin.totalCountries'), value: stats?.totalCountries, accent: 'brand', sub: t('admin.embassyRecords', { count: stats?.totalEmbassies ?? '—' }) },
    { icon: FileText, label: t('admin.visaRules'), value: stats?.totalVisaRules, accent: 'info', sub: t('admin.purposesPerCountry') },
    { icon: FileCheck2, label: t('admin.documents'), value: stats?.totalDocuments, accent: 'success', sub: t('admin.inRegistry') },
    { icon: Building2, label: t('admin.officialSourcesCount'), value: stats?.totalSources, accent: 'warning', sub: t('admin.verifiedSources', { count: stats?.verifiedSources ?? '—' }) },
    { icon: AlertTriangle, label: t('admin.needVerification'), value: stats?.requiringVerification, accent: 'danger', sub: t('admin.reviewOrExpired') },
  ]

  const reviewQueue = stats?.reviewQueue || []
  const expired = stats?.expiredSources || []

  return (
    <div className="space-y-8">
      <p className="rounded-xl border border-warning-500/25 bg-warning-50 px-4 py-3 text-xs leading-relaxed text-warning-700">
        {t('admin.previewNotice')}
      </p>

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
                  {t('admin.reviewQueue')}
                </h2>
                <span className="rounded-none bg-warning-50 px-2.5 py-0.5 text-xs font-bold text-warning-700">
                  {reviewQueue.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-500">{t('admin.reviewQueueText')}</p>

              <ul className="mt-4 divide-y divide-ink-100">
                {reviewQueue.length === 0 && (
                  <li className="py-6 text-center text-sm text-ink-400">{t('admin.allUpToDate')}</li>
                )}
                {reviewQueue.map((item) => (
                  <li key={item.code} className="flex items-center gap-3 py-3">
                    <Flag code={item.code} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{item.name}</p>
                      <p className="text-xs text-ink-400">{t('admin.lastVerifiedShort', { date: formatDate(item.lastVerified) })}</p>
                    </div>
                    <VerificationBadge status={item.status} />
                    <Link
                      to="/admin/countries"
                      className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {t('admin.review')}
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
                  {t('admin.sourceHealth')}
                </h2>
                <span className="rounded-none bg-success-50 px-2.5 py-0.5 text-xs font-bold text-success-700">
                  {t('admin.verifiedSources', { count: stats.verifiedSources })}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-500">{t('admin.sourceHealthText')}</p>

              <ul className="mt-4 divide-y divide-ink-100">
                {expired.length === 0 && (
                  <li className="py-6 text-center text-sm text-ink-400">{t('admin.noExpired')}</li>
                )}
                {expired.map((item) => (
                  <li key={item.code} className="flex items-center gap-3 py-3">
                    <Flag code={item.code} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{item.name}</p>
                      <p className="text-xs text-ink-400">{t('admin.lastVerifiedShort', { date: formatDate(item.lastVerified) })}</p>
                    </div>
                    <VerificationBadge status={item.status} />
                    <Link
                      to="/admin/sources"
                      className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {t('admin.fix')}
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
