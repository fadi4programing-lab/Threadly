"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products?limit=100");
    const data = await res.json();
    setProducts(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 text-left font-medium text-zinc-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-zinc-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-zinc-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            {product.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0]}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                                N/A
                              </div>
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <Badge variant={product.is_active ? "success" : "danger"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                      N/A
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-zinc-500">Stock: {product.stock}</span>
                    <Badge variant={product.is_active ? "success" : "danger"}>
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
