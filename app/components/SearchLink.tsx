import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchLink({ className }: { className?: string }) {
  return (
    <a href="#" className={className}>
      <span className="sr-only">Search</span>
      <MagnifyingGlassIcon aria-hidden="true" className="size-6" />
    </a>
  )
}
