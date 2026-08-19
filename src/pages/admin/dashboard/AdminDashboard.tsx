// src/pages/admin/dashboard/AdminDashboard.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";

// ─── Types ───────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
}

interface PendingItem {
  id: number;
  name: string;
  subtitle: string;
  type: "Vendor" | "Refund" | "Dispute";
  time: string;
  dot: "red" | "yellow" | "green";
}

interface ActivityItem {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

interface Vendor {
  id: number;
  name: string;
  bookings: number;
  revenue: string;
  rating: number;
}

// ─── Mock Data ────────────────────────────────────────────
const STAT_CARDS: StatCard[] = [
  {
    label: "Total Revenue",
    value: "$124,500",
    change: 12.5,
    icon: <AttachMoneyIcon sx={{ fontSize: 24, color: "#0077B6" }} />,
    iconBg: "#e3f0fb",
  },
  {
    label: "Active Users",
    value: "2,847",
    change: 18.2,
    icon: <PeopleIcon sx={{ fontSize: 24, color: "#2e7d32" }} />,
    iconBg: "#e6f4ea",
  },
  {
    label: "Total Bookings",
    value: "1,234",
    change: 8.1,
    icon: <CalendarMonthIcon sx={{ fontSize: 24, color: "#e65100" }} />,
    iconBg: "#fff3e0",
  },
  {
    label: "Active Vendors",
    value: "156",
    change: -2.3,
    icon: <StorefrontIcon sx={{ fontSize: 24, color: "#6a1b9a" }} />,
    iconBg: "#f3e5f5",
  },
];

const PENDING_ITEMS: PendingItem[] = [
  { id: 1, name: "Luxury Resorts Inc.", subtitle: "Vendor • 5 min ago", type: "Vendor", time: "5 min ago", dot: "red" },
  { id: 2, name: "Booking #12345", subtitle: "Refund • 15 min ago", type: "Refund", time: "15 min ago", dot: "yellow" },
  { id: 3, name: "Customer vs Vendor", subtitle: "Dispute • 1 hour ago", type: "Dispute", time: "1 hour ago", dot: "red" },
  { id: 4, name: "Beach Hotels Group", subtitle: "Vendor • 2 hours ago", type: "Vendor", time: "2 hours ago", dot: "green" },
];

const ACTIVITY_ITEMS: ActivityItem[] = [
  { id: 1, title: "New booking created", subtitle: "John Doe • 2 min ago", time: "2 min ago", status: "success" },
  { id: 2, title: "Vendor approved", subtitle: "Admin • 10 min ago", time: "10 min ago", status: "success" },
  { id: 3, title: "Refund processed", subtitle: "Sarah Smith • 30 min ago", time: "30 min ago", status: "warning" },
  { id: 4, title: "Dispute resolved", subtitle: "Mike Johnson • 1 hour ago", time: "1 hour ago", status: "success" },
  { id: 5, title: "Payment failed", subtitle: "Emma Wilson • 2 hours ago", time: "2 hours ago", status: "error" },
];

const TOP_VENDORS: Vendor[] = [
  { id: 1, name: "Luxury Resorts", bookings: 145, revenue: "$45,600", rating: 4.9 },
  { id: 2, name: "City Car Rentals", bookings: 132, revenue: "$38,400", rating: 4.8 },
  { id: 3, name: "Adventure Tours", bookings: 98, revenue: "$32,100", rating: 4.7 },
  { id: 4, name: "Premium Hotels", bookings: 87, revenue: "$29,800", rating: 4.9 },
];

// ─── Sub-components ───────────────────────────────────────

function StatCardItem({ card }: { card: StatCard }) {
  const positive = card.change >= 0;
  return (
    <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: card.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {card.icon}
        </Box>
        <Box display="flex" alignItems="center" gap={0.4}>
          {positive ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: "#2e7d32" }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: "#c62828" }} />
          )}
          <Typography
            fontSize={13}
            fontWeight={600}
            color={positive ? "#2e7d32" : "#c62828"}
          >
            {positive ? "+" : ""}{card.change}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="h5" fontWeight={700} mb={0.3}>
        {card.value}
      </Typography>
      <Typography fontSize={13} color="text.secondary">
        {card.label}
      </Typography>
    </Paper>
  );
}

const dotColors: Record<string, string> = {
  red: "#ef5350",
  yellow: "#ffa726",
  green: "#66bb6a",
};

function ActivityIcon({ status }: { status: ActivityItem["status"] }) {
  const icons = {
    success: <CheckCircleIcon sx={{ fontSize: 20, color: "#2e7d32" }} />,
    warning: <WarningAmberIcon sx={{ fontSize: 20, color: "#e65100" }} />,
    error: <CancelIcon sx={{ fontSize: 20, color: "#c62828" }} />,
    info: <InfoOutlinedIcon sx={{ fontSize: 20, color: "#0077B6" }} />,
  };
  const bgs = {
    success: "#e6f4ea",
    warning: "#fff3e0",
    error: "#fdecea",
    info: "#e3f0fb",
  };
  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        bgcolor: bgs[status],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icons[status]}
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function AdminDashboard() {
  const [_tab] = useState(0);

  return (
    <Box p={3}>
      {/* Page header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>Dashboard Overview</Typography>
        <Typography color="text.secondary" fontSize={14}>
          Welcome back! Here's what's happening on your platform.
        </Typography>
      </Box>

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <StatCardItem card={card} />
          </Grid>
        ))}
      </Grid>

      {/* ── Pending Approvals + Recent Activity ── */}
      <Grid container spacing={2} mb={3}>

        {/* Pending Approvals */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={16}>Pending Approvals</Typography>
              <Button
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{ fontSize: 13, color: "#0077B6", textTransform: "none", p: 0 }}
              >
                View All
              </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={1.5}>
              {PENDING_ITEMS.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid #f0f0f0",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: dotColors[item.dot],
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography fontSize={14} fontWeight={600}>{item.name}</Typography>
                      <Typography fontSize={12} color="text.secondary">{item.subtitle}</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: "#b0bec5" }}>
                    <AccessTimeIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontWeight={700} fontSize={16}>Recent Activity</Typography>
              <Button
                size="small"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                sx={{ fontSize: 13, color: "#0077B6", textTransform: "none", p: 0 }}
              >
                View All
              </Button>
            </Box>

            <Box display="flex" flexDirection="column" gap={1.5}>
              {ACTIVITY_ITEMS.map((item) => (
                <Box key={item.id} display="flex" alignItems="center" gap={1.5}>
                  <ActivityIcon status={item.status} />
                  <Box flexGrow={1}>
                    <Typography fontSize={14} fontWeight={600}>{item.title}</Typography>
                    <Typography fontSize={12} color="text.secondary">{item.subtitle}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Top Performing Vendors ── */}
      <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2.5} pb={1.5}>
          <Typography fontWeight={700} fontSize={16}>Top Performing Vendors</Typography>
          <Button
            size="small"
            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 13, color: "#0077B6", textTransform: "none", p: 0 }}
          >
            View All
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>Vendor Name</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>Bookings</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>Revenue</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TOP_VENDORS.map((vendor) => (
              <TableRow key={vendor.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: "#e3f0fb",
                        color: "#0077B6",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {vendor.name.charAt(0)}
                    </Avatar>
                    <Typography fontSize={14} fontWeight={600}>{vendor.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14}>{vendor.bookings}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} fontWeight={600} color="#0077B6">
                    {vendor.revenue}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <StarIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
                    <Typography fontSize={14}>{vendor.rating}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    sx={{
                      fontSize: 13,
                      color: "#0077B6",
                      textTransform: "none",
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
