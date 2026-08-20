// Minimal push-only service worker. Not a full offline/PWA cache strategy -
// its only job is to turn an incoming push message into a visible OS/browser
// notification while the tab isn't focused.

self.addEventListener("push", (event) => {
  let data = { title: "UBE", body: "You have a new notification." };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "UBE", {
      body: data.body || "",
      icon: "/vite.svg",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
        return;
      }
      return self.clients.openWindow("/vendor/notifications");
    })
  );
});
