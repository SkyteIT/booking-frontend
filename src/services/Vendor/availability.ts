import api from "../api";

type DateRangeBody = {
  dates: string[];
};

// Get availability calendar for a listing and month
export const getAvailability = async (
  listingId: string,
  month: number,
  year: number
) => {
  const res = await api.get(`/api/availability/${listingId}/calendar`, {
    params: { month, year }
  });
  return res.data;
};
// Block dates for a listing
export const blockDates = (listingId: string, body: DateRangeBody) =>
  api.post(`/api/availability/${listingId}/block`, body);
// Unblock dates for a listing
export const unblockDates = (listingId: string, body: DateRangeBody) =>
  api.post(`/api/availability/${listingId}/unblock`, body);