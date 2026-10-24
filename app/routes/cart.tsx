import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import CartServer, { type Cart } from "~/actions/cart.server";
import CartItem from "~/components/CartItem";
import OrderSummary from "~/components/OrderSummary";
import { getCartId } from "~/utils/cart-session.server";

export const meta: MetaFunction = () => [
  { title: "Shopping Cart · Morhaat" },
  { name: "description", content: "Your Morhaat shopping cart." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const cart = await CartServer.getCart(await getCartId(request));
  return Response.json({ cart });
}

export default function CartPage() {
  const { cart } = useLoaderData<{ cart: Cart }>();

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link
          to="/"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Continue Shopping
        </Link>
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
              {cart.lines.map((line) => (
                <li key={line.skuId}>
                  <CartItem line={line} />
                </li>
              ))}
            </ul>
          </section>

          <OrderSummary
            subtotal={cart.subtotal}
            shipping={cart.shipping}
            tax={cart.tax}
            total={cart.total}
          />
        </div>
      </div>
    </div>
  );
}
