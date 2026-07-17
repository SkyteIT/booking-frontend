import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";

const WelcomeCard = () => {
  const { user } = useAuth();

  // Extract first name from full name or default to 'User'
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <Card sx={{ mb: 3, borderRadius: "14px", width: "100%" }}>
      <CardContent>

        <Typography variant="h5" fontWeight={600}>
          Welcome back, {firstName}
        </Typography>

        <Typography color="text.secondary">
          Here's what's happening with your bookings
        </Typography>

      </CardContent>
    </Card>
  );
};

export default WelcomeCard;