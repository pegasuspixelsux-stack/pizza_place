import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Staff Login — Bianco Pizzeria",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-canvas px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium tracking-wide text-accent">
            Bianco Pizzeria
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            Staff sign in
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Manage the hero, menu, and site info.
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.2)]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
