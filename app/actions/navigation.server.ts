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
      { name: "Atta, Rice & Daal", href: "/search?q=Atta+Rice+&+Daal" },
      { name: "Organic Healthy Living", href: "/search?q=Organic+Healthy+Living" },
      { name: "Masala Oil & More", href: "/search?q=Masala+Oil+&+More" },
    ],
    collection: [
      { name: "Dairy, Bread & Eggs", href: "/search?q=Dairy%2C+Bread+%26+Eggs" },
      { name: "Snacks & Munchies", href: "/search?q=Snacks+&+Munchies" },
      { name: "Breakfast & Instant Food", href: "/search?q=Breakfast+&+Instant+Food" },
    ],
    categories: [
      { name: "Cleaning Essentials", href: "/search?q=Cleaning+Essentials" },
      { name: "Home & Offices", href: "/search?q=Home+&+Offices" },
      { name: "Personal Care", href: "/search?q=Personal+Care" },
    ],
    brands: [
      { name: "Bekery & Buscuits ", href: "/search?q=Bekery+&+Buscuits" },
      { name: "Cold Drinks & Juices", href: "/search?q=Cold+Drinks+&+Juices" },
      { name: "Beauties & Personal Care", href: "/search?q=Beauties+&+Personal+Care" },
    ],
  }
];

const pages: NavLink[] = [
  { name: "Fresh Vegetables", href: "/search?q=Fresh+Vegetables" },
  { name: "Exotic Fruits/Vegetables", href: "/search?q=Exotic+Fruits/Vegetables" },
  { name: "Food & Health", href: "/search?q=Food+&+Health" },
];

async function getNavigation(): Promise<NavigationResponse> {
  return { categories, pages };
}

const NavigationServer = {
  getNavigation,
};

export default NavigationServer;
