"use client";

import { useActionState, useRef } from "react";
import type { CategoryId, MenuItem } from "@/lib/types";
import { addMenuItemAction, type MenuItemActionState } from "../actions";
import {
  FieldGroup,
  FormMessage,
  GroupedField,
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
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <FieldGroup>
        <GroupedField label="Nombre" htmlFor="new-name">
          <TextInput
            plain
            id="new-name"
            name="name"
            required
            placeholder="Ej: Margherita"
          />
        </GroupedField>
        <GroupedField label="Precio (UYU)" htmlFor="new-price">
          <TextInput
            plain
            id="new-price"
            name="price"
            type="number"
            min="0"
            step="1"
            required
            placeholder="640"
          />
        </GroupedField>
        <GroupedField label="Descripción" htmlFor="new-description">
          <TextArea
            plain
            id="new-description"
            name="description"
            rows={2}
            required
            placeholder="Una descripción breve y apetitosa"
          />
        </GroupedField>
        <GroupedField
          label="Etiquetas (separadas por comas)"
          htmlFor="new-tags"
        >
          <TextInput
            plain
            id="new-tags"
            name="tags"
            placeholder="Vegetariano, Picante, Sin gluten"
          />
        </GroupedField>
      </FieldGroup>

      <FormMessage error={state.error} success={state.success} />

      <PrimaryButton type="submit" pending={pending} pendingLabel="Agregando…">
        Agregar producto
      </PrimaryButton>
    </form>
  );
}
