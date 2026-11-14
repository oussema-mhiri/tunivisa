// Generic document catalogue used to build per-visa checklists.
// Requirements vary by destination — always confirm the official checklist.

/**
 * Reusable document definitions used to build per-visa checklists.
 * `details` is shown when an item is expanded.
 */
export const DOCUMENTS = [
  {
    id: 'passport',
    label: 'Passport',
    required: true,
    description: 'A valid passport or travel document.',
    details:
      'Must be valid for at least 3–6 months beyond your intended stay and contain at least two blank pages. Copies of previous passports help too.',
  },
  {
    id: 'application_form',
    label: 'Visa application form',
    required: true,
    description: 'The completed online or paper visa application form.',
    details:
      'Printed, dated and signed. Any error can delay the application — review it carefully before submitting.',
  },
  {
    id: 'photos',
    label: 'Passport photos',
    required: true,
    description: 'Recent biometric photos that match the destination\u2019s requirements.',
    details:
      'Typically taken within the last 6 months, on a plain white background, matching the size and format of the destination country (e.g. 35\u00d745 mm for Schengen).',
  },
  {
    id: 'travel_insurance',
    label: 'Travel insurance',
    required: true,
    description: 'Proof of travel medical insurance covering your whole trip.',
    details:
      'Schengen applications require at least \u20ac30,000 in medical cover across the entire Schengen area for the full stay.',
  },
  {
    id: 'accommodation',
    label: 'Proof of accommodation',
    required: true,
    description: 'Hotel booking, rental agreement or an invitation with housing proof.',
    details:
      'A confirmed booking covering every night of the stay, or a signed invitation letter with proof the host can house you.',
  },
  {
    id: 'financial_means',
    label: 'Proof of financial means',
    required: true,
    description: 'Bank statements or funds showing you can support the trip.',
    details:
      'Usually 3–6 months of bank statements. Many consulates require a minimum balance per day of stay (e.g. \u20ac50–\u20ac120/day).',
  },
  {
    id: 'travel_itinerary',
    label: 'Flight / travel information',
    required: true,
    description: 'Round-trip flight reservations and an outline of your trip.',
    details:
      'Confirmed or reserved return tickets plus a rough day-by-day itinerary. Do not buy non-refundable tickets before approval.',
  },
  {
    id: 'employment',
    label: 'Proof of employment / studies',
    required: true,
    description: 'Evidence of what you do back home and why you will return.',
    details:
      'Employment contract, payslips, employer leave letter, or proof of enrolment for students — ties that show you intend to return.',
  },
  {
    id: 'acceptance_letter',
    label: 'Acceptance / admission letter',
    required: false,
    description: 'Official admission from the educational institution.',
    details:
      'Required for study visas: an official acceptance letter from the institution confirming the programme, duration and fees.',
  },
  {
    id: 'work_permit',
    label: 'Work contract / permit',
    required: false,
    description: 'A signed employment contract or approved work permit.',
    details:
      'For work visas: a local employment contract or an approved work-authorisation issued by the destination\u2019s authorities.',
  },
  {
    id: 'business_invite',
    label: 'Business invitation letter',
    required: false,
    description: 'Letter from the host company or organisation.',
    details:
      'For business trips: an invitation from the partner company describing the purpose, dates and who covers costs.',
  },
  {
    id: 'family_invite',
    label: 'Invitation letter (family / friend)',
    required: false,
    description: 'Invitation from your host abroad, often certified.',
    details:
      'For family visits: an invitation letter from your host, sometimes certified by local authorities, plus proof of their status and accommodation.',
  },
  {
    id: 'medical_report',
    label: 'Medical referral / records',
    required: false,
    description: 'Medical reports explaining why treatment is needed abroad.',
    details:
      'For medical visas: a referral from a doctor, medical reports and evidence that the treatment is available and booked at the destination.',
  },
  {
    id: 'residence_proof',
    label: 'Proof of residence',
    required: false,
    description: 'Documentation of where you live in Tunisia.',
    details:
      'A residence certificate, utility bill or rental contract confirming your Tunisian address.',
  },
  {
    id: 'marriage_cert',
    label: 'Marriage / family certificate',
    required: false,
    description: 'Documents proving your family relationship.',
    details:
      'For family reunification or visiting a spouse: certified marriage, birth certificates or family-book extracts.',
  },
  {
    id: 'return_ticket',
    label: 'Return flight ticket',
    required: true,
    description: 'Confirmed onward or return flight reservation.',
    details:
      'Many airlines and border officials ask for proof of onward travel on arrival.',
  },
  {
    id: 'history',
    label: 'Previous passport / travel history',
    required: false,
    description: 'Old passports showing your travel history.',
    details:
      'Consulates often consider Schengen history favourably. Bring previous passports or certified copies.',
  },
]

export function getDocument(id) {
  return DOCUMENTS.find((d) => d.id === id) || null
}

export function getDocuments(ids) {
  return ids
    .map((id) => getDocument(id))
    .filter(Boolean)
    .map((doc) => ({ ...doc }))
}
