# Application Components

An inventory of every moving part in `morhaat-web-ui` and what each is responsible for.
This is a **frontend-only** Remix v2 app running on mock data; the data layer is designed
so that swapping mock for a real API touches only `app/actions/*.server.ts`.

For build commands and architectural rules see [`CLAUDE.md`](../CLAUDE.md).

---

## 1. Framework runtime layer

The Remix entry points that wire React to the server and the browser. Mostly stock
template code — do not hand-edit unless you know why.

| File | Role |
| --- | --- |
| [`app/root.tsx`](../app/root.tsx) | The only HTML document in the app. Exports `Layout` (the `<html>/<head>/<body>` shell, `<Meta>`, `<Links>`, `<ScrollRestoration>`, `<Scripts>`), `links` (preconnect + Inter web font from Google Fonts), and the default `App` component which is currently just `<Outlet />`. **There is no shared header, nav, or footer here yet** — every route renders its own full-page chrome. |
| [`app/entry.client.tsx`](../app/entry.client.tsx) | Browser hydration. `hydrateRoot(document, <RemixBrowser />)` inside `startTransition` + `StrictMode`. Stock. |
| [`app/entry.server.tsx`](../app/entry.server.tsx) | Server-side render. Streams React to the response with `renderToPipeableStream`, branches on `isbot(user-agent)` — bots wait for `onAllReady` (full HTML), browsers stream from `onShellReady`. 5s `ABORT_DELAY`. Stock. |

---

## 2. Routes (`app/routes/`, flat file-based routing)

Each route owns its own page layout and state. State lives in the route, not in components.

| Route | Path | Data source | Notes |
| --- | --- | --- | --- |
| [`app/routes/_index.tsx`](../app/routes/_index.tsx) | `/` | `loader` → `HomeServer.getCatagories()` | "Collections" grid. Server-loaded list of category cards rendered via `useLoaderData`. Sets page `<title>`/description via `meta`. **Gaps:** `catagory: any` in the `.map`, category links are `href="#"`, loader return isn't typed against a service type, term is misspelled `catagory`. |
| [`app/routes/cart.tsx`](../app/routes/cart.tsx) | `/cart` | Inline `INITIAL_CART_ITEMS` array + `useState` | Shopping cart page. Holds cart items in client state, computes `subtotal` / `shipping` ($5 flat) / `tax` (8%) / `total` in the component, renders `<CartItem>` list + `<OrderSummary>`, and shows an empty-cart state. **Gaps (per `CLAUDE.md`):** mock data is inline instead of in a `cart.server.ts` service; totals/tax/shipping are hardcoded business logic in the view; unescaped `'` and redundant `role="list"` trip lint; `Checkout` button is inert. |
| [`app/routes/history.tsx`](../app/routes/history.tsx) | `/history` | none | Static "Your History Book" placeholder with a "Continue Shopping" link. No loader, no data model yet. |

---

## 3. Presentational components (`app/components/`)

Prop-driven, no data fetching, no router awareness. These are the reusable UI pieces.

| Component | Props | Responsibility |
| --- | --- | --- |
| [`app/components/CartItem.tsx`](../app/components/CartItem.tsx) | `id, title, price, image, quantity, onUpdateQuantity(id, qty), onRemove(id)` | One row in the cart: thumbnail, title, line total (`price * quantity`), per-unit price, a −/＋ quantity stepper (− disabled at qty 1), and a Remove button. Purely controlled — all mutations bubble up through callbacks. Imports `useState` but does not use it. Product title links to `href="#"`. |
| [`app/components/OrderSummary.tsx`](../app/components/OrderSummary.tsx) | `subtotal, shipping, tax, total` (all `number`) | The order-summary panel on the cart page: formatted money rows and a full-width Checkout button. Display-only — receives already-computed totals, does no math. Checkout button has no handler. |

---

## 4. Data layer (`app/actions/*.server.ts`) — the mock/real API seam

The single boundary where mock data lives. Routes' `loader`/`action` functions are the
only callers; a real backend later means rewriting only the bodies of these functions.

| Module | Exports | Shape |
| --- | --- | --- |
| [`app/actions/home.server.ts`](../app/actions/home.server.ts) | `default HomeServer = { getCatagories }` | `async getCatagories()` returns a static array of category objects `{ name, description, imageSrc, imageAlt, href }`. **Gaps:** opens with a `"use server"` directive and imports the `_index` route module — both wrong for Remix (build logs "`use server` ... was ignored"); objects have no stable `id`; not a list-response shape (can't grow pagination/filtering); no exported types; misspelled `catagories`. |

**Not yet built:** `cart.server.ts` (cart items + pricing), a history/orders service, a
products/catalog service. Per `CLAUDE.md`, cart data + logic should move here when
`cart.tsx` is next touched.

---

## 5. Styling

| File | Role |
| --- | --- |
| [`app/tailwind.css`](../app/tailwind.css) | The single stylesheet. `@tailwind base/components/utilities` + a base rule giving `html, body` a white / `dark:bg-gray-950` background and `color-scheme: dark` under `prefers-color-scheme: dark`. Imported once in `root.tsx`. |
| [`tailwind.config.ts`](../tailwind.config.ts) | Tailwind 3.4 config. `content` globs `app/**` (incl. `.client`/`.server`). Extends the `sans` font stack with **Inter** (loaded as a web font in `root.tsx`). No custom colors/spacing/plugins. |
| [`postcss.config.js`](../postcss.config.js) | PostCSS pipeline: `tailwindcss` + `autoprefixer`. |

Convention: **Tailwind utility classes only** — no CSS modules, no styled-components, no
component-level `.css` files.

---

## 6. Build & tooling config

| File | Role |
| --- | --- |
| [`package.json`](../package.json) | Scripts: `dev` (Vite dev server, :5173), `build` (`remix vite:build` → `build/server` + `build/client`), `start` (`remix-serve` :3000), `typecheck` (`tsc --noEmit`), `lint` (ESLint 8). Runtime deps: `@remix-run/{node,react,serve}` 2.17, `react`/`react-dom` 18.3, `isbot` 4. Node ≥ 20. **No test runner configured.** |
| [`vite.config.ts`](../vite.config.ts) | Vite 6 + `@remix-run/dev` plugin + `vite-tsconfig-paths`. **All Remix v3 future flags on**: `v3_singleFetch`, `v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`, `v3_lazyRouteDiscovery`. Write loaders/actions to the single-fetch contract. |
| [`tsconfig.json`](../tsconfig.json) | TS 5.9 strict, `moduleResolution: Bundler`, `noEmit` (Vite builds). Path alias `~/*` → `app/*`. `lib: DOM + ES2022`. |
| [`.eslintrc.cjs`](../.eslintrc.cjs) | ESLint 8 legacy config. `eslint:recommended` + `react`, `react-hooks`, **`jsx-a11y` (recommended, as errors)**, `@typescript-eslint`, `import`. Treats `^~/` as internal imports. **`npm run lint` currently fails with 6 pre-existing errors.** |
| [`.agent/workflows/*.md`](../.agent/workflows/) | Plain-English runbooks mirroring the npm scripts: `build`, `dev`, `docker`, `init`, `lint`, `start`, `test`. |

---

## 7. Deployment

| File | Role |
| --- | --- |
| [`Dockerfile`](../Dockerfile) | Multi-stage. **builder** (`node:24-alpine`): `npm ci` → `npm run build`. **runner** (`node:24-alpine`): `npm ci --omit=dev`, copies `build/` + `public/` from builder, runs as non-root `remix` user, `NODE_ENV=production`, `PORT=3000`, `EXPOSE 3000`, `CMD npm run start`. |

Production server is `@remix-run/serve` (`remix-serve`) — no custom server file. Deploy
artifact is `build/server` + `build/client`.

---

## 8. Static assets (`public/`)

Served from `/` as-is: `favicon.ico`, `logo-dark.png`, `logo-light.png` (logos not yet
referenced anywhere in the app).

---

## Data flow at a glance

```
browser request
      │
      ▼
entry.server.tsx ──(streams)──▶ root.tsx <Layout> ──▶ route module
                                                          │
                                   loader() ──▶ app/actions/*.server.ts  (mock data)
                                                          │
                                   default export (page) ──▶ app/components/*  (props only)
                                                          │
                                                     useLoaderData / useState
```

## Known structural gaps (roadmap)

- **No shared layout / chrome** — build a root or pathless `_app` layout route with header/nav/footer.
- **`cart.tsx` violates the data-layer rule** — extract `cart.server.ts` + typed model; move pricing out of the view.
- **`home.server.ts` needs cleanup** — drop `"use server"` and the route import; add stable IDs, list-response shape, exported types.
- **Types not end-to-end** — replace `catagory: any`; type loader returns via service-module types.
- **Lint is red** — 6 pre-existing errors to clear before CI.
- **No tests** — intended stack is Vitest + Testing Library (unit/component) and Playwright (e2e).
- **Spelling** — `catagory`/`catagories` should become `categor*` as the data layer is formalized.
