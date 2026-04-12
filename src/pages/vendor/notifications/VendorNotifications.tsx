// src/pages/vendor/notifications/VendorNotifications.tsx
import { useState } from "react";
import {
  Box, Typography, Paper, Button, Chip, IconButton, Switch, Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PaymentIcon from "@mui/icons-material/Payment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ─── Types ───────────────────────────────────────────────
type NotifStatus = "booking" | "payment" | "review" | "account" | "warning";
type FilterType = "All" | "Unread" | "booking" | "payment" | "review" | "account";

interface Notification {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  status: NotifStatus;
  read: boolean;
}

// ─── Preference state type ────────────────────────────────
interface PrefGroup {
  label: string;
  items: { key: string; label: string; email: boolean; push: boolean }[];
}

// ─── Mock notifications ───────────────────────────────────
const INITIAL_NOTIFS: Notification[] = [
  { id: 1, title: "New booking request", subtitle: "Guest: John Doe — Ocean Suite, 3 nights", time: "2 min ago", status: "booking", read: false },
  { id: 2, title: "Booking confirmed", subtitle: "Booking #BK-2891 is now confirmed", time: "10 min ago", status: "booking", read: false },
  { id: 3, title: "Cancellation received", subtitle: "Booking #BK-2745 was cancelled by the guest", time: "30 min ago", status: "warning", read: false },
  { id: 4, title: "Payment received", subtitle: "$320.00 credited for Booking #BK-2891", time: "1 hour ago", status: "payment", read: true },
  { id: 5, title: "Payout processed", subtitle: "$1,240.00 sent to your bank account", time: "3 hours ago", status: "payment", read: true },
  { id: 6, title: "New review posted", subtitle: "Sarah M. gave you 5 stars — 'Excellent stay!'", time: "5 hours ago", status: "review", read: true },
  { id: 7, title: "Review response reminder", subtitle: "You haven't replied to 2 recent reviews", time: "Yesterday", status: "review", read: true },
  { id: 8, title: "Security alert", subtitle: "New login from Colombo, LK", time: "Yesterday", status: "account", read: true },
  { id: 9, title: "Account updated", subtitle: "Your payout details were changed successfully", time: "2 days ago", status: "account", read: true },
];

// ─── Initial preferences ──────────────────────────────────
const INITIAL_PREFS: PrefGroup[] = [
  {
    label: "Bookings",
    items: [
      { key: "new_booking", label: "New booking requests", email: true, push: true },
      { key: "booking_conf", label: "Booking confirmations", email: true, push: true },
      { key: "cancellations", label: "Cancellations", email: true, push: false },
    ],
  },
  {
    label: "Payments",
    items: [
      { key: "pay_received", label: "Payment received", email: true, push: true },
      { key: "payout", label: "Payout processed", email: true, push: false },
      { key: "pay_failed", label: "Payment failed", email: true, push: true },
    ],
  },
  {
    label: "Reviews",
    items: [
      { key: "new_review", label: "New reviews", email: true, push: true },
      { key: "review_resp", label: "Review responses", email: false, push: false },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "security", label: "Security alerts", email: true, push: true },
      { key: "acc_updates", label: "Account updates", email: true, push: false },
    ],
  },
];

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

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "All" },
  { label: "Unread", value: "Unread" },
  { label: "Bookings", value: "booking" },
  { label: "Payments", value: "payment" },
  { label: "Reviews", value: "review" },
  { label: "Account", value: "account" },
];

// ─── Main Component ───────────────────────────────────────
export default function VendorNotifications() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [view, setView] = useState<"notifications" | "preferences">("notifications");

  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) =>
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const deleteNotif = (id: number) => setNotifs((p) => p.filter((n) => n.id !== id));

  const togglePref = (
    groupIdx: number,
    itemIdx: number,
    channel: "email" | "push"
  ) => {
    setPrefsSaved(false);
    setPrefs((prev) =>
      prev.map((g, gi) =>
        gi !== groupIdx
          ? g
          : {
              ...g,
              items: g.items.map((item, ii) =>
                ii !== itemIdx
                  ? item
                  : { ...item, [channel]: !item[channel] }
              ),
            }
      )
    );
  };

  const filtered = notifs.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.status === activeFilter;
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

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
            sx={{ textTransform: "none", borderRadius: 2, fontSize: 13,
              bgcolor: view === "notifications" ? "#0077B6" : undefined,
              "&:hover": { bgcolor: view === "notifications" ? "#005A8D" : undefined },
            }}
          >
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </Button>
          <Button
            variant={view === "preferences" ? "contained" : "outlined"}
            onClick={() => setView("preferences")}
            sx={{ textTransform: "none", borderRadius: 2, fontSize: 13,
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
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
              onClick={markAllRead}
              disabled={unreadCount === 0}
              sx={{ textTransform: "none", borderRadius: 2, fontSize: 13 }}
            >
              Mark all read
            </Button>
          </Box>

          {/* List */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {filtered.length === 0 ? (
              <Box py={6} textAlign="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#b0bec5", mb: 1 }} />
                <Typography color="text.secondary" fontSize={14}>No notifications here</Typography>
              </Box>
            ) : (
              filtered.map((n, idx) => (
                <Box
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 2,
                    px: 3, py: 2, cursor: "pointer",
                    bgcolor: n.read ? "#fff" : "#f0f7ff",
                    borderBottom: idx < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
                    "&:hover": { bgcolor: n.read ? "#f9fafb" : "#e8f1fb" },
                    transition: "background 0.15s",
                  }}
                >
                  {/* Icon bubble */}
                  <Box sx={{
                    width: 40, height: 40, borderRadius: "50%",
                    bgcolor: bgMap[n.status],
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {iconMap[n.status]}
                  </Box>

                  {/* Text */}
                  <Box flexGrow={1}>
                    <Typography fontSize={14} fontWeight={n.read ? 400 : 600} lineHeight={1.4}>
                      {n.title}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary" mt={0.2}>{n.subtitle}</Typography>
                    <Typography fontSize={11} color="text.disabled" mt={0.3}>{n.time}</Typography>
                  </Box>

                  {/* Unread dot + delete */}
                  <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                    {!n.read && (
                      <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#0077B6" }} />
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }}
                      sx={{ color: "#b0bec5", "&:hover": { color: "#ef5350" } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Paper>

          {filtered.length > 0 && (
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

          {prefs.map((group, gi) => (
            <Box key={group.label}>
              {/* Group label */}
              <Box px={3} pt={2} pb={0.5}>
                <Typography fontWeight={700} fontSize={14}>{group.label}</Typography>
              </Box>

              {group.items.map((item, ii) => (
                <Box
                  key={item.key}
                  display="grid"
                  sx={{ gridTemplateColumns: "1fr 80px 80px" }}
                  px={3} py={1.2}
                  alignItems="center"
                  borderBottom="1px solid #f0f0f0"
                  sx2={{ "&:last-child": { borderBottom: "none" } }}
                >
                  <Typography fontSize={14} color="text.primary">{item.label}</Typography>
                  <Box display="flex" justifyContent="center">
                    <Switch
                      size="small"
                      checked={item.email}
                      onChange={() => togglePref(gi, ii, "email")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                      }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <Switch
                      size="small"
                      checked={item.push}
                      onChange={() => togglePref(gi, ii, "push")}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                      }}
                    />
                  </Box>
                </Box>
              ))}

              {gi < prefs.length - 1 && <Divider />}
            </Box>
          ))}

          {/* Save footer */}
          <Box display="flex" justifyContent="flex-end" gap={1.5} px={3} py={2} bgcolor="#f9fafb" borderTop="1px solid #f0f0f0">
            {prefsSaved && (
              <Typography fontSize={13} color="#2e7d32" alignSelf="center">
                ✓ Preferences saved
              </Typography>
            )}
            <Button variant="outlined" sx={{ textTransform: "none", borderRadius: 2 }}
              onClick={() => { setPrefs(INITIAL_PREFS); setPrefsSaved(false); }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" } }}
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
