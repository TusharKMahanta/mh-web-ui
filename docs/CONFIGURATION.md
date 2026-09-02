# Environment Configuration

The app is built **once** and deployed to multiple environments (local, staging,
production) with different settings. All settings come from **runtime environment
variables** — never from values baked into the build. This is why we do not use
`import.meta.env` / `VITE_*` for deploy config: those are frozen at `npm run
build` time and would make the Docker image environment-specific.

## The single seam

| File | Role |
| --- | --- |
| [`app/config/env.server.ts`](../app/config/env.server.ts) | The only place `process.env` is read. Validates + coerces at boot, exports typed `serverEnv`. Fails fast in staging/prod on missing/invalid vars. |
| [`app/config/public-env.ts`](../app/config/public-env.ts) | The browser-safe subset (`PublicEnv`). `getPublicEnv(serverEnv)` projects it; `app/root.tsx` ships it to `window.ENV`. |

Route loaders/actions and `app/actions/*.server.ts` services import `serverEnv` —
they must not read `process.env` directly.

```ts
import { serverEnv } from "~/config/env.server";

if (serverEnv.USE_MOCK_DATA) return mockCart();
const res = await fetch(`${serverEnv.API_BASE_URL}/cart`, {
  signal: AbortSignal.timeout(serverEnv.API_TIMEOUT_MS),
});
```

On the client, read root loader data, or `readPublicEnv()` (returns `window.ENV`)
from a plain module.

## Where values come from per environment

| Environment | Command | How env vars are supplied |
| --- | --- | --- |
| **Local dev** | `npm run dev` | Remix's Vite plugin auto-loads `.env`, `.env.development`, `.env.local` into `process.env` (Vite mode = `development`). `.env.development` is committed with safe defaults; put personal overrides in `.env.local` (git-ignored). |
| **Local prod smoke test** | `npm run build && npm start` | `.env` files are **not** loaded. Pass vars inline: `APP_ENV=staging SESSION_SECRET=… npm start`. |
| **Docker** | `docker run …` | Baked defaults in the [`Dockerfile`](../Dockerfile); override with `-e KEY=value` or `--env-file`. |
| **Staging / production** | orchestrator / CI | Set as real environment variables / secrets in the platform. |

Precedence in dev (Vite): `.env.local` > `.env.development` > `.env` > process env.

## Variables

Full list with descriptions: [`.env.example`](../.env.example).

| Var | Type | Default | Required outside dev? |
| --- | --- | --- | --- |
| `APP_ENV` | `development` \| `staging` \| `production` | `development` | — |
| `PORT` | int | `3000` | no |
| `API_BASE_URL` | http(s) URL | *(empty)* | **yes if `USE_MOCK_DATA=false`** |
| `API_TIMEOUT_MS` | int | `10000` | no |
| `USE_MOCK_DATA` | bool | `true` in dev, `false` elsewhere | no |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` | `debug` in dev, `info` elsewhere | no |
| `SESSION_SECRET` | string (secret) | dev placeholder | **yes** |
| `PUBLIC_SITE_URL` | URL | `http://localhost:5173` | no |
| `PUBLIC_COMMERCE_ENABLED` | bool | `true` | no |

Booleans accept `true/false/1/0/yes/no/on/off`. In `development` a bad/missing
value logs a warning and uses the default; in `staging`/`production` it throws at
boot with an aggregated message.

`PUBLIC_*` vars (and only those, via `PublicEnv`) are serialized into page HTML
on `window.ENV`. Never put a secret behind a `PUBLIC_` name.

## Adding a new variable

1. Add the field to `ServerEnv` and parse it in `readEnv()` in `app/config/env.server.ts`.
2. Document it in `.env.example`; add a dev value to `.env.development` if useful.
3. If the browser needs it: add it to `PublicEnv` and `getPublicEnv()` in `app/config/public-env.ts`.
4. If it must exist in prod: give it no dev-only fallback so `readEnv` records it as a problem (→ boot failure in staging/prod).
5. Set it in each real environment (Docker `ENV` / `--env-file` / orchestrator secrets).
