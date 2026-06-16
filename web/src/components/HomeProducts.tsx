"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import { Product } from "@/lib/types";

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();
        if (data.data) {
          setProducts(data.data.filter((p: Product) => p.is_featured).slice(0, 8));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-8 py-16">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-8 py-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Products</h2>
        <Link
          href="/products"
          className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
        >
          View All →
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
