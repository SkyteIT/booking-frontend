export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type TimeSlot = {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
};

export type DayAvailability = {
  day: DayOfWeek;
  available: boolean;
  slots: TimeSlot[];
};

export type AvailabilityOverride = {
  date: string; // ISO date "YYYY-MM-DD"
  available: boolean;
  slots: TimeSlot[];
};

export type VendorAvailability = {
  vendorId: string;
  weeklySchedule: DayAvailability[];
  overrides: AvailabilityOverride[];
};

export function formatTimeSlot(slot: TimeSlot): string {
  return `${slot.start} – ${slot.end}`;
}

export function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isDateOverridden(
  overrides: AvailabilityOverride[],
  isoDate: string
): boolean {
  return overrides.some((o) => o.date === isoDate);
}

export function getOverrideForDate(
  overrides: AvailabilityOverride[],
  isoDate: string
): AvailabilityOverride | undefined {
  return overrides.find((o) => o.date === isoDate);
}

export function getDayAvailability(
  weeklySchedule: DayAvailability[],
  day: DayOfWeek
): DayAvailability | undefined {
  return weeklySchedule.find((d) => d.day === day);
}
