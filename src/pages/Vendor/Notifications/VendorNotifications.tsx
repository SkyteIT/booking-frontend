import { Stack } from "@mui/material";

import NotificationCenterPage from "../../../components/notifications/NotificationCenterPage";
import { useAuth } from "../../../context/useAuth";

export default function VendorNotifications() {
  const { user } = useAuth();

  return (
    <Stack spacing={3}>
      <NotificationCenterPage
        role="vendor"
        userId={user?.userId ?? user?.id ?? null}
        showTopCategories={false}
        showPreferences={false}
        showHeaderStats={false}
        showHeaderEmail={false}
      />
    </Stack>
  );
}
