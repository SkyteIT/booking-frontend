import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { Alert, Box, Button, Divider, Paper, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import { useNotifications } from "../../hooks/useNotifications";
import type { NotificationPreference } from "../../services/notificationService";
import {
  disablePushNotifications,
  enablePushNotifications,
  isPushEnabled,
  isPushSupported,
} from "../../utils/pushNotifications";

export interface PreferenceGroup {
  label: string;
  items: { key: string; label: string; notificationType: number }[];
}

interface NotificationPreferencesSectionProps {
  groups: PreferenceGroup[];
}

// Same grouped icon-card treatment as the Notifications page's inbox list,
// keyed by the group label - Bookings/Payments/Reviews/Account across both
// Vendor and Customer settings. Anything else falls back to a plain bell.
const GROUP_STYLE: Record<string, { icon: typeof CalendarMonthOutlinedIcon; bg: string }> = {
  bookings: { icon: CalendarMonthOutlinedIcon, bg: "#e6f4ea" },
  payments: { icon: PaymentOutlinedIcon, bg: "#e3f0fb" },
  reviews: { icon: StarOutlineOutlinedIcon, bg: "#fff8e1" },
  account: { icon: AccountCircleOutlinedIcon, bg: "#f3e5f5" },
};

const styleFor = (label: string) => GROUP_STYLE[label.trim().toLowerCase()] ?? {
  icon: NotificationsNoneOutlinedIcon,
  bg: "rgba(0,119,182,0.08)",
};

export default function NotificationPreferencesSection({ groups }: NotificationPreferencesSectionProps) {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;
  const { preferences, loading, savePreference } = useNotifications(userId);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushError, setPushError] = useState("");

  useEffect(() => {
    isPushEnabled().then(setPushEnabled);
  }, []);

  const handleTogglePush = async () => {
    setPushBusy(true);
    setPushError("");
    try {
      if (pushEnabled) {
        await disablePushNotifications();
        setPushEnabled(false);
      } else {
        const ok = await enablePushNotifications();
        if (!ok) {
          setPushError(
            Notification.permission === "denied"
              ? "Browser notifications are blocked for this site. Allow them in your browser settings, then try again."
              : "Couldn't enable push notifications on this device."
          );
        }
        setPushEnabled(ok);
      }
    } catch {
      setPushError("Something went wrong enabling push notifications.");
    } finally {
      setPushBusy(false);
    }
  };

  const getPrefValue = (
    notificationType: number,
    channel: "emailEnabled" | "pushEnabled" | "smsEnabled"
  ): boolean => {
    const pref = preferences.find((p: NotificationPreference) => p.notificationType === String(notificationType));
    return pref?.[channel] ?? false;
  };

  const handleToggle = (notificationType: number, channel: "email" | "push" | "sms", value: boolean) => {
    const existing = preferences.find((p: NotificationPreference) => p.notificationType === String(notificationType));
    savePreference({
      notificationType,
      emailEnabled: channel === "email" ? value : (existing?.emailEnabled ?? false),
      pushEnabled: channel === "push" ? value : (existing?.pushEnabled ?? false),
      smsEnabled: channel === "sms" ? value : (existing?.smsEnabled ?? false),
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen={false} size={28} />;
  }

  return (
    <Stack spacing={2.5}>
      {isPushSupported() ? (
        <Alert
          severity={pushEnabled ? "success" : "info"}
          sx={{ borderRadius: "14px" }}
          action={
            <Button
              size="small"
              color="inherit"
              disabled={pushBusy}
              onClick={handleTogglePush}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {pushBusy ? "Working..." : pushEnabled ? "Disable" : "Enable"}
            </Button>
          }
        >
          {pushEnabled
            ? "Browser push notifications are enabled on this device."
            : "Turn on browser push notifications to get alerts on this device, on top of Email/SMS."}
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ borderRadius: "14px" }}>
          This browser doesn't support push notifications.
        </Alert>
      )}
      {pushError && (
        <Alert severity="error" sx={{ borderRadius: "14px" }}>
          {pushError}
        </Alert>
      )}

      {groups.map((group) => {
        const { icon: Icon, bg } = styleFor(group.label);
        return (
          <Paper
            key={group.label}
            sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 12px 32px rgba(15,27,45,0.06)" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 2.5, py: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "10px",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: bg,
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{group.label}</Typography>
            </Box>

            <Divider />

            {group.items.map((item, ii) => (
              <Box key={item.key}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.75,
                    transition: "background 0.15s ease",
                    "&:hover": { bgcolor: "rgba(0,119,182,0.04)" },
                  }}
                >
                  <Typography fontSize={14} sx={{ fontWeight: 500 }}>
                    {item.label}
                  </Typography>

                  <Stack direction="row" spacing={3}>
                    <Stack alignItems="center" spacing={0.25}>
                      <Typography fontSize={11} color="text.secondary" sx={{ fontWeight: 600 }}>
                        Email
                      </Typography>
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "emailEnabled")}
                        onChange={(e) => handleToggle(item.notificationType, "email", e.target.checked)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "primary.main" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "primary.main" },
                        }}
                      />
                    </Stack>
                    <Stack alignItems="center" spacing={0.25}>
                      <Typography fontSize={11} color="text.secondary" sx={{ fontWeight: 600 }}>
                        Push
                      </Typography>
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "pushEnabled")}
                        onChange={(e) => handleToggle(item.notificationType, "push", e.target.checked)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "primary.main" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "primary.main" },
                        }}
                      />
                    </Stack>
                    <Stack alignItems="center" spacing={0.25}>
                      <Typography fontSize={11} color="text.secondary" sx={{ fontWeight: 600 }}>
                        SMS
                      </Typography>
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "smsEnabled")}
                        onChange={(e) => handleToggle(item.notificationType, "sms", e.target.checked)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "primary.main" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "primary.main" },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
                {ii < group.items.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        );
      })}
    </Stack>
  );
}
