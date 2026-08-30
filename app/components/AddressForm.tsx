import { Form } from "@remix-run/react";

import type {
  AddressFieldErrors,
  CreateAddressInput,
} from "~/actions/address.server";

interface AddressFormProps {
  errors?: AddressFieldErrors;
  values?: Partial<CreateAddressInput>;
  isSubmitting?: boolean;
}

type FieldName = Exclude<keyof CreateAddressInput, "isDefault">;

const FIELDS: ReadonlyArray<{
  name: FieldName;
  label: string;
  type?: string;
  autoComplete: string;
  optional?: boolean;
  half?: boolean;
}> = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "line1", label: "Address line 1", autoComplete: "address-line1" },
  {
    name: "line2",
    label: "Address line 2",
    autoComplete: "address-line2",
    optional: true,
  },
  { name: "city", label: "City", autoComplete: "address-level2", half: true },
  {
    name: "state",
    label: "State / Province",
    autoComplete: "address-level1",
    half: true,
  },
  {
    name: "postalCode",
    label: "Postal code",
    autoComplete: "postal-code",
    half: true,
  },
  { name: "country", label: "Country", autoComplete: "country-name", half: true },
];

export default function AddressForm({
  errors,
  values,
  isSubmitting,
}: AddressFormProps) {
  return (
    <Form method="post" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {FIELDS.map((field) => {
        const error = errors?.[field.name];
        const errorId = error ? `${field.name}-error` : undefined;
        const raw = values?.[field.name];

        return (
          <div
            key={field.name}
            className={field.half ? "sm:col-span-1" : "sm:col-span-2"}
          >
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.optional ? (
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              ) : null}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              defaultValue={typeof raw === "string" ? raw : ""}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {error ? (
              <p id={errorId} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="flex items-center gap-2 sm:col-span-2">
        <input
          id="isDefault"
          name="isDefault"
          type="checkbox"
          defaultChecked={Boolean(values?.isDefault)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save address"}
        </button>
      </div>
    </Form>
  );
}
