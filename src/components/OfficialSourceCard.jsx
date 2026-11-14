import { ExternalLink, FileText, Globe, Landmark } from 'lucide-react'

const LINK_CONFIG = [
  {
    key: 'embassy',
    label: 'Official embassy website',
    icon: Landmark,
  },
  {
    key: 'visaApplication',
    label: 'Official visa application',
    icon: FileText,
  },
  {
    key: 'government',
    label: 'Official government information',
    icon: Globe,
  },
]

export default function OfficialSourceCard({ links, embassyWebsite, sourceName }) {
  const available = LINK_CONFIG.filter(({ key }) => {
    if (key === 'embassy') return Boolean(embassyWebsite)
    return Boolean(links?.[key])
  })

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-ink-100 px-5 py-4">
        <h2 className="font-display text-lg font-bold text-ink-900">Official Links</h2>
        <p className="mt-0.5 text-sm text-ink-500">
          Always apply through official government channels, never through third-party agents.
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
        {available.map(({ key, label, icon: Icon }) => {
          const url = key === 'embassy' ? embassyWebsite : links?.[key]
          if (!url) return null
          return (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-none border border-ink-200/80 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-none bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-ink-800">{label}</span>
              <span className="flex items-center gap-1 text-xs text-brand-600">
                {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          )
        })}
      </div>
      <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-3">
        <p className="text-xs text-ink-400">
          {sourceName ? `Source: ${sourceName}` : 'Source: official government / embassy'} — always confirm details on the official page before applying.
        </p>
      </div>
    </div>
  )
}
