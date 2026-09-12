"use client";

import { useEffect } from "react";

/**
 * A bottom sheet on mobile, a centered modal from `sm:` up. Used for item
 * add/edit and the menu data-management drawer, so the admin never loses
 * the list behind them while typing.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
        style={{ animation: "sheet-overlay-in 150ms ease-out" }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-[0_-8px_40px_rgba(0,0,0,0.18)] sm:max-w-md sm:rounded-3xl sm:p-7 sm:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
        style={{ animation: "sheet-panel-in 200ms ease-out" }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1.5 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-canvas hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
