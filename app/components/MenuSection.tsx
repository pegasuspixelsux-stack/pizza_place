import type { MenuCategory } from "@/lib/types";

function formatPrice(price: number) {
  return price.toLocaleString("es-UY", {
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  });
}

function CategoryBlock({ category }: { category: MenuCategory }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-tight text-ink">
        {category.name}
      </h3>
      <div className="mt-6 flex flex-col gap-6">
        {category.items.map((item) => (
          <div key={item.id} className="flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h4 className="font-medium text-ink">{item.name}</h4>
                {item.tags && item.tags.length > 0 && (
                  <span className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {item.description}
              </p>
            </div>
            <span className="shrink-0 font-medium tabular-nums text-ink">
              {formatPrice(item.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MenuSection({ categories }: { categories: MenuCategory[] }) {
  return (
    <section id="menu" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
        <div className="max-w-xl">
          <p className="text-sm font-medium tracking-wide text-accent">Menú</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Qué estamos sirviendo
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-2 lg:gap-y-20">
          {categories.map((category) => (
            <CategoryBlock key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
