import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import StoreServer, { type Product } from "~/actions/store.server";
import ProductGrid from "~/components/ProductGrid";
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
  const { skus } = useLoaderData<{ skus: Product[] }>();

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" >
        <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">Customers also bought</h2>

        <ProductGrid
          items={skus.map((product) => ({
            id: product.id,
            name: product.name,
            subtitle: product.color,
            href: product.href,
            imageSrc: product.imageSrc,
            imageAlt: product.imageAlt,
            priceLabel: product.price,
          }))}
        />
      </div>
    </div>
      </div>
    </div>
  );
}
