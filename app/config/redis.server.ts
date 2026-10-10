/**
 * Redis client.
 *
 * This is the ONE place the app creates a Redis connection. Service modules
 * call `getRedis()` and build keys with `redisKey()`; they never call
 * `createClient` themselves. Connection settings come from `serverEnv`
 * (`REDIS_URL`, `REDIS_KEY_PREFIX`, `REDIS_CONNECT_TIMEOUT_MS`).
 *
 * The client connects lazily on first use, so `npm run build`, `typecheck` and
 * server boot never need a reachable Redis — only the code paths that use it.
 * Local dev: `docker compose -f redis/docker-compose.yaml up -d`.
 *
 * The connect promise is cached on `globalThis` so Vite HMR in dev reuses the
 * existing connection instead of opening a new one on every module reload.
 */

import { createClient } from "redis";

import { serverEnv } from "~/config/env.server";

function createRedisClient() {
  return createClient({
    url: serverEnv.REDIS_URL,
    socket: {
      connectTimeout: serverEnv.REDIS_CONNECT_TIMEOUT_MS,
      // Back off linearly up to 3s between reconnect attempts; never give up.
      reconnectStrategy: (retries) => Math.min(retries * 100, 3_000),
    },
  });
}

/** The connected client type (default modules, RESP3). */
export type RedisClient = ReturnType<typeof createRedisClient>;

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: Promise<RedisClient> | undefined;
}

function connect(): Promise<RedisClient> {
  const client = createRedisClient();

  // Without a listener node-redis rethrows socket errors as an unhandled
  // `error` event, which would crash the server during a Redis outage.
  client.on("error", (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error("[redis] client error:", error);
  });

  return client.connect();
}

/** Returns the shared, connected client, connecting on first call. */
export function getRedis(): Promise<RedisClient> {
  if (!globalThis.__redisClient) {
    globalThis.__redisClient = connect().catch((error: unknown) => {
      // Drop the failed attempt so the next call retries instead of
      // returning the same rejected promise forever.
      globalThis.__redisClient = undefined;
      throw error;
    });
  }
  return globalThis.__redisClient;
}

/** Builds a namespaced key: `redisKey("otp", id)` → `"morhaat:otp:<id>"`. */
export function redisKey(...parts: string[]): string {
  return `${serverEnv.REDIS_KEY_PREFIX}${parts.join(":")}`;
}

/** True when Redis answers a PING. For health-check routes. */
export async function pingRedis(): Promise<boolean> {
  try {
    const client = await getRedis();
    return (await client.ping()) === "PONG";
  } catch {
    return false;
  }
}
