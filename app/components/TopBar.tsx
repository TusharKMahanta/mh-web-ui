import { Button } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface TopBarProps {
  onLoginClick?: () => void;
  onSearch?: (query: string) => void;
}

export default function TopBar({ onLoginClick, onSearch }: TopBarProps) {
  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    onSearch?.(typeof query === "string" ? query.trim() : "");
  }

  return (
    <div className="bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
          <form role="search" onSubmit={handleSearchSubmit} className="relative flex items-center">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400"
            />
            <input
              type="search"
              name="q"
              aria-label="Search products"
              placeholder="Search products"
              className="w-[32rem] rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none"
            />
          </form>
          <span aria-hidden="true" className="h-8 w-px bg-gray-600" />
          <Button
            type="button"
            onClick={onLoginClick}
            className="text-sm font-medium text-gray-700 hover:text-gray-800 bg-orange-300 hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            Login/ Signup
          </Button>
        </div>
      </div>
    </div>
  )
}
