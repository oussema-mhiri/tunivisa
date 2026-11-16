// Visa rules for the 20 detailed destinations.
// -----------------------------------------------------------------------------
// Fees, processing times and official links were checked against official
// government / embassy sources on 2026-11-14 (see LAST_VERIFIED per country).
// Long-stay and transit fees are not published consistently, so they are shown
// as "Varies" instead of being estimated. This is still guidance, not legal
// advice — always confirm on the official government website before applying.
// -----------------------------------------------------------------------------

import { LONG_STAY_TYPES } from './visaTypes.js'

// Approximate exchange rates (TND per 1 unit) used only for the optional
// "~TND" display next to foreign-currency fees. Not financial advice.
const TND_RATES = {
  EUR: 3.3,
  USD: 3.1,
  GBP: 3.9,
  CAD: 2.3,
  CHF: 3.5,
  SAR: 0.83,
  JPY: 0.021,
  AED: 0.85,
  QAR: 0.85,
  EGP: 0.1,
  MYR: 0.72,
  TRY: 0.09,
  DZD: 0.023,
  MAD: 0.31,
  TND: 1,
}

export const FEE_BY_COUNTRY = {
  fr: { amount: 90, currency: 'EUR', processing: '15 calendar days (up to 45 in individual cases)' },
  it: { amount: 90, currency: 'EUR', processing: '15 calendar days (up to 45 in individual cases)' },
  de: { amount: 90, currency: 'EUR', processing: '15 calendar days (up to 45 in individual cases)' },
  es: { amount: 90, currency: 'EUR', processing: '15 calendar days (up to 45 in individual cases)' },
  be: { amount: 90, currency: 'EUR', processing: '15 calendar days (up to 45 in individual cases)' },
  nl: { amount: 90, currency: 'EUR', processing: '18–21 calendar days on average (up to 45)' },
  gr: { amount: 90, currency: 'EUR', processing: '15 calendar days (up to 30–60 in individual cases)' },
  ch: { amount: 90, currency: 'CHF', processing: '15 calendar days (up to 45 in individual cases)' },
  tr: { amount: 0, currency: 'TRY', processing: 'No visa required' },
  dz: { amount: 0, currency: 'DZD', processing: 'No visa required' },
  ma: { amount: 0, currency: 'MAD', processing: 'No visa required' },
  qa: { amount: 100, currency: 'QAR', processing: 'Apply online via Hayya before travel; approval time not published' },
  my: { amount: 0, currency: 'MYR', processing: 'No visa required — complete the MDAC within 3 days before arrival' },
  ae: { amount: null, currency: 'AED', processing: 'Apply online via ICP, airline or hotel before travel' },
  eg: { amount: 111, currency: 'TND', processing: 'About 4 working days (may be longer)' },
  sa: { amount: null, currency: 'SAR', processing: 'Apply at the Saudi embassy in Tunis; timing varies' },
  ca: { amount: 100, currency: 'CAD', processing: 'About 34 days (IRCC average), plus biometrics' },
  gb: { amount: 135, currency: 'GBP', processing: 'About 3 weeks' },
  us: { amount: 185, currency: 'USD', processing: 'DS-160 + interview; visa printing 1–2 weeks after approval' },
  jp: { amount: 0, currency: 'JPY', processing: 'No visa required' },
}

export const LAST_VERIFIED = {
  fr: '2026-11-14',
  it: '2026-11-14',
  de: '2026-11-14',
  tr: '2026-11-14',
  dz: '2026-11-14',
  ma: '2026-11-14',
  es: '2026-11-14',
  be: '2026-11-14',
  ca: '2026-11-14',
  gb: '2026-11-14',
  ae: '2026-11-14',
  sa: '2026-11-14',
  eg: '2026-11-14',
  qa: '2026-11-14',
  ch: '2026-11-14',
  nl: '2026-11-14',
  us: '2026-11-14',
  gr: '2026-11-14',
  my: '2026-11-14',
  jp: '2026-11-14',
}

export const OFFICIAL_SOURCE = {
  fr: 'France-Visas (Ministry for Europe and Foreign Affairs)',
  it: 'Italian Ministry of Foreign Affairs / Embassy in Tunis',
  de: 'German Federal Foreign Office / Embassy in Tunis',
  tr: 'Turkish Ministry of Foreign Affairs / Embassy in Tunis',
  dz: 'Algerian Ministry of Foreign Affairs',
  ma: 'Moroccan Ministry of Foreign Affairs',
  es: 'Spanish Ministry of Foreign Affairs / BLS Spain Tunisia',
  be: 'Belgian FPS Foreign Affairs / Immigration Office',
  ca: 'Immigration, Refugees and Citizenship Canada',
  gb: 'UK Visas & Immigration (GOV.UK)',
  ae: 'UAE Government portal / ICP',
  sa: 'Saudi Ministry of Tourism / Ministry of Foreign Affairs',
  eg: 'Egyptian Ministry of Foreign Affairs / Embassy in Tunis',
  qa: 'Qatar Ministry of Interior / Visit Qatar (Hayya)',
  ch: 'Swiss State Secretariat for Migration (SEM)',
  nl: 'Netherlands Ministry of Foreign Affairs / IND',
  us: 'U.S. Department of State / U.S. Embassy in Tunis',
  gr: 'Hellenic Ministry of Foreign Affairs / Embassy in Tunis',
  my: 'Immigration Department of Malaysia (JIM)',
  jp: 'Ministry of Foreign Affairs of Japan / Embassy in Tunis',
}

export const OFFICIAL_LINKS = {
  fr: {
    visaApplication: 'https://france-visas.gouv.fr/tunisie',
    government: 'https://france-visas.gouv.fr/faq',
  },
  it: {
    visaApplication: 'https://ambtunisi.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/dove-chiedere-un-visto/',
    government: 'https://www.esteri.it',
  },
  de: {
    visaApplication: 'https://tunis.diplo.de/tn-fr/service/05-visaeinreise',
    government: 'https://tunis.diplo.de',
  },
  tr: {
    visaApplication: null,
    government: 'https://www.mfa.gov.tr/visa-information-for-foreigners.en.mfa.en.mfa',
  },
  dz: {
    visaApplication: null,
    government: 'https://www.mfa.gov.dz/en/services-for-foreigners/entry-visa-to-algeria',
  },
  ma: {
    visaApplication: null,
    government: 'https://consulat.ma/fr/liste-des-pays-dont-les-ressortissants-sont-dispenses-du-visa-dentree-au-maroc',
  },
  es: {
    visaApplication: 'https://tunisia.blsspainvisa.com/spanish/short_term_visa_tourist.php',
    government: 'https://www.exteriores.gob.es',
  },
  be: {
    visaApplication: 'https://tunisia.diplomatie.belgium.be/fr/venir-en-belgique/visa-pour-la-belgique',
    government: 'https://dofi.ibz.be/en/themes/faq/visa-fees',
  },
  ca: {
    visaApplication: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/apply-visitor-visa.html',
    government: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
  },
  gb: {
    visaApplication: 'https://www.gov.uk/standard-visitor-visa',
    government: 'https://www.gov.uk/standard-visitor',
  },
  ae: {
    visaApplication: 'https://u.ae/en/information-and-services/visa-and-emirates-id/Types-of-visas/tourist-visa',
    government: 'https://u.ae/en/information-and-services/visa-and-emirates-id/Visa-information/do-you-need-an-entry-permit-or-a-visa-to-enter-the-UAE',
  },
  sa: {
    visaApplication: 'https://ksavisa.sa/visa/tourism/details',
    government: 'https://www.mofa.gov.sa',
  },
  eg: {
    visaApplication: 'https://cs.mfa.gov.eg/en/TUN/faq',
    government: 'https://www.mfa.gov.eg',
  },
  qa: {
    visaApplication: 'https://hayya.qa',
    government: 'https://portal.moi.gov.qa/qatarvisas/index.html',
  },
  ch: {
    visaApplication: 'https://www.schweiz-visa.ch',
    government: 'https://www.sem.admin.ch/sem/en/home/themen/einreise/info-einreise/voraussetzungen-nach-staat/mit-visum.html',
  },
  nl: {
    visaApplication: 'https://www.netherlandsworldwide.nl/visa-the-netherlands/schengen-visa/apply-tunisia',
    government: 'https://ind.nl/en/short-stay/short-stay-holiday-or-business-visa',
  },
  us: {
    visaApplication: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html',
    government: 'https://tn.usembassy.gov/visas/nonimmigrant-visas/',
  },
  gr: {
    visaApplication: 'https://www.mfa.gr/missionsabroad/en/visas.html?mis=tunisia&mission=tun',
    government: 'https://www.mfa.gr/en/services/visas-for-foreigners-traveling-to-greece/countries-requiring-or-not-requiring-a-visa/',
  },
  my: {
    visaApplication: 'https://www.imi.gov.my/index.php/en/main-services/visa/visa-requirement-by-country/',
    government: 'https://www.imi.gov.my',
  },
  jp: {
    visaApplication: null,
    government: 'https://www.mofa.go.jp/ca/fna/page22e_000692.html',
  },
}

const ENTRIES = {
  tourism: 'Single or Multiple',
  business: 'Multiple',
  family: 'Single or Multiple',
  medical: 'Single',
  transit: 'Single',
  study: 'Multiple',
  work: 'Multiple',
  residence: 'Multiple',
}

const DURATION_LABEL = {
  tourism: (c) => `Short stay — up to ${c.maxStayDays} days`,
  business: (c) => `Short stay — up to ${c.maxStayDays} days`,
  family: (c) => `Short stay — up to ${c.maxStayDays} days`,
  medical: (c) => `Short stay — up to ${c.maxStayDays} days`,
  transit: () => '24 hours – 5 days (airport transit)',
  study: () => 'Course duration (typically 1–4 years)',
  work: () => 'Contract duration (typically 1–2 years)',
  residence: () => '1–5 years, renewable',
}

export const DOCS_BY_TYPE = {
  tourism: ['passport', 'application_form', 'photos', 'travel_insurance', 'accommodation', 'financial_means', 'travel_itinerary', 'employment', 'return_ticket'],
  business: ['passport', 'application_form', 'photos', 'travel_insurance', 'accommodation', 'financial_means', 'travel_itinerary', 'business_invite', 'employment', 'return_ticket'],
  family: ['passport', 'application_form', 'photos', 'travel_insurance', 'accommodation', 'financial_means', 'family_invite', 'marriage_cert', 'employment', 'return_ticket'],
  medical: ['passport', 'application_form', 'photos', 'travel_insurance', 'accommodation', 'financial_means', 'medical_report', 'employment', 'return_ticket'],
  transit: ['passport', 'application_form', 'photos', 'travel_insurance', 'travel_itinerary', 'return_ticket'],
  study: ['passport', 'application_form', 'photos', 'travel_insurance', 'financial_means', 'acceptance_letter', 'accommodation', 'employment', 'history'],
  work: ['passport', 'application_form', 'photos', 'financial_means', 'work_permit', 'accommodation', 'employment', 'history', 'return_ticket'],
  residence: ['passport', 'application_form', 'photos', 'financial_means', 'residence_proof', 'work_permit', 'marriage_cert', 'history', 'accommodation'],
}

const MODE_STEPS = {
  denied: [
    { title: 'Check official guidance', text: 'Entry is not permitted for Tunisian passport holders under current rules.' },
    { title: 'Verify with official sources', text: 'Confirm the latest position with the destination authorities or nearest embassy before making plans.' },
    { title: 'Do not travel without authorisation', text: 'Airlines and border officers may refuse boarding or entry.' },
  ],
  free: [
    { title: 'Confirm passport validity', text: 'Your passport must be valid for your entire stay (check the entry rule for your destination).' },
    { title: 'Prepare entry documents', text: 'Have your return ticket, accommodation booking and proof of funds ready to show if asked.' },
    { title: 'Fly to your destination', text: 'No visa is required — present your Tunisian passport at immigration.' },
    { title: 'Show documents on arrival', text: 'Border officers may ask for proof of accommodation and onward travel.' },
    { title: 'Receive your entry stamp', text: 'Stay within the maximum allowed period printed on your entry stamp.' },
    { title: 'Enjoy your stay', text: 'Respect local laws and exit before the allowed period ends to avoid overstaying.' },
  ],
  voa: [
    { title: 'Check eligibility', text: 'Confirm you meet the visa-on-arrival conditions (passport validity, purpose, entry point).' },
    { title: 'Prepare documents', text: 'Bring passport photos, flight details, accommodation and enough cash for the visa fee.' },
    { title: 'Travel to your destination', text: 'Fly to an eligible entry point — not all ports offer visa on arrival.' },
    { title: 'Apply at immigration', text: 'Complete the visa form and pay the fee at the border counter.' },
    { title: 'Receive your visa and stamp', text: 'Your visa is affixed to your passport — check the allowed stay.' },
    { title: 'Enjoy your stay', text: 'Leave before the stay limit expires; extensions are usually not possible.' },
  ],
  evisa: [
    { title: 'Check eligibility', text: 'Confirm your passport and purpose qualify for the electronic visa.' },
    { title: 'Prepare documents', text: 'Digitise your passport, photo and travel details for the online form.' },
    { title: 'Complete the online application', text: 'Fill the official portal accurately — mistakes can cause delays.' },
    { title: 'Pay the fee online', text: 'Use a valid international card; keep the payment receipt.' },
    { title: 'Receive your eVisa by email', text: 'Download and print it — keep a copy on your phone too.' },
    { title: 'Travel and present your eVisa', text: 'Show your printed eVisa with your passport on arrival.' },
  ],
  short: [
    { title: 'Check eligibility', text: 'Confirm you meet the entry conditions for this visa category.' },
    { title: 'Prepare documents', text: 'Gather every document in the checklist below.' },
    { title: 'Complete the application', text: 'Fill in the official application form online before your appointment.' },
    { title: 'Book your appointment', text: 'Reserve a slot at the embassy or visa application centre.' },
    { title: 'Submit application and biometrics', text: 'Attend the appointment, provide fingerprints and pay the fee.' },
    { title: 'Wait for the decision', text: 'Track your application; most decisions come within the processing time.' },
  ],
  long: [
    { title: 'Secure admission / offer', text: 'Obtain an official acceptance letter, contract or permit from the destination.' },
    { title: 'Prepare documents', text: 'Gather the long-stay checklist — translations may be required.' },
    { title: 'Complete the long-stay application', text: 'Fill the specific long-stay visa or residence application.' },
    { title: 'Book appointment and biometrics', text: 'Schedule at the embassy or visa centre in Tunisia.' },
    { title: 'Attend the appointment', text: 'Bring originals and copies; an interview may be required.' },
    { title: 'Wait and collect', text: 'Processing can take weeks or months — track and collect your visa.' },
  ],
}

const TYPE_NOTES = {
  tourism:
    'A short-stay visa for holidays and sightseeing. You generally cannot work or study while on this visa.',
  business:
    'For meetings, conferences and trade activities. Business visas rarely permit paid employment in the destination.',
  family:
    'For visiting relatives or a spouse. Some countries require the host to submit a certified invitation first.',
  medical:
    'For receiving medical treatment abroad. You may need to prove that the treatment is not available at home.',
  transit:
    'For passing through a country en route to another destination. Stay is usually limited to hours or a few days.',
  study:
    'A long-stay visa tied to a recognised institution. Tuition must often be paid before the visa is issued.',
  work:
    'A long-stay visa tied to an employment contract. Most countries require the employer to file a permit first.',
  residence:
    'For long-term settlement. Requirements differ strongly by country and by reason (work, family, retirement).',
}

const APPLICATION_METHOD = {
  free: 'No visa required - present passport on arrival',
  voa: 'On arrival at the airport or border crossing',
  evisa: 'Fully online application',
  short: 'Online application + embassy/visa centre appointment',
  long: 'Online/paper application + embassy appointment & biometrics',
  denied: 'Entry not permitted under current rules',
}

const MODE_FOR_STATUS = {
  visa_free: 'free',
  visa_on_arrival: 'voa',
  evisa_eta: 'evisa',
  visa_required: 'short',
  no_admission: 'denied',
  unknown: 'short',
}

function modeFor(country, typeId) {
  if (LONG_STAY_TYPES.includes(typeId)) return 'long'
  return MODE_FOR_STATUS[country.visaStatus] || 'short'
}

function formatFee(country, typeId) {
  if (LONG_STAY_TYPES.includes(typeId) || typeId === 'transit') {
    return 'Varies — check the official source'
  }
  const base = FEE_BY_COUNTRY[country.code] || { amount: null, currency: 'EUR' }
  if (base.amount === null || base.amount === undefined) return 'Varies — check the official source'
  if (base.amount === 0) return 'None'
  const amount = Math.round(base.amount)
  const symbolMap = { EUR: '\u20ac', USD: '$', GBP: '\u00a3', CAD: 'CA$', CHF: 'CHF ', SAR: 'SAR ', JPY: '\u00a5', AED: 'AED ', QAR: 'QAR ', EGP: 'EGP ', MYR: 'RM ', TRY: '\u20ba ', DZD: 'DZD ', MAD: 'MAD ', TND: 'TND ' }
  const symbol = symbolMap[base.currency] || ''
  const rate = TND_RATES[base.currency] || 0
  const tnd = rate && base.currency !== 'TND' ? ` (~${Math.round(amount * rate)} TND)` : ''
  return `${symbol}${amount.toLocaleString()}${tnd}`
}

/**
 * Builds the full visa rule object for one country + one travel purpose.
 * @returns {{status, maxStayDays, duration, entries, processingTime, fee, applicationMethod, mode, documents, steps, notes, lastVerified, officialSource, links, embassy}}
 */
export function buildVisaRule(country, typeId) {
  const mode = modeFor(country, typeId)
  const long = LONG_STAY_TYPES.includes(typeId)
  const status = long ? 'visa_required' : country.visaStatus

  return {
    countryCode: country.code,
    countryName: country.name,
    visaType: typeId,
    visaTypeLabel: typeId.charAt(0).toUpperCase() + typeId.slice(1),
    status,
    maxStayDays: long ? null : country.maxStayDays,
    duration: DURATION_LABEL[typeId](country),
    entries: ENTRIES[typeId],
    processingTime:
      typeId === 'transit'
        ? 'Varies — check the official source'
        : long
          ? 'Varies by permit type — check the official source'
          : FEE_BY_COUNTRY[country.code]?.processing || 'Varies',
    fee: formatFee(country, typeId),
    applicationMethod: APPLICATION_METHOD[mode],
    mode,
    documents: DOCS_BY_TYPE[typeId],
    steps: MODE_STEPS[mode],
    notes: TYPE_NOTES[typeId],
    lastVerified: LAST_VERIFIED[country.code] || '2026-07-01',
    officialSource: OFFICIAL_SOURCE[country.code] || 'Official government source',
    links: OFFICIAL_LINKS[country.code] || { visaApplication: null, government: null },
  }
}

/**
 * All visa rules for one country (all 8 purposes).
 */
export function buildAllVisaRules(country) {
  return LONG_STAY_TYPES.concat(['tourism', 'business', 'family', 'medical', 'transit']).map((t) =>
    buildVisaRule(country, t),
  )
}
