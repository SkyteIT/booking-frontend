import { useEffect, useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";


import ListingSelector from "../../components/vendor/Availability/ListingSelector";
import AvailabilityToolbar from "../../components/vendor/Availability/AvailabilityToolbar";
import AvailabilityLegend from "../../components/vendor/Availability/Availabilitystatus";
import AvailabilityMonthGrid from "../../components/vendor/Availability/AvailabilityMonthGrid";
import Instruction from "../../components/vendor/Availability/Instruction";

import { getAvailability, blockDates, unblockDates } from "../../services/Vendor/availability";
import { toDateOnly } from "../../components/vendor/Availability/utils";
import { getVendorListings } from "../../services/Vendor/listing";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SnackbarAlert from "../../components/common/SnackbarAlert";
import BookingDetailDialog from "../../components/common/BookingDetailDialog";
import BookingsByDateDialog from "../../components/vendor/Availability/BookingsByDateDialog";

type ListingCard = {
  id: string;
  name: string;
  bookedCount: number;
  blockedCount: number;
};

function unwrapCollection<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.$values)) return data.$values;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.calendar)) return data.calendar;
  return [];
}

function getBookingCount(day: any) {
  return Number(
    day?.bookingCount ??
    day?.bookedCount ??
    day?.bookingTotal ??
    day?.totalBookings ??
    day?.bookingsCount ??
    0
  );
}

function isBlockedDay(day: any) {
  return Boolean(day?.isBlocked || day?.status === 3 || day?.status === "Blocked");
}

function isPastDay(dateOnly: string) {
  try {
    const today = toDateOnly(new Date());
    return dateOnly < today;
  } catch {
    return false;
  }
}

function normalizeCalendarResponse(data: any) {
  return unwrapCollection<any>(data);
}

function summarizeCalendar(calendarDays: any[]) {
  const bookedDates = new Set<string>();
  const blockedDates = new Set<string>();

  for (const day of calendarDays) {
    const dateKey = String(day?.date ?? "").slice(0, 10);

    if (!dateKey) continue;

    if (getBookingCount(day) > 0) {
      bookedDates.add(dateKey);
    }

    if (isBlockedDay(day)) {
      blockedDates.add(dateKey);
    }
  }

  return {
    bookedCount: bookedDates.size,
    blockedCount: blockedDates.size,
  };
}

export default function Availability() {

  const [listings, setListings] = useState<ListingCard[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const [monthDate, setMonthDate] = useState(new Date());
  const [calendar, setCalendar] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  

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
      const normalized = normalizeCalendarResponse(data);
      setCalendar(normalized);
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === selectedListingId
            ? {
                ...listing,
                ...summarizeCalendar(normalized),
              }
            : listing
        )
      );
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
    getVendorListings()
      .then((data) => {
        const rows = unwrapCollection<any>(data);

        const mapped = rows
          .map((l: any) => ({
            id: String(l.id ?? l.listingId ?? l.listingID ?? l.listing?.id ?? ""),
            name: String(l.title ?? l.name ?? l.listingTitle ?? "Untitled listing"),
            bookedCount: Number(l.bookedCount ?? l.bookingCount ?? l.totalBookings ?? 0),
            blockedCount: Number(l.blockedCount ?? l.blockCount ?? l.totalBlocked ?? 0),
          }))
          .filter((item: ListingCard) => Boolean(item.id));

        setListings(mapped);

        if (mapped.length > 0) {
          setSelectedListingId((current) => current ?? mapped[0].id);
        }
      })
      .catch((err) => {
        console.error(" API ERROR:", err);
        showMessage(
          err?.response?.data?.message || "Failed to load your listings.",
          "error"
        );
      });
  }, []);

  // Load calendar
  useEffect(() => {
    if (!selectedListingId) return;

    getAvailability(selectedListingId, month, year)
      .then((data) => {
        const normalized = normalizeCalendarResponse(data);
        console.debug("Availability.load", { listing: selectedListingId, month, year, returned: normalized?.length });
        setCalendar(normalized);
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === selectedListingId
              ? {
                  ...listing,
                  ...summarizeCalendar(normalized),
                }
              : listing
          )
        );
      })
      .catch((err) => console.error("Availability error:", err));

  }, [selectedListingId, month, year]);

  const refreshBookings = async () => {
    if (!selectedListingId) return;

    try {
      const data = await getAvailability(selectedListingId, month, year);
      setCalendar(normalizeCalendarResponse(data));
    } catch (err) {
      console.error("Availability refresh error:", err);
    }
  };

  return (
    <Stack spacing={3}>

      {/* HEADER */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Availability Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your listing availability and view bookings
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

                // Validate selected dates: cannot block dates that already have bookings
                const anyBooked = selectedDates.some((d) => {
                  const found = calendar.find((c) => String(c?.date ?? "").startsWith(d));
                  const cnt = getBookingCount(found);
                  return cnt > 0;
                });

                if (anyBooked) {
                  showMessage("One or more selected dates have bookings and cannot be blocked.", "error");
                  return;
                }

                // Prevent blocking past dates
                const anyPast = selectedDates.some((d) => isPastDay(d));
                if (anyPast) {
                  showMessage("One or more selected dates are in the past and cannot be blocked.", "warning");
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

                // Validate selected dates: at least one date must be currently blocked
                const anyBlocked = selectedDates.some((d) => {
                  const found = calendar.find((c) => String(c?.date ?? "").startsWith(d));
                  return isBlockedDay(found);
                });

                if (!anyBlocked) {
                  showMessage("No selected dates are blocked.", "warning");
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
                // Prevent selecting past dates
                if (isPastDay(date)) {
                  showMessage("Cannot select past dates.", "warning");
                  return;
                }

                const found = calendar.find((d) =>
                  d.date.startsWith(date)
                );
                const bookingCount = getBookingCount(found);

                if (bookingCount > 0) {
                  setSelectedDate(date);
                  setOpenDateDialog(true);
                  return;
                }

                if (found && isBlockedDay(found)) {
                  setSelectedDates((prev) =>
                    prev.includes(date)
                      ? prev.filter((d) => d !== date)
                      : [...prev, date]
                  );
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