import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Plane } from 'lucide-react'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// -----------------------------------------------------------------------------
// Route table. Pages are lazy-loaded so each route ships its own JS chunk
// (react / maps / icons are split via manualChunks in vite.config.js).
// -----------------------------------------------------------------------------

const HomePage = lazy(() => import('./pages/HomePage'))
const CountriesPage = lazy(() => import('./pages/CountriesPage'))
const CountryDetailsPage = lazy(() => import('./pages/CountryDetailsPage'))
const VisaDetailsPage = lazy(() => import('./pages/VisaDetailsPage'))
const AssistantPage = lazy(() => import('./pages/AssistantPage'))
const SavedPage = lazy(() => import('./pages/SavedPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminCountriesPage = lazy(() => import('./pages/admin/AdminCountriesPage'))
const AdminVisaRulesPage = lazy(() => import('./pages/admin/AdminVisaRulesPage'))
const AdminDocumentsPage = lazy(() => import('./pages/admin/AdminDocumentsPage'))
const AdminEmbassiesPage = lazy(() => import('./pages/admin/AdminEmbassiesPage'))
const AdminSourcesPage = lazy(() => import('./pages/admin/AdminSourcesPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-none border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
        <p className="text-sm font-medium text-ink-500">Loading…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:code" element={<CountryDetailsPage />} />
          <Route path="/countries/:code/visa/:visaType" element={<VisaDetailsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
                title="Page not found"
                text="The page you're looking for doesn't exist or may have been moved."
              />
            }
          />
        </Route>
      </Routes>
    </Suspense>
  )
}
