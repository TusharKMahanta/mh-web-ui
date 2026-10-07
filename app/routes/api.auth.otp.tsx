import type { ActionFunctionArgs } from "@remix-run/node";

import AuthServer, { InvalidOtpError } from "~/actions/auth.server";

/**
 * Resource route backing the OTP login flow in `LoginModal`: two actions
 * multiplexed on `intent`, request a code for an identifier, then verify it.
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "request") {
    const identifier = formData.get("identifier");
    if (typeof identifier !== "string") {
      return Response.json({ error: "identifier is required" }, { status: 400 });
    }
    const fieldError = AuthServer.validateIdentifier(identifier);
    if (fieldError) {
      return Response.json({ error: fieldError }, { status: 400 });
    }
    const result = await AuthServer.requestOtp(identifier);
    return Response.json(result);
  }

  if (intent === "verify") {
    const requestId = formData.get("requestId");
    const otp = formData.get("otp");
    if (typeof requestId !== "string" || typeof otp !== "string" || otp.trim() === "") {
      return Response.json({ error: "requestId and otp are required" }, { status: 400 });
    }
    try {
      const result = await AuthServer.verifyOtp(requestId, otp);
      return Response.json({ ok: true as const, ...result });
    } catch (error) {
      if (error instanceof InvalidOtpError) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
  }

  return Response.json({ error: "Unknown intent" }, { status: 400 });
}
