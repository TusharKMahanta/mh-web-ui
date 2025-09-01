export default function Cart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <p className="text-gray-600">Your cart is currently empty.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Continue Shopping
      </a>
    </div>
  );
}