import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DICTIONARIES, DEFAULT_LANGUAGE, LANGUAGES } from './translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage('tunivisa.lang', DEFAULT_LANGUAGE)

  useEffect(() => {
    const meta = LANGUAGES.find((l) => l.code === lang)
    document.documentElement.setAttribute('lang', lang)
    if (meta) document.documentElement.setAttribute('dir', meta.dir)
  }, [lang])

  /**
   * Translate a dotted key (e.g. "home.heroTitle").
   * Falls back to English, then to the key itself.
   */
  const t = useCallback(
    (key, params) => {
      const resolve = (dict) =>
        String(key)
          .split('.')
          .reduce((acc, part) => (acc && part in acc ? acc[part] : null), dict)

      let value = resolve(DICTIONARIES[lang] || {})
      if (value === null || value === undefined) value = resolve(DICTIONARIES.en) || key

      if (params) {
        value = String(value).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`)
      }
      return value
    },
    [lang],
  )

  const value = useMemo(
    () => ({ lang, setLang, t, languages: LANGUAGES, dir: LANGUAGES.find((l) => l.code === lang)?.dir || 'ltr' }),
    [lang, setLang, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within <LanguageProvider>')
  return ctx
}
