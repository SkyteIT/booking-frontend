// src/utils/notificationPortals.ts
//
// A single account's notification feed can contain events from two
// different contexts - e.g. a vendor account that also books things as a
// customer receives both "someone reviewed your listing" (vendor context)
// and "your booking was confirmed" (customer context) under the same
// userId. The vendor portal and customer portal must each show only their
// own context's events, never the other's, even for the same account.
//
// `Notification.type` (inbox list items) is the backend enum's NAME
// (Ube.Domain.Enums.Notifications.NotificationType, serialized via
// `.ToString()`) - e.g. "NewBookingRequest", not a number. Preferences use
// the numeric string form instead; this file is only about inbox filtering.

const VENDOR_NOTIFICATION_TYPES = new Set([
  "NewBookingRequest",
  "NewReview",
  "VendorApproved",
  "RevenueTargetAchieved",
  "VendorAdvanceIssued",
  "VendorInvoiceOverdue",
  "RefundProcessed",
  "PaymentDisputeOpened",
  "PayoutProcessed",
  "GatewayError",
]);

const CUSTOMER_NOTIFICATION_TYPES = new Set([
  "BookingConfirmation",
  "Cancellation",
  "ReviewResponse",
  "RefundPending",
  "PaymentFailed",
]);

// Account-level events relevant regardless of which portal you're in.
const SHARED_NOTIFICATION_TYPES = new Set(["SecurityAlert", "AccountUpdate", "SystemMaintenance"]);

export type NotificationPortal = "vendor" | "customer";

export function belongsToPortal(type: string, portal: NotificationPortal): boolean {
  if (SHARED_NOTIFICATION_TYPES.has(type)) return true;
  return portal === "vendor" ? VENDOR_NOTIFICATION_TYPES.has(type) : CUSTOMER_NOTIFICATION_TYPES.has(type);
}
