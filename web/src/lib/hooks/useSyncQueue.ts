import { useEffect, useCallback } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { processSyncQueue, getSyncQueue } from "@/lib/offline/db";

export function useSyncQueue() {
  const isOnline = useOnlineStatus();

  const processQueue = useCallback(async () => {
    if (!isOnline) return;

    const queue = await getSyncQueue();
    if (queue.length === 0) return;

    console.log(`Processing ${queue.length} queued actions...`);
    const results = await processSyncQueue();
    console.log("Sync results:", results);
    return results;
  }, [isOnline]);

  // Process queue when coming back online
  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  return { processQueue, isOnline };
}
