"use client";

import { useState } from "react";
import type { CategoryId, MenuCategory, MenuItem } from "@/lib/types";
import { AddMenuItemForm } from "./AddMenuItemForm";
import { MenuItemRow } from "./MenuItemRow";

export function MenuEditor({
  categories: initialCategories,
}: {
  categories: MenuCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeId, setActiveId] = useState<CategoryId>(
    initialCategories[0]?.id ?? "pizzas"
  );

  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  function withCategory(
    categoryId: CategoryId,
    update: (items: MenuItem[]) => MenuItem[]
  ) {
    setCategories((cats) =>
      cats.map((c) =>
        c.id === categoryId ? { ...c, items: update(c.items) } : c
      )
    );
  }

  if (!active) return null;

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink">Menu</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Add, edit, or remove items across every category.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveId(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category.id === activeId
                ? "bg-ink text-canvas"
                : "border border-line text-ink-muted hover:border-ink-faint hover:text-ink"
            }`}
          >
            {category.name}{" "}
            <span className="tabular-nums opacity-70">
              ({category.items.length})
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {active.items.length === 0 && (
          <p className="text-sm text-ink-muted">
            No items in {active.name} yet. Add the first one below.
          </p>
        )}
        {active.items.map((item) => (
          <MenuItemRow
            key={item.id}
            categoryId={active.id}
            item={item}
            onSaved={(updated) =>
              withCategory(active.id, (items) =>
                items.map((i) => (i.id === updated.id ? updated : i))
              )
            }
            onDeleted={() =>
              withCategory(active.id, (items) =>
                items.filter((i) => i.id !== item.id)
              )
            }
          />
        ))}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <AddMenuItemForm
          categoryId={active.id}
          onAdded={(item) =>
            withCategory(active.id, (items) => [...items, item])
          }
        />
      </div>
    </div>
  );
}
