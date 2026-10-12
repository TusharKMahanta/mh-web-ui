import { Link } from '@remix-run/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchLink({ className }: { className?: string }) {
  return (
    <Link to="/search" className={className}>
      <span className="sr-only">Search</span>
      <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
    </Link>
  )
}
