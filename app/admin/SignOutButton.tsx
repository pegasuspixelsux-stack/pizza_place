"use client";

import { logoutAction } from "./actions";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
