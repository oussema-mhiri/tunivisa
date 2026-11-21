import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Compass,
  FileCheck2,
  Globe2,
  Handshake,
  HeartHandshake,
  Map,
  RefreshCw,
  Route,
  ShieldCheck,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import VisaStatusBadge from '../components/VisaStatusBadge'
import { useSeo } from '../hooks/useSeo'
import { useI18n } from '../i18n/LanguageContext'
import { VISA_MATRIX_META } from '../data/mapData'

const VALUE_ROWS = [
  { icon: Globe2, key: 'value1' },
  { icon: Compass, key: 'value2' },
  { icon: Route, key: 'value3' },
]

const DATA_POINT_ROWS = [
  { icon: BookOpenCheck, key: 'dataPoint1' },
  { icon: FileCheck2, key: 'dataPoint2' },
  { icon: BadgeCheck, key: 'dataPoint3' },
  { icon: RefreshCw, key: 'dataPoint4' },
]

const STATUS_KEYS = ['visa_free', 'visa_on_arrival', 'evisa_eta', 'visa_required', 'no_admission']

const ROADMAP_ROWS = [
  { icon: Map, key: 'roadmap1' },
  { icon: Globe2, key: 'roadmap2' },
  { icon: HeartHandshake, key: 'roadmap3' },
]

export default function AboutPage() {
  const { t } = useI18n()
  useSeo({
    path: '/about',
    title: t('about.seoTitle'),
    description: t('about.seoDescription'),
  })

  return (
    <div className="overflow-hidden">
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="zc-hero relative">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page zc-hero-inner relative py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="zc-hero-copy max-w-4xl"
          >
            <span className="zc-tag">
              <Handshake className="h-3.5 w-3.5" aria-hidden="true" />
              {t('about.eyebrow')}
            </span>
            <h1 className="zc-hero-title mt-6 font-display text-ink-900 text-balance">
              {t('about.heroTitle')}
            </h1>
            <p className="zc-hero-lede mt-7 text-base leading-relaxed text-ink-500 sm:text-lg">
              {t('about.heroText')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="zc-hero-actions mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/countries" className="btn-primary">
              {t('about.exploreCountries')}
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
            <Link to="/assistant" className="btn-secondary">
              <Compass className="h-4.5 w-4.5" aria-hidden="true" />
              {t('about.tryAssistant')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------- VALUES ----------------------------- */}
      <section className="border-y border-ink-100 bg-white">
        <div className="container-page max-w-6xl py-16 sm:py-20">
          <SectionHeading
            eyebrow={t('about.whyEyebrow')}
            title={t('about.whyTitle')}
            subtitle={t('about.whySubtitle')}
          />
          <div className="zc-value-grid mt-10 grid gap-5 md:grid-cols-3">
            {VALUE_ROWS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="card p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{t(`about.${item.key}Title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{t(`about.${item.key}Text`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- STATUS COLORS ------------------------- */}
      <section className="container-page max-w-5xl py-16 sm:py-20">
        <SectionHeading
          eyebrow={t('about.statusEyebrow')}
          title={t('about.statusTitle')}
          subtitle={t('about.statusSubtitle')}
        />
        <div className="zc-status-grid mt-10 grid gap-3 sm:grid-cols-2">
          {STATUS_KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3 }}
              className="card flex items-center justify-between gap-4 p-5"
            >
              <p className="text-sm leading-relaxed text-ink-600">{t(`about.statusRow${i + 1}`)}</p>
              <VisaStatusBadge status={key} className="shrink-0" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* --------------------------- DATA & TRUST ------------------------- */}
      <section className="border-y border-ink-100 bg-white">
        <div className="container-page max-w-[86rem] py-16 sm:py-20">
          <div className="zc-data-layout grid items-start gap-10 lg:grid-cols-[0.85fr_1.35fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow={t('about.dataEyebrow')}
                title={t('about.dataTitle')}
                subtitle={t('about.dataSubtitle')}
              />
              <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-warning-500/25 bg-warning-50 px-4 py-3 text-sm leading-relaxed text-warning-700">
                <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <p>
                  {t('about.dataWarning')}
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 text-sm leading-relaxed text-ink-600">
                <p>
                  {t('about.dataSynced')}{' '}
                  <a href={VISA_MATRIX_META.url} target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline">
                    passport-index-dataset
                  </a>{' '}
                  {t('about.dataSyncedTail', { date: String(VISA_MATRIX_META.fetchedAt || '').slice(0, 10) })}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {DATA_POINT_ROWS.map((point, i) => (
                <motion.div
                  key={point.key}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="card p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <point.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3.5 font-display text-base font-semibold text-ink-900">{t(`about.${point.key}Title`)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{t(`about.${point.key}Text`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- ROADMAP ---------------------------- */}
      <section className="container-page max-w-6xl py-12 sm:py-20">
        <SectionHeading
          eyebrow={t('about.roadmapEyebrow')}
          title={t('about.roadmapTitle')}
          subtitle={t('about.roadmapSubtitle')}
        />
        <div className="zc-roadmap mt-10 grid gap-3">
          {ROADMAP_ROWS.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="card flex items-start gap-4 p-5"
            >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">{t(`about.${item.key}Title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{t(`about.${item.key}Text`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------------------ CTA ------------------------------- */}
      <section className="container-page pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="zc-cta relative overflow-hidden bg-ink-900"
        >
          <div className="relative">
            <h2 className="max-w-2xl font-display text-3xl text-white text-balance sm:text-4xl">
              {t('about.ctaTitle')}
            </h2>
            <p className="mt-3 max-w-xl text-base text-ink-300">
              {t('about.ctaText')}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/countries" className="btn-primary bg-white text-ink-900 hover:bg-ink-100">
                {t('about.exploreCountries')}
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Compass className="h-4.5 w-4.5" aria-hidden="true" />
                {t('about.assistant')}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
