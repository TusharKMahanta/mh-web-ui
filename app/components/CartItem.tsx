import { Link, useFetcher } from "@remix-run/react";

import type { CartLine } from "~/actions/cart.server";
import type { CartActionData } from "~/routes/api.cart";
import { formatMoney } from "~/utils/money";

/**
 * One cart line with quantity stepper and remove button. Each line submits to
 * `/api/cart` through its own fetcher and renders the pending quantity
 * optimistically until the cart page's loader revalidates.
 */
export default function CartItem({ line }: { line: CartLine }) {
    const fetcher = useFetcher<CartActionData>();
    const pendingIntent = fetcher.formData?.get("intent");
    const pendingQuantity = fetcher.formData?.get("quantity");

    // Hide the line as soon as removal is submitted.
    if (pendingIntent === "remove") return null;

    const quantity =
        pendingIntent === "update" && typeof pendingQuantity === "string"
            ? Number(pendingQuantity)
            : line.quantity;
    const lineTotal = { ...line.unitPrice, amount: line.unitPrice.amount * quantity };
    const error = fetcher.state === "idle" && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
    const href = `/sku/${encodeURIComponent(line.skuId)}`;

    const setQuantity = (next: number) =>
        fetcher.submit(
            { intent: "update", skuId: line.skuId, quantity: String(next) },
            { method: "post", action: "/api/cart" },
        );

    return (
        <div className="flex items-center gap-4 py-4">
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                    src={line.imageSrc}
                    alt={line.imageAlt}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                            <Link to={href} className="hover:underline">{line.name}</Link>
                        </h3>
                        <p className="ml-4">{formatMoney(lineTotal)}</p>
                    </div>
                    {line.color ? <p className="mt-1 text-sm text-gray-500">{line.color}</p> : null}
                    <p className="mt-1 text-sm text-gray-500">{formatMoney(line.unitPrice)} each</p>
                </div>
                <div className="mt-4 flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            type="button"
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label={`Decrease quantity of ${line.name}`}
                        >
                            -
                        </button>
                        <span
                            aria-live="polite"
                            className="px-2 py-1 text-gray-900 font-medium min-w-[2rem] text-center"
                        >
                            <span className="sr-only">Quantity </span>
                            {quantity}
                        </span>
                        <button
                            type="button"
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={quantity >= line.maxQuantity}
                            aria-label={`Increase quantity of ${line.name}`}
                        >
                            +
                        </button>
                    </div>

                    <fetcher.Form method="post" action="/api/cart" className="flex">
                        <input type="hidden" name="intent" value="remove" />
                        <input type="hidden" name="skuId" value={line.skuId} />
                        <button type="submit" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Remove<span className="sr-only"> {line.name}</span>
                        </button>
                    </fetcher.Form>
                </div>
                <p role="status" className="mt-2 text-sm text-red-600 empty:hidden">
                    {error}
                </p>
            </div>
        </div>
    );
}
