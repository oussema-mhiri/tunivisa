import { Search } from 'lucide-react'
import { cn } from '../utils/formatters'

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  size = 'md',
  className,
  autoFocus,
  ariaLabel,
  onKeyDown,
}) {
  return (
    <div className={cn('relative w-full', size === 'lg' && 'text-base', className)}>
      <Search
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-400',
          size === 'lg' ? 'left-4 h-5 w-5' : 'left-3.5 h-4.5 w-4.5',
        )}
        aria-hidden="true"
      />
      <input
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel || placeholder}
        className={cn(
          'input',
          size === 'lg' ? 'px-12 py-3.5 text-base' : 'py-2.5',
        )}
      />
    </div>
  )
}
