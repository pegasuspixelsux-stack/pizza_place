"use client";

import { useActionState, useRef } from "react";
import type { MenuCategory } from "@/lib/types";
import { addCategoryAction, type CategoryActionState } from "../actions";
import { FormMessage, PrimaryButton, TextInput } from "./FormControls";

const initialState: CategoryActionState = {};

export function AddCategoryForm({
  onAdded,
}: {
  onAdded: (categories: MenuCategory[]) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: CategoryActionState, formData: FormData) => {
      const result = await addCategoryAction(prevState, formData);
      if (result.categories) {
        onAdded(result.categories);
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <div>
      <p className="text-sm font-medium text-ink">Nueva categoría</p>
      <form
        ref={formRef}
        action={formAction}
        className="mt-3 flex items-center gap-2"
      >
        <TextInput
          name="name"
          type="text"
          placeholder="Ej: Especiales"
          required
          maxLength={60}
          className="flex-1"
        />
        <PrimaryButton
          type="submit"
          pending={pending}
          pendingLabel="Agregando…"
        >
          Agregar
        </PrimaryButton>
      </form>
      <div className="mt-2">
        <FormMessage error={state.error} success={state.success} />
      </div>
    </div>
  );
}
