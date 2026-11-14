// Admin workspace data.
// -----------------------------------------------------------------------------
// The dashboard is a frontend-only preview. Verification status and source
// records are derived from the last official-source check in visaRules.js.
// Edit/review actions do not persist; in production these would live in the
// backend (see src/services/api.js).
// -----------------------------------------------------------------------------

import { LAST_VERIFIED, OFFICIAL_SOURCE, OFFICIAL_LINKS } from './visaRules'

/**
 * Verification state derived from the last official-source check.
 *  - verified      → checked within the last 180 days
 *  - needs_review  → 181–365 days old
 *  - expired       → more than 365 days old
 */
const VERIFIED_MAX_DAYS = 180
const REVIEW_MAX_DAYS = 365

function statusFromLastVerified(date) {
  if (!date) return 'unknown'
  const days = Math.floor((Date.now() - new Date(`${date}T00:00:00Z`).getTime()) / 86400000)
  if (days <= VERIFIED_MAX_DAYS) return 'verified'
  if (days <= REVIEW_MAX_DAYS) return 'needs_review'
  return 'expired'
}

export const VERIFICATION_STATUS = Object.fromEntries(
  Object.entries(LAST_VERIFIED).map(([code, date]) => [code, statusFromLastVerified(date)]),
)

export const VERIFICATION_META = {
  verified: { label: 'Verified', tone: 'success' },
  needs_review: { label: 'Needs Review', tone: 'warning' },
  expired: { label: 'Expired', tone: 'danger' },
  unknown: { label: 'Unknown', tone: 'gray' },
}

export function getVerificationStatus(code) {
  return VERIFICATION_STATUS[code] || 'unknown'
}

/**
 * Official source registry rows for /admin/sources.
 * Built from the bundled visa-rule data.
 */
export function buildAdminSources() {
  return Object.keys(LAST_VERIFIED)
    .map((code) => ({
      code,
      name: OFFICIAL_SOURCE[code] || 'Official government source',
      url: OFFICIAL_LINKS[code]?.government || null,
      category: 'Government / Embassy',
      lastVerified: LAST_VERIFIED[code],
      status: getVerificationStatus(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Aggregate counters for the dashboard. The totals come from the bundled
 * datasets so they always match what the rest of the app shows.
 */
export function buildAdminStats({ countries, visaRules, documents, embassies, sources }) {
  const totalCountries = countries.length
  const totalVisaRules = visaRules.length
  const totalDocuments = documents.length
  const totalEmbassies = embassies.length
  const totalSources = sources.length
  const requiringVerification = sources.filter((s) => s.status !== 'verified').length
  const verifiedSources = totalSources - requiringVerification

  return {
    totalCountries,
    totalVisaRules,
    totalDocuments,
    totalEmbassies,
    totalSources,
    verifiedSources,
    requiringVerification,
    reviewQueue: sources.filter((s) => s.status === 'needs_review'),
    expiredSources: sources.filter((s) => s.status === 'expired'),
  }
}
