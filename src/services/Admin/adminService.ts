import api from "../api";

export interface DashboardStatsDto {
  totalUsers: number;
  activeUsers?: number;
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  pendingApprovals?: number;
  totalRevenue: number;
  currency: string;
  totalListings: number;
  activeListings: number;
  totalVendors: number;
  recentActivities?: AdminActivityDto[];
  topPerformingVendors?: AdminVendorPerformanceDto[];
}

export interface AdminActivityDto {
  id?: string;
  title: string;
  description?: string;
  createdAt?: string;
  timeLabel?: string;
  type?: "success" | "warning" | "info" | "error";
}

export interface AdminVendorPerformanceDto {
  id?: string;
  name: string;
  category?: string;
  revenue: number;
  bookings: number;
  rating?: number;
  trend?: number;
}

export const getDashboardStats = async (): Promise<DashboardStatsDto> => {
  const res = await api.get<DashboardStatsDto>("/admin/dashboard");
  return res.data;
};

export interface AdminUserDto {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
  phoneNumber?: string;
  createdAt: string;
  totalBookings: number;
}

export interface AdminBookingDto {
  id: string;
  customerName: string;
  customerEmail: string;
  listingTitle: string;
  listingCategory: string;
  startDateTime: string;
  endDateTime: string;
  totalAmount: number;
  currency: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Cancelled" | "Completed";
  createdAt: string;
}

export const getAllUsers = async (): Promise<AdminUserDto[]> => {
  const res = await api.get<AdminUserDto[]>("/admin/users");
  return res.data;
};

export const getUserById = async (userId: string): Promise<AdminUserDto> => {
  const res = await api.get<AdminUserDto>(`/admin/users/${userId}`);
  return res.data;
};

export const updateUserRole = async (userId: string, role: string): Promise<AdminUserDto> => {
  const res = await api.put<AdminUserDto>(`/admin/users/${userId}/role`, { role });
  return res.data;
};

// isSuspended: true suspends the user, false reactivates them.
export const updateUserStatus = async (userId: string, isSuspended: boolean): Promise<AdminUserDto> => {
  const res = await api.put<AdminUserDto>(`/admin/users/${userId}/status`, { isSuspended });
  return res.data;
};

export const getAllBookings = async (): Promise<AdminBookingDto[]> => {
  const res = await api.get<AdminBookingDto[]>("/admin/bookings");
  return res.data;
};

export const getBookingById = async (bookingId: string): Promise<AdminBookingDto> => {
  const res = await api.get<AdminBookingDto>(`/admin/bookings/${bookingId}`);
  return res.data;
};

// Backend only accepts: "confirmed" | "cancelled" | "completed" | "pending"
// (case-insensitive) — "Rejected" bookings can be viewed but not set via this endpoint.
export const updateBookingStatus = async (
  bookingId: string,
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
): Promise<AdminBookingDto> => {
  const res = await api.put<AdminBookingDto>(`/admin/bookings/${bookingId}/status`, { status });
  return res.data;
};
