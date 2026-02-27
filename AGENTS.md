# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Plaisia is an AI-assisted daily prayer/reflection app using Ignatian spirituality. Built with React 18, TypeScript, Vite (client), Express (API proxy), and optional Supabase (auth + database).

### Architecture

- **Client**: React SPA built with Vite, Tailwind CSS (local build), served on port 5173 in dev
- **Server**: Express API proxy (`server/`) on port 3001, holds the Gemini API key server-side
- **Database** (optional): Supabase for auth and cloud journal persistence. Falls back to localStorage when not configured.
- Vite proxies `/api/*` to the Express server in development
- PWA-enabled: manifest, service worker, offline caching via Workbox

### Running the dev environment

```
npm run dev
```

Uses `concurrently` to start both Express (port 3001) and Vite (port 5173). Also available separately:
- `npm run dev:server` — Express only
- `npm run dev:client` — Vite only

### Lint / Type-check

```
npx tsc --noEmit
```

No ESLint configured.

### Build / Production

```
npm run build    # Vite build + PWA service worker generation
npm start        # Express serves static files + API (self-hosted production)
```

### Deploying to Vercel

The app is configured for Vercel out of the box:

1. Push the repo to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Set the `API_KEY` environment variable (your Gemini API key) in the Vercel dashboard under Settings → Environment Variables
4. Optionally set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SENTRY_DSN`
5. Deploy

Vercel uses the `api/` directory for serverless functions and `dist/` for the static Vite build. The `server/` directory is only used for local development (Express + Vite proxy).

### Testing

No automated test framework. Manual browser testing is the primary method.

### Important caveats

- **API Key**: Set `API_KEY` in `.env.local`. Only read server-side — never in the client bundle.
- **Gemini 2.5 Flash thinking tokens**: Keep `maxOutputTokens` at 1024+ to avoid truncation.
- **Supabase** (optional): Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` to enable auth + cloud sync. Run `supabase/migrations/001_initial_schema.sql` against your project. Without these, the app works in pure localStorage mode.
- **Sentry** (optional): Set `VITE_SENTRY_DSN` to enable error reporting (production only).
- **Analytics** (optional): Set `VITE_ANALYTICS_ENDPOINT` to enable event tracking. Respects Do Not Track.
- **Dev-only UI**: "(Dev: Advance to Week)" button only appears when `import.meta.env.DEV` is true.
- **CDN fonts**: Google Fonts (Merriweather, Source Sans 3) load from `fonts.googleapis.com`. Cached by the service worker for offline use.
- **All user state in localStorage** by default. With Supabase configured, journal entries sync to the cloud.
