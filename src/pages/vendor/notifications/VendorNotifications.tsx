// src/pages/vendor/notifications/VendorNotifications.tsx
import { useState } from "react";
import {
  Box, Typography, Paper, Button, Chip, IconButton, Switch, Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaymentIcon from "@mui/icons-material/Payment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useNotifications } from "../../../hooks/useNotifications";

// ─── Types ───────────────────────────────────────────────
type NotifStatus = "booking" | "payment" | "review" | "account" | "warning";
type FilterType = "All" | "Unread" | "booking" | "payment" | "review" | "account";

// ─── Config maps ─────────────────────────────────────────
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

// Maps API notificationType string/number → UI status badge
function resolveStatus(type: string | number): NotifStatus {
  const t = String(type).toLowerCase();
  if (t.includes("book") || t.includes("cancel") || t === "1" || t === "2" || t === "3") {
    if (t.includes("cancel") || t === "3") return "warning";
    return "booking";
  }
  if (t.includes("pay") || t === "4" || t === "5") return "payment";
  if (t.includes("review") || t === "6" || t === "7") return "review";
  if (t.includes("account") || t.includes("security") || t === "8" || t === "9") return "account";
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

// Preference groups define the UI rows; notificationType numbers map to API
const PREF_GROUPS = [
  {
    label: "Bookings",
    items: [
      { key: "new_booking",   label: "New booking requests",  notificationType: 1 },
      { key: "booking_conf",  label: "Booking confirmations", notificationType: 2 },
      { key: "cancellations", label: "Cancellations",         notificationType: 3 },
    ],
  },
  {
    label: "Payments",
    items: [
      { key: "pay_received", label: "Payment received",  notificationType: 4 },
      { key: "payout",       label: "Payout processed",  notificationType: 5 },
      { key: "pay_failed",   label: "Payment failed",    notificationType: 6 },
    ],
  },
  {
    label: "Reviews",
    items: [
      { key: "new_review",  label: "New reviews",        notificationType: 7 },
      { key: "review_resp", label: "Review responses",   notificationType: 8 },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "security",    label: "Security alerts",    notificationType: 9 },
      { key: "acc_updates", label: "Account updates",    notificationType: 10 },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────
export default function VendorNotifications() {
  const VENDOR_USER_ID = "YOUR-VENDOR-USER-GUID-HERE"; // Replace with real auth user id

  const {
    notifications,
    preferences,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    savePreference,
  } = useNotifications(VENDOR_USER_ID);

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [view, setView] = useState<"notifications" | "preferences">("notifications");

  // ── Preference toggle handler ──
  const handlePrefToggle = async (
    notificationType: number,
    channel: "email" | "push" | "sms",
    value: boolean
  ) => {
    setPrefsSaved(false);
    const existing = preferences.find(
      (p) => p.notificationType === String(notificationType)
    );
    await savePreference({
      notificationType,
      emailEnabled: channel === "email" ? value : existing?.emailEnabled ?? false,
      pushEnabled:  channel === "push"  ? value : existing?.pushEnabled  ?? false,
      smsEnabled:   channel === "sms"   ? value : existing?.smsEnabled   ?? false,
    });
    setPrefsSaved(true);
  };

  // Helper: read a preference value for a given type + channel
  const getPrefValue = (
    notificationType: number,
    channel: "emailEnabled" | "pushEnabled"
  ): boolean => {
    const pref = preferences.find(
      (p) => p.notificationType === String(notificationType)
    );
    return pref?.[channel] ?? false;
  };

  // ── Filter notifications list ──
  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.isRead;
    return resolveStatus(n.notificationType ?? n.type ?? "") === activeFilter;
  });

  return (
    <Box p={3}>
      {/* ── Page header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Notifications</Typography>
          <Typography color="text.secondary" fontSize={14}>
            Stay on top of your bookings and account activity
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant={view === "notifications" ? "contained" : "outlined"}
            onClick={() => setView("notifications")}
            sx={{
              textTransform: "none", borderRadius: 2, fontSize: 13,
              bgcolor: view === "notifications" ? "#0077B6" : undefined,
              "&:hover": { bgcolor: view === "notifications" ? "#005A8D" : undefined },
            }}
          >
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          <Button
            variant={view === "preferences" ? "contained" : "outlined"}
            onClick={() => setView("preferences")}
            sx={{
              textTransform: "none", borderRadius: 2, fontSize: 13,
              bgcolor: view === "preferences" ? "#0077B6" : undefined,
              "&:hover": { bgcolor: view === "preferences" ? "#005A8D" : undefined },
            }}
          >
            Preferences
          </Button>
        </Box>
      </Box>

      {/* ══════════════ NOTIFICATIONS VIEW ══════════════ */}
      {view === "notifications" && (
        <>
          {/* Controls row */}
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
                  onClick={() => setActiveFilter(f.value)}
                  sx={{
                    fontWeight: 500, fontSize: 13,
                    bgcolor: activeFilter === f.value ? "#0077B6" : "#f0f4f8",
                    color: activeFilter === f.value ? "#fff" : "#4a5568",
                    "&:hover": { bgcolor: activeFilter === f.value ? "#005A8D" : "#e2e8f0" },
                  }}
                />
              ))}
            </Box>
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loading}
              sx={{ textTransform: "none", borderRadius: 2, fontSize: 13 }}
            >
              Mark all read
            </Button>
          </Box>

          {/* Loading state */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress sx={{ color: "#0077B6" }} />
            </Box>
          ) : (
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              {filtered.length === 0 ? (
                <Box py={6} textAlign="center">
                  <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#b0bec5", mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>No notifications here</Typography>
                </Box>
              ) : (
                filtered.map((n, idx) => {
                  const status = resolveStatus(n.notificationType ?? n.type ?? "");
                  return (
                    <Box
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      sx={{
                        display: "flex", alignItems: "center", gap: 2,
                        px: 3, py: 2, cursor: "pointer",
                        bgcolor: n.isRead ? "#fff" : "#f0f7ff",
                        borderBottom: idx < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
                        "&:hover": { bgcolor: n.isRead ? "#f9fafb" : "#e8f1fb" },
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Icon bubble */}
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "50%",
                        bgcolor: bgMap[status],
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {iconMap[status]}
                      </Box>

                      {/* Text */}
                      <Box flexGrow={1}>
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

                      {/* Unread dot + delete */}
                      <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                        {!n.isRead && (
                          <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#0077B6" }} />
                        )}
                        {deleteNotification && (
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                            sx={{ color: "#b0bec5", "&:hover": { color: "#ef5350" } }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  );
                })
              )}
            </Paper>
          )}

          {!loading && filtered.length > 0 && (
            <Typography fontSize={13} color="text.secondary" mt={2} textAlign="center">
              Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </>
      )}

      {/* ══════════════ PREFERENCES VIEW ══════════════ */}
      {view === "preferences" && (
        <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {/* Header row */}
          <Box
            display="grid"
            sx={{ gridTemplateColumns: "1fr 80px 80px" }}
            px={3} py={1.5}
            bgcolor="#f9fafb"
            borderBottom="1px solid #f0f0f0"
          >
            <Typography fontSize={13} fontWeight={600} color="text.secondary">Notification type</Typography>
            <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">Email</Typography>
            <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">Push</Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress sx={{ color: "#0077B6" }} />
            </Box>
          ) : (
            PREF_GROUPS.map((group, gi) => (
              <Box key={group.label}>
                {/* Group label */}
                <Box px={3} pt={2} pb={0.5}>
                  <Typography fontWeight={700} fontSize={14}>{group.label}</Typography>
                </Box>

                {group.items.map((item) => (
                  <Box
                    key={item.key}
                    display="grid"
                    sx={{ gridTemplateColumns: "1fr 80px 80px", "&:last-child": { borderBottom: "none" } }}
                    px={3} py={1.2}
                    alignItems="center"
                    borderBottom="1px solid #f0f0f0"
                  >
                    <Typography fontSize={14} color="text.primary">{item.label}</Typography>

                    {/* Email toggle */}
                    <Box display="flex" justifyContent="center">
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "emailEnabled")}
                        onChange={(e) =>
                          handlePrefToggle(item.notificationType, "email", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                        }}
                      />
                    </Box>

                    {/* Push toggle */}
                    <Box display="flex" justifyContent="center">
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "pushEnabled")}
                        onChange={(e) =>
                          handlePrefToggle(item.notificationType, "push", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                        }}
                      />
                    </Box>
                  </Box>
                ))}

                {gi < PREF_GROUPS.length - 1 && <Divider />}
              </Box>
            ))
          )}

          {/* Save footer */}
          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1.5}
            px={3} py={2}
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
              sx={{ textTransform: "none", borderRadius: 2 }}
              onClick={() => setPrefsSaved(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              sx={{
                textTransform: "none", borderRadius: 2,
                bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" },
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
}