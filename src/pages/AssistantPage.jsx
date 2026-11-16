import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AssistantWizard from '../components/AssistantWizard'
import { getCountry } from '../services/api'
import { useSeo } from '../hooks/useSeo'

export default function AssistantPage() {
  const [params] = useSearchParams()
  const [initialCountry, setInitialCountry] = useState(null)

  useSeo({
    path: '/assistant',
    title: 'Visa Assistant',
    description:
      'Answer a few questions and get a personalised visa guide for your Tunisian passport: status, documents and application steps.',
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
        <p className="zc-eyebrow text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">Visa Assistant</p>
        <h1 className="zc-page-title mt-3 font-display text-ink-900">
          Build your visa guide in under a minute
        </h1>
        <p className="zc-section-lede mt-5 max-w-xl text-sm leading-relaxed text-ink-500 sm:text-base">
          Answer six quick questions and TuniVisa will generate a personalised checklist, application steps and
          readiness score for your trip.
        </p>

        <div className="mt-8">
          <AssistantWizard initialPurpose={params.get('purpose')} initialCountry={initialCountry} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-400">
          The readiness score is an estimate based on your answers — it is not a prediction of visa approval.
          Visa decisions are made solely by the destination&apos;s authorities.
        </p>
      </div>
    </div>
  )
}
