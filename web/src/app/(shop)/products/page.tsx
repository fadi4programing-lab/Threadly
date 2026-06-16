"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, WifiOff } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import { Product } from "@/lib/types";
import { cacheProducts, getCachedProducts } from "@/lib/offline/db";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isFromCache, setIsFromCache] = useState(false);
  const isOnline = useOnlineStatus();

  const fetchProducts = useCallback(
    async (category?: string, query?: string) => {
      setLoading(true);

      if (isOnline) {
        try {
          const params = new URLSearchParams();
          if (category) params.set("category", category);
          if (query) params.set("search", query);
          params.set("limit", "50");

          const res = await fetch(`/api/products?${params}`);
          const data = await res.json();

          if (data.data) {
            setProducts(data.data);
            setIsFromCache(false);
            await cacheProducts(data.data);
          }
        } catch {
          const cached = await getCachedProducts();
          setProducts(cached as Product[]);
          setIsFromCache(true);
        }
      } else {
        const cached = await getCachedProducts();
        setProducts(cached as Product[]);
        setIsFromCache(true);
      }

      setLoading(false);
    },
    [isOnline]
  );

  const fetchCategories = useCallback(async () => {
    if (!isOnline) return;
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch {
      // Silently fail for categories
    }
  }, [isOnline]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(selectedCategory, search);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId, search);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Offline Banner */}
      {isFromCache && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <WifiOff className="h-4 w-4" />
          You&apos;re offline. Showing cached products. Checkout is unavailable.
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Browse our collection
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
          <button
            onClick={() => handleCategoryChange("")}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === ""
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
