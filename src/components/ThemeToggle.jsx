import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../i18n/LanguageContext'
import { cn } from '../utils/formatters'

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const isDark = theme === 'dark'
  const label = isDark ? t('theme.light') : t('theme.dark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-transparent text-ink-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700',
        className,
      )}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.18 }}
          className="flex"
          aria-hidden="true"
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
