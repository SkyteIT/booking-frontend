import {Box,Card,CardContent,Link as MuiLink,Stack,Typography } from "@mui/material";
import BookingsTable from "../bookings/BookingTables";
import { Link as RouterLink } from "react-router-dom";
import type { VendorBookingDto } from "../bookings/BookingTypes";

type Props = {
  rows: VendorBookingDto[]; // For simplicity, using any[] — ideally this should be a typed array of booking objects
  loading?: boolean;
  error?: string | null;
};

export default function UpcomingBookingsCard({ rows, loading = false, error = null }: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Upcoming Bookings
          </Typography>

          <MuiLink component={RouterLink} to="/vendor/bookings" underline="none" sx={{ fontSize: "0.85rem" }}>
            View all
          </MuiLink>
        </Stack>

        {error ? (
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#FDE2E2", color: "#B91C1C" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Failed to load bookings
            </Typography>
            <Typography variant="caption">{error}</Typography>
          </Box>
        ) : loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading bookings...
          </Typography>
        ) : rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No upcoming bookings.
          </Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <BookingsTable rows={rows} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
