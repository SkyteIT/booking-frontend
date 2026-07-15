import type { RawApiRecord } from "../../../utils/types";

export function unwrapCollection<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];

  const obj = data as RawApiRecord | null | undefined;
  if (Array.isArray(obj?.$values)) return obj.$values as T[];
  if (Array.isArray(obj?.items)) return obj.items as T[];
  if (Array.isArray(obj?.result)) return obj.result as T[];
  if (Array.isArray(obj?.data)) return obj.data as T[];
  if (Array.isArray(obj?.calendar)) return obj.calendar as T[];
  return [];
}

export function getBookingCount(day: unknown): number {
  const d = day as RawApiRecord | null | undefined;
  return Number(
    d?.bookingCount ??
      d?.bookedCount ??
      d?.bookingTotal ??
      d?.totalBookings ??
      d?.bookingsCount ??
      0
  );
}

export function isBlockedDay(day: unknown): boolean {
  const d = day as RawApiRecord | null | undefined;
  return Boolean(d?.isBlocked || d?.status === 3 || d?.status === "Blocked");
}

export function isPastDay(dateOnly: string): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    return dateOnly < today;
  } catch {
    return false;
  }
}

export function normalizeCalendarResponse(data: unknown): RawApiRecord[] {
  return unwrapCollection<RawApiRecord>(data);
}

export function summarizeCalendar(calendarDays: RawApiRecord[]) {
  const blockedDates = new Set<string>();
  let totalBookings = 0;

  for (const day of calendarDays) {
    const dateKey = String(day?.date ?? "").slice(0, 10);

    if (!dateKey) continue;

    const cnt = getBookingCount(day);
    if (cnt > 0) {
      totalBookings += cnt;
    }

    if (isBlockedDay(day)) {
      blockedDates.add(dateKey);
    }
  }

  return {
    // `bookedCount` represents total bookings across the month (not unique booked dates)
    bookedCount: totalBookings,
    blockedCount: blockedDates.size,
  };
}
