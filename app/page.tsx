import { getSiteData } from "@/lib/data";
import { Hero } from "@/app/components/Hero";
import { MenuSection } from "@/app/components/MenuSection";
import { SiteFooter } from "@/app/components/SiteFooter";

export default async function Home() {
  const data = await getSiteData();

  return (
    <div className="flex flex-1 flex-col">
      <Hero hero={data.hero} />
      <MenuSection categories={data.menu} />
      <SiteFooter footer={data.footer} />
    </div>
  );
}
