import { useEffect, useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";


import ListingSelector from "../../components/vendor/Availability/ListingSelector";
import AvailabilityToolbar from "../../components/vendor/Availability/AvailabilityToolbar";
import AvailabilityLegend from "../../components/vendor/Availability/Availabilitystatus";
import AvailabilityMonthGrid from "../../components/vendor/Availability/AvailabilityMonthGrid";
import Instruction from "../../components/vendor/Availability/Instruction";

import { getAvailability, blockDates, unblockDates } from "../../services/Vendor/availability";
import { getVendorListings } from "../../services/Vendor/listing";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SnackbarAlert from "../../components/common/SnackbarAlert";
import BookingDetailsDialog from "../../components/common/BookingDetailssDialog";

type ListingCard = {
  id: string;
  name: string;
  bookedCount: number;
  blockedCount: number;
};

export default function Availability() {

  const [listings, setListings] = useState<ListingCard[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const [monthDate, setMonthDate] = useState(new Date());
  const [calendar, setCalendar] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  

  const month = monthDate.getMonth() + 1;
  const year = monthDate.getFullYear();
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"block" | "unblock" | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });
  const showMessage = (
  message: string,
  severity: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const handleConfirm = async () => {
    if (!selectedListingId || !actionType) return;

    try {
      const formattedDates = selectedDates.map(d => `${d}T00:00:00`);

      if (actionType === "block") {
        await blockDates(selectedListingId, { dates: formattedDates });
        showMessage("Dates blocked successfully", "success");
      } else {
        await unblockDates(selectedListingId, { dates: formattedDates });
        showMessage("Dates unblocked successfully", "success");
      }

      const data = await getAvailability(selectedListingId, month, year);
      setCalendar(data);
      setSelectedDates([]);

    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Action failed ";

      showMessage(msg, "error");
    } finally {
      setConfirmOpen(false);
      setActionType(null);
    }
  };
  // Load listings
  useEffect(() => {
  console.log("useEffect for listings triggered");

  const vendorId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  console.log("vendorId:", vendorId);

  getVendorListings(vendorId)
    .then((data) => {
      console.log("API RESPONSE:", data);

      setListings(
        data.map((l: any) => ({
          id: l.id,
          name: l.title,
          bookedCount: 0,
          blockedCount: 0,
        }))
      );
    })
    .catch((err) => {
      console.error(" API ERROR:", err);
    });

}, []);

  // Load calendar
  useEffect(() => {
    if (!selectedListingId) return;

    getAvailability(selectedListingId, month, year)
      .then((data) => {
        setCalendar(data);
      })
      .catch((err) => console.error("Availability error:", err));

  }, [selectedListingId, month, year]);

  return (
    <Stack spacing={3}>

      {/* HEADER */}
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Availability Calendar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage availability for your listings
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>

          {/* LISTINGS */}
          <ListingSelector
            listings={listings}
            selectedListingId={selectedListingId}
            onSelectListing={setSelectedListingId}
          />

          {/* TOOLBAR */}
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

              // Block selected dates
              onBlock={async () => {
                if (!selectedListingId ){
                  showMessage("Please select a listing first.", "warning");
                  return;
                }
                  if (selectedDates.length === 0) {
                  showMessage("Please select dates to block.", "warning");
                  return;
                }
                setActionType("block");
                setConfirmOpen(true);

               
              }}

              // Unblock selected dates
              onUnblock={async () => {
                if (!selectedListingId ){
                  showMessage("Please select a listing first.","warning");
                  return;
                }
                if (selectedDates.length === 0) {
                  showMessage("Please select dates to unblock.", "warning");
                  return;
                }

                setActionType("unblock");
                setConfirmOpen(true);
              }}

              onClear={() => setSelectedDates([])}
            />
          </Box>

          {/* LEGEND */}
          <Box sx={{ mt: 2 }}>
            <AvailabilityLegend />
          </Box>

          {/* CALENDAR */}
          <Box sx={{ mt: 2 }}>
            <AvailabilityMonthGrid
              monthDate={monthDate}
              calendar={calendar}
              selectedDates={selectedDates}
              
              onToggleDate={(date) => {
                if (!selectedListingId) {
                  showMessage("Please select a listing first.", "warning");
                  return;
                }

                const found = calendar.find((d) =>
                  d.date.startsWith(date)
                );

                if (!found) return;

                //only open popup if bookings exist
                if (found.bookingCount && found.bookingCount > 0) {
                  setSelectedDay(found);
                  setDetailsOpen(true);
                  return;
                }

                // normal selection (block/unblock flow)
                setSelectedDates((prev) =>
                  prev.includes(date)
                    ? prev.filter((d) => d !== date)
                    : [...prev, date]
                );
              }}
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

      <BookingDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        data={selectedDay}
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