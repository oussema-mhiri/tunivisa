import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Compass, FileWarning } from 'lucide-react'
import Flag from '../components/Flag'
import VisaStatusBadge from '../components/VisaStatusBadge'
import VisaOverview from '../components/VisaOverview'
import DocumentChecklist from '../components/DocumentChecklist'
import ApplicationSteps from '../components/ApplicationSteps'
import EmbassyCard from '../components/EmbassyCard'
import OfficialSourceCard from '../components/OfficialSourceCard'
import LastVerified from '../components/LastVerified'
import EmptyState from '../components/EmptyState'
import { Skeleton, SkeletonText } from '../components/Skeleton'
import { getVisaDetails } from '../services/api'
import { useSeo } from '../hooks/useSeo'
import { useI18n } from '../i18n/LanguageContext'

export default function VisaDetailsPage() {
  const { t } = useI18n()
  const { code, visaType } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useSeo({
    title: data ? t('visa.seoTitle', { country: data.country.name, type: t(`purpose.${data.rule.visaType}`) }) : undefined,
    path: data ? `/countries/${data.country.code}/visa/${data.rule.visaType}` : undefined,
    description: data
      ? t('visa.seoDescription', { country: data.country.name, type: t(`purpose.${data.rule.visaType}`) })
      : undefined,
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    getVisaDetails(code, visaType).then((res) => {
      if (cancelled) return
      if (!res) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setData(res)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [code, visaType])

  if (loading) {
    return (
      <div className="container-page py-10">
        <Skeleton className="h-5 w-64" />
        <div className="mt-6 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-none" />
          <div className="flex-1">
            <Skeleton className="h-6 w-72" />
            <Skeleton className="mt-2 h-4 w-40" />
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-48 rounded-none" />
            <Skeleton className="mt-6 h-96 rounded-none" />
          </div>
          <Skeleton className="h-64 rounded-none" />
        </div>
        <div className="mt-6">
          <SkeletonText lines={3} />
        </div>
      </div>
    )
  }

  if (notFound || !data) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={Compass}
          title={t('visa.notFound')}
          text={t('visa.notFoundText')}
          action={
            <Link to="/countries" className="btn-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('visa.exploreCountries')}
            </Link>
          }
        />
      </div>
    )
  }

  const { country, rule, documents, embassy, links } = data
  const typeLabel = t(`purpose.${rule.visaType}`)
  const shortLabel = t(`purpose.short.${rule.visaType}`)

  return (
    <div className="container-page py-8 sm:py-10">
      <nav aria-label={t('common.breadcrumb')} className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          <li>
            <Link to="/countries" className="font-medium transition-colors hover:text-brand-600">{t('visa.breadcrumb')}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/countries/${country.code}`} className="font-medium transition-colors hover:text-brand-600">
              {country.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-ink-800">{shortLabel}</li>
        </ol>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card relative overflow-hidden p-6 sm:p-8"
      >
        <div
          className="zc-glow pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(50% 120% at 0% 0%, rgba(29,122,140,0.10) 0%, rgba(255,255,255,0) 60%)' }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-ink-200/70 bg-white shadow-card">
              <Flag code={country.code} size="lg" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold tracking-tight break-words text-ink-900 sm:text-3xl">
                {country.name} — {shortLabel}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {t('visa.forHolders', { purpose: typeLabel })}
              </p>
            </div>
          </div>
          <VisaStatusBadge status={rule.status} size="md" className="self-start sm:self-center" />
        </div>
      </motion.div>

      {/* Source-check notice */}
      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-warning-500/25 bg-warning-50 px-4 py-3 text-xs leading-relaxed text-warning-700">
        <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          {t('visa.sourceNotice')}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <VisaOverview rule={rule} />
          <DocumentChecklist countryCode={country.code} visaType={rule.visaType} documents={documents} />
          <section aria-labelledby="how-to-apply">
            <h2 id="how-to-apply" className="mb-4 font-display text-xl font-bold tracking-tight text-ink-900">
              {t('visa.howToApply')}
            </h2>
            <div className="card p-5 sm:p-6">
              <ApplicationSteps steps={rule.steps} mode={rule.mode} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <EmbassyCard embassy={embassy} />
          <OfficialSourceCard links={links} embassyWebsite={embassy?.website} sourceName={rule.officialSource} />
        </div>
      </div>

      <div className="mt-8">
        <LastVerified date={rule.lastVerified} source={rule.officialSource} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={`/countries/${country.code}`} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('visa.backTo', { name: country.name })}
        </Link>
        <Link to={`/assistant?country=${country.code}&purpose=${rule.visaType}`} className="btn-primary">
          {t('visa.buildChecklist')}
        </Link>
      </div>
    </div>
  )
}
