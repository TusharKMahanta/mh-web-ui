import { useState } from "react";
import { Button } from "@headlessui/react";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Logo from '~/components/Logo'

import type { DeliveryLocation } from "~/actions/delivery.server";
import DeliveryModal from "~/components/DeliveryModal";
import LoginModal from "~/components/LoginModal";

interface TopBarProps {
  deliveryLocations?: DeliveryLocation[];
  onSearch?: (query: string) => void;
}

export default function TopBar({ deliveryLocations = [], onSearch }: TopBarProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const selectedLocation =
    deliveryLocations.find((location) => location.isDefault) ?? deliveryLocations[0];

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    onSearch?.(typeof query === "string" ? query.trim() : "");
  }

  return (
    <div className="bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="flex items-center" />
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
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
          <button
            type="button"
            onClick={() => setDeliveryOpen(true)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-gray-100"
          >
            <MapPinIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-gray-500" />
            <span className="leading-tight">
              <span className="block text-xs text-gray-500">
                {selectedLocation
                  ? `Deliver to ${selectedLocation.recipientName.split(" ")[0]}`
                  : "Select a location"}
              </span>
              <span className="block text-sm font-semibold text-gray-800">
                {selectedLocation
                  ? `${selectedLocation.city} ${selectedLocation.postalCode}`
                  : "Choose your location"}
              </span>
            </span>
          </button>
          <span aria-hidden="true" className="h-8 w-px bg-gray-600" />
          <Button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="text-sm font-medium text-gray-700 hover:text-gray-800 bg-orange-300 hover:bg-gray-200 px-3 py-2 rounded-md"
          >
            Login/ Signup
          </Button>
        </div>
      </div>

      <DeliveryModal
        open={deliveryOpen}
        onClose={setDeliveryOpen}
        locations={deliveryLocations}
        selectedId={selectedLocation?.id}
      />
      <LoginModal open={loginOpen} onClose={setLoginOpen} />
    </div>
  )
}
