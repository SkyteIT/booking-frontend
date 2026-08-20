import NotificationPreferencesSection, {
  type PreferenceGroup,
} from "../../common/NotificationPreferencesSection";

// notificationType values must match the backend's NotificationType enum
// exactly (Ube.Domain.Enums.Notifications.NotificationType) - each row is
// its own real event with its own saved preference, not a shared per-group
// bucket. Using the wrong numbers here means a real event's preference
// lookup finds no row and silently never fires (this is the bug that made
// the first wave of push toggles look broken).
const VENDOR_PREFERENCE_GROUPS: PreferenceGroup[] = [
  {
    label: "Bookings",
    items: [
      { key: "new_booking", label: "New booking requests", notificationType: 1 }, // NewBookingRequest
      { key: "booking_conf", label: "Booking confirmations", notificationType: 2 }, // BookingConfirmation
      { key: "cancellations", label: "Cancellations", notificationType: 3 }, // Cancellation
    ],
  },
  {
    label: "Payments",
    items: [
      { key: "pay_received", label: "Payment received", notificationType: 4 }, // PaymentReceived
      { key: "payout", label: "Payout processed", notificationType: 5 }, // PayoutProcessed
      { key: "pay_failed", label: "Payment failed", notificationType: 6 }, // PaymentFailed
      { key: "advance", label: "Advance issued", notificationType: 16 }, // VendorAdvanceIssued
      { key: "invoice_overdue", label: "Invoice overdue", notificationType: 17 }, // VendorInvoiceOverdue
      { key: "refund_processed", label: "Refund processed", notificationType: 18 }, // RefundProcessed
      { key: "dispute", label: "Payment dispute opened", notificationType: 19 }, // PaymentDisputeOpened
    ],
  },
  {
    label: "Reviews",
    items: [
      { key: "new_review", label: "New reviews", notificationType: 7 }, // NewReview
      { key: "review_resp", label: "Review responses", notificationType: 8 }, // ReviewResponse
    ],
  },
  {
    label: "Account",
    items: [
      { key: "security", label: "Security alerts", notificationType: 9 }, // SecurityAlert
      { key: "acc_updates", label: "Account updates", notificationType: 10 }, // AccountUpdate
    ],
  },
];

export default function NotificationsSection() {
  return <NotificationPreferencesSection groups={VENDOR_PREFERENCE_GROUPS} />;
}
