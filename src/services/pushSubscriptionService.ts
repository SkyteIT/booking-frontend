// src/services/pushSubscriptionService.ts
import api from "./api";

export interface SubscribePushPayload {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const subscribeToPush = (payload: SubscribePushPayload) =>
  api.post("/notifications/push/subscribe", payload);

export const unsubscribeFromPush = (endpoint: string) =>
  api.post("/notifications/push/unsubscribe", { endpoint });
