import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { Notification, NotificationPreference } from "../../services/notificationService";
import { useAuth } from "../../context/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import type { NotificationPreferenceGroup, NotificationRole } from "./notificationCatalog";
import {
  getNotificationRoleConfig,
  resolveNotificationDestination,
  resolveNotificationEventMeta,
  resolveNotificationMatch,
} from "./notificationCatalog";
import { belongsToPortal } from "../../utils/notificationPortals";
import SegmentedTabs from "../common/SegmentedTabs";
import LoadingSpinner from "../common/LoadingSpinner";

type NotificationFilter = "all" | "unread" | string;

type NotificationCenterPageProps = {
  role: NotificationRole;
  userId?: string | null;
  showTopCategories?: boolean;
  showPreferences?: boolean;
  allowReadActions?: boolean;
  showHeaderStats?: boolean;
  showHeaderEmail?: boolean;
};

const PAGE_SIZE = 8;

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

function pickReadableFallback(message: string) {
  return message.trim() || "No description was supplied for this notification.";
}

function getDateSectionLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Earlier";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const itemStart = new Date(date);
  itemStart.setHours(0, 0, 0, 0);

  if (itemStart.getTime() === startOfToday.getTime()) return "Today";
  if (itemStart.getTime() === startOfYesterday.getTime()) return "Yesterday";
  return "Earlier";
}

function preferenceValue(
  preferences: NotificationPreference[],
  notificationType: number,
  channel: "emailEnabled" | "pushEnabled" | "smsEnabled"
) {
  const pref = preferences.find((item) => item.notificationType === String(notificationType));
  return pref?.[channel] ?? false;
}

export default function NotificationCenterPage({
  role,
  userId: providedUserId = null,
  showTopCategories = true,
  showPreferences = true,
  allowReadActions = true,
  showHeaderStats = true,
  showHeaderEmail = true,
}: NotificationCenterPageProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = providedUserId ?? user?.userId ?? user?.id ?? null;
  const email = user?.email ?? "";

  const {
    notifications,
    preferences,
    loading,
    markAsRead,
    markAllAsRead,
    savePreference,
    reload,
  } = useNotifications(userId, { refreshIntervalMs: 30000 });

  const config = getNotificationRoleConfig(role);

  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState<string[]>([]);
  const [preferenceToast, setPreferenceToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const notificationsWithMeta = useMemo(() => {
    // This account's feed may also contain events from the other portal
    // (e.g. a vendor account that also books things as a customer) - only
    // "vendor"/"customer" have a portal to scope to; admin sees everything.
    const scoped =
      role === "vendor" || role === "customer"
        ? notifications.filter((item: Notification) => belongsToPortal(item.type, role))
        : notifications;

    return scoped.map((item: Notification) => {
      const match = resolveNotificationMatch(role, item.type, item.title, item.message);
      return { ...item, match };
    });
  }, [notifications, role]);

  const inboxNotifications = useMemo(() => {
    return notificationsWithMeta.filter((item) => !hiddenNotificationIds.includes(item.id));
  }, [hiddenNotificationIds, notificationsWithMeta]);

  const summary = useMemo(() => {
    const unread = inboxNotifications.filter((item) => !item.isRead).length;
    const critical = inboxNotifications.filter((item) => item.match.severity === "error" || item.match.severity === "warning").length;
    const total = inboxNotifications.length;
    const activeGroups = config.groups.filter((group) =>
      inboxNotifications.some((notification) => group.key === notification.match.groupKey)
    ).length;
    return { unread, critical, total, activeGroups };
  }, [config.groups, inboxNotifications]);

  const filteredNotifications = useMemo(() => {
    return inboxNotifications.filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "unread") return !item.isRead;
      return item.match.groupKey === activeFilter;
    });
  }, [activeFilter, inboxNotifications]);

  const searchedNotifications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return filteredNotifications;

    return filteredNotifications.filter((item) => {
      const group = config.groups.find((entry) => entry.key === item.match.groupKey);
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
      return haystack.includes(normalizedQuery);
    });
  }, [config.groups, filteredNotifications, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(searchedNotifications.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginatedNotifications = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return searchedNotifications.slice(start, start + PAGE_SIZE);
  }, [safePage, searchedNotifications]);

  const sectionedNotifications = useMemo(() => {
    const sections: Array<{
      label: "Today" | "Yesterday" | "Earlier";
      items: typeof paginatedNotifications;
    }> = [];

    for (const item of paginatedNotifications) {
      const label = getDateSectionLabel(item.createdAtUtc);
      const last = sections[sections.length - 1];
      if (!last || last.label !== label) sections.push({ label, items: [item] });
      else last.items.push(item);
    }

    return sections;
  }, [paginatedNotifications]);

  const selectedNotification = useMemo(() => {
    return inboxNotifications.find((item) => item.id === selectedNotificationId) ?? null;
  }, [inboxNotifications, selectedNotificationId]);

  const selectedDestination = useMemo(() => {
    if (!selectedNotification) return null;
    return resolveNotificationDestination(role, selectedNotification.type, selectedNotification.title, selectedNotification.message);
  }, [role, selectedNotification]);

  const visibleGroups = useMemo(() => {
    return config.groups.map((group) => ({
      ...group,
      count: inboxNotifications.filter((item) => item.match.groupKey === group.key).length,
    }));
  }, [config.groups, inboxNotifications]);

  const topCategories = useMemo(() => {
    return [...visibleGroups].sort((a, b) => b.count - a.count);
  }, [visibleGroups]);

  const maxCategoryCount = Math.max(1, ...topCategories.map((group) => group.count));

  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (!selectedNotificationId) return;
    if (inboxNotifications.some((item) => item.id === selectedNotificationId)) return;
    setSelectedNotificationId(null);
  }, [inboxNotifications, selectedNotificationId]);

  const openNotification = async (id: string) => {
    setSelectedNotificationId(id);
    const item = inboxNotifications.find((entry) => entry.id === id);
    if (allowReadActions && item && !item.isRead) {
      await markAsRead(id);
    }
  };

  const hideNotification = (id: string) => {
    setHiddenNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSelectedNotificationId((current) => (current === id ? null : current));
  };

  const handlePreferenceToggle = async (
    preference: NotificationPreferenceGroup,
    channel: "email" | "push" | "sms",
    checked: boolean
  ) => {
    if (!userId) return;
    const nextChannels = {
      emailEnabled: channel === "email" ? checked : preferenceValue(preferences, preference.notificationType, "emailEnabled"),
      pushEnabled: channel === "push" ? checked : preferenceValue(preferences, preference.notificationType, "pushEnabled"),
      smsEnabled: channel === "sms" ? checked : preferenceValue(preferences, preference.notificationType, "smsEnabled"),
    };

    await savePreference({
      notificationType: preference.notificationType,
      ...nextChannels,
    });

    setPreferenceToast({
      open: true,
      message: `${preference.title} updated: ${[
        nextChannels.emailEnabled ? "Email" : null,
        nextChannels.pushEnabled ? "Push" : null,
        nextChannels.smsEnabled ? "SMS" : null,
      ]
        .filter(Boolean)
        .join(", ") || "No channels"} enabled`,
    });
  };

  const showEmptyState = !userId;
  const subtitle = showEmptyState ? "Sign in to load your live notification feed." : config.subtitle;
  const filterButtons = [
    { key: "all", label: "All", count: summary.total },
    { key: "unread", label: "Unread", count: summary.unread },
    ...visibleGroups.map((group) => ({
      key: group.key,
      label: group.title,
      count: group.count,
    })),
  ];

  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "baseline",
              gap: "2px",
            }}
          >
            {config.title}
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "3px",
                backgroundColor: "primary.main",
                display: "inline-block",
                ml: 0.5,
              }}
            />
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {subtitle}
          </Typography>
          {showHeaderStats && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
              <Chip label={`${summary.unread} unread`} size="small" sx={{ bgcolor: "rgba(0,119,182,0.08)", color: "primary.main", fontWeight: 600 }} />
              <Chip label={`${summary.total} total`} size="small" sx={{ bgcolor: "rgba(0,119,182,0.08)", color: "primary.main", fontWeight: 600 }} />
              <Chip label={`${summary.critical} priority`} size="small" sx={{ bgcolor: "rgba(0,119,182,0.08)", color: "primary.main", fontWeight: 600 }} />
              <Chip label={`${summary.activeGroups} groups active`} size="small" sx={{ bgcolor: "rgba(0,119,182,0.08)", color: "primary.main", fontWeight: 600 }} />
            </Stack>
          )}
          {showHeaderEmail && email && (
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
              {email}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5} flexShrink={0}>
          <Button
            variant="outlined"
            startIcon={<DoneAllOutlinedIcon />}
            onClick={() => {
              if (!userId) return;
              // The backend's bulk mark-all-read has no portal filter and
              // would also mark this account's other-portal notifications
              // read - go through the scoped (inbox) list one at a time
              // instead of calling the unscoped bulk endpoint.
              if (role === "vendor" || role === "customer") {
                inboxNotifications.filter((item) => !item.isRead).forEach((item) => void markAsRead(item.id));
              } else {
                markAllAsRead();
              }
            }}
            disabled={!userId || loading || summary.unread === 0}
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
      </Stack>

      {showEmptyState ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Notifications load from the signed-in account. Once the backend returns the user ID, this page will show the live inbox, read state, and delivery preferences.
        </Alert>
      ) : null}

      <Stack spacing={2}>
        {showTopCategories && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              bgcolor: "#fff",
              p: 2.25,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", display: "flex", alignItems: "baseline", gap: "2px" }}>
                  Top categories
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: "2px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Your busiest backend event streams over the current inbox window.
                </Typography>
              </Box>
              <Chip size="small" label={`${topCategories.length} groups`} sx={{ fontWeight: 700 }} />
            </Stack>

            <Box
              sx={{
                mt: 1.5,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(5, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {topCategories.map((group) => {
                const Icon = group.icon;
                const width = `${Math.max(16, Math.round((group.count / maxCategoryCount) * 100))}%`;

                return (
                  <Paper
                    key={group.key}
                    variant="outlined"
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      p: 1.25,
                      borderRadius: 3,
                      borderColor: "rgba(0,119,182,0.12)",
                      bgcolor: "#fff",
                      boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
                      minHeight: 144,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -24,
                        right: -18,
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(0,119,182,0.14) 0%, rgba(0,119,182,0) 70%)",
                        pointerEvents: "none",
                      }}
                    />

                    <Stack spacing={1.1} sx={{ position: "relative", zIndex: 1, minHeight: 118 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "rgba(0,119,182,0.1)",
                            color: "primary.main",
                          }}
                        >
                          <Icon fontSize="small" />
                        </Avatar>
                        <Chip
                          size="small"
                          label={group.severity}
                          sx={{
                            height: 20,
                            fontWeight: 700,
                            bgcolor: "rgba(0,119,182,0.08)",
                            color: "primary.main",
                            textTransform: "capitalize",
                          }}
                        />
                      </Stack>

                      <Box>
                        <Typography fontWeight={800} sx={{ lineHeight: 1.15 }} noWrap>
                          {group.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.3 }} noWrap>
                          {group.labels.length} event types
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={0.5} alignItems="baseline" flexWrap="wrap">
                        <Typography variant="h4" fontWeight={900} lineHeight={1}>
                          {group.count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          notifications
                        </Typography>
                      </Stack>

                      <Box sx={{ mt: "auto" }}>
                        <Box
                          sx={{
                            height: 5,
                            borderRadius: 999,
                            bgcolor: "rgba(15,23,42,0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width,
                              height: "100%",
                              borderRadius: 999,
                              background: "linear-gradient(90deg, #005a8d, #0077b6)",
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }} noWrap>
                          {group.labels[0]}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          </Paper>
        )}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid rgba(15, 23, 42, 0.08)",
            background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", display: "flex", alignItems: "baseline", gap: "2px" }}>
                  Notification feed
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: "2px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Filter the inbox by category and keep unread items visible.
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <SegmentedTabs
                options={filterButtons.map((filter) => filter.key)}
                value={activeFilter}
                onChange={(next) => setActiveFilter(next)}
                labels={Object.fromEntries(
                  filterButtons.map((filter) => [filter.key, `${filter.label} ${filter.count}`])
                )}
              />
            </Box>

            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, message, event type, or category"
              size="small"
              sx={{ mt: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider />

          {loading ? (
            <LoadingSpinner fullScreen={false} py={4} />
          ) : searchedNotifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 46, color: "text.disabled", mb: 1 }} />
              <Typography fontWeight={700}>
                {searchQuery.trim()
                  ? "No notifications match your search"
                  : activeFilter === "unread"
                    ? "No unread notifications"
                    : "No notifications in this filter"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {searchQuery.trim()
                  ? "Try a different keyword or clear the search field."
                  : activeFilter === "unread"
                    ? "You are caught up."
                    : "Try another category or refresh the inbox after the backend sends new events."}
              </Typography>
            </Box>
          ) : (
            <Stack sx={{ maxHeight: { lg: 760 }, overflow: "auto" }}>
              {sectionedNotifications.map((section) => (
                <Box key={section.label}>
                  <Box sx={{ px: 3, pt: 2.5, pb: 1.25 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {section.label}
                    </Typography>
                  </Box>
                  <Stack divider={<Divider flexItem />}>
                    {section.items.map((item) => {
                      const group = config.groups.find((entry) => entry.key === item.match.groupKey) ?? config.groups[0];
                      const eventMeta = resolveNotificationEventMeta(role, item.type, item.title, item.message);
                      const Icon = eventMeta.icon;
                      const tone =
                        item.match.severity === "error"
                          ? "#dc2626"
                          : item.match.severity === "warning"
                            ? "#d97706"
                            : item.match.severity === "success"
                              ? "#0f766e"
                              : "#2563eb";

                      return (
                        <Box
                          key={item.id}
                          onClick={() => void openNotification(item.id)}
                          sx={{
                            position: "relative",
                            display: "grid",
                            gridTemplateColumns: "6px auto minmax(0, 1fr) auto",
                            gap: 2,
                            px: 3,
                            py: 2.25,
                            cursor: "pointer",
                            transition: "background-color 0.18s ease",
                            backgroundColor: item.isRead ? "#fff" : "#f8fbff",
                            "&:hover": {
                              backgroundColor: item.isRead ? "#f9fafb" : "#f3f8ff",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              borderRadius: 999,
                              background: item.isRead ? "rgba(15,27,45,0.08)" : "linear-gradient(180deg, #005a8d, #0077b6)",
                            }}
                          />

                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "14px",
                              bgcolor: "rgba(0,119,182,0.08)",
                              color: "primary.main",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Icon fontSize="small" />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Box sx={{ minWidth: 0 }}>
                                <Typography fontWeight={800} sx={{ lineHeight: 1.25 }} noWrap={false}>
                                  {item.title}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 0.75, flexWrap: "wrap" }}>
                                  <Chip
                                    size="small"
                                    label={group.title}
                                    sx={{
                                      height: 22,
                                      fontWeight: 600,
                                      fontSize: "0.72rem",
                                      bgcolor: "rgba(0,119,182,0.08)",
                                      color: "primary.main",
                                    }}
                                  />
                                  {item.match.severity !== "info" && (
                                    <Chip
                                      size="small"
                                      label={item.match.severity}
                                      sx={{
                                        height: 22,
                                        fontWeight: 600,
                                        fontSize: "0.72rem",
                                        bgcolor: `${tone}14`,
                                        color: tone,
                                        textTransform: "capitalize",
                                      }}
                                    />
                                  )}
                                </Stack>
                              </Box>
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                              {pickReadableFallback(item.message)}
                            </Typography>

                            <Stack direction="row" spacing={1.25} sx={{ mt: 1 }} alignItems="center" flexWrap="wrap">
                              <Typography variant="caption" color="text.disabled">
                                {formatTime(item.createdAtUtc)}
                              </Typography>
                              {item.readAtUtc && (
                                <Typography variant="caption" color="success.main">
                                  Read
                                </Typography>
                              )}
                            </Stack>
                          </Box>

                          <Stack direction="row" alignItems="flex-start" spacing={0.5} sx={{ pl: 1 }}>
                            <Tooltip title={item.isRead ? "Already read" : "Mark as read"}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!item.isRead) void markAsRead(item.id);
                                  }}
                                  disabled={item.isRead || !allowReadActions}
                                  sx={{
                                    color: item.isRead ? "text.disabled" : "primary.main",
                                    bgcolor: item.isRead ? "transparent" : "rgba(25, 118, 210, 0.08)",
                                  }}
                                >
                                  <MarkEmailReadOutlinedIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Open details">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void openNotification(item.id);
                                }}
                                sx={{ color: "text.secondary" }}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Archive from inbox">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  hideNotification(item.id);
                                }}
                                sx={{ color: "text.secondary" }}
                              >
                                <ArchiveOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <ArrowForwardIosRoundedIcon sx={{ fontSize: 12, color: "text.disabled", mt: 1 }} />
                            {!item.isRead ? (
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  bgcolor: "primary.main",
                                  mt: 0.25,
                                }}
                              />
                            ) : (
                              <CircleIcon sx={{ fontSize: 8, color: "transparent", mt: 0.25 }} />
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}

          {searchedNotifications.length > PAGE_SIZE && (
            <Box
              sx={{
                px: 3,
                py: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, searchedNotifications.length)} of {searchedNotifications.length}
              </Typography>
              <Pagination count={totalPages} page={safePage} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </Box>
          )}
        </Paper>

        {showPreferences && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              bgcolor: "#fff",
              p: 3,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", display: "flex", alignItems: "baseline", gap: "2px" }}>
                  Delivery preferences
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: "2px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Fine-tune which channels notify you for each backend event family.
                </Typography>
              </Box>
              <Chip size="small" label="Backend synced" sx={{ fontWeight: 700 }} />
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: { xs: "none", md: "grid" },
                  gridTemplateColumns: "minmax(0, 1.3fr) repeat(3, minmax(96px, 1fr))",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                  border: "1px solid rgba(15, 23, 42, 0.06)",
                  mb: 1.25,
                }}
              >
                <Typography variant="caption" fontWeight={800} color="text.secondary">
                  Category
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75 }}>
                  <EmailOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" fontWeight={800} color="text.secondary">
                    Email
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75 }}>
                  <NotificationsNoneOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" fontWeight={800} color="text.secondary">
                    Push
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75 }}>
                  <SmsOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="caption" fontWeight={800} color="text.secondary">
                    SMS
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.25}>
                {config.preferenceGroups.map((group) => {
                  const channels: Array<{
                    key: "email" | "push" | "sms";
                    field: "emailEnabled" | "pushEnabled" | "smsEnabled";
                    label: string;
                    icon: typeof EmailOutlinedIcon;
                  }> = [
                    { key: "email", field: "emailEnabled", label: "Email", icon: EmailOutlinedIcon },
                    { key: "push", field: "pushEnabled", label: "Push", icon: NotificationsNoneOutlinedIcon },
                    { key: "sms", field: "smsEnabled", label: "SMS", icon: SmsOutlinedIcon },
                  ];

                  return (
                    <Box
                      key={group.key}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.3fr) repeat(3, minmax(96px, 1fr))" },
                        gap: { xs: 1.25, md: 1 },
                        alignItems: "stretch",
                        p: 1.5,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "rgba(15, 23, 42, 0.08)",
                        bgcolor: "#fff",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography fontWeight={800}>{group.title}</Typography>
                          <Chip
                            size="small"
                            label={`Type ${group.notificationType}`}
                            sx={{
                              height: 22,
                              fontWeight: 700,
                              bgcolor: "#f8fafc",
                              border: "1px solid rgba(15, 23, 42, 0.08)",
                            }}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                          {group.description}
                        </Typography>
                      </Box>

                      {channels.map((channel) => {
                        const checked = preferenceValue(preferences, group.notificationType, channel.field);
                        const Icon = channel.icon;

                        return (
                          <Paper
                            key={channel.key}
                            variant="outlined"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1.25,
                              px: 1.5,
                              py: 1.15,
                              borderRadius: 2.5,
                              borderColor: checked ? "rgba(37,99,235,0.22)" : "rgba(15, 23, 42, 0.08)",
                              bgcolor: checked ? "rgba(37,99,235,0.045)" : "#fafbfc",
                              transition: "all 0.18s ease",
                              "&:hover": {
                                borderColor: checked ? "rgba(37,99,235,0.3)" : "rgba(15, 23, 42, 0.16)",
                                bgcolor: checked ? "rgba(37,99,235,0.06)" : "#f8fafc",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  bgcolor: checked ? "primary.main" : "rgba(15, 23, 42, 0.08)",
                                  color: checked ? "#fff" : "text.secondary",
                                }}
                              >
                                <Icon sx={{ fontSize: 16 }} />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={700} lineHeight={1.1}>
                                  {channel.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {checked ? "Enabled" : "Muted"}
                                </Typography>
                              </Box>
                            </Box>

                            <Switch
                              size="small"
                              checked={checked}
                              disabled={!userId}
                              onChange={(_, toggled) => handlePreferenceToggle(group, channel.key, toggled)}
                            />
                          </Paper>
                        );
                      })}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Paper>
        )}
      </Stack>

      <Drawer
        anchor="right"
        open={Boolean(selectedNotification)}
        onClose={() => setSelectedNotificationId(null)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            bgcolor: "#f8fafc",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          },
        }}
      >
        {selectedNotification ? (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", display: "flex", alignItems: "baseline", gap: "2px" }}>
                  Notification details
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: "2px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Full event context and delivery state.
                </Typography>
              </Box>
              <Chip
                label={selectedNotification.isRead ? "Read" : "Unread"}
                color={selectedNotification.isRead ? "success" : "primary"}
                variant="outlined"
              />
            </Stack>

            <Paper sx={{ mt: 3, p: 2.5, borderRadius: 3 }}>
              <Typography variant="overline" color="text.secondary">
                {resolveNotificationEventMeta(role, selectedNotification.type, selectedNotification.title, selectedNotification.message).label}
              </Typography>
              <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>
                {selectedNotification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedNotification.message}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Event type
                  </Typography>
                  <Typography fontWeight={600}>{selectedNotification.type}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Typography fontWeight={600}>{formatTime(selectedNotification.createdAtUtc)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Read at
                  </Typography>
                  <Typography fontWeight={600}>
                    {selectedNotification.readAtUtc ? formatTime(selectedNotification.readAtUtc) : "Not read yet"}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ mt: 2, p: 2.5, borderRadius: 3 }}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Actions
              </Typography>
              <Stack spacing={1.2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (!selectedNotification.isRead) void markAsRead(selectedNotification.id);
                  }}
                  disabled={selectedNotification.isRead || !allowReadActions}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  Mark as read
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => hideNotification(selectedNotification.id)}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  Archive from inbox
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewRoundedIcon />}
                  onClick={() => navigate(selectedDestination?.path ?? "/")}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  {selectedDestination?.label ?? "Open related page"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedNotificationId(null)}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  Close
                </Button>
              </Stack>
            </Paper>
          </Box>
        ) : null}
      </Drawer>

      <Snackbar
        open={preferenceToast.open}
        autoHideDuration={3200}
        onClose={() => setPreferenceToast({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setPreferenceToast({ open: false, message: "" })}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {preferenceToast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
