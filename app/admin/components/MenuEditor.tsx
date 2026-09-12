"use client";

import { useState } from "react";
import type { CategoryId, MenuCategory, MenuItem } from "@/lib/types";
import { AddCategoryForm } from "./AddCategoryForm";
import { AddMenuItemForm } from "./AddMenuItemForm";
import { ImportMenuForm } from "./ImportMenuForm";
import { MenuItemRow } from "./MenuItemRow";
import { Sheet } from "./Sheet";

function DataIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v1A1.5 1.5 0 0 1 14.5 8h-9A1.5 1.5 0 0 1 4 6.5v-1Zm0 5.5a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 12 11v3a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 14v-3Zm10-1.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h.5A1.5 1.5 0 0 0 16 14v-3a1.5 1.5 0 0 0-1.5-1.5H14Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
      <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function MenuEditor({
  categories: initialCategories,
}: {
  categories: MenuCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [activeId, setActiveId] = useState<CategoryId>(
    initialCategories[0]?.id ?? "pizzas"
  );
  const [dataSheetOpen, setDataSheetOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);

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
    <div>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Menú</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Agregá, editá o eliminá productos en cada categoría.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDataSheetOpen(true)}
          aria-label="Datos del menú: importar, exportar y categorías"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
        >
          <DataIcon />
        </button>
      </div>

      <div className="sticky top-16 z-10 -mx-6 bg-canvas/85 px-6 py-2 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
      </div>

      <div className="mt-3 divide-y divide-hairline overflow-hidden rounded-2xl border border-line bg-surface">
        {active.items.length === 0 && (
          <p className="p-4 text-sm text-ink-muted">
            Todavía no hay productos en {active.name}. Agregá el primero
            abajo.
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

      <button
        type="button"
        onClick={() => setAddSheetOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
      >
        <PlusIcon />
        Agregar producto
      </button>

      <Sheet
        open={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title={`Agregar a ${active.name}`}
      >
        <AddMenuItemForm
          categoryId={active.id}
          onAdded={(item) => {
            withCategory(active.id, (items) => [...items, item]);
            setAddSheetOpen(false);
          }}
        />
      </Sheet>

      <Sheet
        open={dataSheetOpen}
        onClose={() => setDataSheetOpen(false)}
        title="Datos del menú"
      >
        <div className="flex flex-col gap-6">
          <ImportMenuForm onImported={setCategories} />
          <div className="border-t border-hairline pt-5">
            <AddCategoryForm
              onAdded={(updated) => {
                setCategories(updated);
                const added = updated.find(
                  (c) => !categories.some((existing) => existing.id === c.id)
                );
                if (added) setActiveId(added.id);
              }}
            />
          </div>
        </div>
      </Sheet>
    </div>
  );
}
