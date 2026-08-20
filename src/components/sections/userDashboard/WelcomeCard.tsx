import { Card, CardContent, Typography } from "@mui/material";

type WelcomeCardProps = {
  firstName?: string;
};

const WelcomeCard = ({ firstName }: WelcomeCardProps) => {
  return (
    <Card className="welcome-card" sx={{ mb: 3, width: "100%" }}>
      <CardContent>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Welcome back{firstName ? `, ${firstName}` : ""}
        </Typography>

        <Typography color="text.secondary">
          Here's what's happening with your bookings
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
