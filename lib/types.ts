export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags?: string[];
}

// The four seed categories ("appetizers", "pizzas", "desserts", "drinks")
// remain as ids, but admins can add their own categories from the
// dashboard, so this is a plain string rather than a fixed union.
export type CategoryId = string;

export interface MenuCategory {
  id: CategoryId;
  name: string;
  items: MenuItem[];
}

export interface HeroData {
  headline: string;
  subtitle: string;
  image: string;
}

export interface FooterHours {
  days: string;
  time: string;
}

export interface FooterData {
  hours: FooterHours[];
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  copyright: string;
}

export interface SiteData {
  hero: HeroData;
  menu: MenuCategory[];
  footer: FooterData;
}
