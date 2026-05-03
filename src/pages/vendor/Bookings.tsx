import {
  Box,
  Card,
  CardContent,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useVendorBookings } from "../../hooks/useVendorBookings";
import { useMemo, useState, useEffect } from "react";

import type { VendorBookingDto } from "../../components/bookings/BookingTypes";

import BookingsStatusTabs, {
  type BookingStatusFilter,
} from "../../components/bookings/BookingStatusTabs";
import BookingsToolbar from "../../components/bookings/BookingToolbar";
import BookingFilterDialog from "../../components/bookings/BookingFilterDialog";
import BookingDateRangeDialog from "../../components/bookings/BookingDateRangeDialog";
import BookingDetailDialog from "../../components/common/BookingDetailDialog";
import BookingCard from "../../components/bookings/BookingCard";

export default function Bookings() {
  // ==============================
  // State
  // ==============================
  const [statusFilter, setFilterStatus] =
    useState<BookingStatusFilter>("All");

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const [openFilters, setOpenFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] =
    useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  // ==============================
  // Data
  // ==============================
  const {
    data,
    loading,
    error,
    page,
    setPage,
    pageCount,
    refetch,
  } = useVendorBookings({
    initialPageSize: 8,
    status: statusFilter === "All" ? undefined : statusFilter,
    sortBy,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // Fix page overflow
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount || 1));
  }, [pageCount, setPage]);

  const rows: VendorBookingDto[] = data ?? [];

  // ==============================
  // Filtering
  // ==============================
  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;

    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.customerName.toLowerCase().includes(s) ||
        r.listingTitle.toLowerCase().includes(s)
    );
  }, [rows, search]);

  // ==============================
  // UI
  // ==============================
  return (
    <Stack spacing={3}>
      {/* 🔹 Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Bookings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track your bookings
        </Typography>
      </Box>

      {/* 🔹 Card */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          bgcolor: "background.paper",
        }}
      >
        {/* 🔹 Tabs */}
        <BookingsStatusTabs
          value={statusFilter}
          onChange={(value) => {
            setFilterStatus(value);
            setPage(1); // 🔥 important UX fix
          }}
        />

        {/* 🔹 Toolbar */}
        <BookingsToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1); // 🔥 reset page
          }}
          dateRange={dateRange}
          onDateRangeClick={() => setOpenDateDialog(true)}
          onFiltersClick={() => setOpenFilters(true)}
          onClear={() => {
            setFilterStatus("All");
            setDateRange({});
            setSortBy(undefined);
            setSearch("");
            setPage(1);
          }}
        />

        <CardContent sx={{ pt: 2, pb: 2.5 }}>
          {/* 🔹 Error */}
          {error ? (
            <Box
              sx={(t) => ({
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(t.palette.error.main, 0.08),
                border: `1px solid ${alpha(
                  t.palette.error.main,
                  0.2
                )}`,
              })}
            >
              <Typography
                variant="body2"
                sx={{ color: "error.main", fontWeight: 500 }}
              >
                Failed to load bookings
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {error}
              </Typography>
            </Box>
          ) : loading ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: 3 }}
            >
              Loading bookings...
            </Typography>
          ) : filteredRows.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No bookings found
            </Typography>
          ) : (
            <Stack spacing={2}>
              {filteredRows.map((b) => (
                <BookingCard
                  key={b.bookingId}
                  booking={b}
                  onClick={() => {
                    setSelectedBookingId(b.bookingId);
                    setOpenDetail(true);
                  }}
                />
              ))}
            </Stack>
          )}

          {/* 🔹 Pagination */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={pageCount || 1}
              page={page}
              onChange={(_, value) => setPage(value)}
              siblingCount={1}
              boundaryCount={1}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "text.secondary",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  bgcolor: (t) =>
                    alpha(t.palette.primary.main, 0.12),
                  color: "primary.main",
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* 🔹 Dialogs */}
      <BookingFilterDialog
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onApply={(value) => {
          setSortBy(value);
          setPage(1);
        }}
      />

      <BookingDateRangeDialog
        open={openDateDialog}
        onClose={() => setOpenDateDialog(false)}
        onApply={(start, end) => {
          setDateRange({
            startDate: start,
            endDate: end,
          });
          setPage(1);
        }}
      />

      <BookingDetailDialog
        bookingId={selectedBookingId}
        onUpdated={refetch}
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedBookingId(null);
        }}
      />
    </Stack>
  );
}