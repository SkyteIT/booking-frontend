// src/pages/admin/notifications/AdminNotifications.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ─── Types ───────────────────────────────────────────────
type NotifStatus = "success" | "warning" | "error" | "info";
type FilterType = "All" | "Unread" | "success" | "warning" | "error" | "info";

interface Notification {
  id: number;
  title: string;
  time: string;
  status: NotifStatus;
  read: boolean;
}

// ─── Mock Data ────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New vendor approved: Luxury Resorts Inc.", time: "5 min ago", status: "success", read: false },
  { id: 2, title: "Refund request pending review", time: "15 min ago", status: "warning", read: false },
  { id: 3, title: "System maintenance scheduled for tonight", time: "1 hour ago", status: "info", read: true },
  { id: 4, title: "Payment gateway error reported", time: "2 hours ago", status: "error", read: false },
  { id: 5, title: "Daily revenue target achieved", time: "3 hours ago", status: "success", read: true },
  { id: 6, title: "New booking created: Booking #12345", time: "4 hours ago", status: "success", read: true },
  { id: 7, title: "Vendor dispute raised: City Car Rentals", time: "5 hours ago", status: "warning", read: false },
  { id: 8, title: "User account flagged for suspicious activity", time: "6 hours ago", status: "error", read: true },
  { id: 9, title: "Platform usage report is ready", time: "Yesterday", status: "info", read: true },
  { id: 10, title: "New vendor registered: Beach Hotels Group", time: "Yesterday", status: "info", read: true },
];

// ─── Config maps ─────────────────────────────────────────
const iconMap: Record<NotifStatus, React.ReactNode> = {
  success: <CheckCircleOutlineIcon sx={{ fontSize: 22, color: "#2e7d32" }} />,
  warning: <WarningAmberIcon sx={{ fontSize: 22, color: "#e65100" }} />,
  error: <ErrorOutlineIcon sx={{ fontSize: 22, color: "#c62828" }} />,
  info: <InfoOutlinedIcon sx={{ fontSize: 22, color: "#0077B6" }} />,
};

const bgMap: Record<NotifStatus, string> = {
  success: "#e6f4ea",
  warning: "#fff3e0",
  error: "#fdecea",
  info: "#e3f0fb",
};

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "All" },
  { label: "Unread", value: "Unread" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Info", value: "info" },
];

// ─── Main Component ───────────────────────────────────────
export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const deleteNotif = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !n.read;
    return n.status === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
            <Typography variant="h4" fontWeight={700}>Notifications</Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} unread`}
                size="small"
                sx={{ bgcolor: "#0077B6", color: "#fff", fontWeight: 600, fontSize: 12 }}
              />
            )}
          </Box>
          <Typography color="text.secondary" fontSize={14}>
            Stay updated with platform activities
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<DoneAllIcon />}
          onClick={markAllRead}
          disabled={unreadCount === 0}
          sx={{ textTransform: "none", borderRadius: 2, fontSize: 13 }}
        >
          Mark All as Read
        </Button>
      </Box>

      {/* Filter chips */}
      <Box display="flex" gap={1} mb={2.5} flexWrap="wrap">
        {FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={f.label}
            clickable
            onClick={() => setActiveFilter(f.value)}
            sx={{
              fontWeight: 500,
              fontSize: 13,
              bgcolor: activeFilter === f.value ? "#0077B6" : "#f0f4f8",
              color: activeFilter === f.value ? "#fff" : "#4a5568",
              "&:hover": {
                bgcolor: activeFilter === f.value ? "#005A8D" : "#e2e8f0",
              },
            }}
          />
        ))}
      </Box>

      {/* Notification list */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        {filtered.length === 0 ? (
          <Box py={6} textAlign="center">
            <InfoOutlinedIcon sx={{ fontSize: 40, color: "#b0bec5", mb: 1 }} />
            <Typography color="text.secondary" fontSize={14}>
              No notifications to show
            </Typography>
          </Box>
        ) : (
          filtered.map((notif, idx) => (
            <Box
              key={notif.id}
              onClick={() => markRead(notif.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: 3,
                py: 2,
                cursor: "pointer",
                bgcolor: notif.read ? "#fff" : "#f0f7ff",
                borderBottom:
                  idx < filtered.length - 1 ? "1px solid #f0f0f0" : "none",
                "&:hover": { bgcolor: notif.read ? "#f9fafb" : "#e8f1fb" },
                transition: "background 0.15s",
              }}
            >
              {/* Icon bubble */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: bgMap[notif.status],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {iconMap[notif.status]}
              </Box>

              {/* Text */}
              <Box flexGrow={1} minWidth={0}>
                <Typography
                  fontSize={14}
                  fontWeight={notif.read ? 400 : 600}
                  noWrap={false}
                  sx={{ lineHeight: 1.4 }}
                >
                  {notif.title}
                </Typography>
                <Typography fontSize={12} color="text.secondary" mt={0.2}>
                  {notif.time}
                </Typography>
              </Box>

              {/* Unread dot + delete */}
              <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                {!notif.read && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#0077B6",
                    }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  sx={{ color: "#b0bec5", "&:hover": { color: "#ef5350" } }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Paper>

      {/* Footer count */}
      {filtered.length > 0 && (
        <Typography fontSize={13} color="text.secondary" mt={2} textAlign="center">
          Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
          {activeFilter !== "All" ? ` — ${activeFilter}` : ""}
        </Typography>
      )}
    </Box>
  );
}
