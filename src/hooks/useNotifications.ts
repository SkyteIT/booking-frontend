// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import { useRealtimeHub } from "./useRealtimeHub";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getPreferences,
  savePreference,
  type Notification,
  type NotificationPreference,
  type UpdatePreferencePayload,
} from "../services/notificationService";

export const useNotifications = (
  userId: string | null,
  options?: {
    refreshIntervalMs?: number;
  }
) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const refreshIntervalMs = options?.refreshIntervalMs ?? 0;

  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [notifs, prefs] = await Promise.all([
        getNotifications(),
        getPreferences(),
      ]);
      setNotifications(notifs);
      setPreferences(prefs);
    } catch {
      console.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useRealtimeHub({
    "notification.created": () => {
      void loadAll();
    },
    "notification.read": () => {
      void loadAll();
    },
    "notification.read-all": () => {
      void loadAll();
    },
  }, { enabled: Boolean(userId) });

  useEffect(() => {
    if (!userId || refreshIntervalMs <= 0) return;

    const intervalId = window.setInterval(() => {
      void loadAll();
    }, refreshIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [loadAll, refreshIntervalMs, userId]);

  const handleMarkAsRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!userId) return;
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [userId]);

  const handleSavePreference = useCallback(
    async (payload: UpdatePreferencePayload) => {
      if (!userId) return;
      const updated = await savePreference(payload);
      setPreferences((prev) => {
        const exists = prev.find((p) => p.id === updated.id);
        if (exists) return prev.map((p) => (p.id === updated.id ? updated : p));
        return [...prev, updated];
      });
    },
    [userId]
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    preferences,
    loading,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    savePreference: handleSavePreference,
    reload: loadAll,
  };
};


