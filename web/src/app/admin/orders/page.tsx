"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui";
import { Order, OrderStatus } from "@/lib/types";

const statusColors: Record<OrderStatus, "default" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "danger",
};

const allStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
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

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString()}{" "}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </span>
                    <Badge variant={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Address:</span> {order.address}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Phone:</span> {order.phone}
                    </p>
                    {order.notes && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Notes:</span> {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-zinc-500">
                    {order.items.map((item, i) => (
                      <span key={i}>
                        {item.name} x{item.quantity} ({item.size}/{item.color})
                        {i < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 font-bold">${order.total.toFixed(2)}</p>
                </div>

                <div className="flex-shrink-0">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as OrderStatus)
                    }
                    className="w-full sm:w-auto rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    {allStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
