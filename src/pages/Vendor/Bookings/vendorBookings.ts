import { useMemo } from "react";
import type { VendorBookingDto } from "../../../components/Bookings/BookingTypes";

export function filterBookingsBySearch(
  rows: VendorBookingDto[],
  search: string
): VendorBookingDto[] {
  if (!search.trim()) return rows;

  const s = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.customerName.toLowerCase().includes(s) ||
      r.listingTitle.toLowerCase().includes(s)
  );
}

export function useFilteredBookings(
  data: VendorBookingDto[] | undefined,
  search: string
) {
  const rows: VendorBookingDto[] = data ?? [];

  return useMemo(() => {
    return filterBookingsBySearch(rows, search);
  }, [rows, search]);
}
