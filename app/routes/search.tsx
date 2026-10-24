import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import SkuServer, { type SkuListResponse } from "~/actions/sku.server";
import ProductGrid from "~/components/ProductGrid";
import SearchCombobox from "~/components/SearchCombobox";
import { formatMoney } from "~/utils/money";

const PAGE_SIZE = 24;

interface SearchLoaderData {
  q: string;
  page: number;
  results: SkuListResponse;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.q ? `Search: ${data.q} · Morhaat` : "Search · Morhaat" },
  { name: "description", content: "Search Morhaat products." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q")?.trim() ?? "";
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);

  const results: SkuListResponse = q
    ? await SkuServer.searchSkus({ q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })
    : { data: [], total: 0, limit: PAGE_SIZE, offset: 0 };

  return Response.json({ q, page, results } satisfies SearchLoaderData);
}

function pageHref(q: string, page: number) {
  return `/search?${new URLSearchParams({ q, page: String(page) })}`;
}

export default function SearchPage() {
  const { q, page, results } = useLoaderData<SearchLoaderData>();
  const hasPrev = page > 1;
  const hasNext = results.offset + results.data.length < results.total;

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            {/* The header search is desktop-only; this gives mobile the same typeahead. */}
            <SearchCombobox className="mb-8 lg:hidden" />

            {q ? (
              <h1 className="text-xl font-bold text-gray-900">
                Results for &ldquo;{q}&rdquo;{" "}
                <span className="text-base font-normal text-gray-500">({results.total})</span>
              </h1>
            ) : (
              <h1 className="text-xl font-bold text-gray-900">Search products</h1>
            )}

            {q && results.data.length === 0 ? (
              <p className="mt-8 text-sm text-gray-500">
                No products match &ldquo;{q}&rdquo;. Try a different search term.
              </p>
            ) : (
              <ProductGrid
                items={results.data.map((sku) => ({
                  id: sku.id,
                  name: sku.name,
                  subtitle: sku.color,
                  href: `/sku/${encodeURIComponent(sku.id)}`,
                  imageSrc: sku.imageSrc,
                  imageAlt: sku.imageAlt,
                  priceLabel: formatMoney(sku.price),
                  skuId: sku.id,
                  inStock: sku.inStock,
                }))}
              />
            )}

            {hasPrev || hasNext ? (
              <nav aria-label="Pagination" className="mt-12 flex justify-between text-sm font-medium">
                {hasPrev ? (
                  <Link to={pageHref(q, page - 1)} className="text-gray-700 hover:text-gray-900">
                    &larr; Previous
                  </Link>
                ) : (
                  <span />
                )}
                {hasNext ? (
                  <Link to={pageHref(q, page + 1)} className="text-gray-700 hover:text-gray-900">
                    Next &rarr;
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
