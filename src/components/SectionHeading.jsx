import { cn } from '../utils/formatters'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', className }) {
  return (
    <div className={cn('zc-heading max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <p className="zc-eyebrow mb-3 text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">{eyebrow}</p>
      )}
      <h2 className="zc-section-title font-display text-3xl text-ink-900 text-balance sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="zc-section-lede mt-4 max-w-2xl text-sm leading-relaxed text-ink-500 sm:text-base">{subtitle}</p>}
    </div>
  )
}
