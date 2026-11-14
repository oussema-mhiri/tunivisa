import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Loader2, MailCheck, Send } from 'lucide-react'
import Logo from '../components/Logo'
import { useSeo } from '../hooks/useSeo'

export default function ForgotPasswordPage() {
  useSeo({ title: 'Reset password', description: 'Reset your TuniVisa password (demo).' })
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    setSent(true)
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
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink-900">Reset your password</h1>
          <p className="mt-1.5 text-center text-sm text-ink-500">
            We&apos;ll email you a secure link to set a new password.
          </p>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600">
              <MailCheck className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-ink-900">Check your inbox</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              If an account exists for <span className="font-semibold text-ink-700">{email}</span>, a reset link is
              on its way. (Demo — no email is actually sent.)
            </p>
            <Link to="/login" className="btn-secondary mt-6 w-full">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to log in
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
            {error && (
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                <CheckCircle2 className="h-4 w-4 rotate-45" aria-hidden="true" />
                {error}
              </p>
            )}
            <div>
              <label htmlFor="fp-email" className="label">Email address</label>
              <input
                id="fp-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-500">
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
