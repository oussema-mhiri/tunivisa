import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToast } from './ToastContext'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const toast = useToast()

  const [saved, setSaved] = useLocalStorage('tunivisa.saved', [])
  const [recentSearches, setRecentSearches] = useLocalStorage('tunivisa.recent', [])
  const [checklists, setChecklists] = useLocalStorage('tunivisa.checklists', {})

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

  const addRecentSearch = useCallback(
    (term) => {
      const cleaned = String(term).trim()
      if (!cleaned) return
      setRecentSearches((prev) => [cleaned, ...prev.filter((s) => s.toLowerCase() !== cleaned.toLowerCase())].slice(0, 10))
    },
    [setRecentSearches],
  )

  const clearRecentSearches = useCallback(() => setRecentSearches([]), [setRecentSearches])

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

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
