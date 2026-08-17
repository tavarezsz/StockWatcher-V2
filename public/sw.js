self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  const fallbackPayload = {
    title: "StockWatcher",
    body: "Um dos seus alertas foi disparado.",
    url: "/alerts",
  };

  let payload = fallbackPayload;

  if (event.data) {
    try {
      payload = { ...fallbackPayload, ...event.data.json() };
    } catch {
      payload = { ...fallbackPayload, body: event.data.text() };
    }
  }

  const notificationOptions = {
    body: payload.body,
    data: {
      url: getSafeNotificationUrl(payload.url),
    },
    tag: payload.tag,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = getSafeNotificationUrl(event.notification.data?.url);

  event.waitUntil(openOrFocusApplication(targetUrl));
});

function getSafeNotificationUrl(value) {
  try {
    const url = new URL(value || "/alerts", self.location.origin);

    return url.origin === self.location.origin ? url.href : "/alerts";
  } catch {
    return "/alerts";
  }
}

async function openOrFocusApplication(targetUrl) {
  const windowClients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of windowClients) {
    if ("navigate" in client) {
      await client.navigate(targetUrl);
    }

    if ("focus" in client) {
      return client.focus();
    }
  }

  return self.clients.openWindow(targetUrl);
}
