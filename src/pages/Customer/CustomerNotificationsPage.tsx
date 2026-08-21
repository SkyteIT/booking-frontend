import { Box } from "@mui/material";
import NotificationCenterPage from "../../components/notifications/NotificationCenterPage";
import { useAuth } from "../../context/useAuth";
import CustomerPageLayout from "./CustomerPageLayout";

export default function CustomerNotificationsPage() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;

  return (
    <CustomerPageLayout title="Customer Notifications" showHeading={false}>
      <Box sx={{ mt: 1 }}>
        <NotificationCenterPage
          role="customer"
          userId={userId}
          showHeaderTitle={true}
          showTopCategories={false}
          showPreferences={false}
          showHeaderStats={false}
          showHeaderEmail={false}
        />
      </Box>
    </CustomerPageLayout>
  );
}
