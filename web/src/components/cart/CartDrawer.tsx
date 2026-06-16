"use client";

import { useEffect, useState } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cart", handleOpen);
    return () => window.removeEventListener("open-cart", handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl dark:bg-zinc-900">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Cart ({itemCount})</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <ShoppingBag className="h-12 w-12 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="rounded-full border border-zinc-200 p-1 hover:bg-zinc-50 dark:border-zinc-700"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="rounded-full border border-zinc-200 p-1 hover:bg-zinc-50 dark:border-zinc-700"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              removeItem(item.product_id, item.size, item.color)
                            }
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Total
                </span>
                <span className="text-lg font-bold">${total.toFixed(2)}</span>
              </div>

              {!isOnline ? (
                <p className="mb-3 text-center text-xs text-amber-600 bg-amber-50 rounded-lg p-2 dark:bg-amber-900/20">
                  You are offline. Checkout is available when you&apos;re online.
                </p>
              ) : null}

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className={isOnline ? "" : "pointer-events-none opacity-50"}
              >
                <Button className="w-full" disabled={!isOnline}>
                  {isOnline ? "Checkout (COD)" : "Offline - No Checkout"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
