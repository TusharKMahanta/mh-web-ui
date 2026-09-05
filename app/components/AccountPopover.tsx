import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { UserIcon } from '@heroicons/react/24/outline'

export default function AccountPopover() {
  return (
    <Popover className="flex">
      <PopoverButton className="-m-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none data-open:text-gray-500">
        <span className="sr-only">Account</span>
        <UserIcon aria-hidden="true" className="size-6" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom end"
        className="z-30 w-56 rounded-lg bg-white p-2 text-sm text-gray-700 shadow-lg ring-1 ring-black/5 transition [--anchor-gap:0.75rem] data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
      >
        <div className="border-b border-gray-100 px-3 py-2">
          <p className="font-medium text-gray-900">Guest</p>
          <p className="text-xs text-gray-500">You are not signed in</p>
        </div>
        <div className="py-1">
          <a href="/history" className="block rounded-md px-3 py-2 hover:bg-gray-50">
            Order history
          </a>
          <a href="/address" className="block rounded-md px-3 py-2 hover:bg-gray-50">
            Addresses
          </a>
        </div>
        <div className="border-t border-gray-100 py-1">
          <button type="button" className="block w-full rounded-md px-3 py-2 text-left hover:bg-gray-50">
            Sign in
          </button>
          <button
            type="button"
            className="block w-full rounded-md px-3 py-2 text-left font-medium text-indigo-600 hover:bg-gray-50"
          >
            Create an account
          </button>
        </div>
      </PopoverPanel>
    </Popover>
  )
}
