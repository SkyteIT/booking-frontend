export function unwrapCollection<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.$values)) return data.$values;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.calendar)) return data.calendar;
  return [];
}

export function getBookingCount(day: any): number {
  return Number(
    day?.bookingCount ??
      day?.bookedCount ??
      day?.bookingTotal ??
      day?.totalBookings ??
      day?.bookingsCount ??
      0
  );
}

export function isBlockedDay(day: any): boolean {
  return Boolean(day?.isBlocked || day?.status === 3 || day?.status === "Blocked");
}

export function isPastDay(dateOnly: string): boolean {
  try {
    const today = new Date().toISOString().slice(0, 10);
    return dateOnly < today;
  } catch {
    return false;
  }
}

export function normalizeCalendarResponse(data: any): any[] {
  return unwrapCollection<any>(data);
}

export function summarizeCalendar(calendarDays: any[]) {
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
