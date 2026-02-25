# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Plaisia is an AI-assisted daily prayer/reflection app using Ignatian spirituality. Built with React 18, TypeScript, Vite (client) and Express (API proxy server).

### Architecture

- **Client**: React SPA built with Vite, Tailwind CSS (local, not CDN), served on port 5173 in dev
- **Server**: Express API proxy (`server/`) on port 3001, holds the Gemini API key server-side
- Vite proxies `/api/*` to the Express server in development
- In production, Express serves static files from `dist/` + handles API routes

### Running the dev environment

```
npm run dev
```

This uses `concurrently` to start both the Express server (port 3001) and Vite dev server (port 5173). You can also run them separately:

```
npm run dev:server   # Express only
npm run dev:client   # Vite only
```

### Lint / Type-check

No ESLint is configured. Use TypeScript for type-checking:

```
npx tsc --noEmit
```

### Build

```
npm run build
```

### Production

```
npm run build
npm start
```

### Testing

No automated test framework is configured. Manual browser testing is the primary method.

### Important caveats

- **API Key**: Set `API_KEY` in `.env.local` (or set `GEMINI_API_KEY` as an environment variable — the update script writes it to `.env.local` automatically). The key is only read server-side by `server/index.js` — it is never sent to the client bundle. Without a valid key, the server returns 500 errors for AI features but the UI still renders.
- **Gemini 2.5 Flash thinking tokens**: The `gemini-2.5-flash` model uses internal thinking tokens that count against `maxOutputTokens`. Keep `maxOutputTokens` at 1024+ for short responses to avoid truncation.
- **Dev-only UI**: The "(Dev: Advance to Week)" button on the dashboard only appears when `import.meta.env.DEV` is true. It is excluded from production builds.
- **CDN dependencies**: Google Fonts (Merriweather, Source Sans 3) load from `fonts.googleapis.com` at runtime. Tailwind CSS is bundled locally.
- **All user state is in localStorage**: No database or backend persistence; journal entries persist in the browser only.
