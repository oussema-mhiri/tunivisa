import Badge from './Badge'
import { VERIFICATION_META } from '../data/admin'

export default function VerificationBadge({ status, className }) {
  const meta = VERIFICATION_META[status] || VERIFICATION_META.unknown
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  )
}
