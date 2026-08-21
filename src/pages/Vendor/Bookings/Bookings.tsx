import {
  Box,
  Card,
  CardContent,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import BookingCard from "../../../components/Bookings/BookingCard";
import BookingDateRangeDialog from "../../../components/Bookings/BookingDateRangeDialog";
import BookingFilterDialog from "../../../components/Bookings/BookingFilterDialog";
import BookingsStatusTabs from "../../../components/Bookings/BookingStatusTabs";
import BookingsToolbar from "../../../components/Bookings/BookingToolbar";
import BookingDetailDialog from "../../../components/common/BookingDetailDialog";
import { useVendorBookingsPage } from "./useVendorBookingsPage";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function Bookings() {
  const {
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
    loading,
    error,
    page,
    setPage,
    pageCount,
    filteredRows,
    refetch,
  } = useVendorBookingsPage();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          Bookings
          <Box component="span" sx={{ width: 8, height: 8, borderRadius: "3px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track your bookings
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
        }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          <BookingsStatusTabs value={statusFilter} onChange={handleStatusChange} />
            <Box sx={{ mt: 2 }}>
                <BookingsToolbar
                search={search}
                onSearchChange={handleSearchChange}
                dateRange={dateRange}
                onDateRangeClick={() => setOpenDateDialog(true)}
                onFiltersClick={() => setOpenFilters(true)}
                onClear={handleClearFilters}
                />
            </Box>
        </Box>

        <CardContent sx={{ pt: 2, pb: 2.5 }}>
          {error ? (
            <Box
              sx={(t) => ({
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(t.palette.error.main, 0.08),
                border: `1px solid ${alpha(t.palette.error.main, 0.2)}`,
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
            <LoadingSpinner fullScreen={false} py={3} />
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

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
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
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                  color: "primary.main",
                  fontWeight: 500,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <BookingFilterDialog
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onApply={handleFilterApply}
      />

      <BookingDateRangeDialog
        open={openDateDialog}
        onClose={() => setOpenDateDialog(false)}
        onApply={handleDateRangeApply}
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
