import { Grid, Card, CardContent, Typography } from "@mui/material";

type StatsCardsProps = {
  totalBookings: number | null;
  upcomingCount: number | null;
  reviewsCount: number | null;
};

const StatsCards = ({ totalBookings, upcomingCount, reviewsCount }: StatsCardsProps) => {
  const fmt = (n: number | null) => (n === null ? "--" : String(n));

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="stats-card">
          <CardContent>
            <Typography color="text.secondary">Total Bookings</Typography>
            <Typography variant="h4">{fmt(totalBookings)}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="stats-card">
          <CardContent>
            <Typography color="text.secondary">Upcoming</Typography>
            <Typography variant="h4">{fmt(upcomingCount)}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="stats-card">
          <CardContent>
            <Typography color="text.secondary">Reviews Given</Typography>
            <Typography variant="h4">{fmt(reviewsCount)}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
