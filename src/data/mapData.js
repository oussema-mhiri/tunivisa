// World map dataset.
// -----------------------------------------------------------------------------
// Maps ISO numeric country codes (as used by the bundled world-atlas TopoJSON)
// to visa metadata for Tunisian passport holders.
//
// Statuses are synced from the passport-index dataset (MIT) into
// src/data/visaMatrix.generated.js via `npm run sync:visa`. Curated metadata
// (names, regions, iso numeric codes) stays here; the 20 detailed destinations
// keep their curated status/max stay in countries.js/visaRules.js.
// -----------------------------------------------------------------------------

import { COUNTRIES } from './countries.js'
import { VISA_MATRIX_ENTRIES, VISA_MATRIX_META } from './visaMatrix.generated.js'

const CURATED_CODES = new Set(COUNTRIES.map((c) => String(c.code).toLowerCase()))

export { VISA_MATRIX_META }

function mergeVisaData(base) {
  if (!base || base.home) return base
  const code = String(base.code || '').toLowerCase()
  const synced = VISA_MATRIX_ENTRIES[code]
  if (!synced || CURATED_CODES.has(code)) return base

  const datasetHasDays = synced.maxStayDays !== null && synced.maxStayDays !== undefined
  const maxStayDays = datasetHasDays
    ? synced.maxStayDays
    : base.maxStayDays != null
      ? base.maxStayDays
      : null

  return {
    ...base,
    status: synced.status,
    maxStayDays,
    rawStatus: synced.rawStatus || null,
    synced: true,
  }
}

/**
 * Base metadata: { isoNumeric: { code, name, region, status, maxStayDays, home } }
 * Status values: visa_free | visa_on_arrival | evisa_eta | visa_required | no_admission
 */
const MAP_COUNTRIES_BASE = {
  // ---------- Home ----------
  '788': { code: 'tn', name: 'Tunisia', region: 'Africa', status: 'visa_free', maxStayDays: null, home: true },

  // ---------- Europe ----------
  '008': { code: 'al', name: 'Albania', region: 'Europe', status: 'evisa_eta', maxStayDays: 90 },
  '020': { code: 'ad', name: 'Andorra', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '040': { code: 'at', name: 'Austria', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '112': { code: 'by', name: 'Belarus', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '056': { code: 'be', name: 'Belgium', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '070': { code: 'ba', name: 'Bosnia and Herzegovina', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '100': { code: 'bg', name: 'Bulgaria', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '191': { code: 'hr', name: 'Croatia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '196': { code: 'cy', name: 'Cyprus', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '203': { code: 'cz', name: 'Czechia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '208': { code: 'dk', name: 'Denmark', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '233': { code: 'ee', name: 'Estonia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '246': { code: 'fi', name: 'Finland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '250': { code: 'fr', name: 'France', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '276': { code: 'de', name: 'Germany', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '300': { code: 'gr', name: 'Greece', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '348': { code: 'hu', name: 'Hungary', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '352': { code: 'is', name: 'Iceland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '372': { code: 'ie', name: 'Ireland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '380': { code: 'it', name: 'Italy', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '428': { code: 'lv', name: 'Latvia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '438': { code: 'li', name: 'Liechtenstein', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '440': { code: 'lt', name: 'Lithuania', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '442': { code: 'lu', name: 'Luxembourg', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '470': { code: 'mt', name: 'Malta', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '498': { code: 'md', name: 'Moldova', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '492': { code: 'mc', name: 'Monaco', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '499': { code: 'me', name: 'Montenegro', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '528': { code: 'nl', name: 'Netherlands', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '807': { code: 'mk', name: 'North Macedonia', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '578': { code: 'no', name: 'Norway', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '616': { code: 'pl', name: 'Poland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '620': { code: 'pt', name: 'Portugal', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '642': { code: 'ro', name: 'Romania', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '643': { code: 'ru', name: 'Russia', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '674': { code: 'sm', name: 'San Marino', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '688': { code: 'rs', name: 'Serbia', region: 'Europe', status: 'evisa_eta', maxStayDays: 90 },
  '703': { code: 'sk', name: 'Slovakia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '705': { code: 'si', name: 'Slovenia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '724': { code: 'es', name: 'Spain', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '752': { code: 'se', name: 'Sweden', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '756': { code: 'ch', name: 'Switzerland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '804': { code: 'ua', name: 'Ukraine', region: 'Europe', status: 'visa_required', maxStayDays: null },
  '826': { code: 'gb', name: 'United Kingdom', region: 'Europe', status: 'visa_required', maxStayDays: 180 },
  '336': { code: 'va', name: 'Vatican City', region: 'Europe', status: 'visa_required', maxStayDays: 90 },

  // ---------- Africa ----------
  '012': { code: 'dz', name: 'Algeria', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '024': { code: 'ao', name: 'Angola', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '204': { code: 'bj', name: 'Benin', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '072': { code: 'bw', name: 'Botswana', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '854': { code: 'bf', name: 'Burkina Faso', region: 'Africa', status: 'evisa_eta', maxStayDays: null },
  '108': { code: 'bi', name: 'Burundi', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 30 },
  '120': { code: 'cm', name: 'Cameroon', region: 'Africa', status: 'evisa_eta', maxStayDays: null },
  '132': { code: 'cv', name: 'Cape Verde', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '140': { code: 'cf', name: 'Central African Republic', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '148': { code: 'td', name: 'Chad', region: 'Africa', status: 'evisa_eta', maxStayDays: null },
  '174': { code: 'km', name: 'Comoros', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 45 },
  '384': { code: 'ci', name: "Côte d'Ivoire", region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '262': { code: 'dj', name: 'Djibouti', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '180': { code: 'cd', name: 'DR Congo', region: 'Africa', status: 'evisa_eta', maxStayDays: 7 },
  '818': { code: 'eg', name: 'Egypt', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '226': { code: 'gq', name: 'Equatorial Guinea', region: 'Africa', status: 'visa_free', maxStayDays: 30 },
  '232': { code: 'er', name: 'Eritrea', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '748': { code: 'sz', name: 'Eswatini', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '231': { code: 'et', name: 'Ethiopia', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '266': { code: 'ga', name: 'Gabon', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '270': { code: 'gm', name: 'Gambia', region: 'Africa', status: 'visa_free', maxStayDays: null },
  '288': { code: 'gh', name: 'Ghana', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 30 },
  '324': { code: 'gn', name: 'Guinea', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '624': { code: 'gw', name: 'Guinea-Bissau', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 90 },
  '404': { code: 'ke', name: 'Kenya', region: 'Africa', status: 'visa_free', maxStayDays: 60 },
  '426': { code: 'ls', name: 'Lesotho', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '430': { code: 'lr', name: 'Liberia', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '434': { code: 'ly', name: 'Libya', region: 'Africa', status: 'visa_free', maxStayDays: null },
  '450': { code: 'mg', name: 'Madagascar', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '454': { code: 'mw', name: 'Malawi', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '466': { code: 'ml', name: 'Mali', region: 'Africa', status: 'visa_free', maxStayDays: null },
  '478': { code: 'mr', name: 'Mauritania', region: 'Africa', status: 'visa_free', maxStayDays: null },
  '480': { code: 'mu', name: 'Mauritius', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '504': { code: 'ma', name: 'Morocco', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '508': { code: 'mz', name: 'Mozambique', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '516': { code: 'na', name: 'Namibia', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '562': { code: 'ne', name: 'Niger', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '566': { code: 'ng', name: 'Nigeria', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '178': { code: 'cg', name: 'Republic of the Congo', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '646': { code: 'rw', name: 'Rwanda', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '678': { code: 'st', name: 'São Tomé and Príncipe', region: 'Africa', status: 'evisa_eta', maxStayDays: null },
  '686': { code: 'sn', name: 'Senegal', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '690': { code: 'sc', name: 'Seychelles', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '694': { code: 'sl', name: 'Sierra Leone', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '706': { code: 'so', name: 'Somalia', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '710': { code: 'za', name: 'South Africa', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '728': { code: 'ss', name: 'South Sudan', region: 'Africa', status: 'evisa_eta', maxStayDays: null },
  '729': { code: 'sd', name: 'Sudan', region: 'Africa', status: 'visa_required', maxStayDays: null },
  '834': { code: 'tz', name: 'Tanzania', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '768': { code: 'tg', name: 'Togo', region: 'Africa', status: 'evisa_eta', maxStayDays: 15 },
  '800': { code: 'ug', name: 'Uganda', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '894': { code: 'zm', name: 'Zambia', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '716': { code: 'zw', name: 'Zimbabwe', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },

  // ---------- Asia ----------
  '004': { code: 'af', name: 'Afghanistan', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '051': { code: 'am', name: 'Armenia', region: 'Asia', status: 'evisa_eta', maxStayDays: 120 },
  '031': { code: 'az', name: 'Azerbaijan', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '050': { code: 'bd', name: 'Bangladesh', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 30 },
  '064': { code: 'bt', name: 'Bhutan', region: 'Asia', status: 'evisa_eta', maxStayDays: 90 },
  '096': { code: 'bn', name: 'Brunei', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '116': { code: 'kh', name: 'Cambodia', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '156': { code: 'cn', name: 'China', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '268': { code: 'ge', name: 'Georgia', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '356': { code: 'in', name: 'India', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '360': { code: 'id', name: 'Indonesia', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '392': { code: 'jp', name: 'Japan', region: 'Asia', status: 'visa_free', maxStayDays: 90 },
  '398': { code: 'kz', name: 'Kazakhstan', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '417': { code: 'kg', name: 'Kyrgyzstan', region: 'Asia', status: 'evisa_eta', maxStayDays: 60 },
  '418': { code: 'la', name: 'Laos', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '458': { code: 'my', name: 'Malaysia', region: 'Asia', status: 'visa_free', maxStayDays: 90 },
  '462': { code: 'mv', name: 'Maldives', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 30 },
  '496': { code: 'mn', name: 'Mongolia', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '104': { code: 'mm', name: 'Myanmar', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '524': { code: 'np', name: 'Nepal', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 90 },
  '408': { code: 'kp', name: 'North Korea', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '586': { code: 'pk', name: 'Pakistan', region: 'Asia', status: 'evisa_eta', maxStayDays: 90 },
  '608': { code: 'ph', name: 'Philippines', region: 'Asia', status: 'visa_free', maxStayDays: 30 },
  '702': { code: 'sg', name: 'Singapore', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '410': { code: 'kr', name: 'South Korea', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '144': { code: 'lk', name: 'Sri Lanka', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '158': { code: 'tw', name: 'Taiwan', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '762': { code: 'tj', name: 'Tajikistan', region: 'Asia', status: 'evisa_eta', maxStayDays: 60 },
  '764': { code: 'th', name: 'Thailand', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 15 },
  '626': { code: 'tl', name: 'Timor-Leste', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 30 },
  '795': { code: 'tm', name: 'Turkmenistan', region: 'Asia', status: 'visa_required', maxStayDays: null },
  '860': { code: 'uz', name: 'Uzbekistan', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '704': { code: 'vn', name: 'Vietnam', region: 'Asia', status: 'evisa_eta', maxStayDays: 90 },

  // ---------- Americas ----------
  '028': { code: 'ag', name: 'Antigua and Barbuda', region: 'Americas', status: 'evisa_eta', maxStayDays: null },
  '032': { code: 'ar', name: 'Argentina', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '044': { code: 'bs', name: 'Bahamas', region: 'Americas', status: 'evisa_eta', maxStayDays: 90 },
  '052': { code: 'bb', name: 'Barbados', region: 'Americas', status: 'visa_free', maxStayDays: 180 },
  '084': { code: 'bz', name: 'Belize', region: 'Americas', status: 'visa_free', maxStayDays: null },
  '068': { code: 'bo', name: 'Bolivia', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '076': { code: 'br', name: 'Brazil', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '124': { code: 'ca', name: 'Canada', region: 'Americas', status: 'visa_required', maxStayDays: 180 },
  '152': { code: 'cl', name: 'Chile', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '170': { code: 'co', name: 'Colombia', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '188': { code: 'cr', name: 'Costa Rica', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '192': { code: 'cu', name: 'Cuba', region: 'Americas', status: 'evisa_eta', maxStayDays: 90 },
  '212': { code: 'dm', name: 'Dominica', region: 'Americas', status: 'visa_free', maxStayDays: 21 },
  '214': { code: 'do', name: 'Dominican Republic', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '218': { code: 'ec', name: 'Ecuador', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '222': { code: 'sv', name: 'El Salvador', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '238': { code: 'fk', name: 'Falkland Islands', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '308': { code: 'gd', name: 'Grenada', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '304': { code: 'gl', name: 'Greenland', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '320': { code: 'gt', name: 'Guatemala', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '328': { code: 'gy', name: 'Guyana', region: 'Americas', status: 'evisa_eta', maxStayDays: null },
  '332': { code: 'ht', name: 'Haiti', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '340': { code: 'hn', name: 'Honduras', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '388': { code: 'jm', name: 'Jamaica', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '484': { code: 'mx', name: 'Mexico', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '558': { code: 'ni', name: 'Nicaragua', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '591': { code: 'pa', name: 'Panama', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '600': { code: 'py', name: 'Paraguay', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '604': { code: 'pe', name: 'Peru', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '630': { code: 'pr', name: 'Puerto Rico', region: 'Americas', status: 'visa_required', maxStayDays: 180 },
  '659': { code: 'kn', name: 'Saint Kitts and Nevis', region: 'Americas', status: 'evisa_eta', maxStayDays: null },
  '662': { code: 'lc', name: 'Saint Lucia', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '670': { code: 'vc', name: 'Saint Vincent and the Grenadines', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '740': { code: 'sr', name: 'Suriname', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '780': { code: 'tt', name: 'Trinidad and Tobago', region: 'Americas', status: 'evisa_eta', maxStayDays: 90 },
  '840': { code: 'us', name: 'United States', region: 'Americas', status: 'visa_required', maxStayDays: 180 },
  '858': { code: 'uy', name: 'Uruguay', region: 'Americas', status: 'visa_required', maxStayDays: null },
  '862': { code: 've', name: 'Venezuela', region: 'Americas', status: 'evisa_eta', maxStayDays: null },

  // ---------- Middle East ----------
  '048': { code: 'bh', name: 'Bahrain', region: 'Middle East', status: 'evisa_eta', maxStayDays: 14 },
  '364': { code: 'ir', name: 'Iran', region: 'Middle East', status: 'visa_free', maxStayDays: 15 },
  '368': { code: 'iq', name: 'Iraq', region: 'Middle East', status: 'evisa_eta', maxStayDays: 30 },
  '376': { code: 'il', name: 'Israel', region: 'Middle East', status: 'visa_required', maxStayDays: null },
  '400': { code: 'jo', name: 'Jordan', region: 'Middle East', status: 'visa_free', maxStayDays: 90 },
  '414': { code: 'kw', name: 'Kuwait', region: 'Middle East', status: 'visa_required', maxStayDays: null },
  '422': { code: 'lb', name: 'Lebanon', region: 'Middle East', status: 'visa_on_arrival', maxStayDays: 30 },
  '512': { code: 'om', name: 'Oman', region: 'Middle East', status: 'visa_required', maxStayDays: null },
  '275': { code: 'ps', name: 'Palestine', region: 'Middle East', status: 'visa_required', maxStayDays: null },
  '634': { code: 'qa', name: 'Qatar', region: 'Middle East', status: 'evisa_eta', maxStayDays: 30 },
  '682': { code: 'sa', name: 'Saudi Arabia', region: 'Middle East', status: 'visa_required', maxStayDays: 90 },
  '760': { code: 'sy', name: 'Syria', region: 'Middle East', status: 'visa_free', maxStayDays: null },
  '792': { code: 'tr', name: 'Turkey', region: 'Middle East', status: 'visa_free', maxStayDays: 90 },
  '784': { code: 'ae', name: 'United Arab Emirates', region: 'Middle East', status: 'visa_required', maxStayDays: 30 },
  '887': { code: 'ye', name: 'Yemen', region: 'Middle East', status: 'visa_required', maxStayDays: null },

  // ---------- Oceania ----------
  '036': { code: 'au', name: 'Australia', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '242': { code: 'fj', name: 'Fiji', region: 'Oceania', status: 'visa_free', maxStayDays: 120 },
  '296': { code: 'ki', name: 'Kiribati', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '584': { code: 'mh', name: 'Marshall Islands', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '583': { code: 'fm', name: 'Micronesia', region: 'Oceania', status: 'visa_free', maxStayDays: 30 },
  '520': { code: 'nr', name: 'Nauru', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '540': { code: 'nc', name: 'New Caledonia', region: 'Oceania', status: 'visa_required', maxStayDays: 90 },
  '554': { code: 'nz', name: 'New Zealand', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '585': { code: 'pw', name: 'Palau', region: 'Oceania', status: 'visa_on_arrival', maxStayDays: 30 },
  '598': { code: 'pg', name: 'Papua New Guinea', region: 'Oceania', status: 'evisa_eta', maxStayDays: 60 },
  '882': { code: 'ws', name: 'Samoa', region: 'Oceania', status: 'visa_on_arrival', maxStayDays: 90 },
  '090': { code: 'sb', name: 'Solomon Islands', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '776': { code: 'to', name: 'Tonga', region: 'Oceania', status: 'visa_required', maxStayDays: null },
  '798': { code: 'tv', name: 'Tuvalu', region: 'Oceania', status: 'visa_on_arrival', maxStayDays: 30 },
  '548': { code: 'vu', name: 'Vanuatu', region: 'Oceania', status: 'visa_free', maxStayDays: 120 },
}

const DETAILED_CODES = new Set(COUNTRIES.map((c) => c.code))

const MAP_COUNTRIES = Object.fromEntries(
  Object.entries(MAP_COUNTRIES_BASE).map(([isoNumeric, entry]) => [isoNumeric, mergeVisaData(entry)]),
)

export const WORLD_MAP_DATA = Object.fromEntries(
  Object.entries(MAP_COUNTRIES).map(([isoNumeric, entry]) => [
    isoNumeric,
    {
      ...entry,
      isoNumeric,
      detailed: DETAILED_CODES.has(entry.code),
    },
  ]),
)

export const ALL_MAP_COUNTRIES = Object.values(WORLD_MAP_DATA)

export function getMapCountryByIso(isoNumeric) {
  return WORLD_MAP_DATA[String(isoNumeric)] || null
}

export function getMapCountryByCode(code) {
  return ALL_MAP_COUNTRIES.find((c) => c.code === code) || null
}
