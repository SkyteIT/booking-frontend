import { Box, Grid, Stack, Typography } from "@mui/material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";

import StatCard from "../../components/vendor/dashboard/StatCard";
import RevenueOverviewCard from "../../components/vendor/dashboard/RevenueOverviewCard";
import RecentActivityCard from "../../components/vendor/dashboard/RecentActivityCard";
import UpcomingBookingsCard from "../../components/vendor/dashboard/UpcomingBookingsCard";

import type { ActivityItem } from "../../components/vendor/dashboard/types";

import { useVendorBookings } from "../../hooks/useVendorBookings";

export default function Dashboard() {
  // For interim — later this comes from auth context
  const vendorId = "11111111-1111-1111-1111-111111111111";
  const {
    data,
    loading,
    error,
  } = useVendorBookings({
    vendorId,
    initialPageSize: 5,
  });



  const stats = [
    { title: "Total Revenue", value: "$12,450", icon: <MonetizationOnOutlinedIcon />, helperText: "↑ +12.5%" },
    { title: "Active Bookings", value: "24", icon: <EventAvailableOutlinedIcon />, helperText: "↑ +3" },
    { title: "Total Listings", value: "12", icon: <Inventory2OutlinedIcon />, helperText: "↑ +1" },
    { title: "Avg. Rating", value: "4.8", icon: <StarOutlineOutlinedIcon />, helperText: "↑ +0.2" },
  ];

  const activity: ActivityItem[] = [
    { id: "a1", title: "New booking request for Tesla Model 3", time: "5 min ago" },
    { id: "a2", title: "You received a 5-star review", time: "1 hour ago" },
    { id: "a3", title: "Payment received: $299.00", time: "2 hours ago" },
  ];



  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title={s.title} value={s.value} icon={s.icon} helperText={s.helperText} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueOverviewCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivityCard items={activity} />
        </Grid>
      </Grid>

      <UpcomingBookingsCard
         rows={data?.slice(0, 4) || []} 
         loading={loading}
         error={error}
         
         />
    </Stack>
  );
}

