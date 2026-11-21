# TuniVisa

> Visa and travel guide for Tunisian passport holders.

**Live site:** https://oussema-mhiri.github.io/tunivisa/

TuniVisa helps Tunisian travellers understand where they can travel and what they need before booking. It combines an interactive world map, detailed country and visa guides, and a personalised visa assistant. No account is required: saved destinations, checklists and recent searches stay in the browser.

## Features

- **Interactive world map** covering 200 countries with visa status for Tunisian passport holders.
- **20 full destination guides** with visa status, maximum stay, fees, processing time, application method, last verification date and official sources.
- **8 travel purposes** (tourism, study, work, business, family visit, medical, and more) with dedicated requirements.
- **Visa Assistant**: a short guided questionnaire that generates a personalised document checklist, application steps and readiness score.
- **AI visa chatbot**: a floating EN/FR/AR assistant that answers from the TuniVisa knowledge base, cites official sources and falls back between two free-tier LLM providers.
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
- Vercel Functions for the chat API
- Gemini 3.5 Flash-Lite with Groq GPT-OSS-120B fallback (RAG, no vector database)
- Optional Upstash Redis for rate limiting and response caching
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

# Base URL of the deployed chat API (Vercel project, Root Directory = server)
VITE_CHAT_API_URL=http://localhost:3000/api
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
POST /api/chat
GET /api/health
```

The mock adapter simulates network latency so loading, empty and error states behave like a real API. Visa data was last checked against official government and embassy sources on **2026-11-14**.

## Chat API

The chatbot backend lives in `server/` and is designed to be deployed as a separate Vercel project with **Root Directory = `server`**. It never exposes API keys to the browser.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Primary provider. |
| `GEMINI_MODEL` | No | Defaults to `gemini-3.5-flash-lite`. |
| `GROQ_API_KEY` | Recommended | Fallback provider if Gemini is unavailable (required in production to avoid 503s). |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-120b`. |
| `ALLOWED_ORIGINS` | No | Defaults to `https://oussema-mhiri.github.io,http://localhost:5173`. |
| `UPSTASH_REDIS_REST_URL` | No | Enables distributed rate limiting and caching. |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash REST token. |
| `PROVIDER_TIMEOUT_MS` | No | Per-provider timeout, defaults to `11000`. |
| `RATE_LIMIT_DISABLED` | No | Local testing only; never disable in production. |

The API accepts:

```json
{
  "message": "Do I need a visa for France?",
  "language": "en",
  "history": [{ "role": "user", "content": "..." }],
  "context": { "countryCode": "fr", "visaType": "tourism" }
}
```

It returns `answer`, `sources`, `suggestedFollowUps`, `relatedLinks`, `provider`, `cached` and `requestId`. Limits are 12 requests per minute and 80 per day per IP, plus a 1,000 requests/day global cap. First-turn responses are cached for 24 hours when Redis is configured.

If both AI providers fail, the API falls back to `provider: 'knowledge'`: it returns an extract of the matching TuniVisa guides instead of a 503. Check `GET /api/health` to confirm which providers are configured.

The knowledge base is generated from `src/data/`:

```bash
npm run build:knowledge
```

Run this after changing countries, visa rules, documents, embassies or map data, then commit `server/data/knowledge.js`.

Local backend development:

```bash
cd server
npm run dev
```

This starts a small Node server on `http://localhost:3000` for `/api/chat` and `/api/health`, using `server/.env`. Configure at least `GEMINI_API_KEY` in `server/.env`; set `GROQ_API_KEY` as a fallback if Gemini is rate-limited/unavailable. In development, the frontend defaults to `http://localhost:3000/api`, so no root `.env` is needed. For a Vercel-compatible runtime, use `npx vercel dev` when the CLI works on your OS.

For production builds, set `VITE_CHAT_API_URL` in the frontend environment. Without it, the widget is hidden.

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

The dev server runs at `http://localhost:5173/`. Keep the chat API from the previous step running in another terminal; otherwise the chat widget shows a connection error.

```bash
npm run build          # production build in dist/
npm run preview        # preview the production build
npm run build:knowledge
npm run test           # server tests (Node built-in test runner)
```

## Deployment

The site is deployed to GitHub Pages at https://oussema-mhiri.github.io/tunivisa/ by `.github/workflows/deploy.yml` on every push to `main`.

- Vite uses `base: '/tunivisa/'` in `vite.config.js`.
- The router uses `import.meta.env.BASE_URL` as its basename.
- `public/404.html` provides the SPA fallback for deep links on GitHub Pages.
- The GitHub Actions workflow builds the app and deploys the `dist/` folder.
- Set the GitHub repository variable **Settings → Secrets and variables → Actions → Variables → `VITE_CHAT_API_URL`** to the deployed Vercel API base (for example `https://tunivisa-chat.vercel.app/api`). The build workflow injects it at build time; without it the widget is hidden.
- Deploy `server/` separately on Vercel: import the repository, set **Root Directory** to `server`, add the variables from `server/.env.example` (including a valid `GROQ_API_KEY` and `ALLOWED_ORIGINS=https://oussema-mhiri.github.io,http://localhost:5173`), and redeploy.
- Verify with `GET <VITE_CHAT_API_URL>/health`: `providers.gemini` and `providers.groq` should be `true`, then rebuild/redeploy Pages so the widget appears.
- GitHub Pages cannot host serverless functions or keep provider keys secret.

## Project structure

```text
src/
  components/   Reusable UI components
  components/chat/  Floating chatbot widget and message UI
  context/      App, theme and toast providers
  data/         Mock countries, tourism tips, visa rules, documents, embassies and map data
  hooks/        Local storage, debounce, SEO and chat hooks
  i18n/         Language context and translations
  layouts/      Public and admin layouts
  pages/        Public and admin route pages
  services/     API and chat service layer
  utils/        Formatting and country metadata helpers
server/
  api/          Vercel Functions: chat and health
  data/         Generated chat knowledge base
  lib/          Retrieval, validation, rate limiting, cache and providers
scripts/
  build-chat-knowledge.mjs  Generates server/data/knowledge.js from src/data
public/
  404.html      GitHub Pages SPA fallback
.github/
  workflows/    GitHub Pages deployment workflow
```

## Notes

- Visa rules change frequently. TuniVisa is guidance, not legal advice; always confirm requirements with the destination's official embassy or government website.
- The `/admin` area is a read-only frontend preview. It has no authentication and no persistence; action buttons are labelled as demos. The chat widget is hidden there.
- English, French and Arabic share the same translation keys (missing keys fall back to English). The chatbot detects Arabic questions and answers in English, French or Arabic; Arabic country and purpose aliases are handled by the retrieval layer.
- Cache keys are tied to `KNOWLEDGE_META.generatedAt`, so regenerating `server/data/knowledge.js` invalidates cached answers.
- The chatbot is informational only. It cannot predict approval. Questions and recent chat history are sent to the configured AI providers, so never include passport numbers, bank details or other sensitive personal data.
