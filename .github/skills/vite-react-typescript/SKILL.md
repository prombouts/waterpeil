---
name: vite-react-typescript
description: Conventions for this Vite + React 19 + TypeScript SPA, including build, dev workflow, and Azure Static Web Apps deployment. Use when adding components, changing build config, or deploying.
---

# Vite + React 19 + TypeScript

## Commands
- `npm run dev` — dev server at http://localhost:5173
- `npm run build` — `tsc` type-check then `vite build` to `dist/`
- `npm run preview` — serve the production build locally

## Conventions
- React 19 function components with hooks; no class components.
- Strict TypeScript: type all props with explicit interfaces/types; `npm run build` fails on type errors, so run it to validate changes.
- Components live in `src/components/`, data in `src/data/`, global styles in `src/index.css` (plain CSS, no framework).
- Entry: `src/main.tsx` → `src/App.tsx`. SPA with a single map view; avoid adding a router unless genuinely needed.
- Prefer named exports for components; one component per file.
- Side-effectful browser APIs (Leaflet, canvas, fetch) belong in `useEffect` with proper cleanup (remove listeners, abort fetches).

## Build & deploy
- Deployed to Azure Static Web Apps via `.github/workflows/azure-static-web-apps.yml` on push to `main` (needs repo secret `AZURE_STATIC_WEB_APPS_API_TOKEN`).
- App location `/`, output location `dist`; SPA fallback configured in `public/staticwebapp.config.json`.
- Use dynamic `import()` for heavy, optional dependencies (e.g. `geotiff`) so Vite code-splits them out of the entry chunk.
