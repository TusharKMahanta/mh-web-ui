/**
 * SKU service — the data layer for product search and SKU detail pages.
 *
 * Talks to the store service's SKU endpoints:
 *   GET ${STORE_API_BASE_URL}/skus?q=&limit=&offset=  → SkuListResponse
 *   GET ${STORE_API_BASE_URL}/skus/:skuId              → { data: Sku } | 404
 *
 * Shapes are modelled as the REST contract: stable string ids, money in minor
 * units with an ISO-4217 currency, and a paginated list response. Swapping
 * the backend means rewriting only the bodies below.
 */

import { serverEnv } from "~/config/env.server";

export interface Money {
  /** Amount in minor units (e.g. paise/cents). */
  amount: number;
  /** ISO-4217 currency code, e.g. "INR". */
  currency: string;
}

export interface Sku {
  id: string;
  slug: string;
  name: string;
  description: string;
  storeId: string;
  color: string | null;
  price: Money;
  imageSrc: string;
  imageAlt: string;
  inStock: boolean;
}

export interface SkuListResponse {
  data: Sku[];
  total: number;
  limit: number;
  offset: number;
}

export interface SkuSearchQuery {
  /** Free-text filter typed by the shopper. */
  q: string;
  limit?: number;
  offset?: number;
}

class HttpError extends Error {
  constructor(
    readonly url: string,
    readonly status: number,
    statusText: string,
  ) {
    super(`GET ${url} failed: ${status} ${statusText}`);
    this.name = "HttpError";
  }
}

async function getJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.API_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new HttpError(url, res.status, res.statusText);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/** Search SKUs matching `q`. Returns one page of results plus the total. */
async function searchSkus({
  q,
  limit = 24,
  offset = 0,
}: SkuSearchQuery): Promise<SkuListResponse> {
  const query = new URLSearchParams({
    q,
    limit: String(limit),
    offset: String(offset),
  });
  return getJson<SkuListResponse>(`${serverEnv.STORE_API_BASE_URL}/skus?${query}`);
}

/** Look up a single SKU. Returns `null` when it does not exist. */
async function getSku(skuId: string): Promise<Sku | null> {
  const url = `${serverEnv.STORE_API_BASE_URL}/skus/${encodeURIComponent(skuId)}`;
  try {
    const body = await getJson<{ data: Sku }>(url);
    return body.data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}

const SkuServer = {
  searchSkus,
  getSku,
};

export default SkuServer;
