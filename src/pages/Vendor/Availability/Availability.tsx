import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import BookingDetailDialog from "../../../components/common/BookingDetailDialog";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import AvailabilityMonthGrid from "../../../components/Vendor/Availability/AvailabilityMonthGrid";
import AvailabilityLegend from "../../../components/Vendor/Availability/Availabilitystatus";
import AvailabilityToolbar from "../../../components/Vendor/Availability/AvailabilityToolbar";
import BookingsByDateDialog from "../../../components/Vendor/Availability/BookingsByDateDialog";
import Instruction from "../../../components/Vendor/Availability/Instruction";
import ListingSelector from "../../../components/Vendor/Availability/ListingSelector";
import { useVendorAvailability } from "./useVendorAvailability";

export default function Availability() {
  const {
    listings,
    selectedListingId,
    setSelectedListingId,
    monthDate,
    setMonthDate,
    calendar,
    selectedDates,
    setSelectedDates,
    selectedDate,
    openDateDialog,
    setOpenDateDialog,
    selectedBookingId,
    setSelectedBookingId,
    confirmOpen,
    setConfirmOpen,
    actionType,
    snackbar,
    handleCloseSnackbar,
    handleConfirm,
    refreshBookings,
    handleBlockAction,
    handleUnblockAction,
    handleToggleDate,
    month,
    year,
  } = useVendorAvailability();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Availability Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your listing availability and view bookings
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
        <CardContent>
          <ListingSelector
            listings={listings}
            selectedListingId={selectedListingId}
            onSelectListing={setSelectedListingId}
          />

          <Box sx={{ mt: 3 }}>
            <AvailabilityToolbar
              monthDate={monthDate}
              onPrevMonth={() => {
                setMonthDate(new Date(year, month - 2, 1));
                setSelectedDates([]);
              }}
              onNextMonth={() => {
                setMonthDate(new Date(year, month, 1));
                setSelectedDates([]);
              }}
              selectedCount={selectedDates.length}
              onBlock={handleBlockAction}
              onUnblock={handleUnblockAction}
              onClear={() => setSelectedDates([])}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <AvailabilityLegend />
          </Box>

          <Box sx={{ mt: 2 }}>
            <AvailabilityMonthGrid
              monthDate={monthDate}
              calendar={calendar}
              selectedDates={selectedDates}
              onToggleDate={handleToggleDate}
            />
          </Box>
        </CardContent>
      </Card>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />

      <BookingDetailDialog
        bookingId={selectedBookingId}
        open={!!selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
        onUpdated={refreshBookings}
      />

      <BookingsByDateDialog
        date={selectedDate}
        open={openDateDialog}
        onClose={() => setOpenDateDialog(false)}
        onSelectBooking={(id) => {
          setSelectedBookingId(id);
          setOpenDateDialog(false);
        }}
      />

      <Instruction />
      <ConfirmDialog
        open={confirmOpen}
        title={actionType === "block" ? "Block Dates" : "Unblock Dates"}
        message={
          actionType === "block"
            ? `You are about to block ${selectedDates.length} date(s). This will prevent bookings.`
            : `You are about to unblock ${selectedDates.length} date(s).`
        }
        confirmText={actionType === "block" ? "Block" : "Unblock"}
        confirmColor={actionType === "block" ? "error" : "primary"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Stack>
  );
}
