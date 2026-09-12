"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { logoutAction } from "./actions";

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] fill-current">
      <path d="M3 5.5A.75.75 0 0 1 3.75 4.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.5Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" />
    </svg>
  );
}

/**
 * Compact burger menu replacing separate "Ver sitio" / "Cerrar sesión"
 * buttons in the admin header, so the header stays uncluttered on mobile.
 */
export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-ink-faint hover:text-ink"
      >
        <MenuIcon />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl border border-line bg-surface py-1.5 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.25)]"
          style={{ animation: "sheet-panel-in 150ms ease-out" }}
        >
          <Link
            href="/"
            target="_blank"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
          >
            Ver sitio
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              role="menuitem"
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-accent transition-colors hover:bg-canvas"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
