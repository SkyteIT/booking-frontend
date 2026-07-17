import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getBookings } from "../../../services/Bookings/booking";
import type { VendorBookingDto } from "../../Bookings/BookingTypes";

type Props = {
  date: string | null;
  open: boolean;
  onClose: () => void;
  onSelectBooking: (id: string) => void;
};

export default function BookingsByDateDialog({
  date,
  open,
  onClose,
  onSelectBooking,
}: Props) {
  const [data, setData] = useState<VendorBookingDto[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedDate = date ?? undefined;

  useEffect(() => {
    if (!selectedDate || !open) return;

    async function fetchBookings() {
      try {
        setLoading(true);

        const res = await getBookings({
          startDate: selectedDate,
          endDate: selectedDate,
        });

        setData(res.items || []);
      } catch (err) {
        console.error("Bookings by date error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [selectedDate, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle>
        Bookings on {selectedDate ? new Date(selectedDate).toDateString() : "-"}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Stack spacing={1}>
            {data.map((b) => (
              <Box
                key={b.bookingId}
                onClick={() => onSelectBooking(b.bookingId)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  border: "1px solid #F3F4F6",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "#F9FAFB",
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {b.bookingNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {b.customerName}
                    </Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color:
                          b.status === "Pending"
                            ? "#92400E"
                            : b.status === "Confirmed"
                            ? "#166534"
                            : "#991B1B",
                      }}
                    >
                      {b.status}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}