"use client";

import { useState } from "react";
import type { SiteData } from "@/lib/types";
import { HeroEditor } from "./HeroEditor";
import { MenuEditor } from "./MenuEditor";
import { FooterEditor } from "./FooterEditor";

type Tab = "hero" | "menu" | "footer";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "menu", label: "Menu" },
  { id: "footer", label: "Footer & Contact" },
];

export function AdminDashboard({ data }: { data: SiteData }) {
  const [tab, setTab] = useState<Tab>("hero");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Changes go live on the site as soon as you save.
        </p>
      </div>

      <nav className="mb-8 flex gap-1 rounded-full border border-line bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-ink text-canvas"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "hero" && <HeroEditor hero={data.hero} />}
      {tab === "menu" && <MenuEditor categories={data.menu} />}
      {tab === "footer" && <FooterEditor footer={data.footer} />}
    </div>
  );
}
