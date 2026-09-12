export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags?: string[];
}

export type CategoryId = "appetizers" | "pizzas" | "desserts" | "drinks";

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
