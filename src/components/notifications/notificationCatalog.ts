import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ApprovalsOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import NotificationImportantOutlinedIcon from "@mui/icons-material/NotificationImportantOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import type { ElementType } from "react";

export type NotificationRole = "admin" | "vendor" | "customer";
export type NotificationSeverity = "success" | "info" | "warning" | "error";

export type NotificationMatch = {
  groupKey: string;
  label: string;
  severity: NotificationSeverity;
};

export type NotificationEventMeta = {
  icon: ElementType;
  accent: string;
  label: string;
};

export type NotificationDestination = {
  path: string;
  label: string;
  description: string;
};

export type NotificationGroup = {
  key: string;
  title: string;
  description: string;
  accent: string;
  icon: ElementType;
  labels: string[];
  keywords: string[];
  severity: NotificationSeverity;
};

export type NotificationPreferenceGroup = {
  key: string;
  title: string;
  description: string;
  notificationType: number;
};

export type NotificationRoleConfig = {
  role: NotificationRole;
  title: string;
  subtitle: string;
  badge: string;
  heroGradient: string;
  heroGlow: string;
  groups: NotificationGroup[];
  preferenceGroups: NotificationPreferenceGroup[];
};

const makeGroup = (
  key: string,
  title: string,
  description: string,
  accent: string,
  icon: ElementType,
  labels: string[],
  keywords: string[],
  severity: NotificationSeverity
): NotificationGroup => ({
  key,
  title,
  description,
  accent,
  icon,
  labels,
  keywords,
  severity,
});

export const NOTIFICATION_ROLE_CONFIGS: Record<NotificationRole, NotificationRoleConfig> = {
  admin: {
    role: "admin",
    title: "Platform notifications",
    subtitle: "Monitor onboarding, moderation, disputes, finance, and safety events from one control room.",
    badge: "Admin",
    heroGradient: "linear-gradient(160deg, #005a8d, #0077b6)",
    heroGlow: "radial-gradient(circle at top right, rgba(224, 242, 254, 0.24), transparent 34%), radial-gradient(circle at bottom left, rgba(224, 242, 254, 0.14), transparent 32%)",
    groups: [
      makeGroup(
        "onboarding",
        "Onboarding",
        "New users, vendors, and platform requests.",
        "#2563eb",
        PersonSearchOutlinedIcon,
        ["new vendor registered", "new customer registration", "vendor requested approval"],
        ["new vendor", "new customer", "vendor requested approval", "requested approval", "registration"],
        "info"
      ),
      makeGroup(
        "moderation",
        "Moderation",
        "Listings, approvals, reports, and review queues.",
        "#7c3aed",
        ApprovalsOutlinedIcon,
        ["new listing submitted", "listing approval required", "listing update requires review", "listing reported", "customer report submitted"],
        ["listing submitted", "approval required", "update requires review", "reported", "review queue", "moderation"],
        "warning"
      ),
      makeGroup(
        "operations",
        "Operations",
        "Bookings, cancellations, payment issues, and refunds.",
        "#0f766e",
        EventAvailableOutlinedIcon,
        ["new booking created", "booking cancellation", "payment issue", "refund request"],
        ["booking created", "booking cancellation", "payment issue", "refund request", "refund", "booking"],
        "success"
      ),
      makeGroup(
        "safety",
        "Safety",
        "Suspensions and system-level alerts.",
        "#dc2626",
        ReportGmailerrorredOutlinedIcon,
        ["vendor account suspended", "system alert"],
        ["account suspended", "system alert", "suspended", "incident", "critical"],
        "error"
      ),
    ],
    preferenceGroups: [
      { key: "onboarding", title: "Onboarding", description: "New users and approval requests", notificationType: 0 },
      { key: "moderation", title: "Moderation", description: "Listings, review queues, and reports", notificationType: 2 },
      { key: "operations", title: "Operations", description: "Bookings, cancellations, and payments", notificationType: 1 },
      { key: "safety", title: "Safety", description: "Suspensions and critical platform alerts", notificationType: 3 },
    ],
  },
  vendor: {
    role: "vendor",
    title: "Vendor notifications",
    subtitle: "Track listings, bookings, payouts, reviews, and account status in one focused inbox.",
    badge: "Vendor",
    heroGradient: "linear-gradient(160deg, #005a8d, #0077b6)",
    heroGlow: "radial-gradient(circle at top right, rgba(224, 242, 254, 0.24), transparent 34%), radial-gradient(circle at bottom left, rgba(224, 242, 254, 0.14), transparent 32%)",
    groups: [
      makeGroup(
        "listings",
        "Listings",
        "Approvals, edits, expiring listings, and expiry warnings.",
        "#7c3aed",
        Inventory2OutlinedIcon,
        ["listing approved", "listing rejected", "listing updated approved", "listing update rejected", "listing expiring soon", "listing expired"],
        ["listing approved", "listing rejected", "listing updated", "listing update", "expiring", "expired", "listing"],
        "warning"
      ),
      makeGroup(
        "bookings",
        "Bookings",
        "Incoming reservations, confirmations, cancellations, and reschedules.",
        "#2563eb",
        EventAvailableOutlinedIcon,
        ["new booking received", "booking confirmed", "booking cancelled by customer", "booking rescheduled"],
        ["booking received", "booking confirmed", "booking cancelled", "booking rescheduled", "booking"],
        "success"
      ),
      makeGroup(
        "payments",
        "Payments",
        "Successful payments, failures, and refunds.",
        "#0f766e",
        PaymentsOutlinedIcon,
        ["payment received", "payment failed", "refund requested", "refund processed"],
        ["payment received", "payment failed", "refund requested", "refund processed", "payment", "refund"],
        "success"
      ),
      makeGroup(
        "reputation",
        "Reputation",
        "Reviews and low-rating alerts.",
        "#d97706",
        ReviewsOutlinedIcon,
        ["new customer review", "low rating received"],
        ["review", "rating", "feedback"],
        "warning"
      ),
      makeGroup(
        "account",
        "Account",
        "Approval, rejection, suspension, and announcements.",
        "#dc2626",
        SettingsSuggestOutlinedIcon,
        ["vendor account approved", "vendor account rejected", "vendor account suspended", "system announcement"],
        ["account approved", "account rejected", "account suspended", "system announcement", "announcement"],
        "error"
      ),
    ],
    preferenceGroups: [
      { key: "listings", title: "Listings", description: "Approvals, updates, and expiry notices", notificationType: 0 },
      { key: "bookings", title: "Bookings", description: "New bookings, confirmations, and cancellations", notificationType: 0 },
      { key: "payments", title: "Payments", description: "Payments, failures, and refunds", notificationType: 1 },
      { key: "reputation", title: "Reviews", description: "Reviews and rating alerts", notificationType: 2 },
      { key: "account", title: "Account", description: "Approvals, suspensions, and announcements", notificationType: 3 },
    ],
  },
  customer: {
    role: "customer",
    title: "Customer notifications",
    subtitle: "Stay on top of booking changes, payments, reviews, promotions, and account updates.",
    badge: "Customer",
    heroGradient: "linear-gradient(160deg, #005a8d, #0077b6)",
    heroGlow: "radial-gradient(circle at top right, rgba(224, 242, 254, 0.24), transparent 34%), radial-gradient(circle at bottom left, rgba(224, 242, 254, 0.14), transparent 32%)",
    groups: [
      makeGroup(
        "bookings",
        "Bookings",
        "Confirmed, pending, rejected, rescheduled, reminders, and completion updates.",
        "#2563eb",
        EventAvailableOutlinedIcon,
        ["booking confirmed", "booking pending", "booking rejected", "booking cancelled by vendor", "booking cancelled by customer", "booking rescheduled", "booking reminder", "booking completed", "booking status changed"],
        ["booking confirmed", "booking pending", "booking rejected", "booking cancelled", "booking rescheduled", "booking reminder", "booking completed", "status changed", "booking"],
        "info"
      ),
      makeGroup(
        "payments",
        "Payments",
        "Successful payments, failures, and refunds.",
        "#0f766e",
        PaymentsOutlinedIcon,
        ["payment successful", "payment failed", "refund requested", "refund approved", "refund rejected", "refund processed"],
        ["payment successful", "payment failed", "refund requested", "refund approved", "refund rejected", "refund processed", "payment", "refund"],
        "success"
      ),
      makeGroup(
        "reviews",
        "Reviews",
        "Review reminders and submitted feedback.",
        "#d97706",
        ReviewsOutlinedIcon,
        ["review reminder", "review submitted"],
        ["review reminder", "review submitted", "review"],
        "warning"
      ),
      makeGroup(
        "account",
        "Account and offers",
        "Verification, vendor application updates, announcements, and promotions.",
        "#7c3aed",
        AnnouncementOutlinedIcon,
        ["account verification", "vendor application submitted", "system announcement", "promotion", "offer available", "promotion/ offer available"],
        ["verification", "vendor application", "application submitted", "announcement", "promotion", "offer", "available", "application"],
        "info"
      ),
    ],
    preferenceGroups: [
      { key: "bookings", title: "Bookings", description: "Booking updates and reminders", notificationType: 0 },
      { key: "payments", title: "Payments", description: "Payment and refund notifications", notificationType: 1 },
      { key: "reviews", title: "Reviews", description: "Review reminders and submissions", notificationType: 2 },
      { key: "account", title: "Account and offers", description: "Verification, application updates, announcements, and promotions", notificationType: 3 },
      { key: "vendor_application", title: "Vendor application", description: "Vendor application submission updates", notificationType: 20 },
    ],
  },
};

const normalize = (value: unknown) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const buildDestination = (path: string, label: string, description: string): NotificationDestination => ({
  path,
  label,
  description,
});

const containsAny = (haystack: string, terms: string[]) => terms.some((term) => haystack.includes(normalize(term)));

export function resolveNotificationMatch(
  role: NotificationRole,
  type: string,
  title: string,
  message: string
): NotificationMatch {
  const config = NOTIFICATION_ROLE_CONFIGS[role];
  const haystack = normalize([type, title, message].filter(Boolean).join(" "));

  for (const group of config.groups) {
    if (group.key === normalize(type)) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === normalize(title)) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === normalize(message)) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === normalize(group.title)) {
      continue;
    }

    if (group.key === "account" && (haystack.includes("account") || haystack.includes("verification") || haystack.includes("announcement") || haystack.includes("application"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "listings" && (haystack.includes("listing") || haystack.includes("approval"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "bookings" && haystack.includes("booking")) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "payments" && (haystack.includes("payment") || haystack.includes("refund"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "reputation" && (haystack.includes("review") || haystack.includes("rating"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "moderation" && (haystack.includes("report") || haystack.includes("approval") || haystack.includes("review"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "operations" && (haystack.includes("booking") || haystack.includes("payment") || haystack.includes("refund"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "safety" && (haystack.includes("suspend") || haystack.includes("alert") || haystack.includes("incident"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }

    if (group.key === "onboarding" && (haystack.includes("vendor") || haystack.includes("customer") || haystack.includes("request"))) {
      return { groupKey: group.key, label: group.title, severity: group.severity };
    }
  }

  const fallback = config.groups[0];
  return { groupKey: fallback.key, label: fallback.title, severity: fallback.severity };
}

export function getNotificationRoleConfig(role: NotificationRole) {
  return NOTIFICATION_ROLE_CONFIGS[role];
}

const EVENT_META: Partial<Record<NotificationRole, Record<string, NotificationEventMeta>>> = {
  admin: {
    adminnewvendorregistered: { icon: PersonAddAlt1OutlinedIcon, accent: "#2563eb", label: "Vendor registered" },
    adminnewlistingsubmitted: { icon: AddBusinessOutlinedIcon, accent: "#7c3aed", label: "Listing submitted" },
    adminvendorrequestapproval: { icon: ApprovalsOutlinedIcon, accent: "#0f766e", label: "Approval requested" },
    adminnewbookingcreated: { icon: EventAvailableOutlinedIcon, accent: "#2563eb", label: "Booking created" },
    adminbookingcancellation: { icon: EventBusyOutlinedIcon, accent: "#d97706", label: "Booking cancelled" },
    adminpaymentissue: { icon: PaymentsOutlinedIcon, accent: "#dc2626", label: "Payment issue" },
    admincustomerreportsubmitted: { icon: ReportGmailerrorredOutlinedIcon, accent: "#dc2626", label: "Customer report" },
    adminlistingreported: { icon: ReportGmailerrorredOutlinedIcon, accent: "#dc2626", label: "Listing reported" },
    adminvendoraccountsuspended: { icon: DoNotDisturbOnOutlinedIcon, accent: "#991b1b", label: "Vendor suspended" },
    adminlistingapprovalrequired: { icon: FactCheckOutlinedIcon, accent: "#7c3aed", label: "Approval required" },
    adminlistingupdaterequiresreview: { icon: RateReviewOutlinedIcon, accent: "#d97706", label: "Update review" },
    adminnewcustomerregistration: { icon: PersonAddAlt1OutlinedIcon, accent: "#2563eb", label: "Customer registered" },
    adminrefundrequest: { icon: RequestPageOutlinedIcon, accent: "#0f766e", label: "Refund request" },
    adminsystemalert: { icon: NotificationImportantOutlinedIcon, accent: "#dc2626", label: "System alert" },
  },
  vendor: {
    vendorlistingsapproved: { icon: TaskAltOutlinedIcon, accent: "#16a34a", label: "Listing approved" },
    vendorlistingsrejected: { icon: CancelOutlinedIcon, accent: "#dc2626", label: "Listing rejected" },
    vendorlistingsupdateapproved: { icon: TaskAltOutlinedIcon, accent: "#16a34a", label: "Update approved" },
    vendorlistingsupdaterejected: { icon: CancelOutlinedIcon, accent: "#dc2626", label: "Update rejected" },
    vendornewbookingreceived: { icon: EventAvailableOutlinedIcon, accent: "#2563eb", label: "New booking" },
    vendorbookingconfirmed: { icon: CheckCircleOutlineIcon, accent: "#16a34a", label: "Booking confirmed" },
    vendorbookingcancelledbycustomer: { icon: EventBusyOutlinedIcon, accent: "#d97706", label: "Booking cancelled" },
    vendorbookingrescheduled: { icon: EventRepeatOutlinedIcon, accent: "#0f766e", label: "Booking rescheduled" },
    vendorpaymentreceived: { icon: PaymentsOutlinedIcon, accent: "#0f766e", label: "Payment received" },
    vendorpaymentfailed: { icon: WarningAmberOutlinedIcon, accent: "#dc2626", label: "Payment failed" },
    vendorrefundrequested: { icon: RequestPageOutlinedIcon, accent: "#d97706", label: "Refund requested" },
    vendorrefundprocessed: { icon: ReceiptLongOutlinedIcon, accent: "#0f766e", label: "Refund processed" },
    vendornewcustomerreview: { icon: ReviewsOutlinedIcon, accent: "#7c3aed", label: "New review" },
    vendorlowratingreceived: { icon: WarningAmberOutlinedIcon, accent: "#dc2626", label: "Low rating" },
    vendoraccountapproved: { icon: VerifiedUserOutlinedIcon, accent: "#16a34a", label: "Account approved" },
    vendoraccountrejected: { icon: PersonOffOutlinedIcon, accent: "#dc2626", label: "Account rejected" },
    vendoraccountsuspended: { icon: DoNotDisturbOnOutlinedIcon, accent: "#991b1b", label: "Account suspended" },
    vendorlistingexpired: { icon: EventBusyOutlinedIcon, accent: "#d97706", label: "Listing expired" },
    vendorsystemannouncement: { icon: CampaignOutlinedIcon, accent: "#7c3aed", label: "Announcement" },
  },
  customer: {
    customerbookingconfirmed: { icon: CheckCircleOutlineIcon, accent: "#16a34a", label: "Booking confirmed" },
    customerbookingpending: { icon: HourglassTopOutlinedIcon, accent: "#d97706", label: "Booking pending" },
    customerbookingrejected: { icon: CancelOutlinedIcon, accent: "#dc2626", label: "Booking rejected" },
    customerbookingcancelledbyvendor: { icon: EventBusyOutlinedIcon, accent: "#dc2626", label: "Cancelled by vendor" },
    customerbookingcancelledbycustomer: { icon: EventBusyOutlinedIcon, accent: "#d97706", label: "Cancelled by customer" },
    customerbookingrescheduled: { icon: EventRepeatOutlinedIcon, accent: "#0f766e", label: "Booking rescheduled" },
    customerbookingreminder: { icon: NotificationsActiveOutlinedIcon, accent: "#2563eb", label: "Booking reminder" },
    customerpaymentsuccessful: { icon: PaymentsOutlinedIcon, accent: "#16a34a", label: "Payment successful" },
    customerpaymentfailed: { icon: WarningAmberOutlinedIcon, accent: "#dc2626", label: "Payment failed" },
    customerrefundrequested: { icon: RequestPageOutlinedIcon, accent: "#d97706", label: "Refund requested" },
    customerrefundapproved: { icon: CheckCircleOutlineIcon, accent: "#16a34a", label: "Refund approved" },
    customerrefundrejected: { icon: CancelOutlinedIcon, accent: "#dc2626", label: "Refund rejected" },
    customerrefundprocessed: { icon: ReceiptLongOutlinedIcon, accent: "#0f766e", label: "Refund processed" },
    customerbookingcompleted: { icon: TaskAltOutlinedIcon, accent: "#16a34a", label: "Booking completed" },
    customerreviewreminder: { icon: RateReviewOutlinedIcon, accent: "#d97706", label: "Review reminder" },
    customerreviewsubmitted: { icon: ReviewsOutlinedIcon, accent: "#7c3aed", label: "Review submitted" },
    customerbookingstatuschanged: { icon: SwapHorizOutlinedIcon, accent: "#0f766e", label: "Status changed" },
    customeraccountverification: { icon: VerifiedUserOutlinedIcon, accent: "#2563eb", label: "Account verification" },
    customerapplicationsubmitted: { icon: AddBusinessOutlinedIcon, accent: "#7c3aed", label: "Vendor application submitted" },
    vendorapplicationsubmitted: { icon: AddBusinessOutlinedIcon, accent: "#7c3aed", label: "Vendor application submitted" },
    customersystemannouncement: { icon: CampaignOutlinedIcon, accent: "#7c3aed", label: "System announcement" },
    customerpromotionandofferavailable: { icon: LocalOfferOutlinedIcon, accent: "#d97706", label: "Offer available" },
  },
};

export function resolveNotificationEventMeta(
  role: NotificationRole,
  type: string,
  title: string,
  message: string
): NotificationEventMeta {
  const normalized = normalize(type).replace(/\s+/g, "");
  const exact = EVENT_META[role]?.[normalized];
  if (exact) return exact;

  const match = resolveNotificationMatch(role, type, title, message);
  const group = NOTIFICATION_ROLE_CONFIGS[role].groups.find((entry) => entry.key === match.groupKey);
  return {
    icon: group?.icon ?? NotificationImportantOutlinedIcon,
    accent: group?.accent ?? "#2563eb",
    label: group?.title ?? match.label,
  };
}

export function resolveNotificationDestination(
  role: NotificationRole,
  type: string,
  title: string,
  message: string
): NotificationDestination {
  const match = resolveNotificationMatch(role, type, title, message);
  const haystack = normalize([type, title, message].filter(Boolean).join(" "));

  if (role === "admin") {
    if (match.groupKey === "onboarding") {
      if (containsAny(haystack, ["vendor"])) {
        return buildDestination("/admin/vendors", "Open vendor queue", "Review vendor registration, approval, and suspension events.");
      }
      return buildDestination("/admin/users", "Open user queue", "Review customer registrations and onboarding activity.");
    }

    if (match.groupKey === "moderation") {
      return buildDestination("/admin/content", "Open moderation hub", "Review listing submissions, content reports, and approval queues.");
    }

    if (match.groupKey === "operations") {
      return buildDestination("/admin/bookings", "Open booking oversight", "Review booking, cancellation, payment, and refund activity.");
    }

    if (match.groupKey === "safety") {
      if (containsAny(haystack, ["vendor"])) {
        return buildDestination("/admin/vendors", "Open vendor safety", "Review vendor suspension and account risk events.");
      }
      return buildDestination("/admin/dashboard", "Open platform overview", "Review the latest platform alert from the admin dashboard.");
    }
  }

  if (role === "vendor") {
    if (match.groupKey === "listings") {
      return buildDestination("/vendor/listings", "Open listings", "Review listing approvals, edits, and expiry notices.");
    }

    if (match.groupKey === "bookings") {
      return buildDestination("/vendor/bookings", "Open bookings", "Review incoming reservations and booking status changes.");
    }

    if (match.groupKey === "payments") {
      return buildDestination("/vendor/dashboard", "Open earnings dashboard", "Review payment activity from the vendor dashboard.");
    }

    if (match.groupKey === "reputation") {
      return buildDestination("/vendor/reviews", "Open reviews", "Read customer feedback and rating alerts.");
    }

    if (match.groupKey === "account") {
      return buildDestination("/vendor/settings", "Open vendor settings", "Review account status, approval, and announcement details.");
    }
  }

  if (role === "customer") {
    if (match.groupKey === "bookings") {
      return buildDestination("/customer/bookings", "Open my bookings", "Review booking confirmations, reschedules, reminders, and cancellations.");
    }

    if (match.groupKey === "payments") {
      return buildDestination("/customer/payments", "Open payment methods", "Review payment success, failures, and refund activity.");
    }

    if (match.groupKey === "reviews") {
      return buildDestination("/customer/reviews", "Open reviews", "Submit or review your recent feedback activity.");
    }

    if (match.groupKey === "account") {
      if (containsAny(haystack, ["verification"])) {
        return buildDestination("/customer/notifications", "Open customer notifications", "Return to your customer notification inbox.");
      }

      if (containsAny(haystack, ["application"])) {
        return buildDestination("/customer/notifications", "Open customer notifications", "Return to your customer notification inbox.");
      }

      return buildDestination("/customer/dashboard", "Open customer dashboard", "Review announcements, offers, and account updates.");
    }
  }

  return buildDestination("/", "Open home", "Return to the main landing page.");
}
