import type { LoaderFunctionArgs } from "@remix-run/node";

import SkuServer from "~/actions/sku.server";
import { SUGGEST_MIN_CHARS, type SkuSuggestion, type SuggestResponse } from "~/utils/search";

const SUGGEST_LIMIT = 8;

/**
 * Resource route: typeahead suggestions for the header search box.
 * `GET /api/search/suggest?q=…` → a slim projection of the top SKU matches.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < SUGGEST_MIN_CHARS) {
    return Response.json({ suggestions: [] } satisfies SuggestResponse);
  }

  const { data } = await SkuServer.searchSkus({ q, limit: SUGGEST_LIMIT });
  const suggestions: SkuSuggestion[] = data
    .slice(0, SUGGEST_LIMIT)
    .map(({ id, name, imageSrc, imageAlt, price }) => ({ id, name, imageSrc, imageAlt, price }));

  return Response.json({ suggestions } satisfies SuggestResponse, {
    headers: { "Cache-Control": "private, max-age=30" },
  });
}
