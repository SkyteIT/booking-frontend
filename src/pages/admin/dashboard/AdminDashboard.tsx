import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { alpha } from "@mui/material/styles";
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
/*
//<<<<<<< HEAD
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";

// ─── Types ───────────────────────────────────────────────
//=======
*/
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";
import {
  getAllBookings,
  getAllUsers,
  getDashboardStats,
  type AdminBookingDto,
  type AdminUserDto,
  type DashboardStatsDto,
} from "../../../services/Admin/adminService";
import { getVendorApplications, type VendorApplication } from "../../../services/Admin/vendor";
import { getListings, type ListingResponse } from "../../../services/Vendor/listingService";

// from currect
//import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";



//>>>>>>> origin/develop


interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
}

interface PendingItem {
//<<<<<<< HEAD
/*id: number;
  name: string;
  subtitle: string;
  type: "Vendor" | "Refund" | "Dispute";
  time: string;
=======
*/
  id: string;
  name: string;
  subtitle: string;
//>>>>>>> origin/develop
  dot: "red" | "yellow" | "green";
}

interface ActivityItem {

/*
  <<<<<<< HEAD
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
=======
*/
  id: string;
  title: string;
  subtitle: string;
  status: "success" | "warning" | "error" | "info";
}

interface VendorPerformance {
  id: string;
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
}

type DashboardSnapshot = {
  dashboardStats: DashboardStatsDto | null;
  users: AdminUserDto[];
  bookings: AdminBookingDto[];
  vendorApplications: VendorApplication[];
  listings: ListingResponse[];
};

type SummarySnapshot = {
  totalRevenue: number;
  activeUsers: number;
  totalBookings: number;
  activeVendors: number;
};

const POLL_INTERVAL_MS = 15000;
const DASHBOARD_REFRESH_EVENT = "admin-dashboard-refresh";

const DOT_COLORS: Record<string, string> = {
  red: "#ef5350",
  yellow: "#ffa726",
  green: "#66bb6a",
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

const formatCurrency = (currency: string, value: number) =>
  `${currency} ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const toTimestamp = (value?: string) => {
  if (!value) return 0;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

function StatCardItem({ card }: { card: StatCard }) {
  const positive = card.change >= 0;

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        height: "100%",
        transition: "box-shadow .2s",
        "&:hover": { boxShadow: "0 6px 24px rgba(0,0,0,0.10)" },
      }}
    >
{/*>>>>>>> origin/develop*/}


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
          <Typography fontSize={13} fontWeight={600} color={positive ? "#2e7d32" : "#c62828"}>
            {positive ? "+" : ""}
            {card.change}%
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

/*
<<<<<<< HEAD
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
=======
*/

function ActivityIcon({ status }: { status: ActivityItem["status"] }) {
  const map = {
    success: { icon: <CheckCircleIcon sx={{ fontSize: 20, color: "#2e7d32" }} />, bg: "#e6f4ea" },
    warning: { icon: <WarningAmberIcon sx={{ fontSize: 20, color: "#e65100" }} />, bg: "#fff3e0" },
    error: { icon: <CancelIcon sx={{ fontSize: 20, color: "#c62828" }} />, bg: "#fdecea" },
    info: { icon: <AccessTimeIcon sx={{ fontSize: 20, color: "#1565c0" }} />, bg: "#e3f2fd" },
  };

//>>>>>>> origin/develop
  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",

        bgcolor: map[status].bg,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
     {/*
<<<<<<< HEAD
      {icons[status]}
=======
*/}
      {map[status].icon}
{/*>>>>>>> origin/develop*/}
    </Box>
  );
}

{/*
<<<<<<< HEAD
// ─── Main Component ───────────────────────────────────────
export default function AdminDashboard() {
  const [_tab] = useState(0);

  return (
    <Box p={3}>
     
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>Dashboard Overview</Typography>
        <Typography color="text.secondary" fontSize={14}>
          Welcome back! Here's what's happening on your platform.
        </Typography>
      </Box>

      
      <Grid container spacing={2} mb={3}>
        {STAT_CARDS.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
            <StatCardItem card={card} />
          </Grid>
        ))}
      </Grid>

      
      <Grid container spacing={2} mb={3}>

       
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
=======

*/}
function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography fontWeight={700} fontSize={16}>
        {title}
      </Typography>
      {onViewAll && (
        <Button
          size="small"
          endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
          onClick={onViewAll}
          sx={{ fontSize: 13, color: "#0077B6", textTransform: "none", p: 0, minWidth: 0 }}
        >
          View All
        </Button>
      )}
    </Box>
  );
}

function EmptyTableRow({ message }: { message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">{message}</Typography>
      </TableCell>
    </TableRow>
  );
}

function normalizeVendorApplications(payload: unknown): VendorApplication[] {
  if (Array.isArray(payload)) return payload as VendorApplication[];

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["items", "data", "results", "records"]) {
      const value = record[key];
      if (Array.isArray(value)) return value as VendorApplication[];
    }
  }

  return [];
}

function calculateChange(current: number, previous: number | null) {
  if (!previous || previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export default function AdminDashboard() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>({
    dashboardStats: null,
    users: [],
    bookings: [],
    vendorApplications: [],
    listings: [],
  });
  const [previousSummary, setPreviousSummary] = useState<SummarySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const snapshotRef = useRef(snapshot);
  const previousSummaryRef = useRef<SummarySnapshot | null>(null);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [dashboardRes, usersRes, bookingsRes, vendorAppsRes, listingsRes] = await Promise.allSettled([
        getDashboardStats(),
        getAllUsers(),
        getAllBookings(),
        getVendorApplications(),
        getListings(),
      ]);

      const current = snapshotRef.current;
      const nextDashboardStats = dashboardRes.status === "fulfilled" ? dashboardRes.value : current.dashboardStats;
      const nextUsers = usersRes.status === "fulfilled" ? usersRes.value : current.users;
      const nextBookings = bookingsRes.status === "fulfilled" ? bookingsRes.value : current.bookings;
      const nextVendorApplications =
        vendorAppsRes.status === "fulfilled" ? normalizeVendorApplications(vendorAppsRes.value) : current.vendorApplications;
      const nextListings = listingsRes.status === "fulfilled" ? listingsRes.value : current.listings;

      const activeUsers = nextUsers.filter((user) => String(user.status).toLowerCase() === "active").length;
      const approvedVendorCount = nextVendorApplications.filter(
        (vendor) => String(vendor.status).toLowerCase() === "approved"
      ).length;
      const bookingRevenue = nextDashboardStats?.totalRevenue
        ?? nextBookings
          .filter((booking) => ["confirmed", "completed"].includes(String(booking.status).toLowerCase()))
          .reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

      const nextSummary: SummarySnapshot = {
        totalRevenue: bookingRevenue,
        activeUsers,
        totalBookings: nextBookings.length,
        activeVendors: nextDashboardStats?.totalVendors ?? approvedVendorCount,
      };

      setPreviousSummary(previousSummaryRef.current);
      previousSummaryRef.current = nextSummary;

      setSnapshot({
        dashboardStats: nextDashboardStats,
        users: nextUsers,
        bookings: nextBookings,
        vendorApplications: nextVendorApplications,
        listings: nextListings,
      });

      const hasAnySuccess =
        dashboardRes.status === "fulfilled" ||
        usersRes.status === "fulfilled" ||
        bookingsRes.status === "fulfilled" ||
        vendorAppsRes.status === "fulfilled" ||
        listingsRes.status === "fulfilled";

      if (!hasAnySuccess) {
        console.error("Dashboard refresh returned no usable data.");
        setError("Failed to load dashboard data.");
      } else {
        setError(null);
      }
    } catch {
      console.error("Failed to load dashboard data.");
      setError("Failed to load dashboard data.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadDashboard(false);

    const intervalId = window.setInterval(() => {
      void loadDashboard(true);
    }, POLL_INTERVAL_MS);

    const handleRefresh = () => {
      void loadDashboard(true);
    };

    window.addEventListener(DASHBOARD_REFRESH_EVENT, handleRefresh);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(DASHBOARD_REFRESH_EVENT, handleRefresh);
    };
  }, [loadDashboard]);

  const activeUsers = snapshot.users.filter((user) => String(user.status).toLowerCase() === "active").length;
  const totalBookings = snapshot.bookings.length;
  const approvedVendorApplications = snapshot.vendorApplications.filter(
    (vendor) => String(vendor.status).toLowerCase() === "approved"
  ).length;
  const pendingVendorApplications = snapshot.vendorApplications
    .filter((vendor) => String(vendor.status).toLowerCase() === "pending")
    .sort((a, b) => toTimestamp(b.submittedAt) - toTimestamp(a.submittedAt));
  const totalVendors = snapshot.dashboardStats?.totalVendors ?? approvedVendorApplications;
  const currency = snapshot.dashboardStats?.currency ?? snapshot.bookings.find((booking) => booking.currency)?.currency ?? "LKR";
  const bookingRevenue =
    snapshot.dashboardStats?.totalRevenue
    ?? snapshot.bookings
      .filter((booking) => ["confirmed", "completed"].includes(String(booking.status).toLowerCase()))
      .reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

  const pendingItems: PendingItem[] = useMemo(
    () =>
      pendingVendorApplications.slice(0, 4).map((item) => ({
        id: item.id,
        name: item.businessName,
        subtitle: `${item.userName} • ${formatDate(item.submittedAt)}`,
        dot: "yellow",
      })),
    [pendingVendorApplications]
  );

  const activityItems: ActivityItem[] = useMemo(() => {
    const bookingEvents = snapshot.bookings.map((booking) => ({
      id: `booking-${booking.id}`,
      title:
        String(booking.status).toLowerCase() === "pending"
          ? "Booking request created"
          : String(booking.status).toLowerCase() === "confirmed"
            ? "Booking confirmed"
            : String(booking.status).toLowerCase() === "completed"
              ? "Booking completed"
              : "Booking updated",
      subtitle: `${booking.customerName} • ${booking.listingTitle} • ${formatDateTime(booking.createdAt)}`,
      status:
        String(booking.status).toLowerCase() === "confirmed"
          ? ("success" as const)
          : String(booking.status).toLowerCase() === "pending"
            ? ("warning" as const)
            : ("info" as const),
      sortAt: toTimestamp(booking.createdAt),
    }));

    const vendorEvents = snapshot.vendorApplications.map((vendor) => ({
      id: `vendor-${vendor.id}`,
      title:
        String(vendor.status).toLowerCase() === "approved"
          ? "Vendor approved"
          : String(vendor.status).toLowerCase() === "rejected"
            ? "Vendor rejected"
            : "Vendor application submitted",
      subtitle: `${vendor.businessName} • ${vendor.userName} • ${formatDateTime(vendor.submittedAt)}`,
      status:
        String(vendor.status).toLowerCase() === "approved"
          ? ("success" as const)
          : String(vendor.status).toLowerCase() === "rejected"
            ? ("error" as const)
            : ("warning" as const),
      sortAt: toTimestamp(vendor.reviewedAt ?? vendor.submittedAt),
    }));

    const userEvents = snapshot.users.map((user) => ({
      id: `user-${user.id}`,
      title: "New user registered",
      subtitle: `${user.fullName} • ${formatDateTime(user.createdAt)}`,
      status: "info" as const,
      sortAt: toTimestamp(user.createdAt),
    }));

    return [...bookingEvents, ...vendorEvents, ...userEvents]
      .sort((a, b) => b.sortAt - a.sortAt)
      .slice(0, 5)
      .map(({ sortAt, ...item }) => item);
  }, [snapshot.bookings, snapshot.users, snapshot.vendorApplications]);

  const topPerformingVendors: VendorPerformance[] = snapshot.dashboardStats?.topPerformingVendors
    ? snapshot.dashboardStats.topPerformingVendors.map((vendor, index) => ({
        id: vendor.id ?? `${vendor.name}-${index}`,
        name: vendor.name,
        bookings: vendor.bookings,
        revenue: vendor.revenue,
        rating: vendor.rating ?? 0,
      }))
    : [];

  const prev = previousSummary;

  const statCards: StatCard[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(currency, bookingRevenue),
      change: calculateChange(bookingRevenue, prev?.totalRevenue ?? null),
      icon: <AttachMoneyIcon sx={{ fontSize: 24, color: "#0077B6" }} />,
      iconBg: "#e3f0fb",
    },
    {
      label: "Active Users",
      value: formatCompact(activeUsers),
      change: calculateChange(activeUsers, prev?.activeUsers ?? null),
      icon: <PeopleIcon sx={{ fontSize: 24, color: "#2e7d32" }} />,
      iconBg: "#e6f4ea",
    },
    {
      label: "Total Bookings",
      value: formatNumber(totalBookings),
      change: calculateChange(totalBookings, prev?.totalBookings ?? null),
      icon: <CalendarMonthIcon sx={{ fontSize: 24, color: "#e65100" }} />,
      iconBg: "#fff3e0",
    },
    {
      label: "Active Vendors",
      value: formatNumber(totalVendors),
      change: calculateChange(totalVendors, prev?.activeVendors ?? null),
      icon: <StorefrontIcon sx={{ fontSize: 24, color: "#6a1b9a" }} />,
      iconBg: "#f3e5f5",
    },
  ];

  return (
    <Box p={3} sx={{ bgcolor: "#F8F9FC", minHeight: "100vh" }}>
      <Box mb={3}>
        <Typography variant="h3" fontWeight={750} color="#0F172A" sx={{ letterSpacing: "-0.02em" }}>
          Dashboard Overview
        </Typography>
        <Typography color="text.secondary" fontSize={14} mt={0.5}>
          Welcome back! Here&apos;s what&apos;s happening on your platform.
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: alpha("#dc2626", 0.08), color: "#b91c1c", borderRadius: 1 }}>
          {error}
        </Box>
      )}

      <Grid container spacing={2} mb={3}>
        {loading ? (
          <Grid size={12}>
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Typography color="text.secondary">Loading dashboard data...</Typography>
            </Paper>
          </Grid>
        ) : (
          statCards.map((card) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
              <StatCardItem card={card} />
            </Grid>
          ))
        )}
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
            <SectionHeader title="Pending Approvals" onViewAll={() => {}} />
            <Box display="flex" flexDirection="column" gap={1.5}>
              {pendingItems.map((item) => (
//>>>>>>> origin/develop
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
// {/*
//                         <<<<<<< HEAD
//                         bgcolor: dotColors[item.dot],
// =======
// */}
                        bgcolor: DOT_COLORS[item.dot],
//>>>>>>> origin/develop
                        flexShrink: 0,
                      }}
                    />
                    <Box>

                      <Typography fontSize={14} fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        {item.subtitle}
                      </Typography>


                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: "#b0bec5" }}>
                    <AccessTimeIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}

              {!loading && pendingItems.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No pending vendor approvals right now.
                </Typography>
              )}

            </Box>
          </Paper>
        </Grid>

{/*
<<<<<<< HEAD
       
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
=======
*/}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "100%" }}>
            <SectionHeader title="Recent Activity" onViewAll={() => {}} />
            <Box display="flex" flexDirection="column" gap={1.5}>
              {activityItems.map((item) => (
                <Box key={item.id} display="flex" alignItems="center" gap={1.5}>
                  <ActivityIcon status={item.status} />
                  <Box>
                    <Typography fontSize={14} fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {!loading && activityItems.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No recent activity returned by the backend.
                </Typography>
              )}
{/*>>>>>>> origin/develop*/}
            </Box>
          </Paper>
        </Grid>
      </Grid>


      <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" p={2.5} pb={1.5}>
          <Typography fontWeight={700} fontSize={16}>
            Top Performing Vendors
          </Typography>
          <Button
            size="small"
            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 13, color: "#0077B6", textTransform: "none", p: 0, minWidth: 0 }}

          >
            View All
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
{/*
<<<<<<< HEAD
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
=======

*/}
              {["Vendor Name", "Bookings", "Revenue", "Rating", "Action"].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, fontSize: 13, color: "#64748b" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {topPerformingVendors.length === 0 ? (
              <EmptyTableRow message="No vendor performance data returned by the backend." />
            ) : (
              topPerformingVendors.map((vendor) => (
                <TableRow key={vendor.id} hover sx={{ "&:last-child td": { border: 0 } }}>
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
                      <Typography fontSize={14} fontWeight={600}>
                        {vendor.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14}>{vendor.bookings}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} fontWeight={600} color="#0077B6">
                      {formatCurrency(currency, vendor.revenue)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <StarIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
                      <Typography fontSize={14}>{vendor.rating.toFixed(1)}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button size="small" sx={{ fontSize: 13, color: "#0077B6", textTransform: "none", p: 0, minWidth: 0 }}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {!loading && refreshing && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "right" }}>
          Refreshing live data...
        </Typography>
      )}
{/*>>>>>>> origin/develop*/}
    </Box>
  );
}
