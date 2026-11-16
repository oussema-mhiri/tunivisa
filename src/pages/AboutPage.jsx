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
import { VISA_MATRIX_META } from '../data/mapData'

const VALUES = [
  {
    icon: Globe2,
    title: 'Built for Tunisian travelers',
    text: 'Every requirement on TuniVisa is presented from the perspective of a Tunisian passport holder — the destination, the status and the documents you would actually need.',
  },
  {
    icon: Compass,
    title: 'One destination at a time',
    text: 'Explore countries, check the visa status, choose your travel purpose and follow a clear step-by-step application guide tailored to your trip.',
  },
  {
    icon: Route,
    title: 'A personal guide in minutes',
    text: 'The Visa Assistant turns a few questions into a personalised readiness score, document checklist and application plan.',
  },
]

const DATA_POINTS = [
  {
    icon: BookOpenCheck,
    title: 'Visa status for 4 categories',
    text: 'Every country is labelled Visa Free, Visa on Arrival, eVisa / eTA or Visa Required, so you instantly know what to expect.',
  },
  {
    icon: FileCheck2,
    title: 'Purpose-based guides',
    text: 'Tourism, study, work, business, family, medical, transit and residence each have their own document checklist and steps.',
  },
  {
    icon: BadgeCheck,
    title: 'Verification and sources',
    text: 'Each rule records a last-verified date and links to the official government or embassy website it is based on.',
  },
  {
    icon: RefreshCw,
    title: 'Built to stay current',
    text: 'The data layer is designed to be replaced by a live REST API, so rules can be refreshed whenever official sources change.',
  },
]

const STATUS_ROWS = [
  { key: 'visa_free', label: 'countries where no visa is needed' },
  { key: 'visa_on_arrival', label: 'countries where a visa is issued on arrival' },
  { key: 'evisa_eta', label: 'countries where an eVisa / eTA must be obtained online' },
  { key: 'visa_required', label: 'countries where a visa is needed before travel' },
  { key: 'no_admission', label: 'countries where entry is not permitted under current rules' },
]

export default function AboutPage() {
  useSeo({
    title: 'About TuniVisa',
    description:
      'TuniVisa is a visa and travel assistant for Tunisian passport holders: discover where you can travel, check requirements and learn how to apply.',
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
              About TuniVisa
            </span>
            <h1 className="zc-hero-title mt-6 font-display text-ink-900 text-balance">
              Every Tunisian passport deserves a clear answer
            </h1>
            <p className="zc-hero-lede mt-7 text-base leading-relaxed text-ink-500 sm:text-lg">
              TuniVisa exists to answer one question simply: where can you travel with your Tunisian passport,
              what do you need, and how do you get it?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="zc-hero-actions mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/countries" className="btn-primary">
              Explore countries
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </Link>
            <Link to="/assistant" className="btn-secondary">
              <Compass className="h-4.5 w-4.5" aria-hidden="true" />
              Try the Visa Assistant
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------- VALUES ----------------------------- */}
      <section className="border-y border-ink-100 bg-white">
        <div className="container-page max-w-6xl py-16 sm:py-20">
          <SectionHeading
            eyebrow="Why TuniVisa"
            title="A travel companion built around the Tunisian passport"
            subtitle="Visa rules are written for tourists, workers, students and families. We present them clearly, in one place, for one passport."
          />
          <div className="zc-value-grid mt-10 grid gap-5 md:grid-cols-3">
            {VALUES.map((item, i) => (
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
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- STATUS COLORS ------------------------- */}
      <section className="container-page max-w-5xl py-16 sm:py-20">
        <SectionHeading
          eyebrow="At a glance"
          title="Four statuses, one colour code"
          subtitle="The same colour language is used across the map, country cards and visa pages, so it never takes more than a second to know where you stand."
        />
        <div className="zc-status-grid mt-10 grid gap-3 sm:grid-cols-2">
          {STATUS_ROWS.map((row) => (
            <motion.div
              key={row.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3 }}
              className="card flex items-center justify-between gap-4 p-5"
            >
              <p className="text-sm leading-relaxed text-ink-600">{row.label}</p>
              <VisaStatusBadge status={row.key} className="shrink-0" />
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
                eyebrow="Data you can trust"
                title="Serious about accuracy, honest about limits"
                subtitle="TuniVisa is a guide, not a guarantee. We mark every figure as verified, due for review or limited so you always know what you are looking at."
              />
              <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-warning-500/25 bg-warning-50 px-4 py-3 text-sm leading-relaxed text-warning-700">
                <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                <p>
                  Visa rules change. Always confirm the latest requirements on the official government or
                  embassy website of your destination before booking anything.
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 text-sm leading-relaxed text-ink-600">
                <p>
                  Visa status data synced from{' '}
                  <a href={VISA_MATRIX_META.url} target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline">
                    passport-index-dataset
                  </a>{' '}
                  (MIT licence), last synced {String(VISA_MATRIX_META.fetchedAt || '').slice(0, 10)}. Fees, delays and document
                  requirements remain curated and must be verified with official sources.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {DATA_POINTS.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="card p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <point.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3.5 font-display text-base font-semibold text-ink-900">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{point.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------- ROADMAP ---------------------------- */}
      <section className="container-page max-w-6xl py-12 sm:py-20">
        <SectionHeading
          eyebrow="Where it’s heading"
          title="A platform that grows with its users"
          subtitle="The roadmap is shaped around real travellers, official sources and multilingual support."
        />
        <div className="zc-roadmap mt-10 grid gap-3">
          {[
            { icon: Map, title: 'More countries and purposes', text: 'Expanding the map dataset and depth of every country guide.' },
            { icon: Globe2, title: 'French and Arabic editions', text: 'The interface is built for translation; French and Arabic are next on the list.' },
            { icon: HeartHandshake, title: 'Community verification', text: 'A channel for travellers to flag changes and help keep data current.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
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
                <h3 className="font-display text-base font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.text}</p>
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
              Ready to find your next destination?
            </h2>
            <p className="mt-3 max-w-xl text-base text-ink-300">
              Start with a country, or let the Assistant build a personalised guide for you.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/countries" className="btn-primary bg-white text-ink-900 hover:bg-ink-100">
                Explore countries
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Compass className="h-4.5 w-4.5" aria-hidden="true" />
                Visa Assistant
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
