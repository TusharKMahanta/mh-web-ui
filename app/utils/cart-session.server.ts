/**
 * Cart cookie.
 *
 * The shopping cart lives server-side (in Redis, via `~/actions/cart.server`)
 * under a random cart id. The browser only holds that id in a signed,
 * httpOnly `cart_id` cookie — the same BFF pattern as the login session in
 * `~/utils/session.server`, but independent of it, so guests can build a cart
 * and signing in or out never loses it.
 *
 *   1. The first "Add to bag" submits to the `api.cart` resource route, which
 *      creates a cart and sets this cookie.
 *   2. Every later request → loaders/actions call `getCartId(request)` and pass
 *      the id into `CartServer`.
 */

import { createCookie } from "@remix-run/node";

import { serverEnv } from "~/config/env.server";

/** How long an untouched cart (and its cookie) survives. Matches the Redis TTL. */
export const CART_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const cartCookie = createCookie("cart_id", {
  path: "/",
  httpOnly: true,
  secure: !serverEnv.isDevelopment,
  sameSite: "lax",
  secrets: [serverEnv.SESSION_SECRET],
  maxAge: CART_TTL_SECONDS,
});

/** Reads the cart id from the request; null if absent or the signature is invalid. */
export async function getCartId(request: Request): Promise<string | null> {
  const value: unknown = await cartCookie.parse(request.headers.get("Cookie"));
  return typeof value === "string" && value !== "" ? value : null;
}

/** Builds the `Set-Cookie` header value that persists a cart id. */
export async function serializeCartId(cartId: string): Promise<string> {
  return cartCookie.serialize(cartId);
}
