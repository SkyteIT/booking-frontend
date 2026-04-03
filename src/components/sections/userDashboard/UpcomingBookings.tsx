import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const UpcomingBookings = () => {
  return (
    <Card sx={{ borderRadius: "14px" }}>
      <CardContent>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            Upcoming Bookings
          </Typography>

          <Button size="small">
            View All
          </Button>
        </Box>

        <Typography color="text.secondary">
          No bookings available
        </Typography>

      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;