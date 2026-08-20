// src/utils/pushNotifications.ts
import { subscribeToPush, unsubscribeFromPush } from "../services/pushSubscriptionService";

export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window;
}

// Web Push wants the VAPID public key as a raw Uint8Array, but it's handed
// out as a URL-safe base64 string.
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) bytes[i] = rawData.charCodeAt(i);
  return bytes;
}

function subscriptionToPayload(subscription: PushSubscription) {
  const json = subscription.toJSON();
  if (!json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Push subscription is missing encryption keys.");
  }
  return {
    endpoint: subscription.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  };
}

// Requests browser notification permission (if not already granted/denied),
// registers the service worker, subscribes to push, and sends the
// subscription to the backend. Returns true once fully enabled.
export async function enablePushNotifications(): Promise<boolean> {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) return false;

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  await subscribeToPush(subscriptionToPayload(subscription));
  return true;
}

export async function disablePushNotifications(): Promise<void> {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  await unsubscribeFromPush(subscription.endpoint);
  await subscription.unsubscribe();
}

export async function isPushEnabled(): Promise<boolean> {
  if (!isPushSupported()) return false;
  if (Notification.permission !== "granted") return false;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  return Boolean(subscription);
}
