// Internationalisation dictionaries.
// English (en) is fully populated. French (fr) is partially populated and
// Arabic (ar) is scaffolded — any missing key falls back to English.
// Add more keys / languages here as the product grows.

const en = {
  common: {
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
    mySpace: 'My space',
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
  chat: {
    open: 'Open visa assistant',
    close: 'Close visa assistant',
    clear: 'Clear conversation',
    title: 'TuniVisa Assistant',
    subtitle: 'Visa answers for Tunisian travellers',
    welcomeTitle: 'Ask about your next destination',
    welcome:
      'I can help with visa requirements, documents, fees and application steps, using TuniVisa guides and official sources.',
    privacy: 'Do not share passport numbers, bank details or personal documents.',
    placeholder: 'Ask a visa question...',
    send: 'Send',
    thinking: 'Searching TuniVisa guides...',
    errorTitle: 'The assistant is unavailable',
    error: 'Please try again in a moment. You can still use the Visa Assistant.',
    rateLimited: 'Too many questions in a short time. Please wait a minute and try again.',
    timeout: 'The request took too long. Please try again.',
    unavailable: 'Both AI providers are busy right now. Please try again shortly.',
    sources: 'Official sources',
    related: 'Related TuniVisa pages',
    suggestions: 'Ask next',
    disclaimer: 'Informational guidance only. No approval prediction. Always verify with the official source.',
    verifiedOn: 'Checked {date}',
    charactersLeft: '{count} characters left',
    userLabel: 'You',
    assistantLabel: 'TuniVisa Assistant',
    starter1: 'Do I need a visa for France?',
    starter2: 'What documents do I need for a student visa?',
    starter3: 'Which countries are visa-free for Tunisians?',
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
    mySpace: 'Mon espace',
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
  chat: {
    open: "Ouvrir l'assistant visa",
    close: "Fermer l'assistant visa",
    clear: 'Effacer la conversation',
    title: 'Assistant TuniVisa',
    subtitle: 'Réponses visa pour les voyageurs tunisiens',
    welcomeTitle: 'Posez une question sur votre destination',
    welcome:
      "Je peux vous aider sur les conditions de visa, les documents, les frais et les étapes de demande, à partir des guides TuniVisa et des sources officielles.",
    privacy: 'Ne partagez pas de numéro de passeport, de coordonnées bancaires ou de documents personnels.',
    placeholder: 'Posez une question visa...',
    send: 'Envoyer',
    thinking: 'Recherche dans les guides TuniVisa...',
    errorTitle: "L'assistant est indisponible",
    error: "Réessayez dans un instant. Vous pouvez toujours utiliser l'assistant visa.",
    rateLimited: 'Trop de questions en peu de temps. Patientez une minute puis réessayez.',
    timeout: 'La demande a pris trop de temps. Réessayez.',
    unavailable: 'Les deux fournisseurs IA sont occupés. Réessayez dans quelques instants.',
    sources: 'Sources officielles',
    related: 'Pages TuniVisa utiles',
    suggestions: 'À demander ensuite',
    disclaimer:
      "Informations indicatives. Aucune prédiction d'approbation. Vérifiez toujours la source officielle.",
    verifiedOn: 'Vérifié le {date}',
    charactersLeft: '{count} caractères restants',
    userLabel: 'Vous',
    assistantLabel: 'Assistant TuniVisa',
    starter1: "Ai-je besoin d'un visa pour la France ?",
    starter2: 'Quels documents faut-il pour un visa étudiant ?',
    starter3: 'Quels pays sont sans visa pour les Tunisiens ?',
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
