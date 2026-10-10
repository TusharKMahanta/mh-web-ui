import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import AddressServer from "~/actions/address.server";
import NavigationServer from "~/actions/navigation.server";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { serverEnv } from "~/config/env.server";
import { getPublicEnv } from "~/config/public-env";
import { getSelectedDeliveryLocationId } from "~/utils/delivery-location.server";
import { getUserSession, type SessionUser } from "~/utils/session.server";

import "./tailwind.css";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);
  const [navigation, deliveryLocations, selectedDeliveryLocationId] = await Promise.all([
    NavigationServer.getNavigation(),
    session
      ? AddressServer.listAddresses(session.profileId, session.accessToken)
      : { addresses: [], total: 0 },
    getSelectedDeliveryLocationId(request),
  ]);
  // Only the browser-safe projection of the session — never the access token.
  const user: SessionUser | null = session ? { identifier: session.identifier } : null;
  return Response.json({
    // Ships only the browser-safe subset of config to the client.
    ENV: getPublicEnv(serverEnv),
    navigation,
    deliveryLocations,
    selectedDeliveryLocationId,
    user,
  });
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
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        navigation={data?.navigation ?? { categories: [], pages: [] }}
        deliveryLocations={data?.deliveryLocations?.addresses ?? []}
        selectedDeliveryLocationId={data?.selectedDeliveryLocationId ?? null}
        user={data?.user ?? null}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
