import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  LayoutDashboard,
  Link2,
  Menu,
  ShieldAlert,
  X,
} from 'lucide-react'
import Logo from '../components/Logo'
import { cn } from '../utils/formatters'
import { useSeo } from '../hooks/useSeo'

const ADMIN_NAV = [
  { to: '/admin', key: 'Dashboard', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/admin/countries', key: 'countries', label: 'Countries', end: false, icon: Globe2 },
  { to: '/admin/visa-rules', key: 'visa-rules', label: 'Visa Rules', end: false, icon: FileText },
  { to: '/admin/documents', key: 'documents', label: 'Documents', end: false, icon: FileCheck2 },
  { to: '/admin/embassies', key: 'embassies', label: 'Embassies', end: false, icon: Building2 },
  { to: '/admin/sources', key: 'sources', label: 'Sources', end: false, icon: Link2 },
]

function SidebarNav({ onNavigate }) {
  return (
    <nav className="space-y-1" aria-label="Admin">
      {ADMIN_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
            )
          }
        >
          <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  useSeo({ title: 'Admin', description: 'TuniVisa admin preview: countries, visa rules, documents, embassies and sources.' })
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const section = ADMIN_NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))

  return (
    <div className="min-h-[70vh]">
      <div className="flex items-center justify-center gap-2 border-b border-warning-500/30 bg-warning-50 px-4 py-2 text-center text-xs font-medium text-warning-700">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Frontend-only admin preview — data mirrors the visa guides, but no changes are persisted.
      </div>

      <div className="container-page py-6 sm:py-8 lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-8">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-20 hidden lg:block" aria-label="Admin sidebar">
          <div className="card p-4">
            <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-4">
              <Logo />
            </div>
            <SidebarNav />
            <Link
              to="/"
              className="mt-4 flex items-center gap-2 rounded-xl border-t border-ink-100 px-3.5 pt-4 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to site
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          {/* Mobile header */}
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <div>
              <p className="text-xs font-semibold tracking-wide text-brand-600 uppercase">Admin</p>
              <h1 className="font-display text-xl font-bold text-ink-900">{section?.label || 'Dashboard'}</h1>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="btn-secondary h-10 w-10 p-0"
              aria-label={mobileOpen ? 'Close admin menu' : 'Open admin menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="card mb-6 overflow-hidden p-4 lg:hidden"
              >
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
                <Link
                  to="/"
                  className="mt-3 flex items-center gap-2 rounded-xl border-t border-ink-100 px-3.5 pt-3 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-600"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to site
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page header (desktop) */}
          <div className="mb-6 hidden items-end justify-between gap-4 lg:flex">
            <div>
              <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">Admin</p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900">
                {section?.label || 'Dashboard'}
              </h1>
            </div>
            <a
              href="https://github.com/anomalyco/opencode"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              View live site
            </a>
          </div>

          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  )
}
