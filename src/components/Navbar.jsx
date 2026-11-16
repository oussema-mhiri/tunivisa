import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Globe, Heart, Menu, Search, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

const NAV_ITEMS = [
  { to: '/', key: 'home', end: true },
  { to: '/countries', key: 'explore', end: false },
  { to: '/compare', key: 'compare', end: false },
  { to: '/assistant', key: 'assistant', end: false },
  { to: '/about', key: 'about', end: false },
]

export default function Navbar() {
  const { t, lang, setLang, languages } = useI18n()
  const { saved } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === lang) || languages[0]

  return (
    <>
      <header className="zc-header sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-lg">
        <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-4">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700',
                  )
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('tunivisa:open-search'))}
              className="hidden h-10 items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 text-sm font-medium text-ink-500 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 sm:flex"
              aria-label={t('nav.openSearch')}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">Search…</span>
              <kbd className="hidden rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-400 xl:inline">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            {/* Language selector */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex h-10 items-center gap-1.5 rounded-full px-2.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', langOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    role="listbox"
                    aria-label="Language options"
                    className="absolute right-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-ink-200 bg-white py-1 shadow-pop"
                  >
                    {languages.map((l) => (
                      <li key={l.code} role="option" aria-selected={l.code === lang}>
                        <button
                          type="button"
                          className={cn(
                            'flex w-full items-center justify-between px-3.5 py-2 text-sm font-medium transition-colors hover:bg-ink-50',
                            l.code === lang ? 'text-brand-700' : 'text-ink-600',
                          )}
                          onClick={() => {
                            setLang(l.code)
                            setLangOpen(false)
                          }}
                        >
                          <span>{l.label}</span>
                          {l.code === lang && <span className="text-brand-600" aria-hidden="true">✓</span>}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/my-space"
              className="flex h-10 items-center gap-2 rounded-full border border-ink-200 bg-white px-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              aria-label={t('nav.mySpace')}
            >
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xl:inline">{t('nav.mySpace')}</span>
              {saved.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                  {saved.length > 99 ? '99+' : saved.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700 lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-ink-200/70 bg-white lg:hidden"
              aria-label="Mobile"
            >
              <div className="container-page max-h-[calc(100dvh-4rem)] space-y-1 overflow-y-auto py-3">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3 text-base font-semibold',
                        isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
                      )
                    }
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    window.dispatchEvent(new Event('tunivisa:open-search'))
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Search className="h-5 w-5 text-ink-400" aria-hidden="true" />
                  {t('nav.openSearch')}
                </button>
                <Link
                  to="/my-space"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Heart className="h-5 w-5 text-ink-400" aria-hidden="true" />
                  {t('nav.mySpace')}
                  {saved.length > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                      {saved.length > 99 ? '99+' : saved.length}
                    </span>
                  )}
                </Link>
                <div className="border-t border-ink-100 px-2 pt-3">
                  <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-ink-400 uppercase">Language</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLang(l.code)
                          setMenuOpen(false)
                        }}
                        aria-pressed={l.code === lang}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors',
                          l.code === lang
                            ? 'border-transparent bg-brand-600 text-white'
                            : 'border-ink-200 text-ink-600 hover:bg-ink-50',
                        )}
                      >
                        {l.code.toUpperCase()} · {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
