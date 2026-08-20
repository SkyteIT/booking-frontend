import api from "../api";

// Matches backend VendorBookingDto - the list-row shape returned by
// GetCustomerBookingsAsync (reused between vendor and customer lists).
export interface CustomerBookingListItem {
  bookingId: string;
  bookingNumber: string;
  listingTitle: string;
  customerName: string;
  startDateTime: string;
  endDateTime: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Cancelled" | "Completed";
  totalAmount: number;
  currency: string;
  createdAt: string;
}

export interface BookingDetailDto {
  bookingId: string;
  bookingNumber: string;
  listingTitle: string;
  customerName: string;
  customerEmail: string;
  startDateTime: string;
  endDateTime: string;
  status: "Pending" | "Confirmed" | "Rejected" | "Cancelled" | "Completed";
  totalAmount: number;
  currency: string;
  createdAt: string;
  canConfirm: boolean;
  canReject: boolean;
  canCancel: boolean;
  canReview: boolean;
  reviewId: string | null;
  reviewRating: number | null;
  reviewComment: string | null;
  reviewCreatedAt: string | null;
  reviewVendorReply: string | null;
  reviewVendorReplyAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export const getMyBookings = async (params: {
  status?: string;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}): Promise<PagedResult<CustomerBookingListItem>> => {
  const res = await api.get<PagedResult<CustomerBookingListItem>>("/bookings", {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.status && params.status !== "All" ? { Status: params.status } : {}),
      ...(params.sortBy && { SortBy: params.sortBy }),
      ...(params.startDate && { StartDate: params.startDate }),
      ...(params.endDate && { EndDate: params.endDate }),
      ...(params.search && { Search: params.search }),
    },
  });
  return res.data;
};

export const getMyBookingDetail = async (bookingId: string): Promise<BookingDetailDto> => {
  const res = await api.get<BookingDetailDto>(`/bookings/${bookingId}`);
  return res.data;
};

export const cancelMyBooking = async (bookingId: string): Promise<BookingDetailDto> => {
  const res = await api.patch<BookingDetailDto>(`/bookings/${bookingId}/cancel`);
  return res.data;
};
