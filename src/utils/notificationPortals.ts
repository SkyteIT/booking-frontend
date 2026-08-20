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
  if (VENDOR_NOTIFICATION_TYPES.has(type)) return portal === "vendor";
  if (CUSTOMER_NOTIFICATION_TYPES.has(type)) return portal === "customer";

  // The explicit sets above only cover the legacy NotificationType range
  // (Ube.Domain.Enums.Notifications.NotificationType, values 1-21) and go
  // stale the moment a new type is added. Every type added since then
  // (the Admin*/Vendor*/Customer* 100+/200+/300+ series - VendorAccountApproved,
  // CustomerBookingConfirmed, etc.) follows a strict role-prefix naming
  // convention, so fall back to that instead of silently dropping it from
  // every portal.
  if (type.startsWith("Vendor")) return portal === "vendor";
  if (type.startsWith("Customer")) return portal === "customer";
  if (type.startsWith("Admin")) return false;

  // Unrecognized/ungrouped type - fail open rather than silently hiding a
  // real notification from every portal.
  return true;
}
