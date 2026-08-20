// src/pages/admin/notifications/AdminNotifications.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import SegmentedTabs from "../../../components/common/SegmentedTabs";
import { useNotifications } from "../../../hooks/useNotifications";
import type { Notification } from "../../../services/notificationService";
import { useAuth } from "../../../context/useAuth";

// ─── Types ───────────────────────────────────────────────
type NotifStatus = "success" | "warning" | "error" | "info";
type FilterType = "All" | "Unread" | "success" | "warning" | "error" | "info";

// ─── Config maps ─────────────────────────────────────────
const iconMap: Record<NotifStatus, React.ReactNode> = {
  success: <CheckCircleOutlineIcon sx={{ fontSize: 22, color: "#2e7d32" }} />,
  warning: <WarningAmberIcon sx={{ fontSize: 22, color: "#e65100" }} />,
  error:   <ErrorOutlineIcon sx={{ fontSize: 22, color: "#c62828" }} />,
  info:    <InfoOutlinedIcon sx={{ fontSize: 22, color: "#0077B6" }} />,
};

const bgMap: Record<NotifStatus, string> = {
  success: "#e6f4ea",
  warning: "#fff3e0",
  error:   "#fdecea",
  info:    "#e3f0fb",
};

// API enum: 0=Booking → info, 1=Payment → success, 2=Review → info, 3=Account → warning
// Notification.type is a string ("0","1","2","3" or named like "booking","payment")
function resolveStatus(type: string): NotifStatus {
  const t = type.toLowerCase();
  if (t === "1" || t.includes("pay") || t.includes("success") || t.includes("approv") || t.includes("revenue") || t.includes("achiev")) return "success";
  if (t === "3" || t.includes("warn") || t.includes("dispute") || t.includes("refund") || t.includes("pending") || t.includes("account")) return "warning";
  if (t.includes("error") || t.includes("fail") || t.includes("flag") || t.includes("suspicious")) return "error";
  // 0=Booking, 2=Review, and everything else → info
  return "info";
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All",     value: "All" },
  { label: "Unread",  value: "Unread" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error",   value: "error" },
  { label: "Info",    value: "info" },
];

// ─── Main Component ───────────────────────────────────────
export default function AdminNotifications() {
  const { user } = useAuth();
  const adminUserId = user?.userId ?? user?.id ?? null;

  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications(adminUserId);

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  // ── Filter ─────────────────────────────────────────────
  // Notification.type is a string — no local status field, resolve on the fly
  const filtered: Notification[] = notifications.filter((n: Notification) => {
    if (activeFilter === "All")    return true;
    if (activeFilter === "Unread") return !n.isRead;
    return resolveStatus(n.type) === activeFilter;
  });

  return (
    <Box p={3}>
      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
            <Typography
              variant="h5"
              sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} unread`}
                size="small"
                sx={{
                  background: "linear-gradient(160deg, #005a8d, #0077b6)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12,
                }}
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
          onClick={markAllAsRead}
          disabled={unreadCount === 0 || loading}
          sx={{ textTransform: "none", borderRadius: "999px", fontSize: 13 }}
        >
          Mark All as Read
        </Button>
      </Box>

      {/* ── Filter tabs ── */}
      <Box mb={2.5}>
        <SegmentedTabs
          options={FILTERS.map((f) => f.value)}
          value={activeFilter}
          onChange={setActiveFilter}
          labels={Object.fromEntries(FILTERS.map((f) => [f.value, f.label]))}
        />
      </Box>

      {/* ── Loading state ── */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#0077B6" }} />
        </Box>
      ) : (
        <>
          {/* ── Notification list ── */}
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
              <Box py={6} textAlign="center">
                <InfoOutlinedIcon sx={{ fontSize: 40, color: "#b0bec5", mb: 1 }} />
                <Typography color="text.secondary" fontSize={14}>
                  No notifications to show
                </Typography>
              </Box>
            ) : (
              filtered.map((n: Notification, idx: number) => {
                const status = resolveStatus(n.type);
                return (
                  <Box
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 2,
                      py: 1.75,
                      mb: idx < filtered.length - 1 ? 1 : 0,
                      borderRadius: "14px",
                      cursor: "pointer",
                      background: n.isRead
                        ? "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)"
                        : "linear-gradient(160deg, #FFFFFF 0%, #DCEEFB 100%)",
                      border: "1px solid rgba(15,27,45,0.06)",
                      "&:hover": { transform: "translateY(-1px)", boxShadow: "0 6px 16px rgba(15,27,45,0.08)" },
                      transition: "all 0.15s ease",
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

                    {/* Text — Notification fields: title, message, createdAtUtc, isRead */}
                    <Box flexGrow={1} minWidth={0}>
                      <Typography
                        fontSize={14}
                        fontWeight={n.isRead ? 400 : 600}
                        sx={{ lineHeight: 1.4 }}
                      >
                        {n.title}
                      </Typography>
                      {n.message && (
                        <Typography fontSize={12} color="text.secondary" mt={0.2}>
                          {n.message}
                        </Typography>
                      )}
                      <Typography fontSize={12} color="text.disabled" mt={0.2}>
                        {new Date(n.createdAtUtc).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* Unread dot + dismiss (hook has no deleteNotification — marks read) */}
                    <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                      {!n.isRead && (
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
                        onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
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

          {/* ── Footer count ── */}
          {filtered.length > 0 && (
            <Typography fontSize={13} color="text.secondary" mt={2} textAlign="center">
              Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
              {activeFilter !== "All" ? ` — ${activeFilter}` : ""}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}