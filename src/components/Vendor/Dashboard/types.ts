export type DashboardStats = {
  title: string;
  value: string;
  icon: React.ReactNode;
  helperText: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
};

export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

export type BookingRow = {
  id: string;
  item: string;
  customer: string;
  date: string;
  status: BookingStatus;
  amount: string;
};

// Shape of GET /api/vendor/dashboard — kept loose since the "recent
// activity" field name (and its item shape) isn't contractually fixed on
// the backend; buildActivityItems() in vendorDashboard.ts parses it
// defensively.
export type DashboardSummary = {
  activeBookings?: number;
  totalListings?: number;
  averageRating?: number;
  recentActivity?: unknown;
  recentActivities?: unknown;
  activities?: unknown;
};

// Shape of GET /api/vendor/dashboard/counts
export type BookingStats = {
  pending?: number;
  confirmed?: number;
  cancelled?: number;
  rejected?: number;
  completed?: number;
  total?: number;
};