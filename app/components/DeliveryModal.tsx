import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import type { DeliveryLocation } from '~/actions/delivery.server'

interface DeliveryModalProps {
  open: boolean
  onClose: (open: boolean) => void
  locations: DeliveryLocation[]
  /** Id of the location currently delivering to, if any. */
  selectedId?: string
  onSelect?: (id: string) => void
}

function formatLocation(location: DeliveryLocation): string {
  const parts = [
    location.line1,
    location.line2,
    `${location.city} ${location.state} ${location.postalCode}`.toUpperCase(),
  ]
  return parts.filter(Boolean).join(', ')
}

export default function DeliveryModal({
  open,
  onClose,
  locations,
  selectedId,
  onSelect,
}: DeliveryModalProps) {
  const [activeId, setActiveId] = useState<string | undefined>(selectedId)

  function handleSelect(id: string) {
    setActiveId(id)
    onSelect?.(id)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Wiring the pincode lookup to the location service comes later.
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-md rounded-xl bg-white text-gray-900 shadow-xl transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
        >
          <div className="flex items-center justify-between rounded-t-xl bg-gray-100 px-5 py-3">
            <h2 className="text-lg font-bold">Choose your location</h2>
            <button
              type="button"
              onClick={() => onClose(false)}
              className="rounded-md border border-gray-400 bg-white p-1 text-gray-600 hover:bg-gray-50"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-sm text-gray-500">
              Select a delivery location to see product availability and delivery
              options
            </p>

            <ul className="mt-4 space-y-2">
              {locations.map((location) => {
                const isActive = location.id === activeId
                return (
                  <li key={location.id}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleSelect(location.id)}
                      className={`w-full rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                        isActive
                          ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-gray-700">
                        <span className="font-bold text-gray-900">
                          {location.recipientName}
                        </span>{' '}
                        {formatLocation(location)}
                      </span>
                      {location.isDefault ? (
                        <span className="mt-1 block font-semibold text-gray-500">
                          Default address
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>

            <a
              href="/address"
              className="mt-3 inline-block text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Add an address or pick-up point
            </a>

            <div className="relative my-4">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-500">
                  or enter an Indian pincode
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <label htmlFor="delivery-pincode" className="sr-only">
                Indian pincode
              </label>
              <input
                id="delivery-pincode"
                name="pincode"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                className="min-w-0 flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="rounded-full border border-gray-400 px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Apply
              </button>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
