/**
 * Auth service — the mock data layer for OTP login. There is no SMS/email
 * provider wired up yet, so `requestOtp` generates the code itself instead of
 * dispatching it; `devOtp` stands in for that delivery channel and is only
 * ever populated outside production. Swapping in a real API means rewriting
 * only the bodies of the functions below.
 *
 * Pending OTP requests live in Redis (not process memory) so login works across
 * multiple server instances and restarts. Each request is one key with a TTL —
 * Redis enforces expiry — plus an attempts counter key with the same TTL.
 */
import { timingSafeEqual } from "node:crypto";

import { serverEnv } from "~/config/env.server";
import { getRedis, redisKey } from "~/config/redis.server";

export interface OtpRequestResult {
  requestId: string;
  identifier: string;
  /** ISO-8601 timestamp; verification fails once this has passed. */
  expiresAt: string;
  /** The generated code — present only when `serverEnv.isDevelopment`. */
  devOtp?: string;
}

export interface OtpVerifyResult {
  profileId: string;
  identifier: string;
}

interface PendingOtpRequest {
  identifier: string;
  otp: string;
}

export class InvalidOtpError extends Error {}

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;

const otpKey = (requestId: string) => redisKey("otp", requestId);
const attemptsKey = (requestId: string) => redisKey("otp", requestId, "attempts");

function otpMatches(expected: string, actual: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function validateIdentifier(identifier: string): string | null {
  const trimmed = identifier.trim();
  if (!trimmed) return "Enter a phone number or email id.";
  if (EMAIL_RE.test(trimmed)) return null;
  if (PHONE_RE.test(trimmed.replace(/[\s-]/g, ""))) return null;
  return "Enter a valid phone number or email id.";
}

function generateOtp(): string {
  return String(Math.floor(Math.random() * 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
}

async function requestOtp(identifier: string): Promise<OtpRequestResult> {
  const trimmed = identifier.trim();
  const requestId = `otp_${crypto.randomUUID()}`;
  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  const pending: PendingOtpRequest = { identifier: trimmed, otp };
  const redis = await getRedis();
  await redis.set(otpKey(requestId), JSON.stringify(pending), {
    expiration: { type: "PX", value: OTP_TTL_MS },
  });

  // Stand-in for an SMS/email provider call.
  // eslint-disable-next-line no-console
  console.info(`[auth.server] OTP for ${trimmed}: ${otp}`);

  return {
    requestId,
    identifier: trimmed,
    expiresAt: new Date(expiresAt).toISOString(),
    devOtp: serverEnv.isDevelopment ? otp : undefined,
  };
}

async function verifyOtp(requestId: string, otp: string): Promise<OtpVerifyResult> {
  const redis = await getRedis();
  const expired = () =>
    new InvalidOtpError("This OTP request has expired. Request a new code.");

  // A missing key covers both TTL expiry and an already-redeemed code.
  const raw = await redis.get(otpKey(requestId));
  if (!raw) throw expired();
  const pending = JSON.parse(raw) as PendingOtpRequest;

  if (!otpMatches(pending.otp, otp.trim())) {
    // INCR is atomic, so concurrent wrong guesses across instances are all counted.
    const [attempts] = await redis
      .multi()
      .incr(attemptsKey(requestId))
      .pExpire(attemptsKey(requestId), OTP_TTL_MS)
      .exec();
    if (Number(attempts) >= MAX_ATTEMPTS) {
      await redis.del([otpKey(requestId), attemptsKey(requestId)]);
      throw new InvalidOtpError("Too many incorrect attempts. Request a new code.");
    }
    throw new InvalidOtpError("Incorrect code. Please try again.");
  }

  // Only the request whose DEL actually removed the key may redeem the code;
  // a concurrent duplicate submission sees 0 and is treated as expired.
  const deleted = await redis.del(otpKey(requestId));
  await redis.del(attemptsKey(requestId));
  if (deleted === 0) throw expired();

  return {
    profileId: "profile_seed_1", // TODO: mint/resolve a real profile once a backend exists
    identifier: pending.identifier,
  };
}

const AuthServer = {
  validateIdentifier,
  requestOtp,
  verifyOtp,
};

export default AuthServer;
