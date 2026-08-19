// src/components/sections/userDashboard/UserNotifications.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Switch,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaymentIcon from "@mui/icons-material/Payment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import { useNotifications } from "../../../hooks/useNotifications";
import type {
  Notification,
  NotificationPreference,
} from "../../../services/notificationService";
import { belongsToPortal } from "../../../utils/notificationPortals";

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

// notificationType values must match the backend's NotificationType enum
// exactly (Ube.Domain.Enums.Notifications.NotificationType) - a mismatch
// here means a real event's preference lookup finds no row and silently
// never fires. Only lists types that are actually customer-facing and
// actually exist in the backend enum - no "Booking reminders" or
// "Promotions & offers" placeholders for events nothing creates.
const PREF_GROUPS = [
  {
    label: "Bookings",
    items: [
      { key: "booking_conf", label: "Booking confirmations", notificationType: 2 }, // BookingConfirmation
      { key: "cancellations", label: "Cancellations", notificationType: 3 }, // Cancellation
    ],
  },
  {
    label: "Payments",
    items: [
      { key: "pay_failed", label: "Payment failed", notificationType: 6 }, // PaymentFailed
      { key: "refund", label: "Refund updates", notificationType: 12 }, // RefundPending
    ],
  },
  {
    label: "Reviews",
    items: [
      { key: "review_resp", label: "Review responses", notificationType: 8 }, // ReviewResponse
    ],
  },
  {
    label: "Account",
    items: [
      { key: "security", label: "Security alerts", notificationType: 9 }, // SecurityAlert
      { key: "acc_updates", label: "Account updates", notificationType: 10 }, // AccountUpdate
    ],
  },
];

// ─── Props ─────────────────────────────────────────────────
interface UserNotificationsProps {
  userId: string | null;
}

// ─── Component ─────────────────────────────────────────────
const UserNotifications = ({ userId }: UserNotificationsProps) => {
  const {
    notifications: allNotifications,
    preferences,
    loading,
    markAsRead,
    savePreference,
  } = useNotifications(userId);

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
  const [prefsSaved,   setPrefsSaved]   = useState(false);
  const [view, setView] = useState<"notifications" | "preferences">("notifications");

  // ── Preference helpers ──────────────────────────────────
  const getPrefValue = (
    notificationType: number,
    channel: "emailEnabled" | "pushEnabled"
  ): boolean => {
    const pref: NotificationPreference | undefined = preferences.find(
      (p: NotificationPreference) => p.notificationType === String(notificationType)
    );
    return pref?.[channel] ?? false;
  };

  const handlePrefToggle = async (
    notificationType: number,
    channel: "email" | "push" | "sms",
    value: boolean
  ) => {
    setPrefsSaved(false);
    const existing: NotificationPreference | undefined = preferences.find(
      (p: NotificationPreference) => p.notificationType === String(notificationType)
    );
    await savePreference({
      notificationType,
      emailEnabled: channel === "email" ? value : (existing?.emailEnabled ?? false),
      pushEnabled:  channel === "push"  ? value : (existing?.pushEnabled  ?? false),
      smsEnabled:   channel === "sms"   ? value : (existing?.smsEnabled   ?? false),
    });
    setPrefsSaved(true);
  };

  // ── Filter ─────────────────────────────────────────────
  const filtered: Notification[] = notifications.filter((n: Notification) => {
    if (activeFilter === "All")    return true;
    if (activeFilter === "Unread") return !n.isRead;
    return resolveStatus(n.type) === activeFilter;
  });

  return (
    <Box>
      {/* ── Section header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stay updated on your bookings and account activity
          </Typography>
        </Box>

        {/* View toggle */}
        <Box display="flex" gap={1}>
          <Button
            size="small"
            variant={view === "notifications" ? "contained" : "outlined"}
            onClick={() => setView("notifications")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontSize: 13,
              bgcolor: view === "notifications" ? "#1976d2" : undefined,
              "&:hover": { bgcolor: view === "notifications" ? "#1565c0" : undefined },
            }}
          >
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          <Button
            size="small"
            variant={view === "preferences" ? "contained" : "outlined"}
            onClick={() => setView("preferences")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontSize: 13,
              bgcolor: view === "preferences" ? "#1976d2" : undefined,
              "&:hover": { bgcolor: view === "preferences" ? "#1565c0" : undefined },
            }}
          >
            Preferences
          </Button>
        </Box>
      </Box>

      {/* ══════════════ NOTIFICATIONS VIEW ══════════════ */}
      {view === "notifications" && (
        <>
          {/* Filter chips + mark-all-read */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexWrap="wrap"
            gap={1}
          >
            <Box display="flex" gap={1} flexWrap="wrap">
              {FILTERS.map((f) => (
                <Chip
                  key={f.value}
                  label={f.label}
                  clickable
                  size="small"
                  onClick={() => setActiveFilter(f.value)}
                  sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    bgcolor: activeFilter === f.value ? "#1976d2" : "#f1f5f9",
                    color:   activeFilter === f.value ? "#fff"    : "#4a5568",
                    "&:hover": {
                      bgcolor: activeFilter === f.value ? "#1565c0" : "#e2e8f0",
                    },
                  }}
                />
              ))}
            </Box>

            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
              sx={{ textTransform: "none", borderRadius: 2, fontSize: 12 }}
            >
              Mark all read
            </Button>
          </Box>

          {/* Loading */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress sx={{ color: "#1976d2" }} size={32} />
            </Box>
          ) : (
            <Paper
              sx={{
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              {filtered.length === 0 ? (
                <Box py={7} textAlign="center">
                  <NotificationsNoneIcon sx={{ fontSize: 44, color: "#b0bec5", mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>
                    {activeFilter === "Unread"
                      ? "You're all caught up!"
                      : "No notifications here"}
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
                        borderBottom:
                          idx < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
                        "&:hover": {
                          bgcolor: n.isRead ? "#f9fafb" : "#e8f1fb",
                        },
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
                        <Typography
                          fontSize={14}
                          fontWeight={n.isRead ? 400 : 600}
                          lineHeight={1.4}
                          noWrap={false}
                        >
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
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#1976d2",
                            }}
                          />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(n.id);
                          }}
                          sx={{
                            color: "#b0bec5",
                            "&:hover": { color: "#ef5350" },
                          }}
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
        </>
      )}

      {/* ══════════════ PREFERENCES VIEW ══════════════ */}
      {view === "preferences" && (
        <Paper
          sx={{
            borderRadius: "14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Column headers */}
          <Box
            display="grid"
            sx={{ gridTemplateColumns: "1fr 80px 80px" }}
            px={3}
            py={1.5}
            bgcolor="#f9fafb"
            borderBottom="1px solid #f0f0f0"
          >
            <Typography fontSize={13} fontWeight={600} color="text.secondary">
              Notification type
            </Typography>
            <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">
              Email
            </Typography>
            <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">
              Push
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress sx={{ color: "#1976d2" }} size={28} />
            </Box>
          ) : (
            PREF_GROUPS.map((group, gi) => (
              <Box key={group.label}>
                <Box px={3} pt={2} pb={0.5}>
                  <Typography fontWeight={700} fontSize={13} color="text.secondary">
                    {group.label.toUpperCase()}
                  </Typography>
                </Box>

                {group.items.map((item) => (
                  <Box
                    key={item.key}
                    display="grid"
                    sx={{ gridTemplateColumns: "1fr 80px 80px" }}
                    px={3}
                    py={1.2}
                    alignItems="center"
                    borderBottom="1px solid #f0f0f0"
                  >
                    <Typography fontSize={14}>{item.label}</Typography>

                    {/* Email */}
                    <Box display="flex" justifyContent="center">
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "emailEnabled")}
                        onChange={(e) =>
                          handlePrefToggle(item.notificationType, "email", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#1976d2" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            bgcolor: "#1976d2",
                          },
                        }}
                      />
                    </Box>

                    {/* Push */}
                    <Box display="flex" justifyContent="center">
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "pushEnabled")}
                        onChange={(e) =>
                          handlePrefToggle(item.notificationType, "push", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#1976d2" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            bgcolor: "#1976d2",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}

                {gi < PREF_GROUPS.length - 1 && <Divider />}
              </Box>
            ))
          )}

          {/* Footer */}
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={1.5}
            px={3}
            py={2}
            bgcolor="#f9fafb"
            borderTop="1px solid #f0f0f0"
          >
            {prefsSaved && (
              <Typography fontSize={13} color="#2e7d32" alignSelf="center">
                ✓ Preferences saved
              </Typography>
            )}
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: "none", borderRadius: 2 }}
              onClick={() => setPrefsSaved(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
              onClick={() => setPrefsSaved(true)}
            >
              Save Preferences
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default UserNotifications;