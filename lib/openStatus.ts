import type { FooterHours } from "./types";

// Sunday = 0 … Saturday = 6, matching both Date#getDay() and the Intl
// weekday abbreviations used below.
const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const INTL_WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const RESTAURANT_TIME_ZONE = "America/Montevideo";

const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .trim();
}

function dayIndex(name: string): number | null {
  const index = DAY_NAMES.indexOf(normalize(name));
  return index === -1 ? null : index;
}

/**
 * Parses a free-text "days" field (as typed into the admin dashboard) into
 * the set of weekdays it covers. Understands single days ("Domingo"),
 * ranges ("Lunes a jueves"), lists ("Viernes y sábado", comma-separated),
 * and "todos los días" for every day.
 */
export function parseDays(daysText: string): Set<number> {
  const result = new Set<number>();
  const normalized = normalize(daysText);

  if (normalized.includes("todos los dias") || normalized === "diario") {
    return new Set([0, 1, 2, 3, 4, 5, 6]);
  }

  const parts = normalized
    .split(/,| y /)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes(" a ")) {
      const [fromRaw, toRaw] = part.split(" a ").map((p) => p.trim());
      const from = dayIndex(fromRaw);
      const to = dayIndex(toRaw);
      if (from === null || to === null) continue;
      let i = from;
      // Walk forward cyclically so a range like "Viernes a lunes" wraps
      // across the weekend correctly.
      for (let steps = 0; steps < 7; steps++) {
        result.add(i);
        if (i === to) break;
        i = (i + 1) % 7;
      }
    } else {
      const index = dayIndex(part);
      if (index !== null) result.add(index);
    }
  }

  return result;
}

/** Parses a "HH:MM – HH:MM" time range into minutes-since-midnight. */
export function parseTimeRange(
  timeText: string
): { startMinutes: number; endMinutes: number } | null {
  const cleaned = timeText.replace(/[–—]/g, "-");
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const [, h1, m1, h2, m2] = match;
  return {
    startMinutes: Number(h1) * 60 + Number(m1),
    endMinutes: Number(h2) * 60 + Number(m2),
  };
}

function getRestaurantLocalTime(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: RESTAURANT_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return {
    day: INTL_WEEKDAY_TO_INDEX[weekday] ?? 0,
    minutes: hour * 60 + minute,
  };
}

/**
 * Whether the restaurant is open right now, in its own timezone
 * (America/Montevideo), based on the footer's operating-hours rows.
 */
export function isRestaurantOpenNow(hours: FooterHours[]): boolean {
  const { day: today, minutes: nowMinutes } = getRestaurantLocalTime();

  for (const entry of hours) {
    const days = parseDays(entry.days);
    if (!days.has(today)) continue;

    const range = parseTimeRange(entry.time);
    if (!range) continue;

    const { startMinutes, endMinutes } = range;
    if (endMinutes > startMinutes) {
      if (nowMinutes >= startMinutes && nowMinutes < endMinutes) return true;
    } else {
      // Overnight range (e.g. 20:00–02:00).
      if (nowMinutes >= startMinutes || nowMinutes < endMinutes) return true;
    }
  }

  return false;
}
