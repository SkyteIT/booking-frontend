import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

type StatsCardsProps = {
  totalBookings: number | null;
  upcomingCount: number | null;
  reviewsCount: number | null;
};

const STATS = (totalBookings: number | null, upcomingCount: number | null, reviewsCount: number | null) => [
  { label: "Total Bookings", value: totalBookings, icon: CalendarMonthOutlinedIcon },
  { label: "Upcoming", value: upcomingCount, icon: EventAvailableOutlinedIcon },
  { label: "Reviews Given", value: reviewsCount, icon: StarOutlineOutlinedIcon },
];

const StatsCards = ({ totalBookings, upcomingCount, reviewsCount }: StatsCardsProps) => {
  const fmt = (n: number | null) => (n === null ? "--" : String(n));

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {STATS(totalBookings, upcomingCount, reviewsCount).map((stat) => {
        const Icon = stat.icon;
        return (
          <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
            <Card className="stats-card">
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, height: "100%" }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    flexShrink: 0,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(160deg, #005a8d, #0077b6)",
                  }}
                >
                  <Icon sx={{ fontSize: "1.3rem", color: "#fff" }} />
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                    {fmt(stat.value)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;
