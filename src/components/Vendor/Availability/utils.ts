import type { DateOnly, DateRange } from "./type.ts";



// Always treat DateOnly as local calendar date, not timezone date-time.
export function toDateOnly(d: Date): DateOnly {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateOnly(s: DateOnly): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function isSameDateOnly(a: DateOnly, b: DateOnly) {
  return a === b;
}

export function isInRange(day: DateOnly, range: DateRange): boolean {
  const x = parseDateOnly(day).getTime();
  const s = parseDateOnly(range.start).getTime();
  const e = parseDateOnly(range.end).getTime();
  return x >= s && x <= e;
}

// ---------- Overlap rule (core business logic) ----------

export function rangesOverlap(a: DateRange, b: DateRange): boolean {
  const aStart = parseDateOnly(a.start).getTime();
  const aEnd = parseDateOnly(a.end).getTime();
  const bStart = parseDateOnly(b.start).getTime();
  const bEnd = parseDateOnly(b.end).getTime();

  return aStart <= bEnd && bStart <= aEnd;
}

// Convert booking datetimes -> date-only range 
export function bookingToDateRange(startIso: string, endIso: string): DateRange {
  const start = new Date(startIso);
  const end = new Date(endIso);

  // treat booking as spanning calendar days
  return { start: toDateOnly(start), end: toDateOnly(end) };
}

// Get all days in month with leading blanks
export function getMonthMeta(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const firstDayOfWeek = first.getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { year, month, firstDayOfWeek, daysInMonth };
}