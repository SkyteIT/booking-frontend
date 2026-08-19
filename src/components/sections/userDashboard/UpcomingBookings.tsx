import { Card, CardContent, Typography, Button, Box, Stack, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { CustomerBookingListItem } from "../../../services/Customer/bookingService";

type UpcomingBookingsProps = {
  bookings: CustomerBookingListItem[];
  loading: boolean;
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const UpcomingBookings = ({ bookings, loading }: UpcomingBookingsProps) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: "14px" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Upcoming Bookings</Typography>
          <Button size="small" onClick={() => navigate("/customer/bookings")}>
            View All
          </Button>
        </Box>

        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : bookings.length === 0 ? (
          <Typography color="text.secondary">No upcoming bookings</Typography>
        ) : (
          <Stack spacing={1.5}>
            {bookings.map((b) => (
              <Box
                key={b.bookingId}
                onClick={() => navigate("/customer/bookings")}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {b.listingTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(b.startDateTime)}
                  </Typography>
                </Box>
                <Chip size="small" label={b.status} />
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
