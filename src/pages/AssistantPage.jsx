import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AssistantWizard from '../components/AssistantWizard'
import { getCountry } from '../services/api'
import { useSeo } from '../hooks/useSeo'
import { useI18n } from '../i18n/LanguageContext'

export default function AssistantPage() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const [initialCountry, setInitialCountry] = useState(null)

  useSeo({
    path: '/assistant',
    title: t('assistant.seoTitle'),
    description: t('assistant.seoDescription'),
  })

  useEffect(() => {
    const countryCode = params.get('country')
    if (!countryCode) {
      setInitialCountry(null)
      return
    }
    let cancelled = false
    getCountry(countryCode).then((country) => {
      if (!cancelled) setInitialCountry(country)
    })
    return () => {
      cancelled = true
    }
  }, [params])

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="zc-eyebrow text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">{t('assistant.eyebrow')}</p>
        <h1 className="zc-page-title mt-3 font-display text-ink-900">
          {t('assistant.title')}
        </h1>
        <p className="zc-section-lede mt-5 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
          {t('assistant.subtitle')}
        </p>

        <div className="mt-8">
          <AssistantWizard initialPurpose={params.get('purpose')} initialCountry={initialCountry} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-400">
          {t('assistant.note')}
        </p>
      </div>
    </div>
  )
}
