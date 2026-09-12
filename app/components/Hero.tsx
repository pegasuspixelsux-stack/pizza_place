import Image from "next/image";
import type { HeroData } from "@/lib/types";

function isSvg(src: string) {
  return src.split("?")[0].toLowerCase().endsWith(".svg");
}

export function Hero({ hero }: { hero: HeroData }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-wide text-accent">
              Bianco Pizzeria
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              {hero.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              {hero.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-canvas transition-all duration-200 ease-out hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
              >
                View the menu
              </a>
              <a
                href="#footer"
                className="inline-flex items-center justify-center rounded-full border border-line px-7 py-3 text-sm font-medium text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-ink-faint active:translate-y-0"
              >
                Hours &amp; location
              </a>
            </div>
          </div>

          <div className="relative order-first mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] lg:order-none">
            {isSvg(hero.image) ? (
              // Vector illustrations don't benefit from next/image's
              // raster optimization pipeline.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.image}
                alt="A wood-fired pizza, top-down view"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={hero.image}
                alt="A wood-fired pizza, top-down view"
                fill
                sizes="(min-width: 1024px) 420px, 80vw"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
