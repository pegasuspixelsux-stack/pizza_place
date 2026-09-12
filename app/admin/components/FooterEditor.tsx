"use client";

import { useActionState, useState } from "react";
import type { FooterData, FooterHours } from "@/lib/types";
import { updateFooterAction, type FooterActionState } from "../actions";
import { Field, FormMessage, PrimaryButton, TextInput } from "./FormControls";

const initialState: FooterActionState = {};

export function FooterEditor({ footer: initialFooter }: { footer: FooterData }) {
  const [footer, setFooter] = useState(initialFooter);
  const [hours, setHours] = useState<FooterHours[]>(initialFooter.hours);

  const [state, formAction, pending] = useActionState(
    async (prevState: FooterActionState, formData: FormData) => {
      const result = await updateFooterAction(prevState, formData);
      if (result.footer) {
        setFooter(result.footer);
        setHours(result.footer.hours);
      }
      return result;
    },
    initialState
  );

  function updateRow(index: number, field: keyof FooterHours, value: string) {
    setHours((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setHours((rows) => [...rows, { days: "", time: "" }]);
  }

  function removeRow(index: number) {
    setHours((rows) => rows.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-ink">
        Pie de página e información de contacto
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Horarios, dirección y datos de contacto que se muestran al pie del
        sitio.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-ink">Horario de atención</p>
          <div className="mt-3 flex flex-col gap-3">
            {hours.map((row, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  aria-label="Días"
                  name="hours_days"
                  value={row.days}
                  onChange={(e) => updateRow(index, "days", e.target.value)}
                  placeholder="Lunes a jueves"
                  className="w-full rounded-xl border border-line bg-canvas px-4 py-2 text-sm text-ink outline-none transition-colors focus:border-ink-faint"
                />
                <input
                  aria-label="Horario"
                  name="hours_time"
                  value={row.time}
                  onChange={(e) => updateRow(index, "time", e.target.value)}
                  placeholder="11:00 – 21:00"
                  className="w-full rounded-xl border border-line bg-canvas px-4 py-2 text-sm text-ink outline-none transition-colors focus:border-ink-faint"
                />
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  aria-label="Eliminar fila"
                  className="shrink-0 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRow}
            className="mt-3 text-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            + Agregar una fila
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Dirección" htmlFor="address">
            <TextInput
              id="address"
              name="address"
              defaultValue={footer.address}
              key={`address-${footer.address}`}
              required
            />
          </Field>
          <Field label="Teléfono" htmlFor="phone">
            <TextInput
              id="phone"
              name="phone"
              defaultValue={footer.phone}
              key={`phone-${footer.phone}`}
              required
            />
          </Field>
          <Field label="Correo electrónico" htmlFor="email">
            <TextInput
              id="email"
              name="email"
              type="email"
              defaultValue={footer.email}
              key={`email-${footer.email}`}
              required
            />
          </Field>
          <Field label="Texto de derechos de autor" htmlFor="copyright">
            <TextInput
              id="copyright"
              name="copyright"
              defaultValue={footer.copyright}
              key={`copyright-${footer.copyright}`}
              required
            />
          </Field>
        </div>

        <FormMessage error={state.error} success={state.success} />

        <div>
          <PrimaryButton type="submit" pending={pending}>
            Guardar pie de página y contacto
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}
