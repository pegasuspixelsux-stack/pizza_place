"use client";

import { useEffect, useState } from "react";
import { isRestaurantOpenNow } from "@/lib/openStatus";
import type { FooterHours } from "@/lib/types";

/**
 * An iOS-style toggle switch used purely as a status indicator (not
 * interactive): the knob slides to the right on a green track when the
 * restaurant is currently open, and to the left on red when it's closed.
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
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
          open ? "bg-[#34c759]" : "bg-[#ff3b30]"
        }`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out ${
            open ? "left-[26px]" : "left-1"
          }`}
        />
      </span>
      <span
        role="status"
        className={`text-sm font-medium ${
          open ? "text-[#248a3d]" : "text-[#d70015]"
        }`}
      >
        {open ? "Abierto ahora" : "Cerrado ahora"}
      </span>
    </div>
  );
}
