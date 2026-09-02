import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { serverEnv } from "~/config/env.server";
import { getPublicEnv } from "~/config/public-env";

import "./tailwind.css";

export function loader() {
  // Ships only the browser-safe subset of config to the client.
  return Response.json({ ENV: getPublicEnv(serverEnv) });
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {data?.ENV ? (
          <script
            // Exposes the browser-safe config on window.ENV before hydration.
            // Only the whitelisted PublicEnv subset is serialized here.
            dangerouslySetInnerHTML={{
              __html: `window.ENV=${JSON.stringify(data.ENV)}`,
            }}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
