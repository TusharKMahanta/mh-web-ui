/**
 * Store service — the mock data layer for individual store pages.
 *
 * Shapes are modelled as if they came from a REST backend: stable string ids,
 * a URL slug, and ISO-8601 date strings. The in-memory `STORES` array stands
 * in for a `stores` database table. Swapping in a real API means rewriting
 * only the bodies below.
 */

import { serverEnv } from "~/config/env.server";

export interface Store {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  isOpen: boolean;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  color: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  price: string;
}

export interface StoreResponse {
  store: Store;
}

export interface NearbyStore {
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export interface NearbyStoresQuery {
  lat: number;
  lng: number;
  radius: number;
}
/**
 * Stores within `radius` (km) of `lat`/`lng`. Fetches
 * `${STORE_API_BASE_URL}/stores?lat=&lng=&radius=` when USE_MOCK_DATA=false,
 * otherwise serves the in-memory fixture above.
 */
async function getStoresNearYou({
  lat,
  lng,
  radius,
}: NearbyStoresQuery): Promise<NearbyStore[]> {
   const query = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  });
  const url = `${serverEnv.STORE_API_BASE_URL}/stores?${query}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.API_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }
    const body = (await res.json()) as { data: NearbyStore[] };
    return body.data;
  } finally {
    clearTimeout(timeout);
  }
}

async function getProductsByStoreId(
  storeId: string
): Promise<Product[]> {
  const url = `${serverEnv.STORE_API_BASE_URL}/stores/${storeId}/products`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.API_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }
    const body = (await res.json()) as { data: Product[] };
    return body.data;
  } finally {
    clearTimeout(timeout);
  }
}
/**
 * Look up a single store by its id or its URL slug. Returns `null` when no
 * store matches so the route can render a 404.
 */
async function getStore(idOrSlug: string): Promise<Store | null> {
  const url = `${serverEnv.STORE_API_BASE_URL}/stores/${idOrSlug}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.API_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }
    const body = (await res.json()) as { data: Store };
    return body.data;
  } finally {
    clearTimeout(timeout);
  }
}

export interface ProductQuery {
  /**
   * Selected delivery-location id (from the `delivery_location_id` cookie —
   * see `~/utils/delivery-location.server`). Threaded through so a real
   * backend can filter by delivery availability/pricing for that address.
   * The mock catalog below ignores it and always returns everything.
   */
  addressId?: string | null;
}

const StoreServer = {
  getStore,
  getStoresNearYou,
  getProductsByStoreId,
};

export default StoreServer;
