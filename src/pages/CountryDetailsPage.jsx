import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CalendarClock, Compass, CreditCard, FileText, Hourglass, Link2, MapPin, Sparkles } from 'lucide-react'
import CountryHero from '../components/CountryHero'
import Flag from '../components/Flag'
import VisaStatusBadge from '../components/VisaStatusBadge'
import VisaPurposeCard from '../components/VisaPurposeCard'
import EmptyState from '../components/EmptyState'
import { Skeleton } from '../components/Skeleton'
import { getCountry, getVisaRules, getVisaTypes, ORIGIN_COUNTRY } from '../services/api'
import { visaStatusMeta } from '../utils/countryMeta'
import { formatDate } from '../utils/formatters'
import { useSeo } from '../hooks/useSeo'

export default function CountryDetailsPage() {
  const { code } = useParams()
  const [country, setCountry] = useState(null)
  const [rule, setRule] = useState(null)
  const [visaTypes, setVisaTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useSeo({
    title: country ? `Visas for ${country.name}` : undefined,
    description: country
      ? `Visa requirements for Tunisian passport holders travelling to ${country.name}: status, maximum stay, fees and how to apply.`
      : undefined,
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    Promise.all([getCountry(code), getVisaRules(code), getVisaTypes()]).then(([c, rules, types]) => {
      if (cancelled) return
      if (!c) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setCountry(c)
      const tourism = rules?.find((r) => r.visaType === 'tourism') || rules?.[0] || null
      setRule(tourism)
      setVisaTypes(types)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [code])

  if (loading) {
    return (
      <div className="container-page py-10">
        <Skeleton className="h-5 w-48" />
        <div className="mt-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (notFound || !country) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={Compass}
          title="Country not found"
          text={`We could not find visa information for "${code}". It may not be in our database yet.`}
          action={
            <Link to="/countries" className="btn-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all countries
            </Link>
          }
        />
      </div>
    )
  }

  const meta = visaStatusMeta(country.visaStatus)

  const metaItems = [
    { label: 'Maximum stay', value: rule ? rule.duration : 'Varies', icon: CalendarClock },
    { label: 'Visa type', value: 'Tourist / Short stay', icon: FileText },
    { label: 'Processing time', value: rule?.processingTime || 'Varies', icon: Hourglass },
    { label: 'Fee', value: rule?.fee || 'Varies', icon: CreditCard },
    { label: 'Application method', value: rule?.applicationMethod || 'Varies', icon: Link2 },
    { label: 'Last verified', value: formatDate(rule?.lastVerified), icon: CalendarClock },
    { label: 'Official source', value: rule?.officialSource || 'Official government source', icon: FileText },
  ]

  return (
    <div className="container-page py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          <li>
            <Link to="/countries" className="font-medium transition-colors hover:text-brand-600">
              Countries
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-ink-800">{country.name}</li>
        </ol>
      </nav>

      <CountryHero country={country} demo={!country.detailed} />

      {/* Status card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="card relative mt-8 overflow-hidden p-6 sm:p-8"
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(120deg, ${meta.color}0f 0%, rgba(255,255,255,0) 55%)` }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Flag code="tn" size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-ink-400 uppercase">Tunisian passport</p>
              <p className="font-display text-lg font-bold break-words text-ink-900">{ORIGIN_COUNTRY.name}</p>
            </div>
          </div>
          <ArrowRight className="hidden h-6 w-6 text-ink-300 lg:block" aria-hidden="true" />
          <div className="flex min-w-0 items-center gap-4">
            <div className="min-w-0 text-right">
              <p className="text-xs font-semibold tracking-wide text-ink-400 uppercase">Destination</p>
              <p className="font-display text-lg font-bold break-words text-ink-900">{country.name}</p>
            </div>
            <Flag code={country.code} size="lg" />
          </div>
          <div className="w-full lg:w-auto">
            <VisaStatusBadge status={country.visaStatus} size="md" className="w-full justify-center lg:w-auto" />
          </div>
        </div>
        {!country.detailed && (
          <p className="relative mt-5 rounded-xl bg-warning-50 px-4 py-3 text-xs leading-relaxed text-warning-700">
            This country appears on our map but does not have a full verified guide yet. The status and stay
            details below are illustrative and should be confirmed with an official source.
          </p>
        )}
      </motion.div>

      {/* Meta grid */}
      <section className="mt-8" aria-label="Visa details">
        <dl className="zc-meta-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metaItems.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="card p-4"
            >
              <dt className="flex items-center gap-2 text-xs font-medium text-ink-400 uppercase">
                <Icon className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                {label}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold break-words text-ink-800">{value}</dd>
            </motion.div>
          ))}
        </dl>
      </section>

      {/* Travel purposes */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">
              Choose your travel purpose
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Select the reason for your trip to see the exact requirements for {country.name}.
            </p>
          </div>
          <Link to={`/assistant?country=${country.code}`} className="btn-secondary">
            <Sparkles className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Get a personalised guide
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visaTypes.map((purpose, i) => (
            <VisaPurposeCard key={purpose.id} purpose={purpose} country={country} index={i} />
          ))}
        </div>
      </section>

      <div className="mt-10 flex items-start gap-2.5 rounded-2xl bg-warning-50 px-4 py-3 text-xs leading-relaxed text-warning-700">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Visa rules change frequently — always confirm with the official embassy or government website of
        {' '}{country.name} before planning your trip.
      </div>
    </div>
  )
}
