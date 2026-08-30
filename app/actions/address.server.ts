/**
 * Address service — the mock data layer for saved delivery addresses.
 *
 * Shapes are modelled as if they came from a REST backend: stable string ids,
 * ISO-8601 date strings, and a list response that can grow pagination/filtering
 * later. The in-memory `addresses` array stands in for a database table.
 * Swapping in a real API means rewriting only the bodies of the functions below.
 */

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export interface AddressListResponse {
  addresses: Address[];
  total: number;
}

export interface CreateAddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type AddressFieldErrors = Partial<
  Record<keyof CreateAddressInput, string>
>;

const REQUIRED_FIELDS: ReadonlyArray<keyof CreateAddressInput> = [
  "fullName",
  "phone",
  "line1",
  "city",
  "state",
  "postalCode",
  "country",
];

// In-memory store standing in for a `addresses` database table. Seeded with one
// row so the list has something to render on first load.
const addresses: Address[] = [
  {
    id: "adr_seed_1",
    fullName: "Tushar Mahanta",
    phone: "+91 98765 43210",
    line1: "12 MG Road",
    line2: "Near City Mall",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
    isDefault: true,
    createdAt: "2026-01-15T09:30:00.000Z",
  },
];

/**
 * Server-side validation of a create request. Returns a map of field name to
 * error message; an empty object means the input is valid.
 */
export function validateAddressInput(
  input: Partial<CreateAddressInput>,
): AddressFieldErrors {
  const errors: AddressFieldErrors = {};

  for (const field of REQUIRED_FIELDS) {
    const value = input[field];
    if (typeof value !== "string" || value.trim() === "") {
      errors[field] = "This field is required.";
    }
  }

  if (
    !errors.phone &&
    typeof input.phone === "string" &&
    input.phone.replace(/\D/g, "").length < 7
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (
    !errors.postalCode &&
    typeof input.postalCode === "string" &&
    !/^[A-Za-z0-9 -]{3,12}$/.test(input.postalCode.trim())
  ) {
    errors.postalCode = "Enter a valid postal code.";
  }

  return errors;
}

async function listAddresses(): Promise<AddressListResponse> {
  const sorted = [...addresses].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
  return { addresses: sorted, total: sorted.length };
}

async function createAddress(input: CreateAddressInput): Promise<Address> {
  const line2 = input.line2?.trim();
  const makeDefault = Boolean(input.isDefault) || addresses.length === 0;

  const address: Address = {
    id: `adr_${crypto.randomUUID()}`,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    line1: input.line1.trim(),
    line2: line2 ? line2 : null,
    city: input.city.trim(),
    state: input.state.trim(),
    postalCode: input.postalCode.trim(),
    country: input.country.trim(),
    isDefault: makeDefault,
    createdAt: new Date().toISOString(),
  };

  if (makeDefault) {
    for (const existing of addresses) existing.isDefault = false;
  }

  addresses.push(address);
  return address;
}

const AddressServer = {
  listAddresses,
  createAddress,
};

export default AddressServer;
