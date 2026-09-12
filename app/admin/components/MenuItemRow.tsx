"use client";

import { useActionState, useState, useTransition } from "react";
import type { CategoryId, MenuItem } from "@/lib/types";
import {
  deleteMenuItemAction,
  updateMenuItemAction,
  type MenuItemActionState,
} from "../actions";
import {
  Field,
  FormMessage,
  PrimaryButton,
  SecondaryButton,
  TextArea,
  TextInput,
} from "./FormControls";

const initialState: MenuItemActionState = {};

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
  const [editing, setEditing] = useState(false);
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
        setEditing(false);
      }
      return result;
    },
    initialState
  );

  function handleDelete() {
    if (!window.confirm(`Delete "${item.name}"? This can't be undone.`)) {
      return;
    }
    startDeleteTransition(async () => {
      await deleteMenuItemAction(categoryId, item.id);
      onDeleted();
    });
  }

  if (editing) {
    return (
      <form
        action={formAction}
        className="flex flex-col gap-4 rounded-2xl border border-line bg-canvas p-5"
      >
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="Name" htmlFor={`name-${item.id}`}>
            <TextInput
              id={`name-${item.id}`}
              name="name"
              defaultValue={item.name}
              required
            />
          </Field>
          <Field label="Price (USD)" htmlFor={`price-${item.id}`}>
            <TextInput
              id={`price-${item.id}`}
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={item.price}
              required
            />
          </Field>
        </div>
        <Field label="Description" htmlFor={`description-${item.id}`}>
          <TextArea
            id={`description-${item.id}`}
            name="description"
            defaultValue={item.description}
            rows={2}
            required
          />
        </Field>
        <Field label="Tags (comma-separated)" htmlFor={`tags-${item.id}`}>
          <TextInput
            id={`tags-${item.id}`}
            name="tags"
            defaultValue={item.tags?.join(", ")}
            placeholder="Vegetarian, Spicy, Gluten-Free"
          />
        </Field>

        <FormMessage error={state.error} success={state.success} />

        <div className="flex gap-3">
          <PrimaryButton type="submit" pending={pending}>
            Save
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => setEditing(false)}>
            Cancel
          </SecondaryButton>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-line p-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h4 className="font-medium text-ink">{item.name}</h4>
          {item.tags && item.tags.length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-2 py-0.5 text-[0.6875rem] font-medium text-ink-muted"
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
        <p className="mt-1.5 text-sm font-medium tabular-nums text-ink">
          ${item.price.toFixed(2)}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
