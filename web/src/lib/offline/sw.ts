export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("SW registered:", registration.scope);
    } catch (error) {
      console.log("SW registration failed:", error);
    }
  });
}

export async function unregisterServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    await registration.unregister();
  }
}
