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