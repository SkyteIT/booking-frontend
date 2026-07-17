import type { BookingStats } from "../../components/Vendor/Dashboard/types";
import api from "../api";

export async function getBookingStats() {
  const res = await api.get<BookingStats>("/vendor/dashboard/counts");
  return res.data;
}