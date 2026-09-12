import type { FooterData } from "@/lib/types";

export function SiteFooter({ footer }: { footer: FooterData }) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    footer.address
  )}`;

  return (
    <footer id="footer" className="bg-rusty-spice-800">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium tracking-wide text-orange-50">Visitanos</h3>
            <p className="mt-4 text-sm font-medium text-orange-50">Bianco Pizzeria</p>
            <p className="mt-1 text-sm leading-relaxed text-rusty-spice-200">
              {footer.address}
            </p>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
            >
              Cómo llegar
            </a>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide text-orange-50">Horarios</h3>
            <dl className="mt-4 flex flex-col gap-2">
              {footer.hours.map((entry) => (
                <div
                  key={entry.days}
                  className="flex justify-between gap-4 text-sm text-rusty-spice-200"
                >
                  <dt>{entry.days}</dt>
                  <dd className="tabular-nums">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide text-orange-50">Contacto</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-rusty-spice-200">
              <a
                href={`tel:${footer.phone.replace(/[^\d+]/g, "")}`}
                className="transition-colors hover:text-orange-300"
              >
                {footer.phone}
              </a>
              <a
                href={`mailto:${footer.email}`}
                className="transition-colors hover:text-orange-300"
              >
                {footer.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-rusty-spice-700/40 pt-8 text-xs text-rusty-spice-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://pegasuspixels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-orange-300"
            >
              Diseño by Pegasus Pixels
            </a>
            <a href="/admin" className="transition-colors hover:text-orange-300">
              Acceso del personal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
