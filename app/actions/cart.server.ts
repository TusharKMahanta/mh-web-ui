/**
 * Cart service — the data layer for the shopping cart.
 *
 * There is no cart endpoint in the backend yet, so this module persists carts
 * in Redis itself: one hash per cart at `cart:<cartId>`, one field per SKU
 * whose value is a JSON `StoredLine` (a snapshot of the SKU taken at add time
 * plus the quantity). Every write slides the key's TTL forward. The cart id
 * reaches this module from the `cart_id` cookie (`~/utils/cart-session.server`).
 *
 * Shapes are modelled as the REST contract a real cart API would return:
 * stable string ids and money in minor units with an ISO-4217 currency (see
 * `Money` in `~/actions/sku.server`). Totals are computed here, never in the
 * UI. Swapping in a real backend means rewriting only the bodies below.
 *
 * Prices are always taken from the SKU service, never from the client.
 */

import { randomBytes } from "node:crypto";

import SkuServer, { type Money } from "~/actions/sku.server";
import { getRedis, redisKey } from "~/config/redis.server";
import { CART_TTL_SECONDS } from "~/utils/cart-session.server";

/** Upper bound on a single line's quantity. */
const MAX_LINE_QUANTITY = 10;
/** Currency of an empty cart's zero totals. */
const DEFAULT_CURRENCY = "INR";
/** Mock pricing rules until a pricing/checkout service exists. */
const FLAT_SHIPPING_MINOR = 5000; // 50.00 per non-empty cart
const TAX_RATE = 0.08;

export interface CartLine {
  skuId: string;
  storeId: string;
  name: string;
  color: string | null;
  imageSrc: string;
  imageAlt: string;
  unitPrice: Money;
  quantity: number;
  lineTotal: Money;
  /** Highest quantity the shopper may set for this line. */
  maxQuantity: number;
}

export interface Cart {
  /** Null when the shopper has no cart yet. */
  id: string | null;
  lines: CartLine[];
  /** Sum of line quantities — the header badge count. */
  itemCount: number;
  subtotal: Money;
  shipping: Money;
  tax: Money;
  total: Money;
}

export type CartErrorStatus = 400 | 404 | 409;

/** A rejected cart mutation. `status` maps directly onto the HTTP response. */
export class CartError extends Error {
  constructor(
    readonly status: CartErrorStatus,
    message: string,
  ) {
    super(message);
    this.name = "CartError";
  }
}

/** What is stored per line in Redis. Derived values (`lineTotal`) are not stored. */
interface StoredLine {
  skuId: string;
  storeId: string;
  name: string;
  color: string | null;
  imageSrc: string;
  imageAlt: string;
  unitPrice: Money;
  quantity: number;
  /** ISO-8601 timestamp — keeps lines in the order they were first added. */
  addedAt: string;
}

const cartKey = (cartId: string) => redisKey("cart", cartId);

const clampQuantity = (quantity: number) =>
  Math.min(Math.max(Math.trunc(quantity), 1), MAX_LINE_QUANTITY);

async function readLines(cartId: string): Promise<StoredLine[]> {
  const redis = await getRedis();
  const fields = await redis.hGetAll(cartKey(cartId));
  return Object.values(fields)
    .map((raw) => JSON.parse(raw) as StoredLine)
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt));
}

async function writeLine(cartId: string, line: StoredLine): Promise<void> {
  const redis = await getRedis();
  await redis
    .multi()
    .hSet(cartKey(cartId), line.skuId, JSON.stringify(line))
    .expire(cartKey(cartId), CART_TTL_SECONDS)
    .exec();
}

async function readLine(cartId: string, skuId: string): Promise<StoredLine | null> {
  const redis = await getRedis();
  const raw = await redis.hGet(cartKey(cartId), skuId);
  return raw ? (JSON.parse(raw) as StoredLine) : null;
}

function toCart(cartId: string | null, stored: StoredLine[]): Cart {
  const currency = stored[0]?.unitPrice.currency ?? DEFAULT_CURRENCY;
  const money = (amount: number): Money => ({ amount, currency });

  const lines: CartLine[] = stored.map((line) => ({
    skuId: line.skuId,
    storeId: line.storeId,
    name: line.name,
    color: line.color,
    imageSrc: line.imageSrc,
    imageAlt: line.imageAlt,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
    lineTotal: money(line.unitPrice.amount * line.quantity),
    maxQuantity: MAX_LINE_QUANTITY,
  }));

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal.amount, 0);
  const shipping = lines.length > 0 ? FLAT_SHIPPING_MINOR : 0;
  const tax = Math.round(subtotal * TAX_RATE);

  return {
    id: cartId,
    lines,
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: money(subtotal),
    shipping: money(shipping),
    tax: money(tax),
    total: money(subtotal + shipping + tax),
  };
}

/** The shopper's cart. An unknown or expired id yields an empty cart. */
async function getCart(cartId: string | null): Promise<Cart> {
  if (!cartId) return toCart(null, []);
  return toCart(cartId, await readLines(cartId));
}

/**
 * Adds `quantity` of a SKU, creating the cart when `cartId` is null. Adding a
 * SKU already in the cart increases its quantity (capped at the line maximum).
 */
async function addItem(
  cartId: string | null,
  skuId: string,
  quantity = 1,
): Promise<{ cartId: string; created: boolean }> {
  const sku = await SkuServer.getSku(skuId);
  if (!sku) throw new CartError(404, "This product no longer exists.");
  if (!sku.inStock) throw new CartError(409, `${sku.name} is out of stock.`);

  const id = cartId ?? randomBytes(32).toString("base64url");
  const lines = cartId ? await readLines(cartId) : [];

  const mixedCurrency = lines.some(
    (line) => line.unitPrice.currency !== sku.price.currency,
  );
  if (mixedCurrency) {
    throw new CartError(409, "This product can't be added to the same cart as your other items.");
  }

  const existing = lines.find((line) => line.skuId === sku.id);
  await writeLine(id, {
    skuId: sku.id,
    storeId: sku.storeId,
    name: sku.name,
    color: sku.color,
    imageSrc: sku.imageSrc,
    imageAlt: sku.imageAlt,
    unitPrice: sku.price,
    quantity: clampQuantity((existing?.quantity ?? 0) + quantity),
    addedAt: existing?.addedAt ?? new Date().toISOString(),
  });

  return { cartId: id, created: cartId === null };
}

/** Sets a line's quantity. A quantity of 0 or less removes the line. */
async function updateQuantity(
  cartId: string,
  skuId: string,
  quantity: number,
): Promise<void> {
  if (quantity <= 0) {
    await removeItem(cartId, skuId);
    return;
  }

  const line = await readLine(cartId, skuId);
  if (!line) throw new CartError(404, "That item is no longer in your cart.");

  await writeLine(cartId, { ...line, quantity: clampQuantity(quantity) });
}

/** Removes a line. Removing a line that isn't there is a no-op. */
async function removeItem(cartId: string, skuId: string): Promise<void> {
  const redis = await getRedis();
  await redis.hDel(cartKey(cartId), skuId);
}

const CartServer = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
};

export default CartServer;
