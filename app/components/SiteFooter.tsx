import type { FooterData } from "@/lib/types";

export function SiteFooter({ footer }: { footer: FooterData }) {
  return (
    <footer id="footer" className="bg-canvas">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium tracking-wide text-ink">Horarios</h3>
            <dl className="mt-4 flex flex-col gap-2">
              {footer.hours.map((entry) => (
                <div
                  key={entry.days}
                  className="flex justify-between gap-4 text-sm text-ink-muted"
                >
                  <dt>{entry.days}</dt>
                  <dd className="tabular-nums">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide text-ink">Visitanos</h3>
            <p className="mt-4 text-sm font-medium text-ink">Bianco Pizzeria</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {footer.address}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wide text-ink">Contacto</h3>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ink-muted">
              <a
                href={`tel:${footer.phone.replace(/[^\d+]/g, "")}`}
                className="transition-colors hover:text-ink"
              >
                {footer.phone}
              </a>
              <a
                href={`mailto:${footer.email}`}
                className="transition-colors hover:text-ink"
              >
                {footer.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <a href="/admin" className="transition-colors hover:text-ink-muted">
            Acceso del personal
          </a>
        </div>
      </div>
    </footer>
  );
}
