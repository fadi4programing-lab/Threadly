"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui";

const statusColors: Record<OrderStatus, "default" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-1 font-medium">${order.total.toFixed(2)}</p>
                </div>
                <Badge variant={statusColors[order.status]}>
                  {order.status}
                </Badge>
              </div>
              <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {order.items.map((item, i) => (
                  <span key={i}>
                    {item.name} x{item.quantity}
                    {i < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
