"use client";

import { useState } from "react";
import type { SiteData } from "@/lib/types";
import { HeroEditor } from "./HeroEditor";
import { MenuEditor } from "./MenuEditor";
import { FooterEditor } from "./FooterEditor";

type Tab = "hero" | "menu" | "footer";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Portada" },
  { id: "menu", label: "Menú" },
  { id: "footer", label: "Contacto" },
];

export function AdminDashboard({ data }: { data: SiteData }) {
  const [tab, setTab] = useState<Tab>("hero");

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Panel
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Los cambios se publican en el sitio apenas los guardás.
        </p>
      </div>

      {/* iOS-style segmented control: muted track, active segment reads as
          a raised white pill rather than a heavy filled bubble. */}
      <nav className="sticky top-0 z-20 -mx-6 mb-6 bg-canvas/85 px-6 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex gap-0.5 rounded-full bg-track p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                tab === t.id
                  ? "bg-surface text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {tab === "hero" && <HeroEditor hero={data.hero} />}
      {tab === "menu" && <MenuEditor categories={data.menu} />}
      {tab === "footer" && <FooterEditor footer={data.footer} />}
    </div>
  );
}
