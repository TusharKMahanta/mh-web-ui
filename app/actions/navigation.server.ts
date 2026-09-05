/**
 * Navigation service — the mock data layer for the site header's category
 * mega-menu, mobile menu, and page links.
 *
 * Shapes are modelled as if they came from a real backend (stable, typed
 * lists of links) so that swapping in a real API later means rewriting only
 * the body of `getNavigation`.
 */

export interface NavLink {
  name: string;
  href: string;
}

export interface NavigationCategory {
  name: string;
  featured: NavLink[];
  collection: NavLink[];
  categories: NavLink[];
  brands: NavLink[];
}

export interface NavigationResponse {
  categories: NavigationCategory[];
  pages: NavLink[];
}

const categories: NavigationCategory[] = [
  {
    name: "Catagory 1",
    featured: [
      { name: "Sleep", href: "#" },
      { name: "Swimwear", href: "#" },
      { name: "Underwear", href: "#" },
    ],
    collection: [
      { name: "Everything", href: "#" },
      { name: "Core", href: "#" },
      { name: "New Arrivals", href: "#" },
      { name: "Sale", href: "#" },
    ],
    categories: [
      { name: "Basic Tees", href: "#" },
      { name: "Artwork Tees", href: "#" },
      { name: "Bottoms", href: "#" },
      { name: "Underwear", href: "#" },
      { name: "Accessories", href: "#" },
    ],
    brands: [
      { name: "Full Nelson", href: "#" },
      { name: "My Way", href: "#" },
      { name: "Re-Arranged", href: "#" },
      { name: "Counterfeit", href: "#" },
      { name: "Significant Other", href: "#" },
    ],
  },
  {
    name: "Catagory 2",
    featured: [
      { name: "Casual", href: "#" },
      { name: "Boxers", href: "#" },
      { name: "Outdoor", href: "#" },
    ],
    collection: [
      { name: "Everything", href: "#" },
      { name: "Core", href: "#" },
      { name: "New Arrivals", href: "#" },
      { name: "Sale", href: "#" },
    ],
    categories: [
      { name: "Artwork Tees", href: "#" },
      { name: "Pants", href: "#" },
      { name: "Accessories", href: "#" },
      { name: "Boxers", href: "#" },
      { name: "Basic Tees", href: "#" },
    ],
    brands: [
      { name: "Significant Other", href: "#" },
      { name: "My Way", href: "#" },
      { name: "Counterfeit", href: "#" },
      { name: "Re-Arranged", href: "#" },
      { name: "Full Nelson", href: "#" },
    ],
  },
];

const pages: NavLink[] = [
  { name: "Company", href: "#" },
  { name: "Stores", href: "/" },
  { name: "Addresses", href: "/address" },
  { name: "History", href: "/history" },
];

async function getNavigation(): Promise<NavigationResponse> {
  return { categories, pages };
}

const NavigationServer = {
  getNavigation,
};

export default NavigationServer;
