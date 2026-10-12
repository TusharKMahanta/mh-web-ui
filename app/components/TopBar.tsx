import { useState } from "react";
import { Button } from "@headlessui/react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Logo from '~/components/Logo'

import type { Address} from '~/actions/address.server'
import DeliveryModal from "~/components/DeliveryModal";
import LoginModal from "~/components/LoginModal";
import SearchCombobox from "~/components/SearchCombobox";
import type { SessionUser } from "~/utils/session.server";

interface TopBarProps {
  deliveryLocations?: Address[];
  /** Id persisted in the `delivery_location_id` cookie, if the shopper has picked one. */
  selectedDeliveryLocationId?: string | null;
  /** Signed-in user, or null for guests. */
  user?: SessionUser | null;
}

export default function TopBar({
  deliveryLocations = [],
  selectedDeliveryLocationId = null,
  user = null,
}: TopBarProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const selectedLocation =
    deliveryLocations.find((location) => location.id === selectedDeliveryLocationId) ??
    deliveryLocations.find((location) => location.isDefault) ??
    deliveryLocations[0];

  return (
    <div className="bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="flex items-center" />
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <SearchCombobox className="w-[32rem]" />
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
          {user ? (
            <span className="max-w-[12rem] truncate text-sm font-medium text-gray-800">
              {user.identifier}
            </span>
          ) : (
            <Button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="text-sm font-medium text-gray-700 hover:text-gray-800 bg-orange-300 hover:bg-gray-200 px-3 py-2 rounded-md"
            >
              Login/ Signup
            </Button>
          )}
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
