import type { Address } from "~/actions/address.server";

export default function AddressCard({ address }: { address: Address }) {
  return (
    <div className="relative h-full rounded-lg border border-gray-200 bg-white p-5">
      {address.isDefault ? (
        <span className="absolute right-4 top-4 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          Default
        </span>
      ) : null}

      <p className="pr-16 text-sm font-semibold text-gray-900">
        {address.fullName}
      </p>

      <address className="mt-2 space-y-0.5 text-sm not-italic text-gray-600">
        <span className="block">{address.line1}</span>
        {address.line2 ? (
          <span className="block">{address.line2}</span>
        ) : null}
        <span className="block">
          {address.city}, {address.state} {address.postalCode}
        </span>
        <span className="block">{address.country}</span>
        <span className="block pt-1 text-gray-500">{address.phone}</span>
      </address>
    </div>
  );
}
