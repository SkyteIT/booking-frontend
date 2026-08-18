import api from "../api";

export interface DashboardStatsDto {
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  currency: string;
  totalListings: number;
  activeListings: number;
  totalVendors: number;
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

// Fetches the server-generated CSV as a Blob. Needs responseType: "blob" -
// without it, axios would try to parse the CSV text as JSON and fail.
export const exportBookingsCsv = async (): Promise<Blob> => {
  const res = await api.get("/admin/bookings/export", { responseType: "blob" });
  return res.data as Blob;
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
