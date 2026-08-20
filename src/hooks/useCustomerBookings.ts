import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyBookings, type CustomerBookingListItem } from "../services/Customer/bookingService";

type UseCustomerBookingsParams = {
  initialPageSize?: number;
  status?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export function useCustomerBookings({
  initialPageSize = 10,
  status,
  sortBy,
  startDate,
  endDate,
  search,
}: UseCustomerBookingsParams) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  const [data, setData] = useState<CustomerBookingListItem[]>([]);
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

        const result = await getMyBookings({
          pageNumber: page,
          pageSize,
          status,
          sortBy,
          startDate,
          endDate,
          search,
        });

        if (isCancelled?.()) return;

        setData(result.items ?? []);
        setTotalCount(result.totalCount ?? 0);
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
    totalCount,
    pageCount,
    refetch: () => fetchBookings(),
  };
}
