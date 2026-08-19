import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  InputAdornment,
  Paper,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CircleIcon from "@mui/icons-material/Circle";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { useAuth } from "../../../context/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import {
  getNotificationRoleConfig,
  resolveNotificationDestination,
  resolveNotificationEventMeta,
  resolveNotificationMatch,
  type NotificationSeverity,
} from "../../../components/notifications/notificationCatalog";

type AdminFilter = "all" | "unread" | "critical" | "onboarding" | "moderation" | "operations" | "safety";

const PAGE_SIZE = 8;

const FILTERS: Array<{ value: AdminFilter; label: string; description: string }> = [
  { value: "all", label: "All", description: "Everything in the admin inbox" },
  { value: "unread", label: "Unread", description: "Items you have not reviewed yet" },
  { value: "critical", label: "Critical", description: "High-priority incidents and escalations" },
  { value: "onboarding", label: "Onboarding", description: "Vendor and customer registration events" },
  { value: "moderation", label: "Moderation", description: "Approval queues and reported content" },
  { value: "operations", label: "Operations", description: "Bookings, payments, and refunds" },
  { value: "safety", label: "Safety", description: "Suspensions and system alerts" },
];

const severityTone: Record<NotificationSeverity, { bg: string; color: string; label: string }> = {
  info: { bg: "#e3f2fd", color: "#1565c0", label: "Info" },
  success: { bg: "#e8f5e9", color: "#2e7d32", label: "Resolved" },
  warning: { bg: "#fff3e0", color: "#ef6c00", label: "Attention" },
  error: { bg: "#ffebee", color: "#c62828", label: "Escalation" },
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hour${Math.floor(diffSeconds / 3600) === 1 ? "" : "s"} ago`;
  if (diffSeconds < 172800) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.userId ?? user?.id ?? null;
  const roleConfig = getNotificationRoleConfig("admin");

  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    reload,
  } = useNotifications(userId, { refreshIntervalMs: 30000 });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<AdminFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const notificationsWithMeta = useMemo(() => {
    return notifications.map((item) => {
      const match = resolveNotificationMatch("admin", item.type, item.title, item.message);
      return { ...item, match };
    });
  }, [notifications]);

  const stats = useMemo(() => {
    const total = notificationsWithMeta.length;
    const unread = notificationsWithMeta.filter((n) => !n.isRead).length;
    const critical = notificationsWithMeta.filter((n) => n.match.severity === "error" || n.match.severity === "warning").length;
    const resolved = notificationsWithMeta.filter((n) => n.isRead).length;

    return { total, unread, critical, resolved };
  }, [notificationsWithMeta]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notificationsWithMeta.filter((item) => {
      const group = roleConfig.groups.find((entry) => entry.key === item.match.groupKey);
      const haystack = [
        item.title,
        item.message,
        item.type,
        item.match.label,
        group?.title,
        ...(group?.keywords ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !haystack.includes(query)) return false;

      if (activeFilter === "all") return true;
      if (activeFilter === "unread") return !item.isRead;
      if (activeFilter === "critical") return item.match.severity === "error" || item.match.severity === "warning";
      return item.match.groupKey === activeFilter;
    });
  }, [activeFilter, notificationsWithMeta, roleConfig.groups, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const selected = useMemo(() => {
    return notificationsWithMeta.find((item) => item.id === selectedId) ?? null;
  }, [notificationsWithMeta, selectedId]);

  const filterCounts = useMemo(() => {
    return FILTERS.reduce<Record<AdminFilter, number>>((acc, item) => {
      if (item.value === "all") acc[item.value] = notificationsWithMeta.length;
      else if (item.value === "unread") acc[item.value] = notificationsWithMeta.filter((n) => !n.isRead).length;
      else if (item.value === "critical") acc[item.value] = notificationsWithMeta.filter((n) => n.match.severity === "error" || n.match.severity === "warning").length;
      else acc[item.value] = notificationsWithMeta.filter((n) => n.match.groupKey === item.value).length;
      return acc;
    }, {
      all: 0,
      unread: 0,
      critical: 0,
      onboarding: 0,
      moderation: 0,
      operations: 0,
      safety: 0,
    });
  }, [notificationsWithMeta]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (!selectedId) return;
    if (notificationsWithMeta.some((item) => item.id === selectedId)) return;
    setSelectedId(null);
  }, [notificationsWithMeta, selectedId]);

  const openItem = async (id: string) => {
    setSelectedId(id);
    const item = notificationsWithMeta.find((entry) => entry.id === id);
    if (item && !item.isRead) {
      await markAsRead(id);
    }
  };

  const selectedDestination = useMemo(() => {
    if (!selected) return null;
    return resolveNotificationDestination("admin", selected.type, selected.title, selected.message);
  }, [selected]);
  const selectedEventMeta = useMemo(() => {
    if (!selected) return null;
    return resolveNotificationEventMeta("admin", selected.type, selected.title, selected.message);
  }, [selected]);
  const SelectedIcon = selectedEventMeta?.icon ?? NotificationsActiveOutlinedIcon;

  return (
    <Box sx={{ display: "grid", gap: 3, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 6,
          p: { xs: 3, md: 4.25 },
          color: "#0f172a",
          background: "linear-gradient(135deg, #f8fbff 0%, #eef4ff 46%, #e0eaff 100%)",
          border: "1px solid rgba(37,99,235,0.12)",
          boxShadow: "0 18px 44px rgba(37,99,235,0.08)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(37,99,235,0.10), transparent 30%), radial-gradient(circle at bottom left, rgba(59,130,246,0.08), transparent 28%)",
            pointerEvents: "none",
          }}
        />
        <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
            <Stack direction="row" spacing={2.25} alignItems="center">
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#2563eb",
                  color: "#fff",
                  border: "1px solid rgba(37,99,235,0.18)",
                }}
              >
                <NotificationsActiveOutlinedIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  lineHeight={1.05}
                  sx={{ letterSpacing: "-0.5px", color: "#0F172A" }}
                >
                  Admin command inbox
                </Typography>
                <Typography sx={{ mt: 0.75, maxWidth: 780, color: "#64748B", fontSize: 14 }}>
                  Monitor onboarding, moderation, operations, and safety events from a single queue.
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ height: 8 }} />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<DoneAllOutlinedIcon />}
              onClick={() => userId && markAllAsRead()}
              disabled={!userId || loading || unreadCount === 0}
              sx={{
                bgcolor: "#fff",
                color: "#0f172a",
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 999,
                px: 2.5,
                border: "1px solid rgba(15,23,42,0.08)",
                "&:hover": { bgcolor: "#f8fafc", borderColor: "rgba(37,99,235,0.18)" },
              }}
            >
              Mark all read
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={() => reload()}
              disabled={loading}
              sx={{
                borderColor: "rgba(37,99,235,0.18)",
                color: "#1d4ed8",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                px: 2.5,
                bgcolor: "#fff",
                "&:hover": { borderColor: "rgba(37,99,235,0.35)", bgcolor: "#eff6ff" },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {!userId && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Sign in to see the live admin inbox.
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: "1fr",
          alignItems: "start",
        }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 2,
            }}
          >
            {[
              {
                label: "Total events",
                value: stats.total,
                accent: "#1d4ed8",
                tint: "#eff6ff",
                border: "rgba(29,78,216,0.16)",
                icon: <FilterListRoundedIcon />,
                hint: "All inbound events",
              },
              {
                label: "Unread",
                value: stats.unread,
                accent: "#0284c7",
                tint: "#ecfeff",
                border: "rgba(2,132,199,0.16)",
                icon: <NotificationsActiveOutlinedIcon />,
                hint: "Needs review",
              },
              {
                label: "Critical",
                value: stats.critical,
                accent: "#e11d48",
                tint: "#fff1f2",
                border: "rgba(225,29,72,0.16)",
                icon: <PriorityHighRoundedIcon />,
                hint: "Escalations",
              },
              {
                label: "Processed",
                value: stats.resolved,
                accent: "#16a34a",
                tint: "#f0fdf4",
                border: "rgba(22,163,74,0.16)",
                icon: <DoneAllOutlinedIcon />,
                hint: "Already reviewed",
              },
            ].map((card) => (
              <Paper
                key={card.label}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 1.8,
                  border: `1px solid ${card.border}`,
                  bgcolor: card.tint,
                  boxShadow: "0 10px 24px rgba(15,23,42,0.03)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: "0 auto auto 0",
                    width: 4,
                    height: "100%",
                    background: card.accent,
                    opacity: 0.9,
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5} sx={{ pl: 0.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ letterSpacing: 0.45, textTransform: "uppercase", color: "text.secondary" }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={900} sx={{ mt: 0.35, lineHeight: 1, color: "#0f172a" }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", mt: 0.35, color: "text.secondary" }}>
                      {card.hint}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#fff", color: card.accent, width: 38, height: 38, boxShadow: "0 6px 16px rgba(15,23,42,0.08)" }}>
                    {card.icon}
                  </Avatar>
                </Stack>
              </Paper>
            ))}
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              border: "1px solid rgba(15,23,42,0.08)",
              bgcolor: "#fff",
              overflow: "hidden",
              boxShadow: "0 16px 40px rgba(15,23,42,0.05)",
            }}
          >
            <Box sx={{ p: { xs: 2.25, md: 2.75 } }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>
                    Notification stream
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search and switch between inbox views with a compact admin workflow.
                  </Typography>
                </Box>
                <TextField
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications"
                  size="small"
                  sx={{
                    width: { xs: "100%", md: 300 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#E8F1FF",
                      borderRadius: 999,
                      transition: "all 0.18s ease",
                      "& fieldset": {
                        borderColor: "rgba(37,99,235,0.22)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(37,99,235,0.36)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2563EB",
                        borderWidth: 1,
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontWeight: 600,
                      color: "#1E3A8A",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon fontSize="small" sx={{ color: "#3B82F6" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Box
                sx={{
                  mt: 2.5,
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: 0.9,
                  overflowX: "hidden",
                  pb: 0.5,
                }}
              >
                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter.value;
                  const count = filterCounts[filter.value];

                  return (
                    <Button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      variant={isActive ? "contained" : "outlined"}
                      sx={{
                        width: "100%",
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        borderRadius: 999,
                        textTransform: "none",
                        px: 1.1,
                        py: 0.8,
                        borderColor: isActive ? "#2563eb" : "rgba(15,23,42,0.10)",
                        bgcolor: isActive ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" : "#fff",
                        color: isActive ? "#fff" : "#334155",
                        boxShadow: isActive
                          ? "0 12px 28px rgba(37,99,235,0.22)"
                          : "0 1px 2px rgba(15,23,42,0.04)",
                        minHeight: 38,
                        borderWidth: 1,
                        position: "relative",
                        "&:hover": {
                          bgcolor: isActive ? "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)" : "#eff6ff",
                          borderColor: isActive ? "#1d4ed8" : "#93c5fd",
                          color: isActive ? "#fff" : "#1d4ed8",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: isActive ? "#fff" : "rgba(37,99,235,0.75)",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          fontWeight={800}
                          fontSize="0.78rem"
                          sx={{ lineHeight: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {filter.label}
                        </Typography>
                        <Chip
                          label={count}
                          size="small"
                          sx={{
                            height: 18,
                            fontWeight: 800,
                            bgcolor: isActive ? "rgba(255,255,255,0.16)" : "rgba(37,99,235,0.08)",
                            color: isActive ? "#fff" : "#1d4ed8",
                            flexShrink: 0,
                            "& .MuiChip-label": { px: 0.65, fontSize: "0.66rem" },
                          }}
                        />
                      </Stack>
                    </Button>
                  );
                })}
              </Box>
            </Box>

            <Divider />

            {loading ? (
              <Box sx={{ p: 4 }}>
                <Typography color="text.secondary">Loading admin notifications...</Typography>
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ p: 5, textAlign: "center" }}>
                <NotificationsActiveOutlinedIcon sx={{ fontSize: 52, color: "text.disabled" }} />
                <Typography fontWeight={800} sx={{ mt: 1 }}>
                  No notifications match this view
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Try another filter or search term.
                </Typography>
              </Box>
            ) : (
              <Stack divider={<Divider flexItem />} sx={{ maxHeight: { xl: 700 }, overflow: "auto" }}>
                {visible.map((item) => {
                  const group = roleConfig.groups.find((entry) => entry.key === item.match.groupKey) ?? roleConfig.groups[0];
                  const eventMeta = resolveNotificationEventMeta("admin", item.type, item.title, item.message);
                  const tone = severityTone[item.match.severity];

                  return (
                    <Box
                      key={item.id}
                      onClick={() => void openItem(item.id)}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "auto minmax(0, 1fr) auto",
                        gap: 1.5,
                        px: 2,
                        py: 1.6,
                        cursor: "pointer",
                        transition: "background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                        backgroundColor: item.isRead ? "#fff" : "#f8fbff",
                        borderLeft: item.isRead ? "3px solid transparent" : `3px solid ${group.accent}`,
                        "&:hover": {
                          backgroundColor: item.isRead ? "#fafcff" : "#eef5ff",
                          boxShadow: "inset 0 0 0 1px rgba(37,99,235,0.08)",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `${eventMeta.accent}14`,
                          color: eventMeta.accent,
                          borderRadius: 3,
                        }}
                      >
                        <eventMeta.icon fontSize="small" />
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="center">
                          <Typography fontWeight={800} sx={{ lineHeight: 1.15, fontSize: "0.95rem" }}>
                            {item.title}
                          </Typography>
                          <Chip
                            label={group.title}
                            size="small"
                            sx={{
                              bgcolor: `${group.accent}14`,
                              color: group.accent,
                              fontWeight: 700,
                              height: 22,
                            }}
                          />
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, fontSize: "0.875rem" }}>
                          {item.message}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.85 }}>
                          <Chip
                            size="small"
                            label={tone.label}
                            sx={{
                              bgcolor: tone.bg,
                              color: tone.color,
                              fontWeight: 700,
                              height: 22,
                            }}
                          />
                          <Typography variant="caption" color="text.disabled">
                            {formatTime(item.createdAtUtc)}
                          </Typography>
                        </Stack>
                      </Box>

                      <Stack alignItems="flex-end" spacing={0.75}>
                        <ArrowForwardIosRoundedIcon sx={{ fontSize: 11, color: "text.disabled", mt: 0.7 }} />
                        {!item.isRead ? (
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: group.accent }} />
                        ) : (
                          <CircleIcon sx={{ fontSize: 8, color: "transparent" }} />
                        )}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            )}

            {filtered.length > PAGE_SIZE && (
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={safePage}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </Paper>
        </Stack>
      </Box>

      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            bgcolor: "#f8fafc",
          },
        }}
      >
        {selected ? (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Notification details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin review and action panel.
                </Typography>
              </Box>
              <Chip
                label={selected.isRead ? "Read" : "Unread"}
                color={selected.isRead ? "success" : "primary"}
                variant="outlined"
              />
            </Stack>

            <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: `${selectedEventMeta?.accent ?? "#0f172a"}14`,
                    color: selectedEventMeta?.accent ?? "#0f172a",
                  }}
                >
                  <SelectedIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography fontWeight={800}>{selected.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEventMeta?.label ?? selected.match.label}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                {selected.message}
              </Typography>

              <Stack spacing={1.25} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Event type
                  </Typography>
                  <Typography fontWeight={700}>{selected.type}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography fontWeight={700}>{formatTime(selected.createdAtUtc)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography fontWeight={700}>{selected.isRead ? "Reviewed" : "Pending review"}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ mt: 2, p: 2.5, borderRadius: 3 }}>
              <Typography fontWeight={800} sx={{ mb: 1.5 }}>
                Actions
              </Typography>
              <Stack spacing={1.2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!selected.isRead) {
                      void markAsRead(selected.id);
                    }
                  }}
                  disabled={selected.isRead}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  Mark as read
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewRoundedIcon />}
                  onClick={() => navigate(selectedDestination?.path ?? "/admin/dashboard")}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  {selectedDestination?.label ?? "Open related page"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedId(null)}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  Close
                </Button>
              </Stack>
            </Paper>
          </Box>
        ) : null}
      </Drawer>
    </Box>
  );
}
