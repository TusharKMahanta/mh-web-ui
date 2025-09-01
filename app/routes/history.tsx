export default function History() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Your History Book</h1>
      <p className="text-gray-600">Your History Book is currently empty.</p>
      <a href="/" className="mt-4 text-blue-500 hover:underline">
        Continue Shopping
      </a>
    </div>
  );
}