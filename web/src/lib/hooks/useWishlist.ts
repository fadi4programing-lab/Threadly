"use client";

import { useState, useEffect, useCallback } from "react";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (!res.ok) return;
      const data = await res.json();
      if (data.data) {
        setWishlistIds(new Set(data.data.map((item: { product_id: string }) => item.product_id)));
      }
    } catch {
      // not logged in or network error
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const isWishlisted = wishlistIds.has(productId);

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (isWishlisted) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });

      try {
        if (isWishlisted) {
          await fetch(`/api/wishlist?product_id=${productId}`, { method: "DELETE" });
        } else {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId }),
          });
        }
      } catch {
        // Revert on failure
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (isWishlisted) {
            next.add(productId);
          } else {
            next.delete(productId);
          }
          return next;
        });
      }
    },
    [wishlistIds]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  return { wishlistIds, toggleWishlist, isWishlisted };
}
