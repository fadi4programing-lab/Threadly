"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/offline/sw";
import { useSyncQueue } from "@/lib/hooks/useSyncQueue";

export function ServiceWorkerRegistrar() {
  const { isOnline } = useSyncQueue();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Show online/offline toast
  useEffect(() => {
    const handleOnline = () => {
      console.log("Back online - syncing...");
    };

    const handleOffline = () => {
      console.log("Gone offline - data will be cached");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  return null;
}
