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
          Username
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
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Forgot password?
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
          There&rsquo;s no self-serve reset for this admin account. To set a
          new password, run{" "}
          <code className="rounded bg-surface px-1 py-0.5 font-mono">
            npm run hash-password -- &quot;new-password&quot;
          </code>{" "}
          and update <code className="font-mono">ADMIN_PASSWORD_HASH</code>{" "}
          in your environment variables (Vercel project settings, or{" "}
          <code className="font-mono">.env.local</code> for local dev).
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
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
