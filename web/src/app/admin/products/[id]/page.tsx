"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input } from "@/components/ui";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  sale_price: string;
  category_id: string;
  images: string;
  sizes: string;
  colors: string;
  stock: string;
  is_active: boolean;
  is_featured: boolean;
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    category_id: "",
    images: "",
    sizes: "",
    colors: "",
    stock: "",
    is_active: true,
    is_featured: false,
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    if (isNew) return;
    const res = await fetch(`/api/products/${params.id}`);
    const data = await res.json();
    if (data.data) {
      const p = data.data;
      setForm({
        name: p.name || "",
        description: p.description || "",
        price: String(p.price || ""),
        sale_price: p.sale_price ? String(p.sale_price) : "",
        category_id: p.category_id || "",
        images: (p.images || []).join(", "),
        sizes: (p.sizes || []).join(", "),
        colors: (p.colors || []).join(", "),
        stock: String(p.stock || ""),
        is_active: p.is_active ?? true,
        is_featured: p.is_featured ?? false,
      });
    }
  }, [isNew, params.id]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.data || []);
  }, []);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [fetchProduct, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      category_id: form.category_id || null,
      images: form.images
        ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      sizes: form.sizes
        ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      colors: form.colors
        ? form.colors.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      stock: parseInt(form.stock) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    const url = isNew ? "/api/products" : `/api/products/${params.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/admin/products");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">
        {isNew ? "Add Product" : "Edit Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <Input
          label="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Input
            label="Sale Price ($)"
            type="number"
            step="0.01"
            value={form.sale_price}
            onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Category
          </label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Images (comma-separated URLs)"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Sizes (comma-separated)"
            value={form.sizes}
            onChange={(e) => setForm({ ...form, sizes: e.target.value })}
            placeholder="S, M, L, XL"
          />
          <Input
            label="Colors (comma-separated)"
            value={form.colors}
            onChange={(e) => setForm({ ...form, colors: e.target.value })}
            placeholder="Black, White, Red"
          />
        </div>

        <Input
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-zinc-300"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="rounded border-zinc-300"
            />
            Featured
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
