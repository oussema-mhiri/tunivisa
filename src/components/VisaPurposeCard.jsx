import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeftRight, Briefcase, GraduationCap, Handshake, HeartPulse, Home, Plane, Users } from 'lucide-react'

const ICONS = { Plane, GraduationCap, Briefcase, Handshake, Users, HeartPulse, ArrowLeftRight, Home }

export default function VisaPurposeCard({ purpose, country, index = 0 }) {
  const Icon = ICONS[purpose.icon] || Plane
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.05, 0.35) }}
    >
      <Link
        to={`/countries/${country.code}/visa/${purpose.id}`}
        className="group flex h-full items-center gap-4 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-sm font-bold text-ink-900">{purpose.label}</span>
          <span className="mt-0.5 line-clamp-1 block text-xs text-ink-400">{purpose.description}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
      </Link>
    </motion.div>
  )
}
