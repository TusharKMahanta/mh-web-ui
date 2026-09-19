/**
 * Delivery-location cookie.
 *
 * Which saved address (or pincode) the shopper is currently browsing under
 * needs to reach every loader that fetches address-filtered data — including
 * loaders for pages that haven't been visited yet — not just the components
 * currently on screen. A React state/context value can't do that: Remix
 * route loaders run server-side on every navigation, so the selection has to
 * travel in the request itself. A signed, persistent cookie is the seam:
 *
 *   1. Selecting a location submits to the `api.delivery-location` resource
 *      route, which sets this cookie.
 *   2. Any loader — now or added later — calls `getSelectedDeliveryLocationId`
 *      and passes the id into its service module as a filter.
 *   3. Remix revalidates every loader on the currently rendered route tree
 *      after that submission, so already-open pages pick up the change too.
 */

import { createCookie } from "@remix-run/node";

import { serverEnv } from "~/config/env.server";

export const deliveryLocationCookie = createCookie("delivery_location_id", {
  path: "/",
  sameSite: "lax",
  secrets: [serverEnv.SESSION_SECRET],
  maxAge: 60 * 60 * 24 * 365, // 1 year
});

/** Reads the selected delivery-location id out of the request, if any is set. */
export async function getSelectedDeliveryLocationId(
  request: Request,
): Promise<string | null> {
  const value: unknown = await deliveryLocationCookie.parse(
    request.headers.get("Cookie"),
  );
  return typeof value === "string" ? value : null;
}

/** Builds the `Set-Cookie` header value that persists a chosen location id. */
export async function serializeDeliveryLocationId(
  locationId: string,
): Promise<string> {
  return deliveryLocationCookie.serialize(locationId);
}
