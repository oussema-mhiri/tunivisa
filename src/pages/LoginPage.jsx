import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import Logo from '../components/Logo'
import { useApp } from '../context/AppContext'
import { useSeo } from '../hooks/useSeo'

export default function LoginPage() {
  useSeo({ title: 'Log in', description: 'Log in to your TuniVisa account (demo).' })
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from || '/profile'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email address.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    try {
      await login(email)
      navigate(from, { replace: true })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-500">Log in to access your saved destinations and checklists.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
          {error && (
            <div role="alert" className="flex items-start gap-2.5 rounded-none bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="label">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="label mb-1.5">Password</label>
              <Link to="/forgot-password" className="mb-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-none p-1 text-ink-400 hover:text-ink-600"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
            Log in
          </button>

          <p className="text-center text-xs text-ink-400">
            Demo app — any valid email and a 6+ character password will work.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          New to TuniVisa?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
