import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "clothes-store";
const DB_VERSION = 1;

export interface CachedProduct {
  id: string;
  data: unknown;
  cachedAt: number;
}

export interface SyncQueueItem {
  id: string;
  url: string;
  method: string;
  body: string;
  createdAt: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Products cache
        if (!db.objectStoreNames.contains("products")) {
          db.createObjectStore("products", { keyPath: "id" });
        }
        // Categories cache
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "id" });
        }
        // Cart (offline)
        if (!db.objectStoreNames.contains("cart")) {
          db.createObjectStore("cart", { keyPath: "key" });
        }
        // Wishlist (offline)
        if (!db.objectStoreNames.contains("wishlist")) {
          db.createObjectStore("wishlist", { keyPath: "product_id" });
        }
        // Sync queue
        if (!db.objectStoreNames.contains("sync-queue")) {
          const store = db.createObjectStore("sync-queue", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("createdAt", "createdAt");
        }
      },
    });
  }
  return dbPromise;
}

// ============================================
// PRODUCTS
// ============================================
export async function cacheProducts(products: unknown[]) {
  const db = await getDB();
  const tx = db.transaction("products", "readwrite");
  for (const product of products) {
    const p = product as CachedProduct;
    await tx.store.put({ ...p, cachedAt: Date.now() });
  }
  await tx.done;
}

export async function getCachedProducts(): Promise<unknown[]> {
  const db = await getDB();
  return db.getAll("products");
}

export async function cacheProduct(product: unknown) {
  const db = await getDB();
  const p = product as CachedProduct;
  await db.put("products", { ...p, cachedAt: Date.now() });
}

export async function getCachedProduct(id: string): Promise<unknown | null> {
  const db = await getDB();
  return db.get("products", id);
}

// ============================================
// CATEGORIES
// ============================================
export async function cacheCategories(categories: unknown[]) {
  const db = await getDB();
  const tx = db.transaction("categories", "readwrite");
  for (const cat of categories) {
    await tx.store.put(cat);
  }
  await tx.done;
}

export async function getCachedCategories(): Promise<unknown[]> {
  const db = await getDB();
  return db.getAll("categories");
}

// ============================================
// CART (offline persistence)
// ============================================
export async function saveCart(items: unknown[]) {
  const db = await getDB();
  await db.put("cart", { key: "items", data: items, updatedAt: Date.now() });
}

export async function loadCart(): Promise<unknown[]> {
  const db = await getDB();
  const record = await db.get("cart", "items");
  return record?.data || [];
}

// ============================================
// WISHLIST (offline persistence)
// ============================================
export async function saveWishlistItem(productId: string) {
  const db = await getDB();
  await db.put("wishlist", {
    product_id: productId,
    addedAt: Date.now(),
  });
}

export async function removeWishlistItem(productId: string) {
  const db = await getDB();
  await db.delete("wishlist", productId);
}

export async function getWishlist(): Promise<string[]> {
  const db = await getDB();
  const items = await db.getAll("wishlist");
  return items.map((item) => item.product_id);
}

// ============================================
// SYNC QUEUE
// ============================================
export async function addToSyncQueue(
  url: string,
  method: string,
  body: unknown
) {
  const db = await getDB();
  await db.add("sync-queue", {
    url,
    method,
    body: JSON.stringify(body),
    createdAt: Date.now(),
  });
}

export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  const db = await getDB();
  return db.getAll("sync-queue");
}

export async function removeSyncQueueItem(id: string | number) {
  const db = await getDB();
  await db.delete("sync-queue", id);
}

export async function clearSyncQueue() {
  const db = await getDB();
  const tx = db.transaction("sync-queue", "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function processSyncQueue() {
  const queue = await getSyncQueue();
  const results = [];

  for (const item of queue) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: item.body,
      });

      if (response.ok) {
        await removeSyncQueueItem(item.id);
        results.push({ success: true, id: item.id });
      } else {
        results.push({ success: false, id: item.id, status: response.status });
      }
    } catch {
      results.push({ success: false, id: item.id, error: "Network error" });
    }
  }

  return results;
}
