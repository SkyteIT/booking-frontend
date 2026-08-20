import { useState } from "react";
import { Box, Button, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

const cardSx = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
};

export default function BookingSettings() {
  const [form, setForm] = useState({
    reviewWindow: "24",
    cancellationHours: "12",
    autoConfirmBookings: false,
    requireAvailabilityCheck: true,
    allowSameDayBooking: true,
  });

  const set = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={800} mb={0.5}>
          Booking
        </Typography>
        <Typography color="text.secondary">
          Rules that control booking approvals, timing, and confirmations.
        </Typography>
      </Box>

      <Paper sx={cardSx}>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="Review Window (hours)"
              type="number"
              value={form.reviewWindow}
              onChange={(e) => set("reviewWindow", e.target.value)}
              fullWidth
            />
            <TextField
              label="Cancellation Window (hours)"
              type="number"
              value={form.cancellationHours}
              onChange={(e) => set("cancellationHours", e.target.value)}
              fullWidth
            />
          </Box>

          <Stack spacing={1}>
            <FormControlLabel
              control={<Switch checked={form.autoConfirmBookings} onChange={(e) => set("autoConfirmBookings", e.target.checked)} />}
              label="Auto-confirm eligible bookings"
            />
            <FormControlLabel
              control={<Switch checked={form.requireAvailabilityCheck} onChange={(e) => set("requireAvailabilityCheck", e.target.checked)} />}
              label="Require availability check"
            />
            <FormControlLabel
              control={<Switch checked={form.allowSameDayBooking} onChange={(e) => set("allowSameDayBooking", e.target.checked)} />}
              label="Allow same-day booking"
            />
          </Stack>

          <Box display="flex" gap={1} flexWrap="wrap">
            <Button size="small" variant="contained" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Save Booking Settings
            </Button>
            <Button size="small" variant="outlined" sx={{ textTransform: "none", px: 1.5, py: 0.75, fontSize: 12 }}>
              Reset
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
