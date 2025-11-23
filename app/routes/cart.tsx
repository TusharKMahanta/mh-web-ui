import { useState } from "react";
import CartItem from "~/components/CartItem";
import OrderSummary from "~/components/OrderSummary";

// Mock data
const INITIAL_CART_ITEMS = [
  {
    id: "1",
    title: "Basic Tee",
    price: 32.0,
    image: "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg",
    quantity: 1,
  },
  {
    id: "2",
    title: "Nomad Tumbler",
    price: 35.0,
    image: "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg",
    quantity: 2,
  },
  {
    id: "3",
    title: "Everyday Ruck Snack",
    price: 220.0,
    image: "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg",
    quantity: 1,
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
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