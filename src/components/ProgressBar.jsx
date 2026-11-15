import { cn } from '../utils/formatters'

export default function ProgressBar({ value, className, barClassName, label }) {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)))
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-ink-700">{label}</span>
          <span className="font-semibold text-ink-900">{pct}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-ink-200/70"
      >
        <div
          className={cn(
            'h-full rounded-full bg-brand-600 transition-all duration-500 ease-out',
            barClassName,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
