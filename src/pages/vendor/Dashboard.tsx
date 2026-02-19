import {
  Box,Card,CardContent,Chip,Divider,Grid,Stack,Typography,Table,  TableBody,TableCell,TableHead,  TableRow,Link as MuiLink,
} from "@mui/material";

import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import StatCard from "../../components/vendor/StatCard";

type ActivityItem = {
  id: string;
  title: string;
  time: string;
};

type BookingRow = {
  id: string;
  item: string;
  customer: string;
  date: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  amount: string;
};

export default function Dashboard() {
  // ✅ Dummy stats
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,450",
      icon: <MonetizationOnOutlinedIcon />,
      helperText: "↑ +12.5%",
    },
    {
      title: "Active Bookings",
      value: "24",
      icon: <EventAvailableOutlinedIcon />,
      helperText: "↑ +3",
    },
    {
      title: "Total Listings",
      value: "12",
      icon: <Inventory2OutlinedIcon />,
      helperText: "↑ +1",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      icon: <StarOutlineOutlinedIcon />,
      helperText: "↑ +0.2",
    },
  ];

  // ✅ Dummy recent activity
  const activity: ActivityItem[] = [
    { id: "a1", title: "New booking request for Tesla Model 3", time: "5 min ago" },
    { id: "a2", title: "You received a 5-star review", time: "1 hour ago" },
    { id: "a3", title: "Payment received: $299.00", time: "2 hours ago" },
  ];

  // ✅ Dummy upcoming bookings
  const bookings: BookingRow[] = [
    { id: "BK-1234", item: "Tesla Model 3", customer: "John Smith", date: "Feb 10, 2026", status: "Confirmed", amount: "$299" },
    { id: "BK-1235", item: "Canon EOS R5", customer: "Sarah Johnson", date: "Feb 11, 2026", status: "Pending", amount: "$150" },
    { id: "BK-1236", item: "Beach House Villa", customer: "Mike Chen", date: "Feb 12, 2026", status: "Confirmed", amount: "$1,200" },
    { id: "BK-1237", item: "DJ Equipment Set", customer: "Emma Davis", date: "Feb 14, 2026", status: "Confirmed", amount: "$450" },
  ];

  const statusChip = (status: BookingRow["status"]) => {
    const map = {
      Confirmed: { label: "Confirmed", sx: { bgcolor: "#E9F9EF", color: "#1B7A3A" } },
      Pending: { label: "Pending", sx: { bgcolor: "#FFF6D9", color: "#8A5A00" } },
      Cancelled: { label: "Cancelled", sx: { bgcolor: "#FDE2E2", color: "#B91C1C" } },
    } as const;

    return (
      <Chip
        label={map[status].label}
        size="small"
        sx={{
          borderRadius: 999,
          fontWeight: 600,
          ...map[status].sx,
        }}
      />
    );
  };

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid key={s.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title={s.title} value={s.value} icon={s.icon} helperText={s.helperText} />
          </Grid>
        ))}
      </Grid>

      {/* Revenue + Recent Activity */}
      <Grid container spacing={2}>
        {/* Revenue Overview (left) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Revenue Overview
                </Typography>

              
              </Stack>

              {/* Chart placeholder area */}
              <Box
                sx={(t) => ({
                  height: 260,
                  borderRadius: 2,
                  border: `1px solid ${t.palette.divider}`,
                  bgcolor: t.palette.background.paper,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  px: 3,
                  pb: 2,
                })}
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <Typography key={d} variant="caption" color="text.secondary">
                    {d}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity (right) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <NotificationsNoneOutlinedIcon fontSize="small" />
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Recent Activity
                </Typography>
              </Stack>

              <Stack spacing={1.5}>
                {activity.map((a, idx) => (
                  <Box key={a.id}>
                    <Stack direction="row" spacing={1.2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#0077b6",
                          mt: "6px",
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                          {a.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {a.time}
                        </Typography>
                      </Box>
                    </Stack>

                    {idx !== activity.length - 1 ? <Divider sx={{ mt: 1.5 }} /> : null}
                  </Box>
                ))}
              </Stack>

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <MuiLink component="button" underline="none" sx={{ fontSize: "0.85rem" }}>
                  View all activity
                </MuiLink>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Bookings */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Upcoming Bookings
            </Typography>

            <MuiLink component="button" underline="none" sx={{ fontSize: "0.85rem" }}>
              View all
            </MuiLink>
          </Stack>

          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#0077b6", fontWeight: 600 }}>Booking ID</TableCell>
                  <TableCell sx={{ color: "#0077b6", fontWeight: 600 }}>Item</TableCell>
                  <TableCell sx={{ color: "#0077b6", fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ color: "#0077b6", fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: "#0077b6", fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: "#0077b6", fontWeight: 600 }} align="right">
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell sx={{ color: "#0077b6", fontWeight: 700 }}>{b.id}</TableCell>
                    <TableCell>{b.item}</TableCell>
                    <TableCell>{b.customer}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{statusChip(b.status)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {b.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
