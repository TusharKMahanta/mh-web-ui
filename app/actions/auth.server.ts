/**
 * Auth service — the mock data layer for OTP login. There is no SMS/email
 * provider wired up yet, so `requestOtp` generates the code itself instead of
 * dispatching it; `devOtp` stands in for that delivery channel and is only
 * ever populated outside production. Swapping in a real API means rewriting
 * only the bodies of the functions below.
 */
import { serverEnv } from "~/config/env.server";

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
  expiresAt: number;
  attemptsRemaining: number;
}

export class InvalidOtpError extends Error {}

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{7,15}$/;

// In-memory store standing in for an OTP/session table, keyed by requestId.
const pendingRequests = new Map<string, PendingOtpRequest>();

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

  pendingRequests.set(requestId, {
    identifier: trimmed,
    otp,
    expiresAt,
    attemptsRemaining: MAX_ATTEMPTS,
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
  const pending = pendingRequests.get(requestId);
  if (!pending) {
    throw new InvalidOtpError("This OTP request has expired. Request a new code.");
  }
  if (Date.now() > pending.expiresAt) {
    pendingRequests.delete(requestId);
    throw new InvalidOtpError("This code has expired. Request a new code.");
  }
  if (pending.attemptsRemaining <= 0) {
    pendingRequests.delete(requestId);
    throw new InvalidOtpError("Too many incorrect attempts. Request a new code.");
  }
  if (pending.otp !== otp.trim()) {
    pending.attemptsRemaining -= 1;
    throw new InvalidOtpError("Incorrect code. Please try again.");
  }

  pendingRequests.delete(requestId);
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
