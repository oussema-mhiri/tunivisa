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
import { useI18n } from '../i18n/LanguageContext'
import { localizedDuration } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

const STAY_OPTIONS = [
  { id: '<15', key: 'stayLt15' },
  { id: '15-30', key: 'stay15to30' },
  { id: '30-90', key: 'stay30to90' },
  { id: '90+', key: 'stay3to12' },
  { id: '1y+', key: 'stay1yPlus' },
]

const SITUATIONS = [
  { id: 'student', key: 'situationStudent', icon: UserRound },
  { id: 'employee', key: 'situationEmployee', icon: Briefcase },
  { id: 'self-employed', key: 'situationSelfEmployed', icon: Briefcase },
  { id: 'business-owner', key: 'situationBusinessOwner', icon: Banknote },
  { id: 'other', key: 'situationOther', icon: FileQuestion },
]

const FINANCE_OPTIONS = [
  { id: 'myself', key: 'financeMyself', icon: Banknote },
  { id: 'family', key: 'financeFamily', icon: HeartHandshake },
  { id: 'employer', key: 'financeEmployer', icon: Briefcase },
  { id: 'other', key: 'financeOther', icon: FileQuestion },
]

function computeReadiness(answers, t) {
  const financial = { myself: 88, employer: 82, family: 62, other: 50 }[answers.finances] || 55
  const purposeScore = { business: 88, study: 86, work: 84, family: 82 }[answers.purpose] || (answers.invitation ? 80 : 70)
  const accommodation = answers.invitation ? 92 : 70
  const supporting = { student: 85, employee: 80, 'self-employed': 72, 'business-owner': 72, other: 60 }[answers.situation] || 65
  const travelHistory = answers.stay === '<15' || answers.stay === '15-30' ? 66 : 52

  const score = Math.round(financial * 0.2 + purposeScore * 0.25 + accommodation * 0.15 + supporting * 0.2 + travelHistory * 0.2)

  return {
    score,
    breakdown: [
      { label: t('wizard.breakdownFinancial'), value: financial },
      { label: t('wizard.breakdownPurpose'), value: purposeScore },
      { label: t('wizard.breakdownAccommodation'), value: accommodation },
      { label: t('wizard.breakdownSupporting'), value: supporting },
      { label: t('wizard.breakdownHistory'), value: travelHistory },
    ],
  }
}

const STEP_META = [
  { key: 'destination', icon: MapPin },
  { key: 'purpose', icon: Briefcase },
  { key: 'stay', icon: CalendarDays },
  { key: 'situation', icon: UserRound },
  { key: 'invitation', icon: HeartHandshake },
  { key: 'finances', icon: Banknote },
]

const TOTAL_STEPS = 7

export default function AssistantWizard({ initialPurpose, initialCountry }) {
  const { t } = useI18n()
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
      const readiness = computeReadiness(answers, t)
      setResult({ ...data, readiness })
      setStep(6)
    } catch {
      setError(t('wizard.serviceError'))
    } finally {
      setLoading(false)
    }
  }, [answers, t])

  const optionGrid = (options, key, iconMap) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const selected = answers[key] === opt.id
        const Icon = iconMap?.[opt.id] || opt.icon
        const label = key === 'purpose' ? t(`purpose.${opt.id}`) : t(`wizard.${opt.key}`)
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
            <span>{label}</span>
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
          <p className="text-sm font-medium text-ink-500">{t('wizard.building')}</p>
        </div>
      )
    }
    if (error) {
      return (
        <EmptyState
          icon={FileQuestion}
          title={t('wizard.loadError')}
          text={error}
          action={<button type="button" onClick={restart} className="btn-primary">{t('wizard.startOver')}</button>}
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
              placeholder={t('search.countryPlaceholder')}
              autoFocus
            />
            <p className="mt-3 text-xs text-ink-400">{t('wizard.tip')}</p>
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
                  {t(`wizard.${opt.key}`)}
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
                  {t(`common.${val}`)}
                </button>
              )
            })}
          </div>
        )
      case 5:
        return optionGrid(FINANCE_OPTIONS, 'finances')
      case 6:
        return result ? <ResultView result={result} answers={answers} onRestart={restart} t={t} /> : null
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
            {step === 6 ? t('wizard.yourGuide') : t('wizard.step', { current: stepNumber, total: TOTAL_STEPS - 1 })}
          </p>
          <h2 className="truncate font-display text-base font-bold text-ink-900 sm:text-lg">
            {step === 6 ? t('wizard.guideReady') : t(`wizard.${stepDef?.key}Title`)}
          </h2>
        </div>
        {step > 0 && step < 6 && (
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-none px-2.5 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700"
            aria-label={t('wizard.restartAssistant')}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('wizard.restart')}
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
              <p className="mb-5 text-sm text-ink-500">{t(`wizard.${stepDef?.key}Subtitle`)}</p>
            )}
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < 6 && (
        <div className="flex items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/60 px-4 py-4 sm:gap-3 sm:px-6">
          <button type="button" onClick={back} disabled={step === 0} className="btn-ghost disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('wizard.back')}
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
                  <span className="sm:hidden">{t('wizard.generateShort')}</span>
                  <span className="hidden sm:inline">{t('wizard.generateLong')}</span>
                </>
              ) : (
                t('wizard.continue')
              )}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultView({ result, answers, onRestart, t }) {
  const { country, rule, documents, embassy, links, readiness } = result
  const duration = localizedDuration(rule, t)

  return (
    <div className="space-y-6">
      <div className="zc-glow rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Flag code={country.code} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink-500">{t('wizard.destination')}</p>
            <h3 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">{country.name}</h3>
          </div>
          <VisaStatusBadge status={rule.status} size="md" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{t('wizard.visaLabel', { label: t(`purpose.short.${rule.visaType}`) })}</span>
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{duration}</span>
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700">{rule.processingTime}</span>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-display text-base font-bold text-ink-900">{t('wizard.importantRequirements')}</h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            { label: t('wizard.maxStay'), value: duration },
            { label: t('wizard.fee'), value: rule.fee },
            { label: t('wizard.processing'), value: rule.processingTime },
            { label: t('wizard.method'), value: rule.applicationMethod },
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
          {t('wizard.howToApply')}
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
        {t('wizard.guideNote', { status: t(`status.${rule.status}`) })}
      </div>

      <div className="flex items-center justify-center">
        <button type="button" onClick={onRestart} className="btn-secondary">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t('wizard.newSearch')}
        </button>
      </div>
    </div>
  )
}
