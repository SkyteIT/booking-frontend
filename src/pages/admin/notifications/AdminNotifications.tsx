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
import SegmentedTabs from "../../../components/common/SegmentedTabs";
import {
  getNotificationRoleConfig,
  resolveNotificationDestination,
  resolveNotificationEventMeta,
  resolveNotificationMatch,
  type NotificationSeverity,
} from "../../../components/notifications/notificationCatalog";

type AdminFilter = "all" | "unread" | "critical" | "onboarding" | "moderation" | "operations" | "safety";

const PAGE_SIZE = 8;

const FILTERS: Array<{ value: AdminFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "critical", label: "Critical" },
  { value: "onboarding", label: "Onboarding" },
  { value: "moderation", label: "Moderation" },
  { value: "operations", label: "Operations" },
  { value: "safety", label: "Safety" },
];

const severityTone: Record<NotificationSeverity, { bg: string; color: string; label: string }> = {
  info: { bg: "#e3f1fc", color: "#0077b6", label: "Info" },
  success: { bg: "#ECFDF5", color: "#10B981", label: "Resolved" },
  warning: { bg: "#FFFBEB", color: "#F59E0B", label: "Attention" },
  error: { bg: "#FEF2F2", color: "#DC2626", label: "Escalation" },
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
      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
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
            Monitor onboarding, moderation, operations, and safety events from a single queue.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<DoneAllOutlinedIcon />}
            onClick={() => userId && markAllAsRead()}
            disabled={!userId || loading || unreadCount === 0}
            sx={{
              borderColor: "divider",
              color: "text.primary",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              px: 2.5,
              "&:hover": { borderColor: "primary.main", bgcolor: "rgba(0,119,182,0.06)", color: "primary.main" },
            }}
          >
            Mark all read
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => reload()}
            disabled={loading}
            disableElevation
            sx={{
              background: "linear-gradient(160deg, #005a8d, #0077b6)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              px: 2.5,
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {!userId && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Sign in to see the live admin inbox.
        </Alert>
      )}

      {/* ── Stat cards ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {[
          { label: "Total events", value: stats.total, color: "#0077b6", bg: "linear-gradient(135deg,#E0F2FE,#BAE6FD)", icon: <FilterListRoundedIcon /> },
          { label: "Unread", value: stats.unread, color: "#0284c7", bg: "linear-gradient(135deg,#ECFEFF,#CFFAFE)", icon: <NotificationsActiveOutlinedIcon /> },
          { label: "Critical", value: stats.critical, color: "#DC2626", bg: "linear-gradient(135deg,#FEF2F2,#FEE2E2)", icon: <PriorityHighRoundedIcon /> },
          { label: "Processed", value: stats.resolved, color: "#10B981", bg: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", icon: <DoneAllOutlinedIcon /> },
        ].map((card) => (
          <Paper
            key={card.label}
            sx={{
              borderRadius: 3,
              p: 2,
              border: "1px solid rgba(15,27,45,0.06)",
              background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="caption" sx={{ letterSpacing: 0.5, textTransform: "uppercase", color: "text.secondary", fontWeight: 600 }}>
                  {card.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 0.3, color: "#0F172A" }}>
                  {card.value}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  background: card.bg,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* ── Filters + search + list ── */}
      <Paper
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
        }}
      >
        <Box sx={{ p: { xs: 2.25, md: 2.75 } }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications"
            size="small"
            fullWidth
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                borderRadius: 999,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />

          <SegmentedTabs
            options={FILTERS.map((filter) => filter.value)}
            value={activeFilter}
            onChange={setActiveFilter}
            labels={Object.fromEntries(
              FILTERS.map((filter) => [filter.value, `${filter.label} ${filterCounts[filter.value]}`])
            )}
          />
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ p: 4 }}>
            <Typography color="text.secondary">Loading admin notifications...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <NotificationsActiveOutlinedIcon sx={{ fontSize: 52, color: "#CBD5E1" }} />
            <Typography fontWeight={700} sx={{ mt: 1 }}>
              No notifications match this view
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Try another filter or search term.
            </Typography>
          </Box>
        ) : (
          <Stack sx={{ maxHeight: { xl: 700 }, overflow: "auto" }}>
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
                    px: 2.5,
                    py: 1.75,
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(15,27,45,0.05)",
                    borderLeft: item.isRead ? "3px solid transparent" : "3px solid #0077b6",
                    background: item.isRead ? "transparent" : "rgba(0,119,182,0.04)",
                    transition: "background-color 0.15s ease",
                    "&:hover": { background: "rgba(0,119,182,0.06)" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "rgba(0,119,182,0.08)",
                      color: "primary.main",
                      borderRadius: "12px",
                    }}
                  >
                    <eventMeta.icon fontSize="small" />
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" spacing={1.5} alignItems="center">
                      <Typography fontWeight={700} sx={{ lineHeight: 1.2, fontSize: "0.92rem" }}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={group.title}
                        size="small"
                        sx={{
                          bgcolor: "rgba(0,119,182,0.08)",
                          color: "primary.main",
                          fontWeight: 700,
                          height: 22,
                        }}
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, fontSize: "0.85rem" }}>
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
                    <ArrowForwardIosRoundedIcon sx={{ fontSize: 11, color: "#CBD5E1", mt: 0.7 }} />
                    {!item.isRead ? (
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main" }} />
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
              borderTop: "1px solid rgba(15,27,45,0.05)",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </Typography>
            <Pagination
              count={totalPages}
              page={safePage}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  background: "linear-gradient(160deg, #005a8d, #0077b6)",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* ── Detail drawer ── */}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        {selected ? (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                  Notification details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin review and action panel.
                </Typography>
              </Box>
              <Chip
                label={selected.isRead ? "Read" : "Unread"}
                size="small"
                sx={{
                  fontWeight: 700,
                  background: selected.isRead ? "#ECFDF5" : "linear-gradient(160deg, #005a8d, #0077b6)",
                  color: selected.isRead ? "#10B981" : "#fff",
                }}
              />
            </Stack>

            <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3, border: "1px solid rgba(15,27,45,0.06)", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "rgba(0,119,182,0.08)",
                    color: "primary.main",
                    borderRadius: "12px",
                  }}
                >
                  <SelectedIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>{selected.title}</Typography>
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

            <Paper sx={{ mt: 2, p: 2.5, borderRadius: 3, border: "1px solid rgba(15,27,45,0.06)", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
              <Typography fontWeight={700} sx={{ mb: 1.5 }}>
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
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    background: "linear-gradient(160deg, #005a8d, #0077b6)",
                    "&:hover": { background: "linear-gradient(160deg, #004a75, #005a8d)" },
                  }}
                >
                  Mark as read
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewRoundedIcon />}
                  onClick={() => navigate(selectedDestination?.path ?? "/admin/dashboard")}
                  sx={{ textTransform: "none", borderRadius: 999, borderColor: "rgba(0,119,182,0.25)", color: "#0077b6" }}
                >
                  {selectedDestination?.label ?? "Open related page"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedId(null)}
                  sx={{ textTransform: "none", borderRadius: 999, borderColor: "#E2E8F0", color: "#64748B" }}
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
