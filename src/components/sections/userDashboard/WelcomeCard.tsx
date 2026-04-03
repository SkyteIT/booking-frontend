import { Card, CardContent, Typography } from "@mui/material";

const WelcomeCard = () => {
  return (
    <Card sx={{ mb: 3, borderRadius: "14px",width: "100%" }}>
      <CardContent>

        <Typography variant="h5" fontWeight={600}>
          Welcome back, --
        </Typography>

        <Typography color="text.secondary">
          Here's what's happening with your bookings
        </Typography>

      </CardContent>
    </Card>
  );
};

export default WelcomeCard;