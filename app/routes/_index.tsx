import type { MetaFunction } from "@remix-run/node";
import  HomeServer  from "~/actions/home.server";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Morhaat" },
    { name: "description", content: "Welcome to Morhaat!" },
  ];
};

export async function loader() {
    const catagories = await HomeServer.getCatagories();
    return Response.json({ catagories });
  }

export default function Home() {
  const { catagories } = useLoaderData<typeof loader>();

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
            {catagories.map((catagory :any) => (
              <div key={catagory.name} className="group relative">
                <img
                  alt={catagory.imageAlt}
                  src={catagory.imageSrc}
                  className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                />
                <h3 className="mt-6 text-sm text-gray-500">
                  <a href={catagory.href}>
                    <span className="absolute inset-0" />
                    {catagory.name}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">{catagory.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
