/**
 * Delivery service — the mock data layer for the header's "Choose your
 * location" picker.
 *
 * The saved locations are read from a JSON fixture (`data/delivery-locations.json`)
 * that stands in for a REST list response: stable string ids, one flag for the
 * default, and a shape that can grow pagination/filtering later. Swapping in a
 * real API means rewriting only the body of `listLocations`.
 */

import rawLocations from "./data/delivery-locations.json";

export interface DeliveryLocation {
  id: string;
  recipientName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface DeliveryLocationListResponse {
  locations: DeliveryLocation[];
  total: number;
}

const locations = rawLocations as DeliveryLocation[];

async function listLocations(): Promise<DeliveryLocationListResponse> {
  // Default first, then original order — mirrors how a backend would sort.
  const sorted = [...locations].sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0;
    return a.isDefault ? -1 : 1;
  });
  return { locations: sorted, total: sorted.length };
}

const DeliveryServer = {
  listLocations,
};

export default DeliveryServer;
