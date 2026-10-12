import { Link } from '@remix-run/react'

export interface ProductGridItem {
  id: string | number
  name: string
  subtitle?: string | null
  href: string
  imageSrc: string
  imageAlt: string
  priceLabel: string
}

export default function ProductGrid({ items }: { items: ProductGridItem[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {items.map((product) => (
        <div key={product.id}>
          <div className="relative">
            <div className="relative h-72 w-full overflow-hidden rounded-lg">
              <img alt={product.imageAlt} src={product.imageSrc} className="size-full object-cover" />
            </div>
            <div className="relative mt-4">
              <h3 className="text-sm font-medium text-gray-900">
                <Link to={product.href} className="hover:underline">
                  {product.name}
                </Link>
              </h3>
              {product.subtitle ? <p className="mt-1 text-sm text-gray-500">{product.subtitle}</p> : null}
            </div>
            <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black opacity-50"
              />
              <p className="relative text-lg font-semibold text-white">{product.priceLabel}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              to={product.href}
              className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
            >
              Add to bag<span className="sr-only">, {product.name}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
