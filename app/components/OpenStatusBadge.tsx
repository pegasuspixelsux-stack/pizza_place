"use client";

import { useEffect, useState } from "react";
import { isRestaurantOpenNow } from "@/lib/openStatus";
import type { FooterHours } from "@/lib/types";

/**
 * An iOS-style toggle switch used purely as a status indicator (not
 * interactive): a green pill with the knob pushed to the right reads
 * "Abierto"; a red pill with the knob pushed to the left reads "Cerrado".
 * Sized to match the hero's CTA buttons (h-11) on every breakpoint.
 * `initialOpen` is computed server-side so there's no flash on load; the
 * client then keeps it fresh with a periodic re-check.
 */
export function OpenStatusBadge({
  hours,
  initialOpen,
}: {
  hours: FooterHours[];
  initialOpen: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    const id = setInterval(() => {
      setOpen(isRestaurantOpenNow(hours));
    }, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <div
      role="status"
      className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full transition-colors duration-300 ${
        open
          ? "flex-row-reverse bg-[#34c759] pr-1.5 pl-4"
          : "bg-[#ff3b30] pr-4 pl-1.5"
      }`}
    >
      <span
        aria-hidden="true"
        className="h-8 w-8 shrink-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out"
      />
      <span className="text-sm font-semibold text-white">
        {open ? "Abierto" : "Cerrado"}
      </span>
    </div>
  );
}
