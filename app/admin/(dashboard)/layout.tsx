import Link from "next/link";
import { verifySession } from "@/lib/auth/dal";
import { SignOutButton } from "../SignOutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
          <div>
            <p className="text-sm font-medium tracking-wide text-accent">
              Bianco Pizzeria
            </p>
            <p className="text-xs text-ink-muted">
              Signed in as {session.username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
            >
              View site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
