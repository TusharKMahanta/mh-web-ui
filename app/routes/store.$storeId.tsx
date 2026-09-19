import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import StoreServer from "~/actions/store.server";
import { getSelectedDeliveryLocationId } from "~/utils/delivery-location.server";

export const meta: MetaFunction = () => [
  { title: "Store · Morhaat" },
  { name: "description", content: "Morhaat store." },
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { storeId } = params;
  if (!storeId) {
    throw new Response("Store not found", { status: 404 });
  }

  const store = await StoreServer.getStore(storeId);
  if (!store) {
    throw new Response("Store not found", { status: 404 });
  }

  // The shopper's selected delivery location (set via the "Deliver to…" modal)
  // is read here and passed into the service call, the same way any other
  // route's loader can — see `~/utils/delivery-location.server` for why this
  // travels as a cookie rather than component props.
  //const addressId = await getSelectedDeliveryLocationId(request);
  //console.log("addressId", addressId);
  const skus = await StoreServer.getProductsByStoreId(storeId);

  return Response.json({ store, skus });
}

export default function StorePage() {
  const { skus } = useLoaderData<typeof loader>();

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" >
        <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Customers also bought</h2>

        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {skus.map((product) => (
            <div key={product.id}>
              <div className="relative">
                <div className="relative h-72 w-full overflow-hidden rounded-lg">
                  <img alt={product.imageAlt} src={product.imageSrc} className="size-full object-cover" />
                </div>
                <div className="relative mt-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black opacity-50"
                  />
                  <p className="relative text-lg font-semibold text-white">{product.price}</p>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href={product.href}
                  className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                >
                  Add to bag<span className="sr-only">, {product.name}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
