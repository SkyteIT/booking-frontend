import UserNotifications from "../../components/sections/userDashboard/UserNotifications";
import { useAuth } from "../../context/useAuth";
import CustomerPageLayout from "./CustomerPageLayout";

export default function CustomerNotificationsPage() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;

  return (
    <CustomerPageLayout title="Notifications" >
      <UserNotifications userId={userId} />
    </CustomerPageLayout>
  );
}
