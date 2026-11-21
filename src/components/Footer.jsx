import { Link } from 'react-router-dom'
import { Globe2, Mail, ShieldAlert } from 'lucide-react'
import Logo from './Logo'
import Flag from './Flag'
import { VISA_MATRIX_META } from '../data/mapData'
import { useI18n } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  const exploreLinks = [
    { to: '/countries', label: t('nav.explore') },
    { to: '/assistant', label: t('nav.assistant') },
    { to: '/saved', label: t('footer.saved') },
    { to: '/about', label: t('nav.about') },
  ]

  const resourceLinks = [
    { to: '/assistant', label: t('footer.assistant') },
    { to: '/countries', label: t('footer.popular') },
    { to: '/my-space', label: t('nav.mySpace') },
    { to: '/about', label: t('footer.about') },
  ]

  const legalLinks = [
    { to: '/about', label: t('footer.contact') },
    { to: '/about', label: t('footer.privacy') },
    { to: '/about', label: t('footer.terms') },
  ]

  return (
    <footer className="zc-footer mt-auto bg-white">
      <div className="container-page zc-footer-grid grid gap-10 py-12 sm:grid-cols-2">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-500">{t('footer.tagline')}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-ink-400">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            {t('footer.frenchAvailable')} <Flag code="fr" size="xs" /> · {t('footer.arabicBeta')} <Flag code="sa" size="xs" />
          </div>
          <a
            href="mailto:hello@tunivisa.tn"
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            hello@tunivisa.tn
          </a>
        </div>

        <nav aria-label={t('footer.explore')}>
          <h3 className="text-sm font-bold tracking-wide text-ink-900 uppercase">{t('footer.explore')}</h3>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink-500 transition-colors hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('footer.resources')}>
          <h3 className="text-sm font-bold tracking-wide text-ink-900 uppercase">{t('footer.resources')}</h3>
          <ul className="mt-4 space-y-2.5">
            {resourceLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink-500 transition-colors hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('footer.legal')}>
          <h3 className="text-sm font-bold tracking-wide text-ink-900 uppercase">{t('footer.legal')}</h3>
          <ul className="mt-4 space-y-2.5">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink-500 transition-colors hover:text-brand-600">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-ink-100 bg-ink-50/60">
        <div className="container-page flex flex-col items-start gap-3 py-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500 lg:max-w-3xl">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning-500" aria-hidden="true" />
            {t('footer.disclaimer')}
          </p>
                    <div className="flex shrink-0 flex-col items-start gap-1 text-xs font-medium text-ink-400 lg:items-end">
            <p className="flex items-center gap-1.5">
              © {year} TuniVisa · {t('footer.madeIn')}
              <Flag code="tn" size="xs" />
            </p>
            <p>
              {t('footer.visaData')} <a href={VISA_MATRIX_META.url} target="_blank" rel="noreferrer" className="underline hover:text-brand-600">passport-index-dataset</a> {t('footer.synced', { date: String(VISA_MATRIX_META.fetchedAt || '').slice(0, 10) })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
