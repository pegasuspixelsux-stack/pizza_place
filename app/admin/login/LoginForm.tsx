"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );
  const [showHelp, setShowHelp] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-ink">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink-faint"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Contraseña
          </label>
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink-faint"
        />
      </div>

      {showHelp && (
        <p className="rounded-xl border border-line bg-canvas p-3 text-xs leading-relaxed text-ink-muted">
          Esta cuenta de administración no tiene un restablecimiento
          automático. Para definir una contraseña nueva, ejecutá{" "}
          <code className="rounded bg-surface px-1 py-0.5 font-mono">
            npm run hash-password -- &quot;nueva-contraseña&quot;
          </code>{" "}
          y actualizá <code className="font-mono">ADMIN_PASSWORD_HASH</code>{" "}
          en tus variables de entorno (configuración del proyecto en Vercel,
          o <code className="font-mono">.env.local</code> en desarrollo
          local).
        </p>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-canvas transition-opacity duration-200 ease-out hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
