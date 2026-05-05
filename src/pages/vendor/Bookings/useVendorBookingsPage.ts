import { useEffect, useState } from "react";
import { useVendorBookings } from "../../../hooks/useVendorBookings";
import type { BookingStatusFilter } from "../../../components/bookings/BookingStatusTabs";
import { useFilteredBookings } from "./vendorBookings";

export function useVendorBookingsPage() {
  const [statusFilter, setFilterStatus] = useState<BookingStatusFilter>("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [openFilters, setOpenFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const { data, loading, error, page, setPage, pageCount, refetch } =
    useVendorBookings({
      initialPageSize: 8,
      status: statusFilter === "All" ? undefined : statusFilter,
      sortBy,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount || 1));
  }, [pageCount, setPage]);

  const filteredRows = useFilteredBookings(data, search);

  const handleStatusChange = (status: BookingStatusFilter) => {
    setFilterStatus(status);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleDateRangeApply: (start?: string, end?: string) => void = (start?: string, end?: string) => {
    setDateRange({ startDate: start, endDate: end });
    setPage(1);
  };

  const handleFilterApply = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterStatus("All");
    setDateRange({});
    setSortBy(undefined);
    setSearch("");
    setPage(1);
  };

  return {
    statusFilter,
    handleStatusChange,
    search,
    handleSearchChange,
    dateRange,
    openFilters,
    setOpenFilters,
    openDateDialog,
    setOpenDateDialog,
    selectedBookingId,
    setSelectedBookingId,
    openDetail,
    setOpenDetail,
    handleDateRangeApply,
    handleFilterApply,
    handleClearFilters,
    data,
    loading,
    error,
    page,
    setPage,
    pageCount,
    filteredRows,
    refetch,
  };
}
