// src/services/notificationService.ts
import api from "./api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  displayLabel?: string;
  iconKey?: string;
  isRead: boolean;
  createdAtUtc: string;
  readAtUtc: string | null;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  notificationType: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}

export interface CreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: number;       // maps to NotificationType enum: 0=Booking, 1=Payment, 2=Review, 3=Account
  email?: string;     // required for email delivery
  phoneNumber?: string; // required for SMS delivery
}

export interface UpdatePreferencePayload {
  notificationType: number;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
}

// ── Fetch notifications for the authenticated user ─────────
// The backend always scopes to the caller's JWT regardless of any id
// passed in, so these take no userId - it was always a dead route param.
export const getNotifications = () =>
  api.get<Notification[]>("/notifications/mine").then((r) => r.data);

// ── Create a notification (also triggers email/SMS based on preferences) ──
export const createNotification = (payload: CreateNotificationPayload) =>
  api.post<Notification>("/notifications", payload).then((r) => r.data);

// ── Mark single notification read ──────────────────────────
export const markAsRead = (id: string) =>
  api.put(`/notifications/${id}/read`);

// ── Mark all notifications read for the authenticated user ──
export const markAllAsRead = () =>
  api.put("/notifications/read-all").then((r) => r.data);

// ── Get notification preferences ───────────────────────────
export const getPreferences = () =>
  api.get<NotificationPreference[]>("/notifications/preferences").then((r) => r.data);

// ── Save (upsert) a notification preference ─────────────────
export const savePreference = (payload: UpdatePreferencePayload) =>
  api.put<NotificationPreference>("/notifications/preferences", payload).then((r) => r.data);
