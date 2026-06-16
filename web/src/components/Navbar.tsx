"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-lg sm:text-xl font-bold">
          Clothes Store
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Products
          </Link>
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs text-zinc-500">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/products"
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            onClick={() => {
              const event = new CustomEvent("open-cart");
              window.dispatchEvent(event);
            }}
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white dark:bg-white dark:text-black">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-black md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Products
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              My Account
            </Link>
            <Link
              href="/dashboard/orders"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Orders
            </Link>
            <Link
              href="/dashboard/wishlist"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Wishlist
            </Link>
            <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />
            <div className="flex items-center gap-2 px-3 py-2.5">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-zinc-500">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
