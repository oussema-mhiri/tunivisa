import { Building2, Clock3, ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react'

function Row({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-medium tracking-wide text-ink-400 uppercase">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium text-ink-700">{value}</dd>
      </div>
    </div>
  )
}

export default function EmbassyCard({ embassy }) {
  if (!embassy) return null
  return (
    <div className="card overflow-hidden">
      <div className="flex items-start gap-3 border-b border-ink-100 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">Application Location</h2>
          <p className="text-sm text-ink-500">Where to submit your application in Tunisia.</p>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="font-semibold text-ink-900">{embassy.name}</p>
        <p className="mt-0.5 text-sm text-brand-600">{embassy.type}</p>
        <dl className="mt-4 space-y-3">
          <Row icon={MapPin} label="City" value={embassy.city} />
          <Row icon={MapPin} label="Address" value={embassy.address} />
          <Row icon={Phone} label="Phone" value={embassy.phone} />
          <Row icon={Mail} label="Email" value={embassy.email} />
          <Row icon={Clock3} label="Opening hours" value={embassy.hours} />
        </dl>
        <a
          href={embassy.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary mt-5 w-full"
        >
          <Globe className="h-4 w-4" aria-hidden="true" />
          {embassy.website?.replace(/^https?:\/\//, '')}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
