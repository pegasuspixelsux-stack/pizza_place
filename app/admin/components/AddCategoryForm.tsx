"use client";

import { useActionState, useRef, useState } from "react";
import type { MenuCategory } from "@/lib/types";
import { addCategoryAction, type CategoryActionState } from "../actions";
import { FormMessage } from "./FormControls";

const initialState: CategoryActionState = {};

export function AddCategoryForm({
  onAdded,
}: {
  onAdded: (categories: MenuCategory[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: CategoryActionState, formData: FormData) => {
      const result = await addCategoryAction(prevState, formData);
      if (result.categories) {
        onAdded(result.categories);
        formRef.current?.reset();
        setOpen(false);
      }
      return result;
    },
    initialState
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-dashed border-line px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
      >
        + Nueva categoría
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form ref={formRef} action={formAction} className="flex items-center gap-2">
        <input
          name="name"
          type="text"
          autoFocus
          placeholder="Nombre de la categoría"
          required
          maxLength={60}
          className="rounded-full border border-line bg-canvas px-4 py-2 text-sm text-ink outline-none transition-colors focus:border-ink-faint"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Agregando…" : "Agregar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
        >
          Cancelar
        </button>
      </form>
      <FormMessage error={state.error} success={state.success} />
    </div>
  );
}
