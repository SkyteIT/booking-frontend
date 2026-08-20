// Mirrors the backend's BusinessDate.Today (Ube.Application.Common.Helpers) -
// "today" for calendar-day comparisons a vendor/customer would recognize on
// their own calendar (offer active windows, "starts today" checks), not
// genuine elapsed-time comparisons.
//
// `new Date().toISOString()` always renders in UTC regardless of the
// browser's local timezone, so a same-day comparison built on it can lag
// the user's actual local date by hours - UBE's users are Sri Lanka based
// (UTC+5:30), so a plain UTC "today" can be a full calendar day behind
// what the vendor sees on their own screen. Use this instead of rolling a
// local `new Date().toISOString().slice(0, 10)` wherever the comparison is
// about a calendar day, not a duration.
export function businessDateToday(): string {
  const BUSINESS_OFFSET_MINUTES = 5.5 * 60;
  const shifted = new Date(Date.now() + BUSINESS_OFFSET_MINUTES * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}
