import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Plane } from 'lucide-react'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import { useI18n } from './i18n/LanguageContext'

// -----------------------------------------------------------------------------
// Route table. Pages are lazy-loaded so each route ships its own JS chunk
// (react / maps / icons are split via manualChunks in vite.config.js).
// -----------------------------------------------------------------------------

const HomePage = lazy(() => import('./pages/HomePage'))
const CountriesPage = lazy(() => import('./pages/CountriesPage'))
const CountryDetailsPage = lazy(() => import('./pages/CountryDetailsPage'))
const VisaDetailsPage = lazy(() => import('./pages/VisaDetailsPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const AssistantPage = lazy(() => import('./pages/AssistantPage'))
const SavedPage = lazy(() => import('./pages/SavedPage'))
const MySpacePage = lazy(() => import('./pages/MySpacePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminCountriesPage = lazy(() => import('./pages/admin/AdminCountriesPage'))
const AdminVisaRulesPage = lazy(() => import('./pages/admin/AdminVisaRulesPage'))
const AdminDocumentsPage = lazy(() => import('./pages/admin/AdminDocumentsPage'))
const AdminEmbassiesPage = lazy(() => import('./pages/admin/AdminEmbassiesPage'))
const AdminSourcesPage = lazy(() => import('./pages/admin/AdminSourcesPage'))

function PageLoader() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t('layout.loadingPage')}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
        <p className="text-sm font-medium text-ink-500">{t('layout.loading')}</p>
      </div>
    </div>
  )
}

export default function App() {
  const { t } = useI18n()
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/countries/:code" element={<CountryDetailsPage />} />
          <Route path="/countries/:code/visa/:visaType" element={<VisaDetailsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/my-space" element={<MySpacePage />} />
          <Route path="/profile" element={<Navigate to="/my-space" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="countries" element={<AdminCountriesPage />} />
            <Route path="visa-rules" element={<AdminVisaRulesPage />} />
            <Route path="documents" element={<AdminDocumentsPage />} />
            <Route path="embassies" element={<AdminEmbassiesPage />} />
            <Route path="sources" element={<AdminSourcesPage />} />
          </Route>

          <Route
            path="*"
            element={
              <NotFoundPage
                icon={Plane}
                title={t('notFound.title')}
                text={t('notFound.text')}
              />
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}
