import api from "./api";

export interface ReviewDto {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface VendorRatingDto {
  averageRating: number;
  totalCount: number;
}

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface GetVendorReviewsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  rating?: number;
}

// Creates a review for a completed booking. Backend enforces: booking must
// be Completed, caller must be the booking's customer, one review per
// booking, rating 1-5.
export const createReview = async (payload: CreateReviewPayload): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>("/reviews", payload);
  return res.data;
};

// Backend re-validates ownership (only the review's author can update it).
export const updateReview = async (
  reviewId: string,
  payload: CreateReviewPayload
): Promise<{ message: string }> => {
  const res = await api.put<{ message: string }>(`/reviews/${reviewId}`, payload);
  return res.data;
};

export const deleteReview = async (reviewId: string): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>(`/reviews/${reviewId}`);
  return res.data;
};

export const getVendorReviews = async (
  vendorId: string,
  params: GetVendorReviewsParams = {}
): Promise<PagedResult<ReviewDto>> => {
  const res = await api.get<PagedResult<ReviewDto>>(`/vendors/${vendorId}/reviews`, {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search && { Search: params.search }),
      ...(params.rating !== undefined && { Rating: params.rating }),
    },
  });
  return res.data;
};

export const getVendorRating = async (vendorId: string): Promise<VendorRatingDto> => {
  const res = await api.get<VendorRatingDto>(`/vendors/${vendorId}/reviews/rating`);
  return res.data;
};

// Vendor-only: reply to a review left on their listing.
export const replyToReview = async (reviewId: string, reply: string): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(`/vendor/reviews/${reviewId}/reply`, { reply });
  return res.data;
};
