import { Typography, Grid, Card, CardContent, } from "@mui/material";

const stats = [
  { title: "Total Revenue", value: "$124,500" },
  { title: "Active Users", value: "2,847" },
  { title: "Total Bookings", value: "1,234" },
  { title: "Active Vendors", value: "156" },
];

export default function Dashboard() {
  return (
    <>
      <Typography variant="h4" fontWeight={600}>
        Dashboard Overview
      </Typography>

      <Typography color="text.secondary" mb={2}>
        Welcome back! Here's what's happening on your platform.
      </Typography>

      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.title}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {s.title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}