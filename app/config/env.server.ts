/**
 * Server-side environment configuration.
 *
 * This is the ONE place the app reads `process.env`. Every route loader/action
 * and every `app/actions/*.server.ts` service reads config from the exported
 * `serverEnv` object instead of touching `process.env` directly. That keeps the
 * dev/staging/prod switch at a single boundary.
 *
 * How values arrive:
 *   - Local dev (`npm run dev`): the Remix Vite plugin loads `.env` and
 *     `.env.development` into `process.env` automatically (Vite mode is
 *     "development"). See `.env.development` for the committed dev defaults.
 *   - Production (`npm start` / Docker): `.env` files are NOT read. The process
 *     environment is the source of truth — set vars via `docker run -e ...`,
 *     your orchestrator, or the shell. See `docs/CONFIGURATION.md`.
 *
 * Validation runs once at module load (i.e. at server boot). In production a
 * missing or malformed required var throws immediately with an aggregated
 * message so a misconfigured deploy fails fast instead of 500-ing per request.
 * In development the same problems log a warning and fall back to a safe default.
 *
 * The file name ends in `.server` so Remix guarantees it never reaches the
 * browser bundle — safe to read secrets here. Browser-visible config lives in
 * `app/config/public-env.ts`.
 */

export type AppEnv = "development" | "staging" | "production";
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface ServerEnv {
  /** Logical deployment environment. Distinct from NODE_ENV. */
  APP_ENV: AppEnv;
  /** Node's own env, set by tooling. `"production"` for optimized builds. */
  NODE_ENV: "development" | "production" | "test";
  /** Convenience flags derived from APP_ENV. */
  isProduction: boolean;
  isStaging: boolean;
  isDevelopment: boolean;

  /** Port the production server (`remix-serve`) listens on. */
  PORT: number;

  /**
   * Base URL of the backend API. Empty while the app runs on mock data.
   * When the real data layer lands, `app/actions/*.server.ts` fetch against this.
   */
  API_BASE_URL: string;
  /** Abort an API request after this many milliseconds. */
  API_TIMEOUT_MS: number;
  /** When true, service modules serve in-memory mock data and ignore API_BASE_URL. */
  USE_MOCK_DATA: boolean;

  /** Minimum level for server logs. */
  LOG_LEVEL: LogLevel;

  /**
   * Secret for signing cookies/sessions. Required in staging/production.
   * Never sent to the client. Rotate per environment.
   */
  SESSION_SECRET: string;

  /** Canonical public origin, e.g. https://morhaat.com — used for absolute URLs. */
  PUBLIC_SITE_URL: string;
  /** Feature flag: is checkout/commerce enabled in this environment. */
  PUBLIC_COMMERCE_ENABLED: boolean;
}

const APP_ENVS: readonly AppEnv[] = ["development", "staging", "production"];
const LOG_LEVELS: readonly LogLevel[] = ["debug", "info", "warn", "error"];

class EnvError extends Error {
  constructor(problems: string[]) {
    super(
      `Invalid environment configuration:\n${problems
        .map((p) => `  - ${p}`)
        .join("\n")}\n` +
        `See .env.example and docs/CONFIGURATION.md.`,
    );
    this.name = "EnvError";
  }
}

function readEnv(source: NodeJS.ProcessEnv): ServerEnv {
  const problems: string[] = [];

  const rawAppEnv = source.APP_ENV?.trim() || "development";
  const APP_ENV = (APP_ENVS as readonly string[]).includes(rawAppEnv)
    ? (rawAppEnv as AppEnv)
    : (() => {
        problems.push(
          `APP_ENV must be one of ${APP_ENVS.join(", ")} (got "${rawAppEnv}")`,
        );
        return "development" as AppEnv;
      })();

  const isProduction = APP_ENV === "production";
  const isStaging = APP_ENV === "staging";
  const isDevelopment = APP_ENV === "development";
  /** Secrets/URLs are mandatory once you leave local dev. */
  const requireHardValues = isProduction || isStaging;

  const rawNodeEnv = source.NODE_ENV?.trim();
  const NODE_ENV: ServerEnv["NODE_ENV"] =
    rawNodeEnv === "production" || rawNodeEnv === "test"
      ? rawNodeEnv
      : "development";

  /** Require a var only outside local dev; otherwise use `fallback`. */
  function str(key: keyof ServerEnv, fallback: string): string {
    const value = source[key]?.trim();
    if (value) return value;
    if (requireHardValues) {
      problems.push(`${key} is required when APP_ENV=${APP_ENV}`);
    }
    return fallback;
  }

  function optionalStr(key: keyof ServerEnv, fallback: string): string {
    return source[key]?.trim() || fallback;
  }

  function int(key: keyof ServerEnv, fallback: number): number {
    const raw = source[key]?.trim();
    if (!raw) return fallback;
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 0) {
      problems.push(`${key} must be a non-negative integer (got "${raw}")`);
      return fallback;
    }
    return n;
  }

  function bool(key: keyof ServerEnv, fallback: boolean): boolean {
    const raw = source[key]?.trim().toLowerCase();
    if (raw === undefined || raw === "") return fallback;
    if (["1", "true", "yes", "on"].includes(raw)) return true;
    if (["0", "false", "no", "off"].includes(raw)) return false;
    problems.push(`${key} must be a boolean (true/false), got "${raw}"`);
    return fallback;
  }

  function enumStr<T extends string>(
    key: keyof ServerEnv,
    allowed: readonly T[],
    fallback: T,
  ): T {
    const raw = source[key]?.trim() as T | undefined;
    if (!raw) return fallback;
    if (!allowed.includes(raw)) {
      problems.push(`${key} must be one of ${allowed.join(", ")} (got "${raw}")`);
      return fallback;
    }
    return raw;
  }

  const USE_MOCK_DATA = bool("USE_MOCK_DATA", isDevelopment);

  const API_BASE_URL = USE_MOCK_DATA
    ? optionalStr("API_BASE_URL", "")
    : str("API_BASE_URL", "");
  if (API_BASE_URL && !/^https?:\/\//.test(API_BASE_URL)) {
    problems.push(`API_BASE_URL must be an absolute http(s) URL (got "${API_BASE_URL}")`);
  }

  const env: ServerEnv = {
    APP_ENV,
    NODE_ENV,
    isProduction,
    isStaging,
    isDevelopment,
    PORT: int("PORT", 3000),
    API_BASE_URL,
    API_TIMEOUT_MS: int("API_TIMEOUT_MS", 10_000),
    USE_MOCK_DATA,
    LOG_LEVEL: enumStr("LOG_LEVEL", LOG_LEVELS, isDevelopment ? "debug" : "info"),
    SESSION_SECRET: str("SESSION_SECRET", "dev-insecure-session-secret"),
    PUBLIC_SITE_URL: optionalStr(
      "PUBLIC_SITE_URL",
      `http://localhost:${source.PORT?.trim() || "5173"}`,
    ),
    PUBLIC_COMMERCE_ENABLED: bool("PUBLIC_COMMERCE_ENABLED", true),
  };

  if (problems.length > 0) {
    if (requireHardValues) {
      throw new EnvError(problems);
    }
    // eslint-disable-next-line no-console
    console.warn(
      `[env] configuration warnings (using fallbacks):\n${problems
        .map((p) => `  - ${p}`)
        .join("\n")}`,
    );
  }

  return env;
}

/** Validated, typed server configuration. Import this; never read process.env elsewhere. */
export const serverEnv: ServerEnv = readEnv(process.env);

export { readEnv as __readEnvForTest };
