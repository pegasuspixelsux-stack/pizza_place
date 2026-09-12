"use client";

import { useActionState, useRef } from "react";
import type { CategoryId, MenuItem } from "@/lib/types";
import { addMenuItemAction, type MenuItemActionState } from "../actions";
import {
  Field,
  FormMessage,
  PrimaryButton,
  TextArea,
  TextInput,
} from "./FormControls";

const initialState: MenuItemActionState = {};

export function AddMenuItemForm({
  categoryId,
  onAdded,
}: {
  categoryId: CategoryId;
  onAdded: (item: MenuItem) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: MenuItemActionState, formData: FormData) => {
      const result = await addMenuItemAction(categoryId, prevState, formData);
      if (result.item) {
        onAdded(result.item);
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      key={categoryId}
      className="flex flex-col gap-4"
    >
      <p className="text-sm font-medium text-ink">Agregar un producto nuevo</p>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <Field label="Nombre" htmlFor="new-name">
          <TextInput
            id="new-name"
            name="name"
            required
            placeholder="Ej: Margherita"
          />
        </Field>
        <Field label="Precio (USD)" htmlFor="new-price">
          <TextInput
            id="new-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="16"
          />
        </Field>
      </div>
      <Field label="Descripción" htmlFor="new-description">
        <TextArea
          id="new-description"
          name="description"
          rows={2}
          required
          placeholder="Una descripción breve y apetitosa"
        />
      </Field>
      <Field label="Etiquetas (separadas por comas)" htmlFor="new-tags">
        <TextInput
          id="new-tags"
          name="tags"
          placeholder="Vegetariano, Picante, Sin gluten"
        />
      </Field>

      <FormMessage error={state.error} success={state.success} />

      <div>
        <PrimaryButton
          type="submit"
          pending={pending}
          pendingLabel="Agregando…"
        >
          Agregar producto
        </PrimaryButton>
      </div>
    </form>
  );
}
