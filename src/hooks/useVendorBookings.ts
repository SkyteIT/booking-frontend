// src/hooks/useVendorBookings.ts

import { useEffect, useMemo, useState } from "react";
import { getVendorBookings } from "../services/Vendor/vendorBookings";
import type {
  VendorBookingDto,
} from "../components/vendor/bookings/BookingTypes";

type UseVendorBookingsParams = {
  vendorId: string;
  initialPageSize?: number;
};

export function useVendorBookings({
  vendorId,
  initialPageSize = 10,
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

  useEffect(() => {
    let cancelled = false;
g
    async function fetchBookings() {
      try {
        setLoading(true);
        setError(null);

        const result = await getVendorBookings({
          vendorId,
          page,
          pageSize,
        });

        if (cancelled) return;

        setData(result.items);
        setTotalCount(result.totalCount);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load bookings");
        setData([]);
        setTotalCount(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [vendorId, page, pageSize]);

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
  };
}