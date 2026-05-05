import { useEffect, useState } from "react";
import { getAvailability, blockDates, unblockDates } from "../../../services/Vendor/availability";
import { getVendorListings } from "../../../services/Vendor/listing";
import {
  normalizeCalendarResponse,
  summarizeCalendar,
  unwrapCollection,
  getBookingCount,
  isBlockedDay,
  isPastDay,
} from "./vendorAvailability";

type ListingCard = {
  id: string;
  name: string;
  bookedCount: number;
  blockedCount: number;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
};

export function useVendorAvailability() {
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [monthDate, setMonthDate] = useState(new Date());
  const [calendar, setCalendar] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"block" | "unblock" | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const month = monthDate.getMonth() + 1;
  const year = monthDate.getFullYear();

  const showMessage = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Load listings on mount
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
        console.error("API ERROR:", err);
        showMessage(
          err?.response?.data?.message || "Failed to load your listings.",
          "error"
        );
      });
  }, []);

  // Load availability when listing/month/year changes
  useEffect(() => {
    if (!selectedListingId) return;

    getAvailability(selectedListingId, month, year)
      .then((data) => {
        const normalized = normalizeCalendarResponse(data);
        console.debug("Availability.load", {
          listing: selectedListingId,
          month,
          year,
          returned: normalized?.length,
        });
        setCalendar(normalized);
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === selectedListingId
              ? { ...listing, ...summarizeCalendar(normalized) }
              : listing
          )
        );
      })
      .catch((err) => console.error("Availability error:", err));
  }, [selectedListingId, month, year]);

  const handleConfirm = async () => {
    if (!selectedListingId || !actionType) return;

    try {
      const formattedDates = selectedDates.map((d) => `${d}T00:00:00`);

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
            ? { ...listing, ...summarizeCalendar(normalized) }
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

  const refreshBookings = async () => {
    if (!selectedListingId) return;

    try {
      const data = await getAvailability(selectedListingId, month, year);
      setCalendar(normalizeCalendarResponse(data));
    } catch (err) {
      console.error("Availability refresh error:", err);
    }
  };

  const handleBlockAction = async () => {
    if (!selectedListingId) {
      showMessage("Please select a listing first.", "warning");
      return;
    }
    if (selectedDates.length === 0) {
      showMessage("Please select dates to block.", "warning");
      return;
    }

    const anyBooked = selectedDates.some((d) => {
      const found = calendar.find((c) => String(c?.date ?? "").startsWith(d));
      const cnt = getBookingCount(found);
      return cnt > 0;
    });

    if (anyBooked) {
      showMessage(
        "One or more selected dates have bookings and cannot be blocked.",
        "error"
      );
      return;
    }

    const anyPast = selectedDates.some((d) => isPastDay(d));
    if (anyPast) {
      showMessage(
        "One or more selected dates are in the past and cannot be blocked.",
        "warning"
      );
      return;
    }

    setActionType("block");
    setConfirmOpen(true);
  };

  const handleUnblockAction = async () => {
    if (!selectedListingId) {
      showMessage("Please select a listing first.", "warning");
      return;
    }
    if (selectedDates.length === 0) {
      showMessage("Please select dates to unblock.", "warning");
      return;
    }

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
  };

  const handleToggleDate = (date: string) => {
    if (!selectedListingId) {
      showMessage("Please select a listing first.", "warning");
      return;
    }
    if (isPastDay(date)) {
      showMessage("Cannot select past dates.", "warning");
      return;
    }

    const found = calendar.find((d) => d.date.startsWith(date));
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

    setSelectedDates((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date]
    );
  };

  return {
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
  };
}
