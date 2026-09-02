/**
 * Browser-safe environment configuration.
 *
 * `serverEnv` (in `env.server.ts`) may hold secrets and never reaches the
 * client. This module defines the small subset that IS safe to expose to the
 * browser, plus the plumbing to read it on either side:
 *
 *   - Server: `app/root.tsx`'s loader calls `getPublicEnv(serverEnv)` and sends
 *     the result down. It also serializes it onto `window.ENV` via an inline
 *     script so code running before hydration (and non-loader modules) can read
 *     it synchronously.
 *   - Client: `readPublicEnv()` returns `window.ENV`. In React components prefer
 *     the loader data from the root route; `readPublicEnv()` is the escape hatch
 *     for plain modules.
 *
 * Nothing here is a secret. Everything here ends up in page HTML.
 */

import type { AppEnv, ServerEnv } from "./env.server";

export interface PublicEnv {
  APP_ENV: AppEnv;
  SITE_URL: string;
  COMMERCE_ENABLED: boolean;
  USE_MOCK_DATA: boolean;
}

/** Project the validated server config down to the browser-safe subset. */
export function getPublicEnv(env: ServerEnv): PublicEnv {
  return {
    APP_ENV: env.APP_ENV,
    SITE_URL: env.PUBLIC_SITE_URL,
    COMMERCE_ENABLED: env.PUBLIC_COMMERCE_ENABLED,
    USE_MOCK_DATA: env.USE_MOCK_DATA,
  };
}

declare global {
  interface Window {
    ENV?: PublicEnv;
  }
}

/**
 * Read the public env on the client. Throws if called before `window.ENV` is
 * set (i.e. before the root route's inline script runs) or on the server.
 */
export function readPublicEnv(): PublicEnv {
  if (typeof window === "undefined" || !window.ENV) {
    throw new Error(
      "readPublicEnv() called before window.ENV was set. On the server, read `serverEnv` instead.",
    );
  }
  return window.ENV;
}
