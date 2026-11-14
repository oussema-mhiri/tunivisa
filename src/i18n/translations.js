// Internationalisation dictionaries.
// English (en) is fully populated. French (fr) is partially populated and
// Arabic (ar) is scaffolded — any missing key falls back to English.
// Add more keys / languages here as the product grows.

const en = {
  common: {
    login: 'Log in',
    register: 'Sign up',
    logout: 'Log out',
    search: 'Search',
    save: 'Save',
    saved: 'Saved',
    viewDetails: 'View requirements',
    backToCountries: 'Back to countries',
    loading: 'Loading…',
    close: 'Close',
    learnMore: 'Learn more',
    all: 'All',
    none: 'None',
    verified: 'Verified',
    apply: 'Apply',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
  },
  nav: {
    home: 'Home',
    explore: 'Explore Countries',
    assistant: 'Visa Assistant',
    about: 'About',
    menu: 'Menu',
    openSearch: 'Open search',
  },
  home: {
    heroTitle: 'Where can you travel with your Tunisian passport?',
    heroSubtitle:
      'Discover visa requirements, application procedures and travel information for destinations around the world.',
    searchPlaceholder: 'Search a country…',
    exploreMap: 'Explore the World Map',
    trustMessage: 'Information based on official government and embassy sources.',
    statsTitle: 'Visa access at a glance',
    statsSubtitle: 'How far your Tunisian passport can take you across our tracked destinations.',
    mapTitle: 'The world at your fingertips',
    mapSubtitle: 'Hover a country to see its status for Tunisian passport holders. Click for full guidance.',
    popularTitle: 'Popular destinations for Tunisians',
    popularSubtitle: 'The most-visited destinations from Tunisia.',
    howTitle: 'How TuniVisa works',
    assistantCtaTitle: 'Not sure what you need?',
    assistantCtaText: 'Answer a few questions and get a personalised visa guide in under a minute.',
    assistantCtaButton: 'Start the Visa Assistant',
    demoNote:
      'Visa rules change frequently. Our 20 full guides are checked against official government and embassy sources, but always confirm requirements before applying.',
  },
  status: {
    visa_free: 'Visa Free',
    visa_on_arrival: 'Visa on Arrival',
    evisa_eta: 'eVisa / eTA',
    visa_required: 'Visa Required',
    unknown: 'Unknown',
  },
  region: {
    Europe: 'Europe',
    Africa: 'Africa',
    Asia: 'Asia',
    Americas: 'Americas',
    'Middle East': 'Middle East',
    Oceania: 'Oceania',
  },
  countries: {
    title: 'Explore countries',
    subtitle: 'Search and filter every destination in our database.',
    searchPlaceholder: 'Search countries…',
    gridView: 'Grid view',
    listView: 'List view',
    sortAlpha: 'Sort A–Z',
    sortAlphaDesc: 'Sort Z–A',
    loadMore: 'Load more countries',
    results: 'countries',
    noResultsTitle: 'No countries found',
    noResultsText: 'Try a different search term or clear your filters.',
    clearFilters: 'Clear filters',
  },
  footer: {
    tagline: 'Visa information for Tunisian travelers.',
    explore: 'Explore',
    resources: 'Resources',
    legal: 'Legal',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    disclaimer:
      'TuniVisa provides informational guidance and does not guarantee visa approval. Visa requirements may change. Always verify requirements with the relevant official government or embassy before applying.',
    madeIn: 'Made in Tunisia',
  },
}

const fr = {
  common: {
    login: 'Se connecter',
    register: "S'inscrire",
    logout: 'Se déconnecter',
    search: 'Rechercher',
    continue: 'Continuer',
    back: 'Retour',
    next: 'Suivant',
  },
  nav: {
    home: 'Accueil',
    explore: 'Explorer les pays',
    assistant: 'Assistant visa',
    about: 'À propos',
  },
  home: {
    heroTitle: 'Où pouvez-vous voyager avec votre passeport tunisien ?',
    heroSubtitle:
      'Découvrez les conditions de visa, les procédures de demande et les informations de voyage pour des destinations dans le monde entier.',
    searchPlaceholder: 'Rechercher un pays…',
    exploreMap: 'Explorer la carte du monde',
    trustMessage: "Informations basées sur des sources gouvernementales et d'ambassade officielles.",
  },
  status: {
    visa_free: 'Sans visa',
    visa_on_arrival: 'Visa à l\u2019arrivée',
    evisa_eta: 'e-Visa / eTA',
    visa_required: 'Visa requis',
    unknown: 'Inconnu',
  },
  footer: {
    tagline: 'Informations sur les visas pour les voyageurs tunisiens.',
    disclaimer:
      "TuniVisa fournit des conseils informatifs et ne garantit pas l'obtention d'un visa. Les conditions de visa peuvent changer. Vérifiez toujours les conditions auprès du gouvernement ou de l'ambassade concernés avant de faire une demande.",
  },
}

// Arabic scaffolding — add translations as the product expands.
const ar = {}

export const DICTIONARIES = { en, fr, ar }
export const DEFAULT_LANGUAGE = 'en'
export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]
