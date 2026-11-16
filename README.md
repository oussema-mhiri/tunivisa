# TuniVisa

> Visa and travel guide for Tunisian passport holders.

**Live site:** https://oussema-mhiri.github.io/tunivisa/

TuniVisa helps Tunisian travellers understand where they can travel and what they need before booking. It combines an interactive world map, detailed country and visa guides, and a personalised visa assistant. No account is required: saved destinations, checklists and recent searches stay in the browser.

## Features

- **Interactive world map** covering 200 countries with visa status for Tunisian passport holders.
- **20 full destination guides** with visa status, maximum stay, fees, processing time, application method, last verification date and official sources.
- **8 travel purposes** (tourism, study, work, business, family visit, medical, and more) with dedicated requirements.
- **Visa Assistant**: a short guided questionnaire that generates a personalised document checklist, application steps and readiness score.
- **Country explorer**: search, filter by visa status and region, sort alphabetically, switch between grid and list views, and load more results.
- **Document checklists** with progress saved locally per country and visa type.
- **Embassy and visa application centre** information for the 20 detailed destinations.
- **Saved destinations, recent searches and a "My space" dashboard**, all stored locally.
- **Global search palette** for quick navigation across countries and visa types.
- **Dark and light themes**, responsive layout and SEO metadata.
- **Admin preview** at `/admin` (URL only, frontend-only, no data is persisted).

## Tech stack

- React 18 and React Router 7
- Vite 6
- Tailwind CSS 4
- Framer Motion
- Lucide React
- react-simple-maps with world-atlas
- GitHub Actions and GitHub Pages

## Routes

| Route | Description |
| --- | --- |
| `/` | Home: search, visa statistics, world map, popular destinations |
| `/countries` | Browse, search and filter all destinations |
| `/countries/:code` | Country overview and visa requirements |
| `/countries/:code/visa/:visaType` | Details for a specific travel purpose |
| `/assistant` | Personalised visa assistant |
| `/saved` | Saved destinations |
| `/my-space` | Local dashboard with saved countries, checklists and recent searches |
| `/about` | About TuniVisa |
| `/admin` | Frontend-only admin preview |

## Data and API

The app ships with bundled mock data in `src/data/` and works without a backend. All reads go through `src/services/api.js`, which already mirrors the expected REST API shape.

Environment variables (see `.env.example`):

```bash
# Base URL for a future backend
VITE_API_URL=http://localhost:4000/api

# Set to "false" to call the real REST API instead of bundled mock data
VITE_USE_MOCK=true
```

Expected endpoints:

```text
GET /api/countries
GET /api/countries/:code
GET /api/countries/:code/visa-rules
GET /api/countries/:code/visa/:visaType
GET /api/countries/:code/embassy
GET /api/countries/:code/visa/:visaType/documents
GET /api/popular-countries
GET /api/visa-statistics
GET /api/map
GET /api/visa-types
```

The mock adapter simulates network latency so loading, empty and error states behave like a real API. Visa data was last checked against official government and embassy sources on **2026-11-14**.

## Local storage

TuniVisa does not use accounts or a remote database. These values are kept in `localStorage`:

| Key | Contents |
| --- | --- |
| `tunivisa.saved` | Saved destination codes |
| `tunivisa.recent` | Recent search terms |
| `tunivisa.checklists` | Document checklist progress |
| `tunivisa.theme` | Light or dark theme preference |
| `tunivisa.lang` | Selected language |

## Getting started

Requirements: Node.js 20 or newer (Node.js 22 is used in CI).

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173/`.

```bash
npm run build    # production build in dist/
npm run preview  # preview the production build
```

## Deployment

The site is deployed to GitHub Pages at https://oussema-mhiri.github.io/tunivisa/ by `.github/workflows/deploy.yml` on every push to `main`.

- Vite uses `base: '/tunivisa/'` in `vite.config.js`.
- The router uses `import.meta.env.BASE_URL` as its basename.
- `public/404.html` provides the SPA fallback for deep links on GitHub Pages.
- The GitHub Actions workflow builds the app and deploys the `dist/` folder.

## Project structure

```text
src/
  components/   Reusable UI components
  context/      App, theme and toast providers
  data/         Mock countries, visa rules, documents, embassies and map data
  hooks/        Local storage, debounce and SEO hooks
  i18n/         Language context and translations
  layouts/      Public and admin layouts
  pages/        Public and admin route pages
  services/     API service layer
  utils/        Formatting and country metadata helpers
public/
  404.html      GitHub Pages SPA fallback
.github/
  workflows/    GitHub Pages deployment workflow
```

## Notes

- Visa rules change frequently. TuniVisa is guidance, not legal advice; always confirm requirements with the destination's official embassy or government website.
- The `/admin` area is a frontend-only preview. It has no authentication and no persistence.
- English is fully translated; French is partially translated and Arabic is scaffolded, with missing keys falling back to English.
