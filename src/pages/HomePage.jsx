import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Compass, FileText, Globe2, Info, Map, Plane, ShieldCheck, Wallet } from 'lucide-react'
import CountrySearch from '../components/CountrySearch'
import Flag from '../components/Flag'
import SectionHeading from '../components/SectionHeading'
import StatCard from '../components/StatCard'
import CountryCard from '../components/CountryCard'
import VisaStatusBadge from '../components/VisaStatusBadge'
import { SkeletonList } from '../components/Skeleton'
import { getVisaStatistics, getPopularCountries } from '../services/api'
import { useI18n } from '../i18n/LanguageContext'
import { useSeo } from '../hooks/useSeo'

const WorldMap = lazy(() => import('../components/WorldMap'))

const STAT_ICONS = {
  visa_free: Plane,
  visa_on_arrival: Globe2,
  evisa_eta: FileText,
  visa_required: Map,
}

const HOW_STEPS = [
  {
    icon: SearchIcon,
    title: 'Search a destination',
    text: 'Type any country and instantly see what Tunisian passport holders need to enter.',
  },
  {
    icon: BadgeCheck,
    title: 'Check the requirements',
    text: 'Review the visa status, allowed stay, fees, documents and official sources for your trip.',
  },
  {
    icon: Compass,
    title: 'Get a personalised plan',
    text: 'Use the Visa Assistant for a step-by-step guide and document checklist built around you.',
  },
]

function SearchIcon(props) {
  return <Globe2 {...props} />
}

export default function HomePage() {
  const { t } = useI18n()
  useSeo({
    title: 'Where can you travel with your Tunisian passport?',
    description:
      'Discover visa-free destinations, visa on arrival countries, eVisa options and visa requirements for Tunisian passport holders around the world.',
  })

  const [stats, setStats] = useState(null)
  const [popular, setPopular] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getVisaStatistics(), getPopularCountries()]).then(([s, p]) => {
      if (!cancelled) {
        setStats(s)
        setPopular(p)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const scrollToMap = () => {
    document.getElementById('world-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="overflow-hidden">
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="zc-hero relative">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="container-page zc-hero-inner relative py-14 sm:py-28 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="zc-hero-copy max-w-4xl"
          >
            <span className="zc-tag max-w-full flex-wrap">
              <Plane className="h-3.5 w-3.5" aria-hidden="true" />
              Visa & travel guide for Tunisian passport holders
              <Flag code="tn" size="sm" />
            </span>

            <h1 className="zc-hero-title mt-6 font-display text-ink-900 text-balance">
              {t('home.heroTitle')}
            </h1>
            <p className="zc-hero-lede mt-7 text-base leading-relaxed text-ink-500 sm:text-lg">
              {t('home.heroSubtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="zc-hero-search mt-10 max-w-2xl"
          >
            <CountrySearch size="lg" placeholder={t('home.searchPlaceholder')} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="zc-hero-actions mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <button type="button" onClick={scrollToMap} className="btn-secondary w-full sm:w-auto">
              <Map className="h-4.5 w-4.5 text-brand-600" aria-hidden="true" />
              {t('home.exploreMap')}
            </button>
            <Link to="/assistant" className="btn-primary w-full sm:w-auto">
              <Compass className="h-4.5 w-4.5" aria-hidden="true" />
              Try the Visa Assistant
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="zc-hero-trust mt-6 flex max-w-xl items-center gap-2 text-xs font-medium text-ink-400 sm:text-sm"
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-success-500" aria-hidden="true" />
            {t('home.trustMessage')}
          </motion.p>
        </div>
      </section>

      {/* --------------------------- STATISTICS --------------------------- */}
      <section className="relative z-10 -mt-8 border-y border-ink-900 bg-white sm:-mt-12">
        <div className="container-page max-w-6xl py-10 sm:py-16">
          <SectionHeading
            className="lg:ml-12"
            eyebrow="At a glance"
            title={t('home.statsTitle')}
            subtitle={t('home.statsSubtitle')}
          />
          <div className="zc-stats mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {!stats &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card h-28 animate-pulse bg-ink-100/60" aria-hidden="true" />
              ))}
            {stats &&
              Object.entries(stats.counts)
                .filter(([key]) => STAT_ICONS[key])
                .map(([key, value], i) => {
                const Icon = STAT_ICONS[key]
                return (
                  <StatCard
                    key={key}
                    icon={Icon}
                    value={value}
                    label={t(`status.${key}`)}
                    sub={`${stats.percentages[key]}% of tracked countries`}
                    accent={key === 'visa_free' ? 'success' : key === 'visa_on_arrival' ? 'warning' : key === 'evisa_eta' ? 'info' : 'danger'}
                    index={i}
                  />
                )
              })}
          </div>
          <p className="mt-6 flex max-w-xl items-center gap-1.5 text-xs text-ink-400">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            {stats?.note || 'Based on our tracked map dataset.'}
          </p>
        </div>
      </section>

      {/* ----------------------------- WORLD MAP -------------------------- */}
      <section id="world-map" className="container-page scroll-mt-20 py-16 sm:py-24 lg:max-w-[82rem]">
        <SectionHeading
          className="lg:ml-16"
          eyebrow="Interactive map"
          title={t('home.mapTitle')}
          subtitle={t('home.mapSubtitle')}
        />
        <div className="mt-10">
          <Suspense
            fallback={
              <div className="flex h-[420px] items-center justify-center rounded-none border border-ink-200/80 bg-white shadow-card">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-none border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
                  <p className="text-sm font-medium text-ink-500">Preparing the map…</p>
                </div>
              </div>
            }
          >
            <WorldMap />
          </Suspense>
        </div>
      </section>

      {/* -------------------------- POPULAR DESTINATIONS ------------------- */}
      <section className="border-y border-ink-900 bg-white">
        <div className="container-page max-w-[88rem] py-20 sm:py-14">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              title={t('home.popularTitle')}
              subtitle={t('home.popularSubtitle')}
            />
            <Link to="/countries" className="btn-secondary shrink-0">
              Explore all countries
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {!popular && (
            <div className="mt-10">
              <SkeletonList items={8} />
            </div>
          )}
          {popular && (
            <div className="zc-popular-grid mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((country, i) => (
                <CountryCard key={country.code} country={country} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------- HOW IT WORKS ------------------------- */}
      <section className="container-page max-w-5xl py-10 sm:py-24">
        <SectionHeading
          className="lg:pl-16"
          eyebrow="Simple by design"
          title={t('home.howTitle')}
          subtitle="Three steps between you and your next trip."
        />
        <div className="zc-steps mt-10 grid gap-5 md:grid-cols-3">
          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="card relative p-6"
            >
              <span className="absolute top-6 right-6 font-display text-4xl font-bold text-ink-100" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center border border-ink-900 bg-brand-200 text-ink-900">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------- ASSISTANT CTA ------------------------ */}
      <section className="container-page pb-20 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="zc-cta relative overflow-hidden bg-ink-900"
        >
          <div className="relative">
            <span className="zc-tag">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Free · No sign-up required
            </span>
            <h2 className="mt-5 max-w-2xl font-display text-3xl text-white text-balance sm:text-4xl">
              {t('home.assistantCtaTitle')}
            </h2>
            <p className="mt-3 max-w-xl text-base text-ink-300">{t('home.assistantCtaText')}</p>
            <Link to="/assistant" className="btn-primary mt-7 bg-white text-ink-900 hover:bg-ink-100">
              {t('home.assistantCtaButton')}
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {['Visa Free', 'Visa on Arrival', 'eVisa / eTA', 'Visa Required'].map((label, i) => {
            const status = ['visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required'][i]
            return <VisaStatusBadge key={status} status={status} />
          })}
        </div>
      </section>

      {/* ----------------------------- DISCLAIMER -------------------------- */}
      <div className="zc-disclaimer bg-white">
        <div className="container-page flex items-start gap-3 py-6">
          <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-warning-500" aria-hidden="true" />
          <p className="max-w-4xl text-xs leading-relaxed text-ink-500 sm:text-sm">{t('home.demoNote')}</p>
        </div>
      </div>
    </div>
  )
}
