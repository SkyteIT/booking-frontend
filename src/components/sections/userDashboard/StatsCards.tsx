import { Grid, Card, CardContent, Typography } from "@mui/material";

const StatsCards = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="stats-card">
          <CardContent>
            <Typography color="text.secondary">
              Total Bookings
            </Typography>
            <Typography variant="h4">--</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="stats-card">
          <CardContent>
            <Typography color="text.secondary">
              Upcoming
            </Typography>
            <Typography variant="h4">--</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card className="stats-card">
          <CardContent>
            <Typography color="text.secondary">
              Reviews Given
            </Typography>
            <Typography variant="h4">--</Typography>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
};

export default StatsCards;