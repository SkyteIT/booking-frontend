import { Card, CardContent, Typography, Button, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookingCard from "../../Bookings/BookingCard";
import type { CustomerBookingListItem } from "../../../services/Customer/bookingService";
import LoadingSpinner from "../../common/LoadingSpinner";

type UpcomingBookingsProps = {
  bookings: CustomerBookingListItem[];
  loading: boolean;
};

const UpcomingBookings = ({ bookings, loading }: UpcomingBookingsProps) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: "20px", boxShadow: "0 12px 32px rgba(15,27,45,0.06)" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Upcoming Bookings
          </Typography>
          <Button
            size="small"
            onClick={() => navigate("/customer/bookings")}
            sx={{ borderRadius: "999px", textTransform: "none", fontWeight: 600 }}
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner fullScreen={false} py={3} />
        ) : bookings.length === 0 ? (
          <Typography color="text.secondary">No upcoming bookings</Typography>
        ) : (
          // Same BookingCard used on the vendor's Bookings page - CustomerBookingListItem
          // is shape-compatible with VendorBookingDto, so this is real visual
          // consistency, not a lookalike re-implementation.
          <Stack spacing={1.5}>
            {bookings.map((b) => (
              <BookingCard
                key={b.bookingId}
                booking={b}
                primaryLabel={b.listingTitle}
                onClick={() => navigate("/customer/bookings")}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
