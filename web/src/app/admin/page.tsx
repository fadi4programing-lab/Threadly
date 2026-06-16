"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

interface Stats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Users",
      value: stats.users,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`rounded-full p-3 ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
