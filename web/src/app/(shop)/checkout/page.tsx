"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/hooks/useCart";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { Button, Input } from "@/components/ui";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const isOnline = useOnlineStatus();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOnline) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold">Offline</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Checkout requires an internet connection.
        </p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold">Cart is empty</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Add some items to your cart first.
        </p>
        <Button onClick={() => router.push("/products")} className="mt-4">
          Browse Products
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold">Order Placed!</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-center">
          Your order has been placed successfully.
          <br />
          Pay with Cash on Delivery when it arrives.
        </p>
        <Button onClick={() => router.push("/dashboard/orders")} className="mt-6">
          View Orders
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        total,
        address,
        phone,
        notes,
      }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    clearCart();
    setSuccess(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Cash on Delivery
      </p>

      {/* Order Summary */}
      <div className="mt-8 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-medium mb-3">Order Summary</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.size}-${item.color}`}
              className="flex justify-between text-sm"
            >
              <span className="text-zinc-600 dark:text-zinc-400">
                {item.name} x{item.quantity} ({item.size}/{item.color})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <Input
          label="Delivery Address"
          placeholder="123 Main St, City, Country"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 234 567 890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <Input
          label="Notes (optional)"
          placeholder="Any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order (COD)"}
        </Button>
      </form>
    </div>
  );
}
