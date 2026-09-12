import { useState } from 'react'
import { PopoverGroup } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon } from '@heroicons/react/24/outline'

import type { DeliveryLocation } from '~/actions/delivery.server'
import type { NavigationResponse } from '~/actions/navigation.server'
import AccountPopover from '~/components/AccountPopover'
import MegaMenu from '~/components/MegaMenu'
import MobileMenu from '~/components/MobileMenu'
import SearchLink from '~/components/SearchLink'
import TopBar from '~/components/TopBar'

export default function Header({
  navigation,
  deliveryLocations,
}: {
  navigation: NavigationResponse
  deliveryLocations: DeliveryLocation[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white">
      <MobileMenu open={open} onClose={setOpen} navigation={navigation} />

      <header className="relative">
        <nav aria-label="Top">
          <TopBar deliveryLocations={deliveryLocations} />

          {/* Secondary navigation */}
          <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="border-b border-gray-200">
                <div className="flex h-16 items-center justify-between">
                  

                  <div className="hidden h-full lg:flex">
                    {/* Mega menus */}
                    <PopoverGroup className="inset-x-0 bottom-0 px-4">
                      <div className="flex h-full justify-center space-x-8">
                        {navigation.categories.map((category, categoryIdx) => (
                          <MegaMenu key={category.name} category={category} categoryIdx={categoryIdx} />
                        ))}
                        {navigation.pages.map((page) => (
                          <a
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                          >
                            {page.name}
                          </a>
                        ))}
                      </div>
                    </PopoverGroup>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="-ml-2 rounded-md bg-white p-2 text-gray-400"
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>

                    <SearchLink className="ml-2 p-2 text-gray-400 hover:text-gray-500" />
                  </div>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="flex space-x-8">
                        <AccountPopover />
                      </div>

                      <span aria-hidden="true" className="mx-4 h-6 w-px bg-gray-200 lg:mx-6" />

                      <div className="flow-root">
                        <a href="/cart" className="group -m-2 flex items-center p-2">
                          <ShoppingCartIcon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                          <span className="sr-only">items in cart, view bag</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
