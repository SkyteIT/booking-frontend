import NotificationCenterPage from "../../../components/notifications/NotificationCenterPage";
import { useAuth } from "../../../context/useAuth";
import CustomerPageLayout from "../CustomerPageLayout";

export default function CustomerNotifications() {
  const { user } = useAuth();
  const userId = user?.userId ?? user?.id ?? null;

  return (
    <CustomerPageLayout
      title="Notifications"
      subtitle="A focused inbox for booking, payment, review, and account updates."
    >
      <NotificationCenterPage
        role="customer"
        userId={userId}
        showTopCategories={false}
        showPreferences={false}
        compactHero
        showHeaderStats={false}
        showHeaderEmail={false}
        modernFilterBar
      />
    </CustomerPageLayout>
  );
}
