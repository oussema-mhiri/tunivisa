import { Link } from 'react-router-dom'
import { Globe2, Mail, ShieldAlert } from 'lucide-react'
import Logo from './Logo'
import Flag from './Flag'
import { useI18n } from '../i18n/LanguageContext'

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  const exploreLinks = [
    { to: '/countries', label: t('nav.explore') },
    { to: '/assistant', label: t('nav.assistant') },
    { to: '/saved', label: 'Saved destinations' },
    { to: '/about', label: t('nav.about') },
  ]

  const resourceLinks = [
    { to: '/assistant', label: 'Visa Assistant' },
    { to: '/countries', label: 'Popular destinations' },
    { to: '/profile', label: 'My profile' },
    { to: '/admin', label: 'Admin dashboard' },
  ]

  const legalLinks = [
    { to: '/about', label: 'Contact' },
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
            French <Flag code="fr" size="xs" /> and Arabic <Flag code="sa" size="xs" /> editions coming soon.
          </div>
          <a
            href="mailto:hello@tunivisa.tn"
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            hello@tunivisa.tn
          </a>
        </div>

        <nav aria-label="Explore">
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

        <nav aria-label="Resources">
          <h3 className="text-sm font-bold tracking-wide text-ink-900 uppercase">Resources</h3>
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

        <nav aria-label="Legal">
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
          <p className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-400">
            © {year} TuniVisa · {t('footer.madeIn')}
            <Flag code="tn" size="xs" />
          </p>
        </div>
      </div>
    </footer>
  )
}
