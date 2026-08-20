// src/components/sections/userDashboard/UserNotifications.tsx
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PaymentIcon from "@mui/icons-material/Payment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNotifications } from "../../../hooks/useNotifications";
import type { Notification } from "../../../services/notificationService";
import { belongsToPortal } from "../../../utils/notificationPortals";
import SegmentedTabs from "../../common/SegmentedTabs";

// ─── Types ────────────────────────────────────────────────
type NotifStatus = "booking" | "payment" | "review" | "account" | "warning";
type FilterType = "All" | "Unread" | "booking" | "payment" | "review" | "account";

// ─── Icon / bg config (matches VendorNotifications) ───────
const iconMap: Record<NotifStatus, React.ReactNode> = {
  booking: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: "#2e7d32" }} />,
  payment: <PaymentIcon           sx={{ fontSize: 20, color: "#0077B6" }} />,
  review:  <StarOutlineIcon       sx={{ fontSize: 20, color: "#f59e0b" }} />,
  account: <AccountCircleOutlinedIcon sx={{ fontSize: 20, color: "#6a1b9a" }} />,
  warning: <WarningAmberIcon      sx={{ fontSize: 20, color: "#e65100" }} />,
};

const bgMap: Record<NotifStatus, string> = {
  booking: "#e6f4ea",
  payment: "#e3f0fb",
  review:  "#fff8e1",
  account: "#f3e5f5",
  warning: "#fff3e0",
};

function resolveStatus(type: string): NotifStatus {
  const t = type.toLowerCase();
  if (t === "3" || t.includes("account") || t.includes("security")) return "account";
  if (t === "0" || t.includes("book"))    return "booking";
  if (t === "1" || t.includes("pay"))     return "payment";
  if (t === "2" || t.includes("review"))  return "review";
  if (t.includes("cancel"))               return "warning";
  return "booking";
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString();
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All",      value: "All" },
  { label: "Unread",   value: "Unread" },
  { label: "Bookings", value: "booking" },
  { label: "Payments", value: "payment" },
  { label: "Reviews",  value: "review" },
  { label: "Account",  value: "account" },
];

// ─── Props ─────────────────────────────────────────────────
interface UserNotificationsProps {
  userId: string | null;
}

// ─── Component ─────────────────────────────────────────────
// Preference toggles (Email/Push/SMS per event) live in Settings > Notifications
// now, not here - this is just the inbox, no duplicate second copy of the
// same controls.
const UserNotifications = ({ userId }: UserNotificationsProps) => {
  const { notifications: allNotifications, loading, markAsRead } = useNotifications(userId);

  // This account's feed may also contain vendor-context events (e.g. a
  // vendor account that visits their own customer pages) - the customer
  // portal only ever shows customer-context notifications, never those.
  const notifications = allNotifications.filter((n: Notification) => belongsToPortal(n.type, "customer"));
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  // The backend's bulk mark-all-read has no type filter and would also
  // mark this account's vendor-context notifications read - go through
  // the filtered (customer-only) list one at a time instead.
  const markAllAsRead = () => {
    notifications.filter((n) => !n.isRead).forEach((n) => markAsRead(n.id));
  };

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filtered: Notification[] = notifications.filter((n: Notification) => {
    if (activeFilter === "All")    return true;
    if (activeFilter === "Unread") return !n.isRead;
    return resolveStatus(n.type) === activeFilter;
  });

  return (
    <Box>
      <Paper
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(15,27,45,0.06)",
        }}
      >
        {/* Filter tabs + mark-all-read - part of the same white surface
            as the list below, not floating separately above it. */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
          sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}
        >
          <SegmentedTabs
            options={FILTERS.map((f) => f.value)}
            labels={Object.fromEntries(FILTERS.map((f) => [f.value, f.label])) as Partial<Record<FilterType, string>>}
            value={activeFilter}
            onChange={setActiveFilter}
          />

          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || loading}
            sx={{ textTransform: "none", borderRadius: "999px", fontSize: 12, fontWeight: 600 }}
          >
            Mark all read
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress color="primary" size={32} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box py={7} textAlign="center">
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
                  px: 3,
                  py: 2,
                  cursor: n.isRead ? "default" : "pointer",
                  bgcolor: n.isRead ? "#fff" : "#f0f7ff",
                  borderBottom: idx < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
                  "&:hover": { bgcolor: n.isRead ? "#f9fafb" : "#e8f1fb" },
                  transition: "background 0.15s",
                }}
              >
                {/* Icon bubble */}
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

                {/* Text content */}
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

                {/* Unread dot + dismiss */}
                <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                  {!n.isRead && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
                  )}
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

      {!loading && filtered.length > 0 && (
        <Typography fontSize={12} color="text.secondary" mt={2} textAlign="center">
          Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  );
};

export default UserNotifications;
