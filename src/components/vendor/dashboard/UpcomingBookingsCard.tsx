import { alpha } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import BookingsTable from "../../bookings/BookingTables";
import type { VendorBookingDto } from "../../bookings/BookingTypes";

type Props = {
  rows: VendorBookingDto[];
  loading?: boolean;
  error?: string | null;
};

export default function UpcomingBookingsCard({
  rows,
  loading = false,
  error = null,
}: Props) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* 🔹 Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Upcoming bookings
          </Typography>

          <MuiLink
            component={RouterLink}
            to="/vendor/bookings"
            underline="none"
            sx={{
              fontSize: "0.85rem",
              color: "primary.main",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            View all
          </MuiLink>
        </Stack>

        {/* 🔹 Error */}
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
              sx={{ fontWeight: 500, color: "error.main" }}
            >
              Failed to load bookings
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {error}
            </Typography>
          </Box>
        ) : loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading bookings...
          </Typography>
        ) : rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No upcoming bookings
          </Typography>
        ) : (
          <Box
            sx={{
              overflowX: "auto",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <BookingsTable rows={rows} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}