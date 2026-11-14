// Travel purposes covered by TuniVisa. Requirements are confirmed per country.

/**
 * The eight travel purposes covered by TuniVisa.
 * `icon` maps to a Lucide icon rendered by VisaPurposeCard / AssistantWizard.
 */
export const VISA_TYPES = [
  {
    id: 'tourism',
    label: 'Tourism',
    shortLabel: 'Tourist Visa',
    icon: 'Plane',
    description: 'Sightseeing, holidays, visiting attractions or short leisure trips.',
  },
  {
    id: 'study',
    label: 'Study',
    shortLabel: 'Student Visa',
    icon: 'GraduationCap',
    description: 'Enrolling in a language course, university programme or recognised training.',
  },
  {
    id: 'work',
    label: 'Work',
    shortLabel: 'Work Visa',
    icon: 'Briefcase',
    description: 'Employment under a local contract or intra-company transfer.',
  },
  {
    id: 'business',
    label: 'Business',
    shortLabel: 'Business Visa',
    icon: 'Handshake',
    description: 'Meetings, conferences, trade fairs and business negotiations.',
  },
  {
    id: 'family',
    label: 'Family Visit',
    shortLabel: 'Family Visa',
    icon: 'Users',
    description: 'Visiting family members who live abroad.',
  },
  {
    id: 'medical',
    label: 'Medical',
    shortLabel: 'Medical Visa',
    icon: 'HeartPulse',
    description: 'Medical treatment, consultations or accompanying a patient.',
  },
  {
    id: 'transit',
    label: 'Transit',
    shortLabel: 'Transit Visa',
    icon: 'ArrowLeftRight',
    description: 'Passing through the country en route to a third destination.',
  },
  {
    id: 'residence',
    label: 'Residence',
    shortLabel: 'Residence Permit',
    icon: 'Home',
    description: 'Long-term stay for settlement, retirement or family reunification.',
  },
]

export const VISA_TYPE_IDS = VISA_TYPES.map((t) => t.id)

export function getVisaType(id) {
  return VISA_TYPES.find((t) => t.id === id) || null
}

/** Long-term purposes that follow a different (long-stay) application path. */
export const LONG_STAY_TYPES = ['study', 'work', 'residence']
