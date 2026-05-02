// src/pages/vendor/settings/VendorSettings.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Paper, List, ListItemButton, ListItemIcon,
  ListItemText, Switch, Button, Divider, CircularProgress,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentIcon from "@mui/icons-material/Payment";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Chip } from "@mui/material";

import { useNotifications } from "../../../hooks/useNotifications";
import type { Notification, NotificationPreference } from "../../../services/notificationService";

// ─── Settings sidebar tabs ───────────────────────────────
const SETTINGS_TABS = [
  { key: "profile",       label: "Profile",         icon: <PersonOutlineIcon />       },
  { key: "payout",        label: "Payout Details",  icon: <CreditCardOutlinedIcon />  },
  { key: "team",          label: "Team & Roles",    icon: <GroupsOutlinedIcon />      },
  { key: "security",      label: "Security",        icon: <LockOutlinedIcon />        },
  { key: "localization",  label: "Localization",    icon: <LanguageIcon />            },
  { key: "notifications", label: "Notifications",   icon: <NotificationsNoneIcon />   },
];

// ─── Notification helpers ────────────────────────────────
type NotifStatus = "booking" | "payment" | "review" | "account" | "warning";
type FilterType  = "All" | "Unread" | "booking" | "payment" | "review" | "account";

const iconMap: Record<NotifStatus, React.ReactNode> = {
  booking: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: "#2e7d32" }} />,
  payment: <PaymentIcon            sx={{ fontSize: 20, color: "#0077B6" }} />,
  review:  <StarOutlineIcon        sx={{ fontSize: 20, color: "#f59e0b" }} />,
  account: <AccountCircleOutlinedIcon sx={{ fontSize: 20, color: "#6a1b9a" }} />,
  warning: <WarningAmberIcon       sx={{ fontSize: 20, color: "#e65100" }} />,
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

const NOTIF_FILTERS: { label: string; value: FilterType }[] = [
  { label: "All",      value: "All"     },
  { label: "Unread",   value: "Unread"  },
  { label: "Bookings", value: "booking" },
  { label: "Payments", value: "payment" },
  { label: "Reviews",  value: "review"  },
  { label: "Account",  value: "account" },
];

const PREF_GROUPS = [
  {
    label: "Bookings",
    items: [
      { key: "new_booking",   label: "New booking requests",  notificationType: 0 },
      { key: "booking_conf",  label: "Booking confirmations", notificationType: 0 },
      { key: "cancellations", label: "Cancellations",         notificationType: 0 },
    ],
  },
  {
    label: "Payments",
    items: [
      { key: "pay_received", label: "Payment received", notificationType: 1 },
      { key: "payout",       label: "Payout processed", notificationType: 1 },
      { key: "pay_failed",   label: "Payment failed",   notificationType: 1 },
    ],
  },
  {
    label: "Reviews",
    items: [
      { key: "new_review",  label: "New reviews",      notificationType: 2 },
      { key: "review_resp", label: "Review responses", notificationType: 2 },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "security",    label: "Security alerts", notificationType: 3 },
      { key: "acc_updates", label: "Account updates", notificationType: 3 },
    ],
  },
];

// ─── Placeholder ─────────────────────────────────────────
function PlaceholderPanel({ label }: { label: string }) {
  return (
    <Box py={8} textAlign="center">
      <Typography color="text.secondary" fontSize={14}>
        {label} settings coming soon.
      </Typography>
    </Box>
  );
}

// ─── Notifications Panel (inbox + preferences in tabs) ───
function NotificationsPanel() {
  const VENDOR_USER_ID = "YOUR-VENDOR-USER-GUID-HERE"; // Replace with real auth user id

  const {
    notifications, preferences, loading, unreadCount,
    markAsRead, markAllAsRead, savePreference,
  } = useNotifications(VENDOR_USER_ID);

  const [subTab,      setSubTab]      = useState<"inbox" | "preferences">("inbox");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [prefsSaved,  setPrefsSaved]  = useState(false);

  // Preference helpers
  const getPrefValue = (notificationType: number, channel: "emailEnabled" | "pushEnabled"): boolean => {
    const pref = preferences.find((p: NotificationPreference) => p.notificationType === String(notificationType));
    return pref?.[channel] ?? false;
  };

  const handlePrefToggle = async (notificationType: number, channel: "email" | "push" | "sms", value: boolean) => {
    setPrefsSaved(false);
    const existing = preferences.find((p: NotificationPreference) => p.notificationType === String(notificationType));
    await savePreference({
      notificationType,
      emailEnabled: channel === "email" ? value : (existing?.emailEnabled ?? false),
      pushEnabled:  channel === "push"  ? value : (existing?.pushEnabled  ?? false),
      smsEnabled:   channel === "sms"   ? value : (existing?.smsEnabled   ?? false),
    });
    setPrefsSaved(true);
  };

  const filtered: Notification[] = notifications.filter((n: Notification) => {
    if (activeFilter === "All")    return true;
    if (activeFilter === "Unread") return !n.isRead;
    return resolveStatus(n.type) === activeFilter;
  });

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>Notifications</Typography>
      <Typography color="text.secondary" fontSize={14} mb={2.5}>
        Manage your notification inbox and delivery preferences
      </Typography>

      {/* Sub-tabs */}
      <Box display="flex" gap={1} mb={3} borderBottom="2px solid #f0f4f8" pb={0}>
        {(["inbox", "preferences"] as const).map((t) => (
          <Box
            key={t}
            onClick={() => setSubTab(t)}
            sx={{
              px: 2, pb: 1.2, cursor: "pointer",
              fontWeight: subTab === t ? 700 : 400,
              fontSize: 14,
              color: subTab === t ? "#0077B6" : "#64748b",
              borderBottom: subTab === t ? "2px solid #0077B6" : "2px solid transparent",
              mb: "-2px",
              textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {t === "inbox" ? `Inbox${unreadCount > 0 ? ` (${unreadCount})` : ""}` : "Preferences"}
          </Box>
        ))}
      </Box>

      {/* ── INBOX ── */}
      {subTab === "inbox" && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
            <Box display="flex" gap={1} flexWrap="wrap">
              {NOTIF_FILTERS.map((f) => (
                <Chip
                  key={f.value}
                  label={f.label}
                  clickable
                  onClick={() => setActiveFilter(f.value)}
                  sx={{
                    fontWeight: 500, fontSize: 12,
                    bgcolor: activeFilter === f.value ? "#0077B6" : "#f0f4f8",
                    color:   activeFilter === f.value ? "#fff"    : "#4a5568",
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

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress sx={{ color: "#0077B6" }} />
            </Box>
          ) : (
            <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              {filtered.length === 0 ? (
                <Box py={8} textAlign="center">
                  <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#b0bec5", mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>No notifications here</Typography>
                </Box>
              ) : (
                filtered.map((n: Notification, idx: number) => {
                  const status = resolveStatus(n.type);
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
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "50%",
                        bgcolor: bgMap[status],
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {iconMap[status]}
                      </Box>
                      <Box flexGrow={1}>
                        <Typography fontSize={14} fontWeight={n.isRead ? 400 : 600} lineHeight={1.4}>
                          {n.title}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary" mt={0.2}>{n.message}</Typography>
                        <Typography fontSize={11} color="text.disabled"  mt={0.3}>{formatTime(n.createdAtUtc)}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                        {!n.isRead && (
                          <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#0077B6" }} />
                        )}
                        <DeleteOutlineIcon
                          fontSize="small"
                          onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                          sx={{ color: "#b0bec5", cursor: "pointer", "&:hover": { color: "#ef5350" } }}
                        />
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

      {/* ── PREFERENCES ── */}
      {subTab === "preferences" && (
        <>
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress sx={{ color: "#0077B6" }} />
            </Box>
          ) : (
            <>
              <Box display="grid" sx={{ gridTemplateColumns: "1fr 80px 80px" }} px={1} pb={1}>
                <Box />
                <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">Email</Typography>
                <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">Push</Typography>
              </Box>

              {PREF_GROUPS.map((group, gi) => (
                <Box key={group.label} mb={2}>
                  <Typography fontWeight={700} fontSize={15} mb={1}>{group.label}</Typography>
                  <Box sx={{ border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
                    {group.items.map((item, ii) => (
                      <Box key={item.key}>
                        <Box
                          display="grid"
                          sx={{ gridTemplateColumns: "1fr 80px 80px" }}
                          px={2} py={1.4} alignItems="center"
                        >
                          <Typography fontSize={14}>{item.label}</Typography>
                          <Box display="flex" justifyContent="center">
                            <Switch
                              size="small"
                              checked={getPrefValue(item.notificationType, "emailEnabled")}
                              onChange={(e) => handlePrefToggle(item.notificationType, "email", e.target.checked)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                              }}
                            />
                          </Box>
                          <Box display="flex" justifyContent="center">
                            <Switch
                              size="small"
                              checked={getPrefValue(item.notificationType, "pushEnabled")}
                              onChange={(e) => handlePrefToggle(item.notificationType, "push", e.target.checked)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                              }}
                            />
                          </Box>
                        </Box>
                        {ii < group.items.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </Box>
                  {gi < PREF_GROUPS.length - 1 && <Box mb={1} />}
                </Box>
              ))}

              <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mt={2}>
                {prefsSaved && (
                  <Typography fontSize={13} color="#2e7d32">✓ Preferences saved</Typography>
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
                  startIcon={<SaveOutlinedIcon />}
                  disabled={loading}
                  onClick={() => setPrefsSaved(true)}
                  sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" } }}
                >
                  Save Preferences
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

// ─── Main VendorSettings Page ─────────────────────────────
export default function VendorSettings() {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const activeTab = section ?? "notifications";

  const handleTabChange = (key: string) => {
    navigate(`/vendor/settings/${key}`, { replace: true });
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "notifications": return <NotificationsPanel />;
      case "profile":       return <PlaceholderPanel label="Profile" />;
      case "payout":        return <PlaceholderPanel label="Payout Details" />;
      case "team":          return <PlaceholderPanel label="Team & Roles" />;
      case "security":      return <PlaceholderPanel label="Security" />;
      case "localization":  return <PlaceholderPanel label="Localization" />;
      default:              return <PlaceholderPanel label={activeTab} />;
    }
  };

  return (
    <Box p={{ xs: 2, md: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Settings</Typography>
      <Typography color="text.secondary" fontSize={14} mb={3}>
        Manage your account and preferences
      </Typography>

      <Box display="grid" sx={{ gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: 3 }}>
        {/* ── Left nav ── */}
        <Paper sx={{ borderRadius: "16px", p: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", height: "fit-content" }}>
          <List disablePadding>
            {SETTINGS_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <ListItemButton
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  sx={{
                    borderRadius: "10px", mb: 0.5,
                    bgcolor: active ? "#EFF6FF" : "transparent",
                    "&:hover": { bgcolor: active ? "#EFF6FF" : "#F8FAFC" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: active ? "#0077B6" : "#94A3B8" }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={tab.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active ? "#0077B6" : "#374151",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Paper>

        {/* ── Right panel ── */}
        <Paper sx={{ borderRadius: "16px", p: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {renderPanel()}
        </Paper>
      </Box>
    </Box>
  );
}