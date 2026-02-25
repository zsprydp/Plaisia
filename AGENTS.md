# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Plaisia is a client-side React SPA (no backend) for AI-assisted daily prayer/reflection using Ignatian spirituality. Built with React 18, TypeScript, Vite, and Tailwind CSS (loaded via CDN).

### Running the dev server

```
npm run dev
```

Starts Vite on port 5173. Use `--host 0.0.0.0` to expose to network.

### Lint / Type-check

No ESLint is configured. Use TypeScript for type-checking:

```
npx tsc --noEmit
```

Note: The codebase has pre-existing TS errors (unused imports, a relative path issue in `services/geminiService.ts`). These do not block the Vite build.

### Build

```
npm run build
```

### Testing

No automated test framework is configured. Manual browser testing is the primary method.

### Important caveats

- **API Key required**: The app needs `API_KEY` set in `.env.local` for the Google Gemini API. Without it, the app crashes on load because `services/geminiService.ts` throws at module-import time. A placeholder value allows the UI to render, but AI features (reflection prompts, discernment analysis, TTS) will fail at call time.
- **No lock file**: There is no `package-lock.json` in the repo, so `npm install` resolves versions fresh each time.
- **CDN dependencies**: Tailwind CSS and Google Fonts load from CDNs at runtime. Network access to `cdn.tailwindcss.com` and `fonts.googleapis.com` is required for proper styling.
- **All state is in localStorage**: No database or backend; journal entries persist in the browser's localStorage only.
