import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
};

export default function BookingDetailsDialog({
  open,
  onClose,
  data,
}: Props) {
  const navigate = useNavigate();

  if (!data) return null;

  const date = new Date(data.date).toDateString();

  const status = data.isBlocked
    ? "Blocked"
    : data.availableCount === 0
    ? "Full"
    : data.bookingCount > 0
    ? "Partially booked"
    : "Available";

  const handleViewBookings = () => {
    navigate(`/vendor/bookings?date=${data.date}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={3}>

          {/* Date */}
          <Typography variant="h6" fontWeight={600}>
            {date}
          </Typography>

          {/* Status */}
          <Typography
            sx={{
              fontSize: 14,
              color: "#6B7280",
            }}
          >
            {status}
          </Typography>

          {/* Stats */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              {data.bookingCount} bookings
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {data.availableCount} available
            </Typography>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              onClick={onClose}
              sx={{
                textTransform: "none",
                color: "#6B7280",
              }}
            >
              Close
            </Button>

            <Button
              variant="contained"
              onClick={handleViewBookings}
              disabled={!data.bookingCount}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                backgroundColor: "#0077b6",
                "&:hover": {
                  backgroundColor: "#005580",
                },
              }}
            >
              View
            </Button>
          </Stack>

        </Stack>
      </DialogContent>
    </Dialog>
  );
}