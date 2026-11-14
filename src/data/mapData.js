// World map dataset.
// -----------------------------------------------------------------------------
// Maps ISO numeric country codes (as used by the bundled world-atlas TopoJSON)
// to a visa status for Tunisian passport holders. The 20 detailed destinations
// were checked against official sources on 2026-11-13; all other entries remain
// illustrative and are marked as non-detailed so the UI can flag them.
//
// In production this data is served by the API (see src/services/api.js):
//   GET /api/map  →  { [isoNumeric]: { code, name, region, status, maxStayDays } }
// -----------------------------------------------------------------------------

import { COUNTRIES } from './countries'

/**
 * { isoNumeric: { code, name, region, status, maxStayDays, home } }
 * Status values: visa_free | visa_on_arrival | evisa_eta | visa_required
 * Countries not listed here render as "Unknown" (gray) on the map.
 */
const MAP_COUNTRIES = {
  // ---------- Home ----------
  '788': { code: 'tn', name: 'Tunisia', region: 'Africa', status: 'visa_free', maxStayDays: null, home: true },

  // ---------- Europe ----------
  '250': { code: 'fr', name: 'France', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '276': { code: 'de', name: 'Germany', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '380': { code: 'it', name: 'Italy', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '724': { code: 'es', name: 'Spain', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '056': { code: 'be', name: 'Belgium', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '528': { code: 'nl', name: 'Netherlands', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '756': { code: 'ch', name: 'Switzerland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '826': { code: 'gb', name: 'United Kingdom', region: 'Europe', status: 'visa_required', maxStayDays: 180 },
  '300': { code: 'gr', name: 'Greece', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '040': { code: 'at', name: 'Austria', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '620': { code: 'pt', name: 'Portugal', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '752': { code: 'se', name: 'Sweden', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '578': { code: 'no', name: 'Norway', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '208': { code: 'dk', name: 'Denmark', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '246': { code: 'fi', name: 'Finland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '372': { code: 'ie', name: 'Ireland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '616': { code: 'pl', name: 'Poland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '203': { code: 'cz', name: 'Czechia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '348': { code: 'hu', name: 'Hungary', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '642': { code: 'ro', name: 'Romania', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '100': { code: 'bg', name: 'Bulgaria', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '191': { code: 'hr', name: 'Croatia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '688': { code: 'rs', name: 'Serbia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '804': { code: 'ua', name: 'Ukraine', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '643': { code: 'ru', name: 'Russia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '196': { code: 'cy', name: 'Cyprus', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '442': { code: 'lu', name: 'Luxembourg', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '352': { code: 'is', name: 'Iceland', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '233': { code: 'ee', name: 'Estonia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '440': { code: 'lt', name: 'Lithuania', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '428': { code: 'lv', name: 'Latvia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '703': { code: 'sk', name: 'Slovakia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '705': { code: 'si', name: 'Slovenia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '008': { code: 'al', name: 'Albania', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '807': { code: 'mk', name: 'North Macedonia', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '499': { code: 'me', name: 'Montenegro', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '070': { code: 'ba', name: 'Bosnia and Herzegovina', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '498': { code: 'md', name: 'Moldova', region: 'Europe', status: 'visa_required', maxStayDays: 90 },
  '112': { code: 'by', name: 'Belarus', region: 'Europe', status: 'visa_free', maxStayDays: 30 },

  // ---------- Africa ----------
  '012': { code: 'dz', name: 'Algeria', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '504': { code: 'ma', name: 'Morocco', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '818': { code: 'eg', name: 'Egypt', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '434': { code: 'ly', name: 'Libya', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '729': { code: 'sd', name: 'Sudan', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '686': { code: 'sn', name: 'Senegal', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 90 },
  '384': { code: 'ci', name: "C\u00f4te d'Ivoire", region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '120': { code: 'cm', name: 'Cameroon', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '566': { code: 'ng', name: 'Nigeria', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '288': { code: 'gh', name: 'Ghana', region: 'Africa', status: 'visa_required', maxStayDays: 60 },
  '404': { code: 'ke', name: 'Kenya', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '834': { code: 'tz', name: 'Tanzania', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '231': { code: 'et', name: 'Ethiopia', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '800': { code: 'ug', name: 'Uganda', region: 'Africa', status: 'evisa_eta', maxStayDays: 90 },
  '646': { code: 'rw', name: 'Rwanda', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '710': { code: 'za', name: 'South Africa', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '716': { code: 'zw', name: 'Zimbabwe', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '270': { code: 'gm', name: 'Gambia', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '466': { code: 'ml', name: 'Mali', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '562': { code: 'ne', name: 'Niger', region: 'Africa', status: 'visa_required', maxStayDays: 30 },
  '204': { code: 'bj', name: 'Benin', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '768': { code: 'tg', name: 'Togo', region: 'Africa', status: 'evisa_eta', maxStayDays: 15 },
  '478': { code: 'mr', name: 'Mauritania', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 30 },
  '854': { code: 'bf', name: 'Burkina Faso', region: 'Africa', status: 'evisa_eta', maxStayDays: 30 },
  '480': { code: 'mu', name: 'Mauritius', region: 'Africa', status: 'visa_free', maxStayDays: 90 },
  '690': { code: 'sc', name: 'Seychelles', region: 'Africa', status: 'visa_on_arrival', maxStayDays: 30 },

  // ---------- Asia ----------
  '392': { code: 'jp', name: 'Japan', region: 'Asia', status: 'visa_free', maxStayDays: 90 },
  '410': { code: 'kr', name: 'South Korea', region: 'Asia', status: 'visa_required', maxStayDays: 90 },
  '156': { code: 'cn', name: 'China', region: 'Asia', status: 'visa_required', maxStayDays: 30 },
  '356': { code: 'in', name: 'India', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '458': { code: 'my', name: 'Malaysia', region: 'Asia', status: 'visa_free', maxStayDays: 90 },
  '702': { code: 'sg', name: 'Singapore', region: 'Asia', status: 'visa_required', maxStayDays: 30 },
  '764': { code: 'th', name: 'Thailand', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 15 },
  '360': { code: 'id', name: 'Indonesia', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 30 },
  '608': { code: 'ph', name: 'Philippines', region: 'Asia', status: 'visa_required', maxStayDays: 30 },
  '704': { code: 'vn', name: 'Vietnam', region: 'Asia', status: 'evisa_eta', maxStayDays: 90 },
  '116': { code: 'kh', name: 'Cambodia', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '418': { code: 'la', name: 'Laos', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 30 },
  '496': { code: 'mn', name: 'Mongolia', region: 'Asia', status: 'visa_required', maxStayDays: 30 },
  '586': { code: 'pk', name: 'Pakistan', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '050': { code: 'bd', name: 'Bangladesh', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 30 },
  '144': { code: 'lk', name: 'Sri Lanka', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },
  '524': { code: 'np', name: 'Nepal', region: 'Asia', status: 'visa_on_arrival', maxStayDays: 90 },
  '104': { code: 'mm', name: 'Myanmar', region: 'Asia', status: 'evisa_eta', maxStayDays: 28 },
  '064': { code: 'bt', name: 'Bhutan', region: 'Asia', status: 'evisa_eta', maxStayDays: 30 },

  // ---------- Americas ----------
  '840': { code: 'us', name: 'United States', region: 'Americas', status: 'visa_required', maxStayDays: 180 },
  '124': { code: 'ca', name: 'Canada', region: 'Americas', status: 'visa_required', maxStayDays: 180 },
  '484': { code: 'mx', name: 'Mexico', region: 'Americas', status: 'visa_required', maxStayDays: 180 },
  '076': { code: 'br', name: 'Brazil', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '032': { code: 'ar', name: 'Argentina', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '152': { code: 'cl', name: 'Chile', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '170': { code: 'co', name: 'Colombia', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '604': { code: 'pe', name: 'Peru', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '862': { code: 've', name: 'Venezuela', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '068': { code: 'bo', name: 'Bolivia', region: 'Americas', status: 'visa_on_arrival', maxStayDays: 30 },
  '218': { code: 'ec', name: 'Ecuador', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '858': { code: 'uy', name: 'Uruguay', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '600': { code: 'py', name: 'Paraguay', region: 'Americas', status: 'visa_free', maxStayDays: 90 },
  '188': { code: 'cr', name: 'Costa Rica', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '591': { code: 'pa', name: 'Panama', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '192': { code: 'cu', name: 'Cuba', region: 'Americas', status: 'visa_required', maxStayDays: 30 },
  '214': { code: 'do', name: 'Dominican Republic', region: 'Americas', status: 'visa_required', maxStayDays: 30 },
  '388': { code: 'jm', name: 'Jamaica', region: 'Americas', status: 'visa_required', maxStayDays: 30 },
  '780': { code: 'tt', name: 'Trinidad and Tobago', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '320': { code: 'gt', name: 'Guatemala', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '222': { code: 'sv', name: 'El Salvador', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '558': { code: 'ni', name: 'Nicaragua', region: 'Americas', status: 'visa_required', maxStayDays: 90 },
  '340': { code: 'hn', name: 'Honduras', region: 'Americas', status: 'visa_required', maxStayDays: 90 },

  // ---------- Middle East ----------
  '792': { code: 'tr', name: 'Turkey', region: 'Middle East', status: 'visa_free', maxStayDays: 90 },
  '682': { code: 'sa', name: 'Saudi Arabia', region: 'Middle East', status: 'visa_required', maxStayDays: 90 },
  '784': { code: 'ae', name: 'United Arab Emirates', region: 'Middle East', status: 'visa_required', maxStayDays: 90 },
  '634': { code: 'qa', name: 'Qatar', region: 'Middle East', status: 'evisa_eta', maxStayDays: 30 },
  '414': { code: 'kw', name: 'Kuwait', region: 'Middle East', status: 'visa_on_arrival', maxStayDays: 30 },
  '048': { code: 'bh', name: 'Bahrain', region: 'Middle East', status: 'evisa_eta', maxStayDays: 30 },
  '512': { code: 'om', name: 'Oman', region: 'Middle East', status: 'evisa_eta', maxStayDays: 30 },
  '400': { code: 'jo', name: 'Jordan', region: 'Middle East', status: 'visa_on_arrival', maxStayDays: 30 },
  '422': { code: 'lb', name: 'Lebanon', region: 'Middle East', status: 'visa_required', maxStayDays: 30 },
  '376': { code: 'il', name: 'Israel', region: 'Middle East', status: 'visa_required', maxStayDays: 90 },
  '368': { code: 'iq', name: 'Iraq', region: 'Middle East', status: 'visa_required', maxStayDays: 30 },
  '760': { code: 'sy', name: 'Syria', region: 'Middle East', status: 'visa_required', maxStayDays: 30 },
  '887': { code: 'ye', name: 'Yemen', region: 'Middle East', status: 'visa_required', maxStayDays: 30 },
  '364': { code: 'ir', name: 'Iran', region: 'Middle East', status: 'visa_on_arrival', maxStayDays: 30 },

  // ---------- Oceania ----------
  '036': { code: 'au', name: 'Australia', region: 'Oceania', status: 'visa_required', maxStayDays: 90 },
  '554': { code: 'nz', name: 'New Zealand', region: 'Oceania', status: 'visa_required', maxStayDays: 90 },
  '242': { code: 'fj', name: 'Fiji', region: 'Oceania', status: 'visa_free', maxStayDays: 120 },
  '598': { code: 'pg', name: 'Papua New Guinea', region: 'Oceania', status: 'visa_required', maxStayDays: 60 },
  '090': { code: 'sb', name: 'Solomon Islands', region: 'Oceania', status: 'visa_on_arrival', maxStayDays: 90 },
  '548': { code: 'vu', name: 'Vanuatu', region: 'Oceania', status: 'visa_free', maxStayDays: 90 },
  '882': { code: 'ws', name: 'Samoa', region: 'Oceania', status: 'visa_on_arrival', maxStayDays: 60 },
  '776': { code: 'to', name: 'Tonga', region: 'Oceania', status: 'visa_free', maxStayDays: 90 },
}

const DETAILED_CODES = new Set(COUNTRIES.map((c) => c.code))

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
