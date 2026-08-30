import { Link } from "@remix-run/react";

const FOOTER_LINKS: ReadonlyArray<{ to: string; label: string }> = [
  { to: "/", label: "Home" },
  { to: "/cart", label: "Cart" },
  { to: "/address", label: "Addresses" },
  { to: "/history", label: "History" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Morhaat. All rights reserved.
        </p>

        <nav aria-label="Footer" className="flex gap-6">
          {FOOTER_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
