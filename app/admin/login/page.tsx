import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acceso del Personal — Bianco Pizzeria",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-canvas px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <span aria-hidden="true">←</span> Volver al sitio
        </Link>

        <div className="mb-8 mt-8 text-center">
          <p className="text-sm font-medium tracking-wide text-accent">
            Bianco Pizzeria
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Ingreso del personal
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Gestioná la portada, el menú y la información del sitio.
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.2)]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
