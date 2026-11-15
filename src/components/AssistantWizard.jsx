import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Banknote,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  GraduationCap,
  Handshake,
  HeartHandshake,
  HeartPulse,
  Home,
  Loader2,
  MapPin,
  Plane,
  RotateCcw,
  UserRound,
  Users,
} from 'lucide-react'
import CountrySearch from './CountrySearch'
import Flag from './Flag'
import VisaStatusBadge from './VisaStatusBadge'
import ProgressBar from './ProgressBar'
import DocumentChecklist from './DocumentChecklist'
import ApplicationSteps from './ApplicationSteps'
import OfficialSourceCard from './OfficialSourceCard'
import LastVerified from './LastVerified'
import ReadinessScore from './ReadinessScore'
import EmptyState from './EmptyState'
import { getVisaDetails } from '../services/api'
import { VISA_TYPES } from '../data/visaTypes'
import { visaStatusMeta } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

const STAY_OPTIONS = [
  { id: '<15', label: 'Less than 15 days' },
  { id: '15-30', label: '15 – 30 days' },
  { id: '30-90', label: '30 – 90 days' },
  { id: '90+', label: '3 months – 1 year' },
  { id: '1y+', label: 'More than 1 year' },
]

const SITUATIONS = [
  { id: 'student', label: 'Student', icon: UserRound },
  { id: 'employee', label: 'Employee', icon: Briefcase },
  { id: 'self-employed', label: 'Self-employed', icon: Briefcase },
  { id: 'business-owner', label: 'Business owner', icon: Banknote },
  { id: 'other', label: 'Other', icon: FileQuestion },
]

const FINANCE_OPTIONS = [
  { id: 'myself', label: 'Myself', icon: Banknote },
  { id: 'family', label: 'Family', icon: HeartHandshake },
  { id: 'employer', label: 'Employer', icon: Briefcase },
  { id: 'other', label: 'Other', icon: FileQuestion },
]

function computeReadiness(answers) {
  const financial = { myself: 88, employer: 82, family: 62, other: 50 }[answers.finances] || 55
  const purposeScore = { business: 88, study: 86, work: 84, family: 82 }[answers.purpose] || (answers.invitation ? 80 : 70)
  const accommodation = answers.invitation ? 92 : 70
  const supporting = { student: 85, employee: 80, 'self-employed': 72, 'business-owner': 72, other: 60 }[answers.situation] || 65
  const travelHistory = answers.stay === '<15' || answers.stay === '15-30' ? 66 : 52

  const score = Math.round(financial * 0.2 + purposeScore * 0.25 + accommodation * 0.15 + supporting * 0.2 + travelHistory * 0.2)

  return {
    score,
    breakdown: [
      { label: 'Financial documents', value: financial },
      { label: 'Travel purpose', value: purposeScore },
      { label: 'Accommodation', value: accommodation },
      { label: 'Supporting documents', value: supporting },
      { label: 'Travel history', value: travelHistory },
    ],
  }
}

const STEP_META = [
  { key: 'country', title: 'What is your destination?', subtitle: 'Start typing to search 100+ countries.', icon: MapPin },
  { key: 'purpose', title: 'What is the purpose of your trip?', subtitle: 'Choose the option that best matches.', icon: Briefcase },
  { key: 'stay', title: 'How long do you plan to stay?', subtitle: 'Be as accurate as you can.', icon: CalendarDays },
  { key: 'situation', title: 'What is your current situation?', subtitle: 'Consulates care about your ties to home.', icon: UserRound },
  { key: 'invitation', title: 'Do you have an invitation?', subtitle: 'From family, a host or a company.', icon: HeartHandshake },
  { key: 'finances', title: 'Who will finance your trip?', subtitle: 'This affects the documents you prepare.', icon: Banknote },
]

const TOTAL_STEPS = 7

export default function AssistantWizard({ initialPurpose, initialCountry }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    country: initialCountry || null,
    purpose: initialPurpose || null,
    stay: null,
    situation: null,
    invitation: null,
    finances: null,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setAnswer = (key, value) => setAnswers((a) => ({ ...a, [key]: value }))

  const stepDef = STEP_META[step]
  const stepNumber = step + 1

  const canNext = useMemo(() => {
    switch (step) {
      case 0: return Boolean(answers.country)
      case 1: return Boolean(answers.purpose)
      case 2: return Boolean(answers.stay)
      case 3: return Boolean(answers.situation)
      case 4: return answers.invitation !== null
      case 5: return Boolean(answers.finances)
      default: return true
    }
  }, [step, answers])

  useEffect(() => {
    if (initialPurpose) setAnswers((a) => ({ ...a, purpose: initialPurpose }))
  }, [initialPurpose])

  useEffect(() => {
    if (initialCountry) setAnswers((a) => ({ ...a, country: initialCountry }))
  }, [initialCountry])

  const next = () => {
    if (step === 5) {
      generateResult()
      return
    }
    setStep((s) => s + 1)
  }

  const back = () => {
    if (step === 0) return
    setStep((s) => s - 1)
  }

  const restart = () => {
    setStep(0)
    setAnswers({ country: null, purpose: null, stay: null, situation: null, invitation: null, finances: null })
    setResult(null)
    setError(null)
  }

  const generateResult = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getVisaDetails(answers.country.code, answers.purpose)
      const readiness = computeReadiness(answers)
      setResult({ ...data, readiness })
      setStep(6)
    } catch {
      setError('The visa guide service is temporarily unavailable. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [answers])

  const optionGrid = (options, key, iconMap) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const selected = answers[key] === opt.id
        const Icon = iconMap?.[opt.id] || opt.icon
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setAnswer(key, opt.id)}
            aria-pressed={selected}
            className={cn(
              'flex items-center gap-3 rounded-none border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all duration-150',
              selected
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-ink-50',
            )}
          >
            {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
            <span>{opt.label}</span>
            {selected && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )

  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-4 py-16">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" aria-hidden="true" />
          <p className="text-sm font-medium text-ink-500">Building your personalised visa guide…</p>
        </div>
      )
    }
    if (error) {
      return (
        <EmptyState
          icon={FileQuestion}
          title="Could not load the visa guide"
          text={error}
          action={<button type="button" onClick={restart} className="btn-primary">Start over</button>}
        />
      )
    }

    switch (step) {
      case 0:
        return (
          <div>
            <CountrySearch
              size="lg"
              onSelect={(country) => setAnswer('country', country)}
              placeholder="Search a country…"
              autoFocus
            />
            <p className="mt-3 text-xs text-ink-400">Tip: pick a country that is high on your wish list.</p>
          </div>
        )
      case 1:
        return optionGrid(VISA_TYPES, 'purpose')
      case 2:
        return (
          <div className="space-y-3">
            {STAY_OPTIONS.map((opt) => {
              const selected = answers.stay === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswer('stay', opt.id)}
                  aria-pressed={selected}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-none border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all',
                    selected
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-ink-50',
                  )}
                >
                  <CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {opt.label}
                  {selected && <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        )
      case 3:
        return optionGrid(SITUATIONS, 'situation')
      case 4:
        return (
          <div className="grid grid-cols-2 gap-3 sm:max-w-md">
            {['yes', 'no'].map((val) => {
              const selected = answers.invitation === val
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAnswer('invitation', val)}
                  aria-pressed={selected}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-none border-2 px-4 py-4 text-sm font-semibold capitalize transition-all',
                    selected
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-ink-50',
                  )}
                >
                  <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                  {val}
                </button>
              )
            })}
          </div>
        )
      case 5:
        return optionGrid(FINANCE_OPTIONS, 'finances')
      case 6:
        return result ? <ResultView result={result} answers={answers} onRestart={restart} /> : null
      default:
        return null
    }
  }

  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4 sm:px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          {stepDef ? <stepDef.icon className="h-5 w-5" aria-hidden="true" /> : <Briefcase className="h-5 w-5" aria-hidden="true" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">
            {step === 6 ? 'Your visa guide' : `Step ${stepNumber} of ${TOTAL_STEPS - 1}`}
          </p>
          <h2 className="truncate font-display text-base font-bold text-ink-900 sm:text-lg">
            {step === 6 ? 'Here is your personalised guide' : stepDef?.title}
          </h2>
        </div>
        {step > 0 && step < 6 && (
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-none px-2.5 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
            aria-label="Restart assistant"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Restart
          </button>
        )}
      </div>

      <div className="px-5 pt-4 sm:px-6">
        <ProgressBar value={(step / (TOTAL_STEPS - 1)) * 100} />
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {!loading && !error && step < 6 && (
              <p className="mb-5 text-sm text-ink-500">{stepDef?.subtitle}</p>
            )}
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 6 && (
        <div className="flex items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/60 px-4 py-4 sm:gap-3 sm:px-6">
          <button type="button" onClick={back} disabled={step === 0} className="btn-ghost disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <div className="flex items-center gap-2">
            {answers.country && (
              <span className="hidden items-center gap-1.5 text-sm font-medium text-ink-500 sm:inline-flex">
                <Flag code={answers.country.code} size="sm" />
                {answers.country.name}
              </span>
            )}
            <button type="button" onClick={next} disabled={!canNext || loading} className="btn-primary">
              {step === 5 ? (
                <>
                  <span className="sm:hidden">Generate</span>
                  <span className="hidden sm:inline">Generate my visa guide</span>
                </>
              ) : (
                'Continue'
              )}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultView({ result, answers, onRestart }) {
  const { country, rule, documents, embassy, links, readiness } = result
  const meta = visaStatusMeta(rule.status)

  return (
    <div className="space-y-6">
      <div className="zc-glow rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Flag code={country.code} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-500">Destination</p>
            <h3 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">{country.name}</h3>
          </div>
          <VisaStatusBadge status={rule.status} size="md" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{rule.visaTypeLabel} visa</span>
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{rule.duration}</span>
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{rule.processingTime}</span>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-display text-base font-bold text-ink-900">Important requirements</h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            { label: 'Maximum stay', value: rule.duration },
            { label: 'Fee', value: rule.fee },
            { label: 'Processing', value: rule.processingTime },
            { label: 'Method', value: rule.applicationMethod },
          ].map((item) => (
            <li key={item.label} className="flex items-start gap-2.5 rounded-lg border border-ink-200/70 bg-white px-3.5 py-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-500" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium text-ink-400 uppercase">{item.label}</p>
                <p className="text-sm font-semibold text-ink-800">{item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ReadinessScore score={readiness.score} breakdown={readiness.breakdown} />

      <DocumentChecklist
        countryCode={country.code}
        visaType={rule.visaType}
        documents={documents}
        compact
      />

      <div>
        <h4 className="mb-2 flex items-center gap-2 font-display text-base font-bold text-ink-900">
          <ClipboardCheck className="h-4.5 w-4.5 text-brand-600" aria-hidden="true" />
          How to apply
        </h4>
        <div className="card p-5">
          <ApplicationSteps steps={rule.steps} />
        </div>
      </div>

      {embassy && (
        <div className="rounded-xl border border-ink-200/70 bg-white p-4">
          <p className="text-sm font-semibold text-ink-800">{embassy.name}</p>
          <p className="mt-0.5 text-xs text-ink-500">{embassy.city} · {embassy.type}</p>
        </div>
      )}

      <OfficialSourceCard links={links} embassyWebsite={embassy?.website} sourceName={rule.officialSource} />
      <LastVerified date={rule.lastVerified} source={rule.officialSource} />

      <div className="rounded-xl border border-warning-500/25 bg-warning-50 px-4 py-3 text-xs leading-relaxed text-warning-700">
        This guide reflects current entry rules ({meta.label}) but visa decisions are always made by the
        destination authority. Verify the fee, documents and processing time on the official government
        website before applying.
      </div>

      <div className="flex items-center justify-center">
        <button type="button" onClick={onRestart} className="btn-secondary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start a new search
        </button>
      </div>
    </div>
  )
}
