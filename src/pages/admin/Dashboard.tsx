import { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Alert } from "@mui/material";
import { getDashboardStats, type DashboardStatsDto } from "../../services/Admin/adminService";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getDashboardStats();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setError("Failed to load dashboard stats.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = stats
    ? [
        { title: "Total Revenue", value: `${stats.currency} ${stats.totalRevenue.toLocaleString()}` },
        { title: "Total Users", value: stats.totalUsers.toLocaleString() },
        { title: "Total Bookings", value: stats.totalBookings.toLocaleString() },
        { title: "Active Vendors", value: stats.totalVendors.toLocaleString() },
      ]
    : [];

  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
      >
        Dashboard Overview
      </Typography>

      <Typography color="text.secondary" mb={2} sx={{ mt: 0.5 }}>
        Welcome back! Here's what's happening on your platform.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {loading ? (
          <Grid size={12}>
            <Typography variant="body2" color="text.secondary">
              Loading stats...
            </Typography>
          </Grid>
        ) : (
          cards.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.title}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(15,27,45,0.06)",
                  background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                }}
              >
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
          ))
        )}
      </Grid>
    </>
  );
}
