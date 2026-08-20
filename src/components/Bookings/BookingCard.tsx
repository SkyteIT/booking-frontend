import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import StatusChip from "../Vendor/Dashboard/StatusChip";
import type { VendorBookingDto } from "./BookingTypes";

type Props = {
  booking: VendorBookingDto;
  onClick?: () => void;
  // Vendors see who booked (customerName, the default); a customer
  // looking at their own bookings needs the listing/venue name instead -
  // pass it explicitly rather than repurposing customerName's meaning.
  primaryLabel?: string;
};

export default function BookingCard({ booking, onClick, primaryLabel }: Props) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 4,

        // glass surface - a soft gradient tint instead of flat white, so
        // it doesn't look like a stark cutout against the page's blue
        // radial-glow background.
        background: "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(224,242,254,0.55))",
        backdropFilter: "blur(10px)",

        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.05)",

        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          
          {/* TOP */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "primary.main",// booking number color
              }}
            >
              {(booking.bookingNumber ?? "").toUpperCase()}
            </Typography>

            <StatusChip
              label={booking.status}
              category={booking.status}
            />
          </Stack>

          {/* Customer name (vendor view) or listing title (customer view) */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            {primaryLabel ?? booking.customerName}
          </Typography>

          {/* DATE */}
          <Typography
            variant="caption"
            sx={{ color: "text.secondary" }}
          >
            {new Date(booking.startDateTime).toLocaleDateString()} —{" "}
            {new Date(booking.endDateTime).toLocaleDateString()}
          </Typography>

          {/* DIVIDER (soft visual separation) */}
          <Box
            sx={{
              height: 1,
              bgcolor: "rgba(0,0,0,0.05)",
              borderRadius: 2,
            }}
          />

          {/* AMOUNT */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              color: "text.primary",
            }}
          >
            {booking.currency} {booking.totalAmount}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}