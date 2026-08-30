import { useState } from "react";
import { useLoaderData } from "@remix-run/react";

import CartServer, { type CartItem as CartItemModel } from "~/actions/cart.server";
import CartItem from "~/components/CartItem";
import OrderSummary from "~/components/OrderSummary";

export async function loader() {
  const { items, total } = await CartServer.getCart();
  return Response.json({ items, total });
}

export default function Cart() {
  const { items } = useLoaderData<typeof loader>() as {
    items: CartItemModel[];
    total: number;
  };
  const [cartItems, setCartItems] = useState<CartItemModel[]>(items);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 5.0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <a
          href="/"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cartItems.map((item) => (
                <li key={item.id}>
                  <CartItem
                    {...item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                </li>
              ))}
            </ul>
          </section>

          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}