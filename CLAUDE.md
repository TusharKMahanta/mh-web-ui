# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`morhaat-web-ui` is the **frontend module of a retail e-commerce system**. It is being built as a **production-grade** application maintained by a single developer. Right now it runs entirely on **mock data** — there is no backend. The design goal is that swapping mock data for a real API later touches only the data layer (`app/actions/*.server.ts`), never routes or components.

Treat every change as production code: `npm run typecheck`, `npm run lint`, and `npm run build` must all pass before a change is considered done.

## Commands

| Task | Command |
| --- | --- |
| Install deps | `npm install` (Node >= 20; repo tested on v22) |
| Dev server | `npm run dev` — Vite dev server on http://localhost:5173, HMR |
| Production build | `npm run build` — outputs `build/server` + `build/client` |
| Run production build | `npm start` — `remix-serve` on http://localhost:3000 (`PORT` overrides) |
| Typecheck | `npm run typecheck` (`tsc`, `noEmit`) |
| Lint | `npm run lint` (ESLint 8, legacy `.eslintrc.cjs`) |
| Lint autofix | `npx eslint --fix --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .` |
| Docker | `docker build -t morhaat-web-ui:latest .` then `docker run -p 3000:3000 morhaat-web-ui:latest` |

**No test framework is configured yet** — `npm test` does not exist. For a production-grade build the intended stack (per `.agent/workflows/test.md`) is **Vitest + @testing-library/react** for unit/component tests and **Playwright** for e2e. When you add it, add `test` / `test:e2e` scripts and document how to run a single test here.

`.agent/workflows/*.md` are step-by-step runbooks mirroring the commands above (`build`, `dev`, `docker`, `init`, `lint`, `start`, `test`).

## Architecture

Remix v2 (`@remix-run/*` ^2.17) on the **Vite** plugin, served in production by `@remix-run/serve`. React 18.3, TypeScript (strict), Tailwind CSS 3.4.

- **All Remix v3 future flags are enabled** in `vite.config.ts` (`v3_singleFetch`, `v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`, `v3_lazyRouteDiscovery`). Write loaders/actions to the single-fetch contract.
- **Path alias**: `~/*` → `app/*` (`tsconfig.json` + `vite-tsconfig-paths`). ESLint treats `^~/` as internal imports.
- **Routing** is file-based in `app/routes/` (flat convention). `app/root.tsx` is currently only the `<html>` shell + font links + `<Outlet />` — **there is no shared header, nav, footer, or app layout yet**. Building shared chrome (a root layout or a `_app` pathless layout route wrapping the store pages) is expected early work.
- **Components** in `app/components/` are presentational and prop-driven; state lives in the route. There is no global state library.
- **Styling**: Tailwind utility classes only, imported once via `app/tailwind.css` in `root.tsx`. `tailwind.config.ts` extends the `sans` stack with Inter (Google Fonts, loaded in `root.tsx`).

### Data layer (the mock-data seam — read before adding any data)

All data MUST flow through **service modules in `app/actions/*.server.ts`** (e.g. `home.server.ts` exports `HomeServer.getCatagories()`). Rules:

- Route `loader`/`action` functions call these service modules and nothing else for data. Loaders return `Response.json(...)`.
- Service functions are **`async` and return typed, API-shaped data** — model the shape as if it came from a real REST/GraphQL backend (stable IDs, list responses that can grow pagination/filtering, ISO date strings, money as minor units or a documented convention). Export the types; they are the contract the rest of the app codes against.
- **Do not put mock data arrays inline in route or component files.** `app/routes/cart.tsx` currently violates this (`INITIAL_CART_ITEMS` inline, totals hardcoded) — migrate cart data/logic into a `cart.server.ts` service + typed model when touching it.
- Keep the mock/real switch at the module boundary: a real backend later means rewriting the body of these functions only.

### Environment configuration (the deploy seam — read before reading `process.env`)

Per-environment settings are **runtime env vars**, resolved once at server boot. Never use `import.meta.env` / `VITE_*` for deploy config — the app is built once and deployed to many environments. Full guide: `docs/CONFIGURATION.md`.

- **`app/config/env.server.ts`** is the only module that reads `process.env`. It validates/coerces and exports a typed `serverEnv`. In `staging`/`production` a missing or malformed required var (`SESSION_SECRET`, and `API_BASE_URL` when `USE_MOCK_DATA=false`) throws at boot; in `development` it warns and uses a default. Route loaders/actions and `app/actions/*.server.ts` import `serverEnv` — they must not touch `process.env` directly.
- **`app/config/public-env.ts`** defines `PublicEnv`, the browser-safe subset. `app/root.tsx`'s loader ships it and serializes it to `window.ENV`. Anything named `PUBLIC_*` ends up in page HTML — never a secret.
- Dev vars load automatically from `.env.development` (committed, no secrets) / `.env.local` (git-ignored) via the Remix Vite plugin. Production/Docker: real env vars only (`.env` files are not read by `remix-serve`). `.env.example` documents every var.

## Conventions & gotchas

- The domain term for product groupings is misspelled **`catagories`/`catagory`** throughout `home.server.ts` and `_index.tsx`. Prefer fixing it to `categories` as part of formalizing the data layer; if you leave it, be consistent.
- `home.server.ts` opens with a `"use server"` directive and imports the `_index` route module — both are wrong for Remix and the build logs `"use server" ... was ignored`. Not a pattern to copy; remove when refactoring that file.
- **`npm run lint` currently fails with 6 pre-existing errors** (unused imports, an `any` in `_index.tsx`, an unescaped `'` in `cart.tsx`, redundant `role="list"`, `href="#"`). Clear these before wiring up CI.
- `jsx-a11y` rules are enabled as **errors** — keep accessibility lint green; this is a customer-facing storefront.
- Loader data is typed loosely in places (`catagory: any`). Production-grade means real types end to end — type loader return values via the service-module types.

## Framework direction

- Dependencies were bumped to the latest in-range versions (Remix 2.17.5, Vite 6.4.3, TypeScript 5.9.3, React 18.3.1, Tailwind 3.4.19). Pending **deliberate** major migrations, each its own change: ESLint 8→9 (flat config) + `@typescript-eslint` 6→8 + `eslint-plugin-react-hooks` 4→7; Tailwind 3→4; React 18→19; `isbot` 4→5.
- **"Remix 3" is not an upgrade path** — it is a separate, non-React, ground-up rewrite with no migration from Remix 2. If this app ever leaves Remix 2, the supported target is **React Router v7 framework mode**. Do not attempt to adopt Remix 3.
