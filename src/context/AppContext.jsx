import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from './ToastContext'

// -----------------------------------------------------------------------------
// Mock authentication & user state.
// There is NO backend — login/register simulate a network round-trip and store
// a fake user profile in localStorage. Swap for a real API later via
// services/api.js (auth endpoints).
// -----------------------------------------------------------------------------

const AppContext = createContext(null)

function simulateDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AppProvider({ children }) {
  const toast = useToast()

  const [user, setUser] = useLocalStorage('tunivisa.user', null)
  const [saved, setSaved] = useLocalStorage('tunivisa.saved', [])
  const [recentSearches, setRecentSearches] = useLocalStorage('tunivisa.recent', [])
  const [checklists, setChecklists] = useLocalStorage('tunivisa.checklists', {})
  const [profile, setProfile] = useLocalStorage('tunivisa.profile', null)

  // ---- Auth (mock) -------------------------------------------------------
  const login = useCallback(
    async (email) => {
      await simulateDelay()
      const nameFromEmail = email.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Traveler'
      const next = {
        name: nameFromEmail.replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        joined: new Date().toISOString(),
      }
      setUser(next)
      setProfile((prev) => prev || { name: next.name, email, nationality: 'Tunisia' })
      toast.success('Welcome back! You are now logged in (demo).')
      return next
    },
    [setUser, setProfile, toast],
  )

  const register = useCallback(
    async ({ name, email }) => {
      await simulateDelay()
      const next = { name, email, joined: new Date().toISOString() }
      setUser(next)
      setProfile({ name, email, nationality: 'Tunisia' })
      toast.success(`Account created. Welcome to TuniVisa, ${name.split(' ')[0]}! (demo)`)
      return next
    },
    [setUser, setProfile, toast],
  )

  const logout = useCallback(() => {
    setUser(null)
    toast.info('You have been logged out.')
  }, [setUser, toast])

  // ---- Saved countries ----------------------------------------------------
  const isSaved = useCallback((code) => saved.includes(code), [saved])

  const toggleSaved = useCallback(
    (code, label = 'Country') => {
      let nowSaved = false
      setSaved((prev) => {
        nowSaved = !prev.includes(code)
        return nowSaved ? [...prev, code] : prev.filter((c) => c !== code)
      })
      toast[nowSaved ? 'success' : 'info'](
        nowSaved ? `${label} saved to your destinations.` : `${label} removed from saved destinations.`,
      )
      return nowSaved
    },
    [setSaved, toast],
  )

  // ---- Recent searches -----------------------------------------------------
  const addRecentSearch = useCallback(
    (term) => {
      const cleaned = String(term).trim()
      if (!cleaned) return
      setRecentSearches((prev) => [cleaned, ...prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase())].slice(0, 10))
    },
    [setRecentSearches],
  )

  const clearRecentSearches = useCallback(() => setRecentSearches([]), [setRecentSearches])

  // ---- Saved document checklists ------------------------------------------
  const checklistKey = (countryCode, visaType) => `${countryCode}:${visaType}`

  const getChecklistDone = useCallback(
    (countryCode, visaType) => checklists[checklistKey(countryCode, visaType)] || [],
    [checklists],
  )

  const toggleChecklistDoc = useCallback(
    (countryCode, visaType, docId) => {
      const key = checklistKey(countryCode, visaType)
      setChecklists((prev) => {
        const done = prev[key] || []
        const next = done.includes(docId) ? done.filter((d) => d !== docId) : [...done, docId]
        return { ...prev, [key]: next }
      })
    },
    [setChecklists],
  )

  const resetChecklist = useCallback(
    (countryCode, visaType) => {
      const key = checklistKey(countryCode, visaType)
      setChecklists((prev) => {
        const { [key]: _removed, ...rest } = prev
        return rest
      })
    },
    [setChecklists],
  )

  // ---- Profile --------------------------------------------------------------
  const updateProfile = useCallback(
    (patch) => {
      setProfile((prev) => ({ ...(prev || {}), ...patch }))
      toast.success('Profile updated (demo).')
    },
    [setProfile, toast],
  )

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      saved,
      isSaved,
      toggleSaved,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      checklists,
      getChecklistDone,
      toggleChecklistDoc,
      resetChecklist,
      updateProfile,
    }),
    [
      user,
      profile,
      login,
      register,
      logout,
      saved,
      isSaved,
      toggleSaved,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
      checklists,
      getChecklistDone,
      toggleChecklistDoc,
      resetChecklist,
      updateProfile,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
