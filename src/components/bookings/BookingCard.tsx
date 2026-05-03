import { Card, CardContent, Typography, Stack} from "@mui/material";
import StatusChip from "../vendor/dashboard/StatusChip"; 

type Props = {
  booking: any;
  onClick?: () => void;
};

export default function BookingCard({ booking, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
        cursor: "pointer",
        transition: "all 0.2s ease",

        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.2}>
          
          {/* 🔹 Top */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {booking.bookingNumber}
            </Typography>

            <StatusChip
              label={booking.status}
              category={booking.status}
            />
          </Stack>

          {/* 🔹 Customer */}
          <Typography sx={{ fontWeight: 500 }}>
            {booking.customerName}
          </Typography>

          {/* 🔹 Date */}
          <Typography variant="caption" color="text.secondary">
            {new Date(booking.startDateTime).toLocaleDateString()} —{" "}
            {new Date(booking.endDateTime).toLocaleDateString()}
          </Typography>

          {/* 🔹 Amount */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.95rem",
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