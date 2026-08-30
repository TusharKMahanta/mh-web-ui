/**
 * Store service — the mock data layer for individual store pages.
 *
 * Shapes are modelled as if they came from a REST backend: stable string ids,
 * a URL slug, and ISO-8601 date strings. The in-memory `STORES` array stands
 * in for a `stores` database table. Swapping in a real API means rewriting
 * only the bodies below.
 */

export interface Store {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  isOpen: boolean;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export interface StoreResponse {
  store: Store;
}

// In-memory store standing in for a `stores` database table.
const STORES: Store[] = [
  {
    id: "str_1",
    slug: "morhaat-bengaluru",
    name: "Morhaat Bengaluru",
    description: "Flagship store on MG Road.",
    city: "Bengaluru",
    country: "India",
    isOpen: true,
    createdAt: "2026-01-10T08:00:00.000Z",
  },
  {
    id: "str_2",
    slug: "morhaat-guwahati",
    name: "Morhaat Guwahati",
    description: "Concept store on GS Road.",
    city: "Guwahati",
    country: "India",
    isOpen: false,
    createdAt: "2026-02-05T08:00:00.000Z",
  },
];

const products = [
  {
    id: 1,
    name: 'Zip Tote Basket',
    color: 'White and black',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-01.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
    price: '$140',
  },
  {
    id: 2,
    name: 'Zip High Wall Tote',
    color: 'White and blue',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-02.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, blue canvas straps and handle, and front zipper pocket.',
    price: '$150',
  },
  {
    id: 3,
    name: 'Halfsize Tote',
    color: 'Clay',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-03.jpg',
    imageAlt: 'Front of tote with monochrome natural canvas body, straps, roll top, and handles.',
    price: '$210',
  },
  {
    id: 4,
    name: 'High Wall Tote',
    color: 'Black and orange',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-04.jpg',
    imageAlt: 'Front of zip tote bag with black canvas, black handles, and orange drawstring top.',
    price: '$210',
  },
  {
    id: 1,
    name: 'Zip Tote Basket',
    color: 'White and black',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-01.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
    price: '$140',
  },
  {
    id: 2,
    name: 'Zip High Wall Tote',
    color: 'White and blue',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-02.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, blue canvas straps and handle, and front zipper pocket.',
    price: '$150',
  },
  {
    id: 3,
    name: 'Halfsize Tote',
    color: 'Clay',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-03.jpg',
    imageAlt: 'Front of tote with monochrome natural canvas body, straps, roll top, and handles.',
    price: '$210',
  },
  {
    id: 4,
    name: 'High Wall Tote',
    color: 'Black and orange',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-04.jpg',
    imageAlt: 'Front of zip tote bag with black canvas, black handles, and orange drawstring top.',
    price: '$210',
  },
  {
    id: 1,
    name: 'Zip Tote Basket',
    color: 'White and black',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-01.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
    price: '$140',
  },
  {
    id: 2,
    name: 'Zip High Wall Tote',
    color: 'White and blue',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-02.jpg',
    imageAlt: 'Front of zip tote bag with white canvas, blue canvas straps and handle, and front zipper pocket.',
    price: '$150',
  },
  {
    id: 3,
    name: 'Halfsize Tote',
    color: 'Clay',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-03.jpg',
    imageAlt: 'Front of tote with monochrome natural canvas body, straps, roll top, and handles.',
    price: '$210',
  },
  {
    id: 4,
    name: 'High Wall Tote',
    color: 'Black and orange',
    href: '#',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-related-product-04.jpg',
    imageAlt: 'Front of zip tote bag with black canvas, black handles, and orange drawstring top.',
    price: '$210',
  },
]

/**
 * Look up a single store by its id or its URL slug. Returns `null` when no
 * store matches so the route can render a 404.
 */
async function getStore(idOrSlug: string): Promise<Store | null> {
  const key = idOrSlug.trim().toLowerCase();
  const store = STORES.find(
    (s) => s.id.toLowerCase() === key || s.slug.toLowerCase() === key,
  );
  return store ? { ...store } : null;
}
async function getProducts(id: string): Promise<any[]> {
  return products;
}

const StoreServer = {
  getStore,
  getProducts,
};

export default StoreServer;
