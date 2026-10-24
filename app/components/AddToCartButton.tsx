import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'

import type { CartActionData } from '~/routes/api.cart'

/** How long the "Added" confirmation stays on the button. */
const ADDED_FEEDBACK_MS = 2000

export default function AddToCartButton({
  skuId,
  productName,
  disabled = false,
  className,
  children = 'Add to bag',
}: {
  skuId: string
  /** Read to screen readers after the label, e.g. "Add to bag, Zip Tote Basket". */
  productName: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}) {
  const fetcher = useFetcher<CartActionData>()
  const [justAdded, setJustAdded] = useState(false)
  const isAdding = fetcher.state !== 'idle'
  const error = fetcher.state === 'idle' && fetcher.data && !fetcher.data.ok ? fetcher.data.error : null

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data?.ok) return
    setJustAdded(true)
    const timeout = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS)
    return () => clearTimeout(timeout)
  }, [fetcher.state, fetcher.data])

  return (
    <fetcher.Form method="post" action="/api/cart">
      <input type="hidden" name="intent" value="add" />
      <input type="hidden" name="skuId" value={skuId} />
      <input type="hidden" name="quantity" value="1" />
      <button type="submit" disabled={disabled || isAdding} aria-busy={isAdding} className={className}>
        {isAdding ? 'Adding…' : justAdded ? 'Added' : children}
        <span className="sr-only">, {productName}</span>
      </button>
      <p role="status" className="mt-2 text-sm text-red-600 empty:hidden">
        {error}
      </p>
    </fetcher.Form>
  )
}
