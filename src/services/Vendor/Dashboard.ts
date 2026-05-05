

import api from "../api";

export async function getBookingStats() {
  const res = await api.get("/api/vendor/dashboard/counts");
  return res.data;
}