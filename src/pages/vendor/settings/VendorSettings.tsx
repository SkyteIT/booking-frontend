// src/pages/vendor/settings/VendorSettings.tsx
import { useState } from "react";
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

import { useNotifications } from "../../../hooks/useNotifications";
import type { NotificationPreference } from "../../../services/notificationService";

// ─── Sidebar nav items ────────────────────────────────────
const SETTINGS_TABS = [
  { key: "profile",       label: "Profile",         icon: <PersonOutlineIcon /> },
  { key: "payout",        label: "Payout Details",  icon: <CreditCardOutlinedIcon /> },
  { key: "team",          label: "Team & Roles",    icon: <GroupsOutlinedIcon /> },
  { key: "security",      label: "Security",        icon: <LockOutlinedIcon /> },
  { key: "localization",  label: "Localization",    icon: <LanguageIcon /> },
  { key: "notifications", label: "Notifications",   icon: <NotificationsNoneIcon /> },
];

// ─── Notification preference groups ──────────────────────
// notificationType matches API enum: 0=Booking,1=Payment,2=Review,3=Account
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

// ─── Placeholder panels ───────────────────────────────────
function PlaceholderPanel({ label }: { label: string }) {
  return (
    <Box py={6} textAlign="center">
      <Typography color="text.secondary" fontSize={14}>
        {label} settings coming soon.
      </Typography>
    </Box>
  );
}

// ─── Notifications panel ──────────────────────────────────
function NotificationsPanel() {
  const VENDOR_USER_ID = "YOUR-VENDOR-USER-GUID-HERE"; // Replace with real auth user id

  const { preferences, loading, savePreference } = useNotifications(VENDOR_USER_ID);

  const [prefsSaved, setPrefsSaved] = useState(false);

  const getPrefValue = (
    notificationType: number,
    channel: "emailEnabled" | "pushEnabled"
  ): boolean => {
    const pref: NotificationPreference | undefined = preferences.find(
      (p: NotificationPreference) => p.notificationType === String(notificationType)
    );
    return pref?.[channel] ?? false;
  };

  const handleToggle = async (
    notificationType: number,
    channel: "email" | "push" | "sms",
    value: boolean
  ) => {
    setPrefsSaved(false);
    const existing = preferences.find(
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

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>
        Notification Preferences
      </Typography>
      <Typography color="text.secondary" fontSize={14} mb={3}>
        Choose how you want to be notified
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress sx={{ color: "#0077B6" }} />
        </Box>
      ) : (
        <>
          {/* Column headers */}
          <Box
            display="grid"
            sx={{ gridTemplateColumns: "1fr 80px 80px" }}
            px={1} pb={1}
          >
            <Box />
            <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">
              Email
            </Typography>
            <Typography fontSize={13} fontWeight={600} color="text.secondary" textAlign="center">
              Push
            </Typography>
          </Box>

          {PREF_GROUPS.map((group, gi) => (
            <Box key={group.label} mb={1}>
              {/* Group heading */}
              <Typography fontWeight={700} fontSize={15} mb={1}>
                {group.label}
              </Typography>

              {/* Rows */}
              <Box
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  overflow: "hidden",
                  mb: gi < PREF_GROUPS.length - 1 ? 2 : 0,
                }}
              >
                {group.items.map((item, ii) => (
                  <Box key={item.key}>
                    <Box
                      display="grid"
                      sx={{ gridTemplateColumns: "1fr 80px 80px" }}
                      px={2} py={1.4}
                      alignItems="center"
                    >
                      <Typography fontSize={14} color="text.primary">
                        {item.label}
                      </Typography>

                      {/* Email */}
                      <Box display="flex" justifyContent="center">
                        <Switch
                          size="small"
                          checked={getPrefValue(item.notificationType, "emailEnabled")}
                          onChange={(e) =>
                            handleToggle(item.notificationType, "email", e.target.checked)
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                          }}
                        />
                      </Box>

                      {/* Push */}
                      <Box display="flex" justifyContent="center">
                        <Switch
                          size="small"
                          checked={getPrefValue(item.notificationType, "pushEnabled")}
                          onChange={(e) =>
                            handleToggle(item.notificationType, "push", e.target.checked)
                          }
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
            </Box>
          ))}

          {/* Footer */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2} mt={4}>
            {prefsSaved && (
              <Typography fontSize={13} color="#2e7d32">
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
              startIcon={<SaveOutlinedIcon />}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                bgcolor: "#0077B6",
                "&:hover": { bgcolor: "#005A8D" },
              }}
              onClick={() => setPrefsSaved(true)}
            >
              Save Preferences
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

// ─── Main Settings Page ───────────────────────────────────
export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState("notifications");

  const renderPanel = () => {
    switch (activeTab) {
      case "notifications": return <NotificationsPanel />;
      case "profile":       return <PlaceholderPanel label="Profile" />;
      case "payout":        return <PlaceholderPanel label="Payout Details" />;
      case "team":          return <PlaceholderPanel label="Team & Roles" />;
      case "security":      return <PlaceholderPanel label="Security" />;
      case "localization":  return <PlaceholderPanel label="Localization" />;
      default:              return null;
    }
  };

  return (
    <Box p={{ xs: 2, md: 3 }}>
      {/* Page header */}
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
                  onClick={() => setActiveTab(tab.key)}
                  sx={{
                    borderRadius: "10px",
                    mb: 0.5,
                    bgcolor: active ? "#EFF6FF" : "transparent",
                    "&:hover": { bgcolor: active ? "#EFF6FF" : "#F8FAFC" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 34,
                      color: active ? "#0077B6" : "#94A3B8",
                    }}
                  >
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