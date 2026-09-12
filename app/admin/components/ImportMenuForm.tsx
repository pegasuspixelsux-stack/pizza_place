"use client";

import { useActionState, useRef, useState } from "react";
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
  const [fileName, setFileName] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (prevState: MenuImportActionState, formData: FormData) => {
      const result = await importMenuAction(prevState, formData);
      if (result.categories) {
        onImported(result.categories);
        formRef.current?.reset();
        setFileName(null);
      }
      return result;
    },
    initialState
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">Importar productos</p>
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
        Subí un .xlsx o .csv para reemplazar productos por categoría.{" "}
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="font-medium text-ink underline decoration-line underline-offset-2"
        >
          {showHelp ? "Ocultar detalles" : "¿Cómo funciona?"}
        </button>
      </p>

      {showHelp && (
        <p className="mt-2 rounded-xl bg-canvas p-3 text-xs leading-relaxed text-ink-muted">
          Columnas requeridas: <code className="font-mono">Categoria</code>,{" "}
          <code className="font-mono">Nombre</code>,{" "}
          <code className="font-mono">Precio</code>; opcionales{" "}
          <code className="font-mono">Descripcion</code> y{" "}
          <code className="font-mono">Etiquetas</code> (separadas por comas).
          Categoria debe coincidir con el nombre de una categoría existente.
          Los productos importados <strong>reemplazan</strong> a los
          existentes en cada categoría que aparezca en el archivo. ¿No tenés
          un archivo a mano? Exportá el menú actual y usalo como plantilla.
        </p>
      )}

      <form ref={formRef} action={formAction} className="mt-3 flex flex-col gap-3">
        <label
          htmlFor="menu-import-file"
          className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-line bg-canvas px-4 py-6 text-center transition-colors hover:border-ink-faint"
        >
          <span className="text-sm font-medium text-ink">
            {fileName ?? "Elegí un archivo .xlsx o .csv"}
          </span>
          <span className="text-xs text-ink-muted">
            Tocá para buscar en tu dispositivo
          </span>
          <input
            id="menu-import-file"
            name="file"
            type="file"
            accept=".xlsx,.csv"
            required
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>

        <FormMessage error={state.error} success={state.success} />

        <PrimaryButton type="submit" pending={pending} pendingLabel="Importando…">
          Importar
        </PrimaryButton>
      </form>
    </div>
  );
}
