import { NavLink } from "@remix-run/react";

const NAV_LINKS: ReadonlyArray<{ to: string; label: string; end?: boolean }> = [
  { to: "/", label: "Home", end: true },
  { to: "/cart", label: "Cart" },
  { to: "/address", label: "Addresses" },
  { to: "/history", label: "History" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2" aria-label="Morhaat home">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Morhaat
          </span>
        </NavLink>

        <nav aria-label="Primary" className="flex items-center gap-6">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
