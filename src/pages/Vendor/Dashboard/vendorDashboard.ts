import type { ActivityItem } from "../../../components/Vendor/Dashboard/types";

export function formatDashboardDate(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    return utcDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function buildActivityItems(
  backendActivitySource: any,
  fallbackBookings: any[]
): ActivityItem[] {
  const backendActivity: ActivityItem[] = Array.isArray(backendActivitySource)
    ? backendActivitySource.slice(0, 5).map((item: any, index: number) => ({
        id: String(item.id ?? item.activityId ?? item.bookingId ?? index),
        title: String(
          item.title ??
            item.message ??
            item.description ??
            "Booking activity update"
        ),
        time: formatDashboardDate(item.time ?? item.createdAt ?? item.date),
      }))
    : [];

  const fallbackActivity: ActivityItem[] = fallbackBookings.slice(0, 3).map((b) => ({
    id: b.bookingId,
    title: `${b.customerName} booked ${b.listingTitle}`,
    time: formatDashboardDate(b.createdAt),
  }));

  return backendActivity.length > 0 ? backendActivity : fallbackActivity;
}

export function calculateRevenuemetrics(bookings: any[]) {
  const currentRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const previousRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const growth =
    previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  return { currentRevenue, previousRevenue, growth };
}
