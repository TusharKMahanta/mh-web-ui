import { useEffect, useId, useRef, useState } from 'react'
import { Form, Link, useFetcher, useLocation, useNavigate, useSearchParams } from '@remix-run/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { formatMoney } from '~/utils/money'
import { SUGGEST_MIN_CHARS, type SuggestResponse } from '~/utils/search'

const DEBOUNCE_MS = 200

/**
 * Header search box with typeahead (WAI-ARIA 1.2 combobox pattern).
 *
 * - Typing loads suggestions from `/api/search/suggest`.
 * - Clicking a suggestion, or arrowing to one and pressing Enter, opens `/sku/:id`.
 * - Enter with no suggestion highlighted submits the form natively to `/search?q=`.
 */
export default function SearchCombobox({ className }: { className?: string }) {
  const listboxId = useId()
  const fetcher = useFetcher<SuggestResponse>()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const urlQuery = location.pathname === '/search' ? searchParams.get('q') ?? '' : ''

  const [query, setQuery] = useState(urlQuery)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const blurRef = useRef<ReturnType<typeof setTimeout>>()

  // Sync with the URL and close the list whenever the route changes.
  useEffect(() => {
    setQuery(urlQuery)
    setOpen(false)
    setActiveIndex(-1)
  }, [location.key, urlQuery])

  useEffect(
    () => () => {
      clearTimeout(debounceRef.current)
      clearTimeout(blurRef.current)
    },
    [],
  )

  const trimmed = query.trim()
  const hasQuery = trimmed.length >= SUGGEST_MIN_CHARS
  const suggestions = hasQuery ? fetcher.data?.suggestions ?? [] : []
  const loading = fetcher.state === 'loading'
  const showList = open && hasQuery && (suggestions.length > 0 || loading || fetcher.data !== undefined)
  const optionId = (index: number) => `${listboxId}-option-${index}`

  function handleChange(value: string) {
    setQuery(value)
    setActiveIndex(-1)
    setOpen(true)
    clearTimeout(debounceRef.current)
    const next = value.trim()
    if (next.length < SUGGEST_MIN_CHARS) return
    debounceRef.current = setTimeout(() => {
      fetcher.load(`/api/search/suggest?${new URLSearchParams({ q: next })}`)
    }, DEBOUNCE_MS)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        if (suggestions.length === 0) return
        event.preventDefault()
        setOpen(true)
        setActiveIndex((i) => (i + 1) % suggestions.length)
        break
      case 'ArrowUp':
        if (suggestions.length === 0) return
        event.preventDefault()
        setOpen(true)
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
        break
      case 'Enter':
        if (showList && activeIndex >= 0 && suggestions[activeIndex]) {
          event.preventDefault()
          navigate(`/sku/${encodeURIComponent(suggestions[activeIndex].id)}`)
        } else if (trimmed === '') {
          event.preventDefault()
        }
        // Otherwise fall through to the native form submit → /search?q=
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          setOpen(false)
          setActiveIndex(-1)
        }
        break
    }
  }

  return (
    <Form method="get" action="/search" role="search" className={`relative ${className ?? ''}`}>
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
      />
      <input
        type="search"
        name="q"
        role="combobox"
        autoComplete="off"
        aria-label="Search products"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-activedescendant={showList && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        placeholder="Search products"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay so a click on a suggestion lands before the list unmounts.
          blurRef.current = setTimeout(() => setOpen(false), 150)
        }}
        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none"
      />

      <ul
        id={listboxId}
        role="listbox"
        aria-label="Search suggestions"
        hidden={!showList}
        className="absolute inset-x-0 top-full z-30 mt-1 max-h-96 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
      >
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={index === activeIndex ? 'bg-gray-100' : undefined}
          >
            <Link
              to={`/sku/${encodeURIComponent(suggestion.id)}`}
              tabIndex={-1}
              onMouseEnter={() => setActiveIndex(index)}
              className="flex items-center gap-3 px-3 py-2 text-gray-800"
            >
              <img src={suggestion.imageSrc} alt="" className="size-10 shrink-0 rounded object-cover" />
              <span className="flex-1 truncate">{suggestion.name}</span>
              <span className="shrink-0 text-gray-500">{formatMoney(suggestion.price)}</span>
            </Link>
          </li>
        ))}
        {suggestions.length === 0 ? (
          <li role="presentation" className="px-3 py-2 text-gray-500">
            {loading ? 'Searching…' : 'No matches. Press Enter to search all products.'}
          </li>
        ) : null}
      </ul>
    </Form>
  )
}
