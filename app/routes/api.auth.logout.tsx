import type { ActionFunctionArgs } from "@remix-run/node";

import { destroyUserSession } from "~/utils/session.server";

/**
 * Resource route: signs the shopper out by deleting their Redis session and
 * clearing the session cookie. Remix revalidates the root loader afterwards,
 * so the header flips back to the guest state.
 */
export async function action({ request }: ActionFunctionArgs) {
  return Response.json(
    { ok: true as const },
    { headers: { "Set-Cookie": await destroyUserSession(request) } },
  );
}
