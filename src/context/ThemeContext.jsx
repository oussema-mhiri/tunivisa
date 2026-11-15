import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// -----------------------------------------------------------------------------
// Light / dark theme. The choice is persisted in localStorage and applied as a
// `dark` class on <html> (see the inline bootstrap script in index.html, which
// prevents a flash of the wrong theme on first paint).
// -----------------------------------------------------------------------------

const ThemeContext = createContext(null)

export const THEME_STORAGE_KEY = 'tunivisa.theme'

function systemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B1420' : '#F4EFE4')
}

export function ThemeProvider({ children }) {
  const [stored, setStored] = useLocalStorage(THEME_STORAGE_KEY, null)
  const theme = stored === 'dark' || stored === 'light' ? stored : systemTheme()

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Follow the OS preference while the user has not picked a theme manually.
  useEffect(() => {
    if (stored === 'dark' || stored === 'light' || !window.matchMedia) return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme(systemTheme())
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [stored])

  const toggleTheme = useCallback(() => {
    setStored((prev) => {
      const current = prev === 'dark' || prev === 'light' ? prev : systemTheme()
      return current === 'dark' ? 'light' : 'dark'
    })
  }, [setStored])

  const setTheme = useCallback((next) => setStored(next === 'dark' ? 'dark' : 'light'), [setStored])

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
