import { Link } from 'react-router-dom'
import Flag from './Flag'
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

export default function Logo({ to = '/', className, iconOnly = false, light = false }) {
  const { t } = useI18n()
  return (
    <Link
      to={to}
      className={cn('group inline-flex items-center gap-2', className)}
      aria-label={t('layout.logoAria')}
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl border border-transparent shadow-card transition-transform duration-200 group-hover:-translate-y-0.5',
          light ? 'bg-white/10 text-white' : 'bg-brand-600 text-white',
        )}
      >
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
          <circle cx="20" cy="32" r="12" fill="currentColor" opacity="0.25" />
          <path
            d="M14 32c0-7 4.5-12.5 11-14.5 6.5 2 11 7.5 11 14.5s-4.5 12.5-11 14.5C18.5 44.5 14 39 14 32Z"
            fill="currentColor"
          />
          <path
            d="M33 23l4.5 4.5L51 14c1-1 .8-2.6-.5-3.5-.9-.6-2.1-.4-2.9.4L34.5 24l3 3.5"
            fill="currentColor"
            opacity="0.75"
          />
          <path d="M36.5 30.5l2 2 13-10c1-1 .8-2.6-.5-3.5-1.3-.9-2.8-.4-3.6.4l-10.9 11z" fill="currentColor" opacity="0.6" />
        </svg>
      </span>
      {!iconOnly && (
        <span
          className={cn(
            'font-display text-xl font-semibold tracking-[-0.02em]',
            light ? 'text-white' : 'text-ink-900',
          )}
        >
          Tuni<span className={light ? 'text-brand-200' : 'text-brand-600'}>Visa</span>
          <span className="ml-1 inline-flex translate-y-0.5 items-center" aria-hidden="true">
            <Flag code="tn" size="xs" />
          </span>
        </span>
      )}
    </Link>
  )
}
