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

export default function VisaDetailsPage() {
  const { code, visaType } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useSeo({
    title: data ? `${data.country.name} — ${data.rule.visaTypeLabel} Visa` : undefined,
    description: data
      ? `Everything about the ${data.rule.visaTypeLabel.toLowerCase()} visa for ${data.country.name}: overview, documents, application steps and official sources.`
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
          title="Visa guide not found"
          text={`We could not find visa details for this country or purpose. Check the link or explore another destination.`}
          action={
            <Link to="/countries" className="btn-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Explore countries
            </Link>
          }
        />
      </div>
    )
  }

  const { country, rule, documents, embassy, links } = data

  return (
    <div className="container-page py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          <li>
            <Link to="/countries" className="font-medium transition-colors hover:text-brand-600">Countries</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/countries/${country.code}`} className="font-medium transition-colors hover:text-brand-600">
              {country.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-ink-800">{rule.visaTypeLabel} Visa</li>
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
          style={{ background: 'radial-gradient(50% 120% at 0% 0%, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0) 60%)' }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-none border border-ink-200/70 bg-white shadow-card">
              <Flag code={country.code} size="lg" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold tracking-tight break-words text-ink-900 sm:text-3xl">
                {country.name} — {rule.visaTypeLabel} Visa
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                For Tunisian passport holders travelling for {rule.visaTypeLabel.toLowerCase()}
              </p>
            </div>
          </div>
          <VisaStatusBadge status={rule.status} size="md" className="self-start sm:self-center" />
        </div>
      </motion.div>

      {/* Source-check notice */}
      <div className="mt-6 flex items-start gap-2.5 rounded-none border border-warning-500/30 bg-warning-50 px-4 py-3 text-xs leading-relaxed text-warning-700">
        <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          This guide was checked against official government and embassy sources on the date shown below.
          Entry rules, fees and document lists can change without notice, so always confirm on the official
          links before applying.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <VisaOverview rule={rule} />
          <DocumentChecklist countryCode={country.code} visaType={rule.visaType} documents={documents} />
          <section aria-labelledby="how-to-apply">
            <h2 id="how-to-apply" className="mb-4 font-display text-xl font-bold tracking-tight text-ink-900">
              How to Apply
            </h2>
            <div className="card p-5 sm:p-6">
              <ApplicationSteps steps={rule.steps} />
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
          Back to {country.name}
        </Link>
        <Link to={`/assistant?country=${country.code}&purpose=${rule.visaType}`} className="btn-primary">
          Build my checklist with the Assistant
        </Link>
      </div>
    </div>
  )
}
