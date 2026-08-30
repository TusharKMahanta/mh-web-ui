import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";

import AddressServer, {
  validateAddressInput,
  type Address,
  type CreateAddressInput,
} from "~/actions/address.server";
import AddressCard from "~/components/AddressCard";
import AddressForm from "~/components/AddressForm";

export const meta: MetaFunction = () => [
  { title: "Addresses · Morhaat" },
  { name: "description", content: "Manage your saved delivery addresses." },
];

export async function loader() {
  const { addresses, total } = await AddressServer.listAddresses();
  return Response.json({ addresses, total });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const input: Partial<CreateAddressInput> = {
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    line2: String(formData.get("line2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    country: String(formData.get("country") ?? ""),
    isDefault: formData.get("isDefault") === "on",
  };

  const errors = validateAddressInput(input);
  if (Object.keys(errors).length > 0) {
    return { errors, values: input };
  }

  await AddressServer.createAddress(input as CreateAddressInput);
  return redirect("/address");
}

export default function AddressPage() {
  const { addresses } = useLoaderData<typeof loader>() as {
    addresses: Address[];
    total: number;
  };
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Your addresses
        </h1>

        <section aria-labelledby="address-list-heading" className="mt-8">
          <h2
            id="address-list-heading"
            className="text-lg font-medium text-gray-900"
          >
            Saved addresses ({addresses.length})
          </h2>

          {addresses.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              You have no saved addresses yet. Add one below.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((address) => (
                <li key={address.id}>
                  <AddressCard address={address} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="add-address-heading" className="mt-12">
          <h2
            id="add-address-heading"
            className="text-lg font-medium text-gray-900"
          >
            Add a new address
          </h2>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
            <AddressForm
              errors={actionData?.errors}
              values={actionData?.values}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
