import type { ActionFunctionArgs } from "@remix-run/node";

import CartServer, { CartError } from "~/actions/cart.server";
import { getCartId, serializeCartId } from "~/utils/cart-session.server";

/** Response body of every cart mutation; consumed by `useFetcher` in the UI. */
export type CartActionData = { ok: true } | { ok: false; error: string };

const MAX_SKU_ID_LENGTH = 128;

function fail(status: number, error: string) {
  return Response.json({ ok: false, error } satisfies CartActionData, { status });
}

/**
 * Resource route: every cart mutation (add / update quantity / remove) posts
 * here. Remix revalidates all loaders on the page after a fetcher submission,
 * so the header badge and the cart page pick up the change on their own.
 * The cart id travels in the `cart_id` cookie — see
 * `~/utils/cart-session.server`.
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const skuId = formData.get("skuId");
  const rawQuantity = formData.get("quantity");

  if (typeof skuId !== "string" || skuId.trim() === "" || skuId.length > MAX_SKU_ID_LENGTH) {
    return fail(400, "skuId is required");
  }

  const quantity = typeof rawQuantity === "string" ? Number(rawQuantity) : NaN;
  const cartId = await getCartId(request);

  try {
    let id = cartId;
    switch (intent) {
      case "add": {
        const addQuantity = rawQuantity === null ? 1 : quantity;
        if (!Number.isInteger(addQuantity) || addQuantity < 1) {
          return fail(400, "quantity must be a positive integer");
        }
        ({ cartId: id } = await CartServer.addItem(cartId, skuId, addQuantity));
        break;
      }
      case "update":
        if (!Number.isInteger(quantity) || quantity < 0) {
          return fail(400, "quantity must be a non-negative integer");
        }
        if (!cartId) return fail(404, "Your cart is empty.");
        await CartServer.updateQuantity(cartId, skuId, quantity);
        break;
      case "remove":
        if (!cartId) return fail(404, "Your cart is empty.");
        await CartServer.removeItem(cartId, skuId);
        break;
      default:
        return fail(400, "intent must be one of add, update, remove");
    }

    // Re-issue the cookie on every write so its expiry slides with the cart's.
    return Response.json({ ok: true } satisfies CartActionData, {
      headers: id ? { "Set-Cookie": await serializeCartId(id) } : undefined,
    });
  } catch (error) {
    if (error instanceof CartError) return fail(error.status, error.message);
    throw error;
  }
}
