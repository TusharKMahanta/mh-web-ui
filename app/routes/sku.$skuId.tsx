import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";

import SkuServer, { type Sku } from "~/actions/sku.server";
import AddToCartButton from "~/components/AddToCartButton";
import { formatMoney } from "~/utils/money";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.sku ? `${data.sku.name} · Morhaat` : "Product · Morhaat" },
  { name: "description", content: data?.sku?.description ?? "Morhaat product." },
];

export async function loader({ params }: LoaderFunctionArgs) {
  const { skuId } = params;
  if (!skuId) {
    throw new Response("Product not found", { status: 404 });
  }

  const sku = await SkuServer.getSku(skuId);
  if (!sku) {
    throw new Response("Product not found", { status: 404 });
  }

  return Response.json({ sku });
}

export default function SkuPage() {
  const { sku } = useLoaderData<{ sku: Sku }>();

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
            <div className="overflow-hidden rounded-lg">
              <img alt={sku.imageAlt} src={sku.imageSrc} className="aspect-square w-full object-cover" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{sku.name}</h1>
              {sku.color ? <p className="mt-2 text-sm text-gray-500">{sku.color}</p> : null}

              <p className="mt-4 text-2xl text-gray-900">{formatMoney(sku.price)}</p>

              <p className={`mt-2 text-sm font-medium ${sku.inStock ? "text-green-700" : "text-red-700"}`}>
                {sku.inStock ? "In stock" : "Out of stock"}
              </p>

              <p className="mt-6 text-base text-gray-700">{sku.description}</p>

              <div className="mt-10">
                <AddToCartButton
                  skuId={sku.id}
                  productName={sku.name}
                  disabled={!sku.inStock}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-400 px-8 py-3 text-base font-medium text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {notFound ? "Product not found" : "Something went wrong"}
      </h1>
      <p className="mt-4 text-sm text-gray-500">
        {notFound
          ? "This product may have been removed or the link is incorrect."
          : "We couldn't load this product. Please try again."}
      </p>
      <Link to="/search" className="mt-8 inline-block text-sm font-medium text-orange-600 hover:text-orange-500">
        Search products &rarr;
      </Link>
    </div>
  );
}
