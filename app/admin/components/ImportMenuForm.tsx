"use client";

import { useActionState, useRef } from "react";
import type { MenuCategory } from "@/lib/types";
import { importMenuAction, type MenuImportActionState } from "../actions";
import { FormMessage, PrimaryButton } from "./FormControls";

const initialState: MenuImportActionState = {};

export function ImportMenuForm({
  onImported,
}: {
  onImported: (categories: MenuCategory[]) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prevState: MenuImportActionState, formData: FormData) => {
      const result = await importMenuAction(prevState, formData);
      if (result.categories) {
        onImported(result.categories);
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <div className="rounded-2xl border border-dashed border-line bg-canvas p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">
          Importar o exportar el menú
        </p>
        <div className="flex items-center gap-3 text-xs font-medium text-accent">
          <a
            href="/admin/menu-export?format=xlsx"
            className="transition-opacity hover:opacity-80"
          >
            Exportar .xlsx
          </a>
          <a
            href="/admin/menu-export?format=csv"
            className="transition-opacity hover:opacity-80"
          >
            Exportar .csv
          </a>
        </div>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
        Subí un archivo <code className="font-mono">.xlsx</code> o{" "}
        <code className="font-mono">.csv</code> con las columnas{" "}
        <code className="font-mono">Categoria</code>,{" "}
        <code className="font-mono">Nombre</code>,{" "}
        <code className="font-mono">Descripcion</code>,{" "}
        <code className="font-mono">Precio</code> y, opcionalmente,{" "}
        <code className="font-mono">Etiquetas</code> (separadas por comas).
        Categoria debe coincidir con el nombre de una categoría que ya exista
        en el menú (creá categorías nuevas primero, con el botón &quot;+
        Nueva categoría&quot; de abajo). Los productos importados{" "}
        <strong>reemplazan</strong> a los existentes en cada categoría que
        aparezca en el archivo. ¿No tenés un archivo a mano? Exportá el menú
        actual y usalo como plantilla.
      </p>

      <form
        ref={formRef}
        action={formAction}
        className="mt-4 flex flex-wrap items-center gap-3"
      >
        <input
          name="file"
          type="file"
          accept=".xlsx,.csv"
          required
          className="text-xs text-ink-muted file:mr-3 file:rounded-full file:border file:border-line file:bg-surface file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
        />
        <PrimaryButton
          type="submit"
          pending={pending}
          pendingLabel="Importando…"
        >
          Importar
        </PrimaryButton>
      </form>

      <div className="mt-3">
        <FormMessage error={state.error} success={state.success} />
      </div>
    </div>
  );
}
