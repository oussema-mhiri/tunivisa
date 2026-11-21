import { motion } from 'framer-motion'
import { CalendarDays, Landmark, Lightbulb, Sparkles } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'

function localized(value, lang) {
  if (!value) return ''
  return value[lang] || value.en || ''
}

export default function TourismHighlights({ country }) {
  const { t, lang } = useI18n()
  const tourism = country?.tourism

  if (!tourism) return null

  const tip = localized(tourism.tip, lang)
  const bestTime = localized(tourism.bestTime, lang)
  const title = t('tourism.title', { country: country.name })

  return (
    <section className="mt-12 sm:mt-16" aria-label={title}>
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">{title}</h2>
        <p className="mt-1 text-sm text-ink-500">{t('tourism.subtitle')}</p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.25 }}
          className="card p-5 sm:p-6 lg:col-span-3"
        >
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-400 uppercase">
            <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
            {t('tourism.highlights')}
          </h3>
          {country.capital && (
            <p className="mt-4 flex items-center gap-2 border-b border-ink-100 pb-4 text-sm text-ink-600">
              <Landmark className="h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <span>{t('tourism.capital')}:</span>
              <span className="font-semibold text-ink-900">{country.capital}</span>
            </p>
          )}
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {tourism.highlights.map((place, index) => (
              <li
                key={place}
                className="flex items-start gap-2.5 border border-ink-200/80 bg-white px-3 py-2.5 text-sm text-ink-700"
              >
                <span className="font-mono text-xs font-semibold text-brand-600">{String(index + 1).padStart(2, '0')}</span>
                <span>{place}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.25, delay: 0.06 }}
          className="card flex flex-col gap-5 p-5 sm:p-6 lg:col-span-2"
        >
          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-400 uppercase">
              <Lightbulb className="h-4 w-4 text-brand-500" aria-hidden="true" />
              {t('tourism.tip')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{tip}</p>
          </div>
          {bestTime && (
            <div className="border-t border-ink-100 pt-5">
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-400 uppercase">
                <CalendarDays className="h-4 w-4 text-brand-500" aria-hidden="true" />
                {t('tourism.bestTime')}
              </h3>
              <p className="mt-3 text-sm font-medium text-ink-800">{bestTime}</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
