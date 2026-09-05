import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'

import type { NavigationCategory } from '~/actions/navigation.server'

export default function MegaMenu({
  category,
  categoryIdx,
}: {
  category: NavigationCategory
  categoryIdx: number
}) {
  return (
    <Popover className="flex">
      <div className="relative flex">
        <PopoverButton className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-open:text-indigo-600">
          {category.name}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
          />
        </PopoverButton>
      </div>
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      >
        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
        <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
        <div className="relative bg-white">
          <div className="mx-auto max-w-7xl px-8">
            <div className="grid grid-cols-2 items-start gap-x-8 gap-y-10 pt-10 pb-12">
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                <div>
                  <p id={`desktop-featured-heading-${categoryIdx}`} className="font-medium text-gray-900">
                    Featured
                  </p>
                  <ul
                    role="list"
                    aria-labelledby={`desktop-featured-heading-${categoryIdx}`}
                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                  >
                    {category.featured.map((item) => (
                      <li key={item.name} className="flex">
                        <a href={item.href} className="hover:text-gray-800">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p id="desktop-categories-heading" className="font-medium text-gray-900">
                    Categories
                  </p>
                  <ul
                    role="list"
                    aria-labelledby="desktop-categories-heading"
                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                  >
                    {category.categories.map((item) => (
                      <li key={item.name} className="flex">
                        <a href={item.href} className="hover:text-gray-800">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                <div>
                  <p id="desktop-collection-heading" className="font-medium text-gray-900">
                    Collection
                  </p>
                  <ul
                    role="list"
                    aria-labelledby="desktop-collection-heading"
                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                  >
                    {category.collection.map((item) => (
                      <li key={item.name} className="flex">
                        <a href={item.href} className="hover:text-gray-800">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p id="desktop-brand-heading" className="font-medium text-gray-900">
                    Brands
                  </p>
                  <ul
                    role="list"
                    aria-labelledby="desktop-brand-heading"
                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                  >
                    {category.brands.map((item) => (
                      <li key={item.name} className="flex">
                        <a href={item.href} className="hover:text-gray-800">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
