import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface LoginModalProps {
  open: boolean
  onClose: (open: boolean) => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Wiring to the auth service comes later.
  }

  // onClose is a no-op so clicking the backdrop (or Esc) can't dismiss the
  // modal; it closes only via the explicit X button below.
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
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
            <h2 className="text-lg font-bold">Login/ Sign up</h2>
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
            <p className="text-sm text-gray-500">Using OTP</p>
            <span aria-hidden="true" className="mt-2 block h-0.5 w-16 bg-orange-400" />

            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="login-identifier" className="sr-only">
                Phone number or Email Id
              </label>
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="Enter Phone number/ Email Id"
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-orange-400 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-orange-400"
              >
                Continue
              </button>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
