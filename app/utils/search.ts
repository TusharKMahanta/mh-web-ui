import type { Sku } from "~/actions/sku.server";

/** Minimum trimmed query length before typeahead suggestions are fetched. */
export const SUGGEST_MIN_CHARS = 2;

/** Slim SKU projection returned by `/api/search/suggest`. */
export type SkuSuggestion = Pick<Sku, "id" | "name" | "imageSrc" | "imageAlt" | "price">;

export interface SuggestResponse {
  suggestions: SkuSuggestion[];
}
