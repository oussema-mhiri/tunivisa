import { useEffect, useState } from 'react'
import { flagEmoji, flagUrl } from '../utils/countryMeta'
import { cn } from '../utils/formatters'

// Flag widths are kept small so cards/tables stay compact. Height is fixed and
// the intrinsic aspect ratio is preserved (a few flags are not 4:3).
const HEIGHTS = {
  xs: 'h-3',
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-10',
  xl: 'h-16',
}

const EMOJI_SIZES = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-5xl',
  xl: 'text-7xl',
}

export default function Flag({ code, size = 'md', className }) {
  const [failed, setFailed] = useState(false)
  const normalized = String(code || '').toLowerCase()

  useEffect(() => {
    setFailed(false)
  }, [normalized])

  if (!normalized || failed) {
    return (
      <span
        role="img"
        aria-label={normalized ? `${normalized.toUpperCase()} flag` : 'Flag'}
        className={cn(
          'inline-block leading-none select-none',
          EMOJI_SIZES[size] || EMOJI_SIZES.md,
          className,
        )}
      >
        {normalized ? flagEmoji(normalized) : '🏳️'}
      </span>
    )
  }

  const retina = size === 'lg' || size === 'xl' ? 320 : 160

  return (
    <img
      src={flagUrl(normalized, 80)}
      srcSet={`${flagUrl(normalized, 80)} 1x, ${flagUrl(normalized, retina)} 2x`}
      alt={`${normalized.toUpperCase()} flag`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        'inline-block w-auto shrink-0 object-cover ring-1 ring-ink-900/30',
        HEIGHTS[size] || HEIGHTS.md,
        className,
      )}
    />
  )
}
