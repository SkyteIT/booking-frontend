import { Box, Grid, Stack, Typography } from "@mui/material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";

import StatCard from "../../components/vendor/dashboard/StatCard";
import RevenueOverviewCard from "../../components/vendor/dashboard/RevenueOverviewCard";
import RecentActivityCard from "../../components/vendor/dashboard/RecentActivityCard";
import UpcomingBookingsCard from "../../components/vendor/dashboard/UpcomingBookingsCard";
import { useEffect, useState } from "react";
import type { ActivityItem } from "../../components/vendor/dashboard/types";
import { getDashboard } from "../../services/Bookings/booking";
import { useVendorBookings } from "../../hooks/useVendorBookings";
import BookingStatusChart from "../../components/bookings/BookingStatusChart";



function formatDashboardDate(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    return utcDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function Dashboard() {
  // For interim — later this comes from auth context
  
  const {
    data,
    loading,
    error,
  } = useVendorBookings({

    initialPageSize: 4,
  });
  const [dashboard, setDashboard] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const bookings = data || [];


  

  const currentRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const previousRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const growth =
    previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoadingDashboard(true);
        setDashboardError(null);
        const res = await getDashboard();
        setDashboard(res);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
        setDashboardError("Unable to load dashboard activity.");
      } finally {
        setLoadingDashboard(false);
      }
    }

    loadDashboard();
  }, []);

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
  const fallbackActivity: ActivityItem[] = bookings.slice(0, 3).map((b) => ({
    id: b.bookingId,
    title: `${b.customerName} booked ${b.listingTitle}`,
    time: formatDashboardDate(b.createdAt),
  }));

  const backendActivitySource =
    dashboard?.recentActivity ?? dashboard?.recentActivities ?? dashboard?.activities;

  const backendActivity: ActivityItem[] = Array.isArray(backendActivitySource)
    ? backendActivitySource.slice(0, 5).map((item: any, index: number) => ({
        id: String(item.id ?? item.activityId ?? item.bookingId ?? index),
        title: String(
          item.title ??
            item.message ??
            item.description ??
            "Booking activity update"
        ),
        time: formatDashboardDate(item.time ?? item.createdAt ?? item.date),
      }))
    : [];

  const activity = backendActivity.length > 0 ? backendActivity : fallbackActivity;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueOverviewCard bookings={bookings} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <BookingStatusChart bookings={bookings} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <UpcomingBookingsCard rows={data || []} loading={loading} error={error} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivityCard
            items={activity}
            loading={loadingDashboard && backendActivity.length === 0}
            error={dashboardError}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

