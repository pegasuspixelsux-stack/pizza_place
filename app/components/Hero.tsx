import Image from "next/image";
import { isRestaurantOpenNow } from "@/lib/openStatus";
import type { FooterHours, HeroData } from "@/lib/types";
import { OpenStatusBadge } from "./OpenStatusBadge";

function isSvg(src: string) {
  return src.split("?")[0].toLowerCase().endsWith(".svg");
}

export function Hero({
  hero,
  hours,
}: {
  hero: HeroData;
  hours: FooterHours[];
}) {
  const initialOpen = isRestaurantOpenNow(hours);

  return (
    <section className="bg-rusty-spice-800">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid items-center gap-14 pt-0 pb-16 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-32">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide text-orange-400">
              Bianco Pizzeria
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-orange-50 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {hero.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-rusty-spice-200">
              {hero.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="inline-flex items-center justify-center rounded-full bg-orange-400 px-7 py-3 text-sm font-medium text-rusty-spice-950 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
              >
                Ver el menú
              </a>
              <a
                href="#footer"
                className="inline-flex items-center justify-center rounded-full border border-rusty-spice-600 px-7 py-3 text-sm font-medium text-orange-50 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-orange-400 active:translate-y-0"
              >
                Horarios y ubicación
              </a>
            </div>
          </div>

          <div className="order-first flex flex-col items-center gap-4 lg:order-none">
            <div className="relative -mx-6 aspect-square w-[calc(100%+3rem)] overflow-hidden rounded-none sm:mx-0 sm:w-full sm:max-w-md sm:rounded-[2rem]">
              {isSvg(hero.image) ? (
                // Vector illustrations don't benefit from next/image's
                // raster optimization pipeline.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero.image}
                  alt="Una pizza a la leña, vista desde arriba"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={hero.image}
                  alt="Una pizza a la leña, vista desde arriba"
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>
            <OpenStatusBadge hours={hours} initialOpen={initialOpen} />
          </div>
        </div>
        <div className="border-b border-rusty-spice-700" />
      </div>
    </section>
  );
}
