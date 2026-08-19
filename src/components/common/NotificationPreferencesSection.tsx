import { Alert, Box, Button, CircularProgress, Divider, Stack, Switch, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
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
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={3}>
        {isPushSupported() ? (
          <Alert
            severity={pushEnabled ? "success" : "info"}
            action={
              <Button
                size="small"
                color="inherit"
                disabled={pushBusy}
                onClick={handleTogglePush}
                sx={{ textTransform: "none" }}
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
          <Alert severity="warning">This browser doesn't support push notifications.</Alert>
        )}
        {pushError && <Alert severity="error">{pushError}</Alert>}

        {groups.map((group) => (
          <Box key={group.label}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>{group.label}</Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={1.5}>
              {group.items.map((item) => (
                <Box
                  key={item.key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography>{item.label}</Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Stack alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "emailEnabled")}
                        onChange={(e) => handleToggle(item.notificationType, "email", e.target.checked)}
                      />
                    </Stack>
                    <Stack alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Push
                      </Typography>
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "pushEnabled")}
                        onChange={(e) => handleToggle(item.notificationType, "push", e.target.checked)}
                      />
                    </Stack>
                    <Stack alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        SMS
                      </Typography>
                      <Switch
                        size="small"
                        checked={getPrefValue(item.notificationType, "smsEnabled")}
                        onChange={(e) => handleToggle(item.notificationType, "sms", e.target.checked)}
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
