// src/pages/Vendor/Notifications/VendorNotifications.tsx
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PaymentIcon from "@mui/icons-material/Payment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SegmentedTabs from "../../../components/common/SegmentedTabs";
import { useAuth } from "../../../context/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import type { Notification } from "../../../services/notificationService";
import { belongsToPortal } from "../../../utils/notificationPortals";

type NotifStatus = "booking" | "payment" | "review" | "account" | "warning";
type FilterType = "All" | "Unread" | "booking" | "payment" | "review" | "account";

const iconMap: Record<NotifStatus, React.ReactNode> = {
  booking: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: "#2e7d32" }} />,
  payment: <PaymentIcon sx={{ fontSize: 20, color: "#0077B6" }} />,
  review: <StarOutlineIcon sx={{ fontSize: 20, color: "#f59e0b" }} />,
  account: <AccountCircleOutlinedIcon sx={{ fontSize: 20, color: "#6a1b9a" }} />,
  warning: <WarningAmberIcon sx={{ fontSize: 20, color: "#e65100" }} />,
};

const bgMap: Record<NotifStatus, string> = {
  booking: "#e6f4ea",
  payment: "#e3f0fb",
  review: "#fff8e1",
  account: "#f3e5f5",
  warning: "#fff3e0",
};

function resolveStatus(type: string): NotifStatus {
  const t = type.toLowerCase();
  if (t === "3" || t.includes("account") || t.includes("security")) return "account";
  if (t === "0" || t.includes("book")) return "booking";
  if (t === "1" || t.includes("pay")) return "payment";
  if (t === "2" || t.includes("review")) return "review";
  if (t.includes("cancel")) return "warning";
  return "booking";
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString();
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "All" },
  { label: "Unread", value: "Unread" },
  { label: "Bookings", value: "booking" },
  { label: "Payments", value: "payment" },
  { label: "Reviews", value: "review" },
  { label: "Account", value: "account" },
];

export default function VendorNotifications() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;
  const { notifications: allNotifications, loading, markAsRead } = useNotifications(userId);

  // This account's feed may also contain customer-context events (e.g. a
  // vendor account that also books things as a customer) - the vendor
  // portal only ever shows vendor-context notifications, never those.
  const notifications = allNotifications.filter((n: Notification) => belongsToPortal(n.type, "vendor"));
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  // The backend's bulk mark-all-read has no type filter and would also
  // mark this account's customer-context notifications read - go through
  // the filtered (vendor-only) list one at a time instead.
  const markAllAsRead = () => {
    notifications.filter((n) => !n.isRead).forEach((n) => markAsRead(n.id));
  };

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filtered: Notification[] = notifications.filter((n: Notification) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.isRead;
    return resolveStatus(n.type) === activeFilter;
  });

  return (
    <Box p={{ xs: 2, md: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            Notifications
          </Typography>
          <Typography color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>
            Bookings, payments, reviews and account activity for your business
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<DoneAllIcon />}
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || loading}
          sx={{ textTransform: "none", borderRadius: "999px" }}
        >
          Mark all read
        </Button>
      </Box>

      <Box mb={2}>
        <SegmentedTabs
          options={FILTERS.map((f) => f.value)}
          value={activeFilter}
          onChange={setActiveFilter}
          labels={Object.fromEntries(FILTERS.map((f) => [f.value, f.label]))}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#0077B6" }} />
        </Box>
      ) : (
        <Paper
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
            p: filtered.length === 0 ? 0 : 1.5,
          }}
        >
          {filtered.length === 0 ? (
            <Box py={8} textAlign="center">
              <NotificationsNoneIcon sx={{ fontSize: 44, color: "#b0bec5", mb: 1 }} />
              <Typography color="text.secondary" fontSize={14}>
                {activeFilter === "Unread" ? "You're all caught up!" : "No notifications here"}
              </Typography>
            </Box>
          ) : (
            filtered.map((n: Notification, idx: number) => {
              const status = resolveStatus(n.type);
              return (
                <Box
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 2,
                    py: 1.75,
                    mb: idx < filtered.length - 1 ? 1 : 0,
                    borderRadius: "14px",
                    cursor: n.isRead ? "default" : "pointer",
                    background: n.isRead
                      ? "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)"
                      : "linear-gradient(160deg, #FFFFFF 0%, #DCEEFB 100%)",
                    border: "1px solid rgba(15,27,45,0.06)",
                    "&:hover": { transform: "translateY(-1px)", boxShadow: "0 6px 16px rgba(15,27,45,0.08)" },
                    transition: "all 0.15s ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: bgMap[status],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {iconMap[status]}
                  </Box>

                  <Box flexGrow={1} minWidth={0}>
                    <Typography fontSize={14} fontWeight={n.isRead ? 400 : 600} lineHeight={1.4}>
                      {n.title}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary" mt={0.2}>
                      {n.message}
                    </Typography>
                    <Typography fontSize={11} color="text.disabled" mt={0.3}>
                      {formatTime(n.createdAtUtc)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                    {!n.isRead && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#0077B6" }} />}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.id);
                      }}
                      sx={{ color: "#b0bec5", "&:hover": { color: "#ef5350" } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              );
            })
          )}
        </Paper>
      )}

      {!loading && filtered.length > 0 && (
        <Typography fontSize={12} color="text.secondary" mt={2} textAlign="center">
          Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  );
}
