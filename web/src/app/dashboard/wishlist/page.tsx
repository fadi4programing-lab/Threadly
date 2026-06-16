"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";

interface WishlistItem {
  id: string;
  product_id: string;
  products: Product;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    const res = await fetch("/api/wishlist");
    const data = await res.json();
    setItems(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const removeItem = async (productId: string) => {
    await fetch(`/api/wishlist?product_id=${productId}`, {
      method: "DELETE",
    });
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Wishlist</h2>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500">Your wishlist is empty</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-sm font-medium text-black hover:underline dark:text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900"
            >
              <Link href={`/products/${item.product_id}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  {item.products?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.products.images[0]}
                      alt={item.products.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-1">
                    {item.products?.name}
                  </h3>
                  <p className="text-sm font-bold mt-1">
                    ${(item.products?.sale_price || item.products?.price || 0).toFixed(2)}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => removeItem(item.product_id)}
                className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity dark:bg-black/80"
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
