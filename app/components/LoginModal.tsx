import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LoginModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
}

interface RequestOtpResponse {
  requestId: string;
  identifier: string;
  expiresAt: string;
  devOtp?: string;
}

interface VerifyOtpResponse {
  ok: true;
  profileId: string;
  identifier: string;
}

interface ErrorResponse {
  error: string;
}

const OTP_LENGTH = 6;
const EMPTY_OTP = Array<string>(OTP_LENGTH).fill("");
// Matches the Dialog's own `duration-200` close transition so state doesn't
// visibly reset to step 1 while the modal is still fading out.
const CLOSE_TRANSITION_MS = 200;

export default function LoginModal({ open, onClose }: LoginModalProps) {
  // Bumping this key gives each fetcher a fresh instance (no stale `.data`),
  // which is how we clear a previous request/error when the form resets.
  const [sessionKey, setSessionKey] = useState(0);
  const requestFetcher = useFetcher<RequestOtpResponse | ErrorResponse>({
    key: `login-request-${sessionKey}`,
  });
  const verifyFetcher = useFetcher<VerifyOtpResponse | ErrorResponse>({
    key: `login-verify-${sessionKey}`,
  });

  const [identifier, setIdentifier] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(EMPTY_OTP);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const requestError =
    requestFetcher.data && "error" in requestFetcher.data ? requestFetcher.data.error : null;
  const verifyError =
    verifyFetcher.data && "error" in verifyFetcher.data ? verifyFetcher.data.error : null;

  const isRequesting = requestFetcher.state !== "idle";
  const isVerifying = verifyFetcher.state !== "idle";

  // Move to the OTP step once the server hands back a requestId.
  useEffect(() => {
    if (requestFetcher.data && "requestId" in requestFetcher.data) {
      setRequestId(requestFetcher.data.requestId);
      setDevOtp(requestFetcher.data.devOtp ?? null);
      setDigits(EMPTY_OTP);
      requestAnimationFrame(() => inputRefs.current[0]?.focus());
    }
  }, [requestFetcher.data]);

  // Close the modal once the OTP is verified.
  useEffect(() => {
    if (verifyFetcher.data && "ok" in verifyFetcher.data) {
      onClose(false);
    }
  }, [verifyFetcher.data, onClose]);

  // Reset back to step 1 after the modal finishes closing, so reopening it
  // never shows a stale OTP screen or error.
  useEffect(() => {
    if (open) return;
    const timeout = setTimeout(() => {
      setIdentifier("");
      setRequestId(null);
      setDevOtp(null);
      setDigits(EMPTY_OTP);
      setSessionKey((key) => key + 1);
    }, CLOSE_TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  function handleIdentifierSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identifier.trim() || isRequesting) return;
    requestFetcher.submit(
      { intent: "request", identifier },
      { method: "post", action: "/api/auth/otp" },
    );
  }

  function handleChangeIdentifier() {
    setRequestId(null);
    setDevOtp(null);
    setDigits(EMPTY_OTP);
    setSessionKey((key) => key + 1);
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = [...EMPTY_OTP];
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleOtpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const otp = digits.join("");
    if (!requestId || otp.length !== OTP_LENGTH || isVerifying) return;
    verifyFetcher.submit(
      { intent: "verify", requestId, otp },
      { method: "post", action: "/api/auth/otp" },
    );
  }

  // onClose is a no-op so clicking the backdrop (or Esc) can't dismiss the
  // modal; it closes only via the explicit X button below.
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-md rounded-xl bg-white text-gray-900 shadow-xl transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          <div className="flex items-center justify-between rounded-t-xl bg-gray-100 px-5 py-3">
            <h2 className="text-lg font-bold">Login/ Sign up</h2>
            <button
              type="button"
              onClick={() => onClose(false)}
              className="rounded-md border border-gray-400 bg-white p-1 text-gray-600 hover:bg-gray-50"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-sm text-gray-500">Using OTP</p>
            <span aria-hidden="true" className="mt-2 block h-0.5 w-16 bg-orange-400" />

            {requestId === null ? (
              <form onSubmit={handleIdentifierSubmit} className="mt-6">
                <label htmlFor="login-identifier" className="sr-only">
                  Phone number or Email Id
                </label>
                <input
                  id="login-identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter Phone number/ Email Id"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                {requestError ? (
                  <p className="mt-2 text-sm text-red-600">{requestError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isRequesting || !identifier.trim()}
                  className="mt-6 w-full rounded-md bg-orange-400 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRequesting ? "Sending..." : "Continue"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="mt-6">
                <p className="text-sm text-gray-700">
                  Enter the {OTP_LENGTH}-digit code sent to{" "}
                  <span className="font-semibold">{identifier}</span>.{" "}
                  <button
                    type="button"
                    onClick={handleChangeIdentifier}
                    className="font-medium text-sky-600 hover:text-sky-700"
                  >
                    Change
                  </button>
                </p>

                {devOtp ? (
                  <p className="mt-1 text-xs text-gray-400">Dev hint: use code {devOtp}</p>
                ) : null}

                <div className="mt-4 flex justify-between gap-2">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(event) => handleDigitChange(index, event.target.value)}
                      onKeyDown={(event) => handleDigitKeyDown(index, event)}
                      onPaste={handlePaste}
                      aria-label={`OTP digit ${index + 1}`}
                      className="h-12 w-12 rounded-md border border-gray-300 text-center text-lg font-semibold text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  ))}
                </div>

                {verifyError ? (
                  <p className="mt-2 text-sm text-red-600">{verifyError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isVerifying || digits.join("").length !== OTP_LENGTH}
                  className="mt-6 w-full rounded-md bg-orange-400 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVerifying ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
