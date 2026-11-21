import Badge from './Badge'
import { VERIFICATION_META } from '../data/admin'
import { useI18n } from '../i18n/LanguageContext'

export default function VerificationBadge({ status, className }) {
  const { t } = useI18n()
  const meta = VERIFICATION_META[status] || VERIFICATION_META.unknown
  return (
    <Badge tone={meta.tone} className={className}>
      {t(`verification.${status || 'unknown'}`)}
    </Badge>
  )
}
