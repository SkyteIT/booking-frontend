import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { Box, Grid, Stack, Typography } from "@mui/material";
import BookingStatusChart from "../../../components/Bookings/BookingStatusChart";
import RecentActivityCard from "../../../components/Vendor/Dashboard/RecentActivityCard";
import RevenueOverviewCard from "../../../components/Vendor/Dashboard/RevenueOverviewCard";
import StatCard from "../../../components/Vendor/Dashboard/StatCard";
import UpcomingBookingsCard from "../../../components/Vendor/Dashboard/UpcomingBookingsCard";
import { useVendorDashboard } from "./useVendorDashboard";

export default function Dashboard() {
  const {
    bookings,
    loading,
    error,
    dashboard,
    loadingDashboard,
    bookingStats,
    loadingBookingStats,
    currentRevenue,
    growth,
    activity,
    dashboardError,
  } = useVendorDashboard();

  const stats = [
    {
      title: "Total Revenue",
      value: `LKR ${currentRevenue.toLocaleString()}`,
      icon: <MonetizationOnOutlinedIcon />,
      helperText: `${growth.toFixed(1)}% vs last ${"month"}`,
    },
    {
      title: "Active Bookings",
      value: String(dashboard?.activeBookings ?? 0),
      icon: <EventAvailableOutlinedIcon />,
      helperText: "Confirmed",
    },
    {
      title: "Total Listings",
      value: String(dashboard?.totalListings ?? 0),
      icon: <Inventory2OutlinedIcon />,
      helperText: "Your listings",
    },
    {
      title: "Avg. Rating",
      value: String(dashboard?.averageRating ?? 0),
      icon: <StarOutlineOutlinedIcon />,
      helperText: "Coming soon",
    },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h5"
          sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
        >
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your bookings, revenue, and activity
        </Typography>
      </Box>

      {loadingDashboard ? (
        <Typography color="text.secondary">Loading dashboard...</Typography>
      ) : (
        <Grid container spacing={2}>
          {stats.map((s) => (
            <Grid key={s.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title={s.title}
                value={s.value}
                icon={s.icon}
                helperText={s.helperText}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ mb: 1 }}>
            <RevenueOverviewCard bookings={bookings} />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ mb: 1 }}>
            {loadingBookingStats ? (
              <Typography color="text.secondary">Loading chart...</Typography>
            ) : (
              <BookingStatusChart stats={bookingStats} />
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container rowSpacing={2} columnSpacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <UpcomingBookingsCard rows={bookings || []} loading={loading} error={error} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivityCard
            items={activity}
            loading={loadingDashboard && activity.length === 0}
            error={dashboardError}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
