/**
 * Login sessions (BFF pattern).
 *
 * The browser only ever holds an opaque, random session id in a signed,
 * httpOnly `__session` cookie. The access token issued by the auth service
 * lives in Redis under that id and never leaves the server:
 *
 *   1. OTP verify succeeds → `createUserSession` stores the token in Redis
 *      under a fresh id and returns the `Set-Cookie` header carrying the id.
 *   2. Every later request → loaders/actions call `getUserSession(request)` to
 *      resolve the id back to the token, and pass it to service modules for
 *      their `Authorization` header.
 *   3. Logout → `destroyUserSession` deletes the Redis key and expires the cookie.
 *
 * A session expires after `SESSION_TTL_SECONDS` or when its token does,
 * whichever is sooner. Only `SessionUser` (no token, no profile id) may be sent
 * to the browser.
 */

import { randomBytes } from "node:crypto";

import { createCookie } from "@remix-run/node";

import type { OtpVerifyResult } from "~/actions/auth.server";
import { serverEnv } from "~/config/env.server";
import { getRedis, redisKey } from "~/config/redis.server";

/** Server-side session record. Contains the access token — never return it from a loader. */
export interface UserSession {
  profileId: string;
  identifier: string;
  accessToken: string;
  tokenType: string;
  /** ISO-8601 timestamp. */
  tokenExpiresAt: string;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

/** The browser-safe view of the signed-in user. */
export interface SessionUser {
  identifier: string;
}

const sessionCookie = createCookie("__session", {
  path: "/",
  httpOnly: true,
  secure: !serverEnv.isDevelopment,
  sameSite: "lax",
  secrets: [serverEnv.SESSION_SECRET],
  maxAge: serverEnv.SESSION_TTL_SECONDS,
});

const sessionKey = (sessionId: string) => redisKey("session", sessionId);

/** Reads the session id from the request; null if absent or the signature is invalid. */
async function readSessionId(request: Request): Promise<string | null> {
  const value: unknown = await sessionCookie.parse(request.headers.get("Cookie"));
  return typeof value === "string" && value !== "" ? value : null;
}

/**
 * Stores the token from a successful login in Redis under a new session id and
 * returns the `Set-Cookie` header value. Any session already on the request is
 * deleted first, so a login always gets a fresh id (prevents session fixation).
 */
export async function createUserSession(
  request: Request,
  auth: OtpVerifyResult,
): Promise<string> {
  const redis = await getRedis();

  const previousId = await readSessionId(request);
  if (previousId) await redis.del(sessionKey(previousId));

  const sessionId = randomBytes(32).toString("base64url");
  const now = Date.now();
  const session: UserSession = {
    profileId: auth.profileId,
    identifier: auth.identifier,
    accessToken: auth.accessToken,
    tokenType: auth.tokenType,
    tokenExpiresAt: new Date(now + auth.expiresIn * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
  };

  await redis.set(sessionKey(sessionId), JSON.stringify(session), {
    expiration: {
      type: "EX",
      value: Math.min(serverEnv.SESSION_TTL_SECONDS, auth.expiresIn),
    },
  });

  return sessionCookie.serialize(sessionId);
}

/**
 * Resolves the request's session, including the access token. Server-only.
 * Returns null for guests, tampered cookies and expired sessions.
 */
export async function getUserSession(request: Request): Promise<UserSession | null> {
  const sessionId = await readSessionId(request);
  if (!sessionId) return null;

  const redis = await getRedis();
  const raw = await redis.get(sessionKey(sessionId));
  return raw ? (JSON.parse(raw) as UserSession) : null;
}

/** Deletes the session from Redis and returns a `Set-Cookie` header that clears the cookie. */
export async function destroyUserSession(request: Request): Promise<string> {
  const sessionId = await readSessionId(request);
  if (sessionId) {
    const redis = await getRedis();
    await redis.del(sessionKey(sessionId));
  }
  return sessionCookie.serialize("", { maxAge: 0 });
}
