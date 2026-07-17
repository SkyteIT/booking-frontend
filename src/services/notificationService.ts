// src/services/notificationService.ts
import api from "./api";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
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

// ── Fetch notifications for a user ─────────────────────────
export const getNotifications = (userId: string) =>
  api.get<Notification[]>(`/notifications/user/${userId}`).then((r) => r.data);

// ── Create a notification (also triggers email/SMS based on preferences) ──
export const createNotification = (payload: CreateNotificationPayload) =>
  api.post<Notification>("/notifications", payload).then((r) => r.data);

// ── Mark single notification read ──────────────────────────
export const markAsRead = (id: string) =>
  api.put(`/notifications/${id}/read`);

// ── Mark all notifications read for a user ─────────────────
export const markAllAsRead = (userId: string) =>
  api.put(`/notifications/user/${userId}/read-all`).then((r) => r.data);

// ── Get notification preferences ───────────────────────────
export const getPreferences = (userId: string) =>
  api.get<NotificationPreference[]>(`/notifications/preferences/${userId}`).then((r) => r.data);

// ── Save (upsert) a notification preference ─────────────────
export const savePreference = (userId: string, payload: UpdatePreferencePayload) =>
  api.put<NotificationPreference>(`/notifications/preferences/${userId}`, payload).then((r) => r.data);