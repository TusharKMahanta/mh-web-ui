/**
 * Cart service — the mock data layer for the shopping cart.
 *
 * Shapes are modelled as if they came from a REST backend: stable string ids
 * and a list response that can grow later (server-computed totals, promotions,
 * pagination). The in-memory `CART_ITEMS` array stands in for the persisted
 * cart. Swapping in a real API means rewriting only the bodies below.
 *
 * Money convention: `price` is in major currency units (USD, 2 decimal places).
 * A real backend would likely switch this to integer minor units.
 *
 * NOTE: subtotal / shipping / tax / total are still computed in the route
 * (`app/routes/cart.tsx`) because they update live as quantities change on the
 * client. Moving that math here is a follow-up once the cart has real
 * server-side mutations.
 */

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

// In-memory store standing in for the persisted cart.
const CART_ITEMS: CartItem[] = [
  {
    id: "1",
    title: "Basic Tee",
    price: 32.0,
    image:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
    quantity: 1,
  },
  {
    id: "2",
    title: "Nomad Tumbler",
    price: 35.0,
    image:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-01-product-02.jpg",
    quantity: 2,
  },
  {
    id: "3",
    title: "Everyday Ruck Snack",
    price: 220.0,
    image:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/shopping-cart-page-01-product-03.jpg",
    quantity: 1,
  },
];

async function getCart(): Promise<CartResponse> {
  const items = CART_ITEMS.map((item) => ({ ...item }));
  return { items, total: items.length };
}

const CartServer = {
  getCart,
};

export default CartServer;
