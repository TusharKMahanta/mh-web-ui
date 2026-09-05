import { Fragment } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import type { NavigationResponse } from '~/actions/navigation.server'

export default function MobileMenu({
  open,
  onClose,
  navigation,
}: {
  open: boolean
  onClose: (open: boolean) => void
  navigation: NavigationResponse
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-40 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
      />
      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <div className="flex px-4 pt-5 pb-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* Links */}
          <TabGroup className="mt-2">
            <div className="border-b border-gray-200">
              <TabList className="-mb-px flex space-x-8 px-4">
                {navigation.categories.map((category) => (
                  <Tab
                    key={category.name}
                    className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                  >
                    {category.name}
                  </Tab>
                ))}
              </TabList>
            </div>
            <TabPanels as={Fragment}>
              {navigation.categories.map((category, categoryIdx) => (
                <TabPanel key={category.name} className="space-y-12 px-4 pt-10 pb-6">
                  <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                      <div>
                        <p id={`mobile-featured-heading-${categoryIdx}`} className="font-medium text-gray-900">
                          Featured
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`mobile-featured-heading-${categoryIdx}`}
                          className="mt-6 space-y-6"
                        >
                          {category.featured.map((item) => (
                            <li key={item.name} className="flex">
                              <a href={item.href} className="text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p id="mobile-categories-heading" className="font-medium text-gray-900">
                          Categories
                        </p>
                        <ul role="list" aria-labelledby="mobile-categories-heading" className="mt-6 space-y-6">
                          {category.categories.map((item) => (
                            <li key={item.name} className="flex">
                              <a href={item.href} className="text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10">
                      <div>
                        <p id="mobile-collection-heading" className="font-medium text-gray-900">
                          Collection
                        </p>
                        <ul role="list" aria-labelledby="mobile-collection-heading" className="mt-6 space-y-6">
                          {category.collection.map((item) => (
                            <li key={item.name} className="flex">
                              <a href={item.href} className="text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p id="mobile-brand-heading" className="font-medium text-gray-900">
                          Brands
                        </p>
                        <ul role="list" aria-labelledby="mobile-brand-heading" className="mt-6 space-y-6">
                          {category.brands.map((item) => (
                            <li key={item.name} className="flex">
                              <a href={item.href} className="text-gray-500">
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            {navigation.pages.map((page) => (
              <div key={page.name} className="flow-root">
                <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                  {page.name}
                </a>
              </div>
            ))}
          </div>

          <div className="space-y-6 border-t border-gray-200 px-4 py-6">
            <div className="flow-root">
              <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                Create an account
              </a>
            </div>
            <div className="flow-root">
              <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                Sign in
              </a>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
