import { Box, Card, CardContent, Pagination, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import BookingCard from "../../components/Bookings/BookingCard";
import BookingDateRangeDialog from "../../components/Bookings/BookingDateRangeDialog";
import BookingFilterDialog from "../../components/Bookings/BookingFilterDialog";
import BookingsStatusTabs from "../../components/Bookings/BookingStatusTabs";
import BookingsToolbar from "../../components/Bookings/BookingToolbar";
import CustomerBookingDetailDialog from "../../components/Bookings/CustomerBookingDetailDialog";
import CustomerPageLayout from "./CustomerPageLayout";
import { useCustomerBookingsPage } from "./useCustomerBookingsPage";

export default function CustomerBookings() {
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
    data,
    refetch,
  } = useCustomerBookingsPage();

  return (
    <CustomerPageLayout title="My Bookings" subtitle="View and manage your bookings.">
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          bgcolor: "background.paper",
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
              <Typography variant="body2" sx={{ color: "error.main", fontWeight: 500 }}>
                Failed to load bookings
              </Typography>
            </Box>
          ) : loading ? (
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          ) : data.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                You don't have any bookings yet.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {data.map((booking) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  onClick={() => {
                    setSelectedBookingId(booking.bookingId);
                    setOpenDetail(true);
                  }}
                />
              ))}
            </Stack>
          )}

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </CardContent>
      </Card>

      <CustomerBookingDetailDialog
        bookingId={selectedBookingId}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        onUpdated={refetch}
      />

      <BookingDateRangeDialog
        open={openDateDialog}
        onClose={() => setOpenDateDialog(false)}
        onApply={handleDateRangeApply}
      />

      <BookingFilterDialog
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onApply={handleFilterApply}
      />
    </CustomerPageLayout>
  );
}
