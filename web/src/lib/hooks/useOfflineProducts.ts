"use client";

import { useState, useCallback } from "react";
import { useOnlineStatus } from "./useOnlineStatus";
import { cacheProducts, getCachedProducts, cacheProduct, getCachedProduct } from "@/lib/offline/db";
import { Product } from "@/lib/types";

export function useOfflineProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const isOnline = useOnlineStatus();

  const fetchProducts = useCallback(
    async (params?: string) => {
      setLoading(true);
      setIsOffline(!isOnline);

      if (isOnline) {
        try {
          const url = params ? `/api/products?${params}` : "/api/products?limit=50";
          const res = await fetch(url);
          const data = await res.json();

          if (data.data) {
            setProducts(data.data);
            await cacheProducts(data.data);
          }
        } catch {
          // Network error, try cache
          const cached = await getCachedProducts();
          setProducts(cached as Product[]);
          setIsOffline(true);
        }
      } else {
        // Offline: use cache
        const cached = await getCachedProducts();
        setProducts(cached as Product[]);
      }

      setLoading(false);
    },
    [isOnline]
  );

  const fetchProduct = useCallback(
    async (id: string) => {
      setLoading(true);
      setIsOffline(!isOnline);

      if (isOnline) {
        try {
          const res = await fetch(`/api/products/${id}`);
          const data = await res.json();

          if (data.data) {
            setProduct(data.data);
            await cacheProduct(data.data);
          }
        } catch {
          const cached = await getCachedProduct(id);
          setProduct(cached as Product | null);
          setIsOffline(true);
        }
      } else {
        const cached = await getCachedProduct(id);
        setProduct(cached as Product | null);
      }

      setLoading(false);
    },
    [isOnline]
  );

  return {
    products,
    product,
    loading,
    isOffline,
    fetchProducts,
    fetchProduct,
  };
}
