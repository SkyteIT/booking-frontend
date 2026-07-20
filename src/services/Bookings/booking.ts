import type { VendorBookingDto, PageResult } from "../../components/Bookings/BookingTypes";
import type { DashboardSummary } from "../../components/Vendor/Dashboard/types";
import api from "../api";

// GET LIST
export const getBookings = async (params: {
  status?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await api.get<PageResult<VendorBookingDto>>("/vendor/bookings", {
    params: {
      PageNumber: params.page,
      PageSize: params.pageSize,
      ...(params.status && params.status !== "All" ? { Status: params.status } : {}),
      ...(params.sortBy && { SortBy: params.sortBy }),
      ...(params.startDate && { StartDate: params.startDate }),
      ...(params.endDate && { EndDate: params.endDate }),
    },
  });

  return res.data;
};

// GET DETAIL
export const getBookingDetail = async (bookingId: string) => {
  const res = await api.get(`/vendor/bookings/${bookingId}`);

  return res.data;
};

// UPDATE STATUS
export const updateBookingStatus = async (
  bookingId: string,
  newStatus: string
) => {
  const res = await api.patch(`/vendor/bookings/${bookingId}/status`, {
    newStatus,
  });

  return res.data;
};
export const getDashboard = async () => {
  const res = await api.get<DashboardSummary>("/vendor/dashboard");

  return res.data;
};