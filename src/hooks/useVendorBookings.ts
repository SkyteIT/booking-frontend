import { useCallback, useEffect, useMemo, useState } from "react";
import type { VendorBookingDto } from "../components/Bookings/BookingTypes";
import { getBookings } from "../services/Bookings/booking";

type UseVendorBookingsParams = {
  initialPageSize?: number;
  status?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export function useVendorBookings({
  initialPageSize = 10,
  status,
  sortBy,
  startDate,
  endDate,
  search,
}: UseVendorBookingsParams) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [data, setData] = useState<VendorBookingDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const fetchBookings = useCallback(
    async (isCancelled?: () => boolean) => {
      try {
        setLoading(true);
        setError(null);

        const result = await getBookings({
          page,
          pageSize,
          status,
          sortBy,
          startDate,
          endDate,
          search,
        });

        if (isCancelled?.()) return;

        // Handle both API types (very important)
        if (Array.isArray(result)) {
          // API returns plain array
          setData(result);
          setTotalCount(result.length);
        } else {
          // API returns paginated object
          setData(result.items ?? []);
          setTotalCount(result.totalCount ?? 0);
        }
      } catch (err) {
        if (isCancelled?.()) return;

        setError(err instanceof Error ? err.message : "Failed to load bookings");
        setData([]);
        setTotalCount(0);
      } finally {
        if (!isCancelled?.()) setLoading(false);
      }
    },
    [page, pageSize, status, sortBy, startDate, endDate, search]
  );

  useEffect(() => {
    let cancelled = false;

    fetchBookings(() => cancelled);

    return () => {
      cancelled = true;
    };
  }, [fetchBookings]);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    pageCount,
    refetch: () => fetchBookings(),

  };
}