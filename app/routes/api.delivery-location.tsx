import type { ActionFunctionArgs } from "@remix-run/node";

import AddressServer from "~/actions/address.server";
import { serializeDeliveryLocationId } from "~/utils/delivery-location.server";

/**
 * Resource route: persists the shopper's chosen delivery location as a
 * cookie so every loader — on this page and every page loaded after —
 * can read it and filter its data accordingly. See
 * `~/utils/delivery-location.server` for why this is a cookie and not
 * client-side state.
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locationId = formData.get("locationId");

  if (typeof locationId !== "string" || locationId.trim() === "") {
    return Response.json({ error: "locationId is required" }, { status: 400 });
  }

  const { addresses } = await AddressServer.listAddresses("profile_seed_1"); // TODO: use real profileId from session or cookie
  const isKnownLocation = addresses.some((address) => address.id === locationId);
  if (!isKnownLocation) {
    return Response.json({ error: "Unknown location" }, { status: 400 });
  }

  return Response.json(
    { ok: true, locationId },
    { headers: { "Set-Cookie": await serializeDeliveryLocationId(locationId) } },
  );
}
