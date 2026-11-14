import { cn } from '../utils/formatters'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-wide text-brand-600 uppercase">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-ink-500 sm:text-lg">{subtitle}</p>}
    </div>
  )
}
