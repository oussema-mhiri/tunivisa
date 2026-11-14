export function formatDate(iso) {
  if (!iso) return 'N/A'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural || `${singular}s`
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
