export default function TopBar() {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
          Get free delivery on orders over ₹100
        </p>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
          <a href="#" className="text-sm font-medium text-white hover:text-gray-100">
            Create an account
          </a>
          <span aria-hidden="true" className="h-6 w-px bg-gray-600" />
          <a href="#" className="text-sm font-medium text-white hover:text-gray-100">
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}
