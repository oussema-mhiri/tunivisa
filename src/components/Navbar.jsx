import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Globe, LogOut, Menu, Search, UserRound, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { useApp } from '../context/AppContext'
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

const NAV_ITEMS = [
  { to: '/', key: 'home', end: true },
  { to: '/countries', key: 'explore', end: false },
  { to: '/assistant', key: 'assistant', end: false },
  { to: '/about', key: 'about', end: false },
]

export default function Navbar() {
  const { t, lang, setLang, languages } = useI18n()
  const { user, isAuthenticated, logout } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === lang) || languages[0]

  const handleLogout = () => {
    setProfileOpen(false)
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-lg">
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
                    'rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
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
              className="hidden h-10 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm font-medium text-ink-500 shadow-sm transition-colors hover:border-ink-300 hover:text-ink-700 sm:flex"
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
                className="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-ink-100"
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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex h-10 items-center gap-2 rounded-xl px-2 transition-colors hover:bg-ink-100"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Account menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                      role="menu"
                      className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-ink-200 bg-white py-1.5 shadow-pop"
                    >
                      <div className="border-b border-ink-100 px-4 py-3">
                        <p className="truncate text-sm font-bold text-ink-900">{user?.name}</p>
                        <p className="truncate text-xs text-ink-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50"
                      >
                        <UserRound className="h-4 w-4" aria-hidden="true" />
                        My profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        {t('common.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary ml-1 hidden sm:inline-flex">
                {t('common.login')}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100 lg:hidden"
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
                        isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50',
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
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-ink-700 hover:bg-ink-50"
                >
                  <Search className="h-5 w-5 text-ink-400" aria-hidden="true" />
                  {t('nav.openSearch')}
                </button>
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
                          'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors',
                          l.code === lang
                            ? 'border-brand-600 bg-brand-50 text-brand-700'
                            : 'border-ink-200 text-ink-600 hover:bg-ink-50',
                        )}
                      >
                        {l.code.toUpperCase()} · {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t border-ink-100 px-2 pt-3">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1">
                        Profile
                      </Link>
                      <button type="button" onClick={handleLogout} className="btn-ghost flex-1">
                        {t('common.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1">
                        {t('common.login')}
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1">
                        {t('common.register')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
