"use client";

import { useActionState, useState, useTransition } from "react";
import type { CategoryId, MenuItem } from "@/lib/types";
import {
  deleteMenuItemAction,
  updateMenuItemAction,
  type MenuItemActionState,
} from "../actions";
import {
  FieldGroup,
  FormMessage,
  GroupedField,
  PrimaryButton,
  TextArea,
  TextInput,
} from "./FormControls";
import { Sheet } from "./Sheet";

const initialState: MenuItemActionState = {};

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-current">
      <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

export function MenuItemRow({
  categoryId,
  item,
  onSaved,
  onDeleted,
}: {
  categoryId: CategoryId;
  item: MenuItem;
  onSaved: (item: MenuItem) => void;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const [state, formAction, pending] = useActionState(
    async (prevState: MenuItemActionState, formData: FormData) => {
      const result = await updateMenuItemAction(
        categoryId,
        item.id,
        prevState,
        formData
      );
      if (result.item) {
        onSaved(result.item);
        setOpen(false);
      }
      return result;
    },
    initialState
  );

  function handleDelete() {
    if (
      !window.confirm(
        `¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    startDeleteTransition(async () => {
      await deleteMenuItemAction(categoryId, item.id);
      onDeleted();
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-canvas"
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{item.name}</p>
          {item.tags && item.tags.length > 0 && (
            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {item.tags.join(" · ")}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-ink-faint">
          <span className="font-medium tabular-nums text-ink">
            $ {item.price.toLocaleString("es-UY")}
          </span>
          <ChevronIcon />
        </div>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title={item.name}>
        <form action={formAction} className="flex flex-col gap-5">
          <FieldGroup>
            <GroupedField label="Nombre" htmlFor={`name-${item.id}`}>
              <TextInput
                plain
                id={`name-${item.id}`}
                name="name"
                defaultValue={item.name}
                required
              />
            </GroupedField>
            <GroupedField label="Precio (UYU)" htmlFor={`price-${item.id}`}>
              <TextInput
                plain
                id={`price-${item.id}`}
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={item.price}
                required
              />
            </GroupedField>
            <GroupedField
              label="Descripción"
              htmlFor={`description-${item.id}`}
            >
              <TextArea
                plain
                id={`description-${item.id}`}
                name="description"
                defaultValue={item.description}
                rows={2}
                required
              />
            </GroupedField>
            <GroupedField
              label="Etiquetas (separadas por comas)"
              htmlFor={`tags-${item.id}`}
            >
              <TextInput
                plain
                id={`tags-${item.id}`}
                name="tags"
                defaultValue={item.tags?.join(", ")}
                placeholder="Vegetariano, Picante, Sin gluten"
              />
            </GroupedField>
          </FieldGroup>

          <FormMessage error={state.error} success={state.success} />

          <div className="flex items-center gap-3">
            <PrimaryButton type="submit" pending={pending} className="flex-1">
              Guardar
            </PrimaryButton>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent disabled:opacity-50"
            >
              {isDeleting ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </form>
      </Sheet>
    </>
  );
}
