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
    name: "Groceries & Essentials",
    featured: [
      { name: "Atta, Rice & Daal", href: "#" },
      { name: "Organic Healthy Living", href: "#" },
      { name: "Masala Oil & More", href: "#" },
    ],
    collection: [
      { name: "Dairy, Bread & Eggs", href: "#" },
      { name: "Snacks & Munchies", href: "#" },
      { name: "Breakfast & Instant Food", href: "#" },
    ],
    categories: [
      { name: "Cleaning Essentials", href: "#" },
      { name: "Home & Offices", href: "#" },
      { name: "Personal Care", href: "#" },
    ],
    brands: [
      { name: "Bekery & Buscuits ", href: "#" },
      { name: "Cold Drinks & Juices", href: "#" },
      { name: "Beauties & Personal Care", href: "#" },
    ],
  }
];

const pages: NavLink[] = [
  { name: "Fresh Vegetables", href: "/fresh-vegetables" },
  { name: "Exotic Fruits/Vegetables", href: "/exotic-fruits-vegetables" },
  { name: "Food & Health", href: "/food" },
];

async function getNavigation(): Promise<NavigationResponse> {
  return { categories, pages };
}

const NavigationServer = {
  getNavigation,
};

export default NavigationServer;
