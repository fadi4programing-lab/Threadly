import Link from "next/link";
import { Package, Heart, User, Store } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Threadly
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Store className="h-4 w-4" />
              Browse Shop
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-zinc-100 dark:bg-zinc-800"
            >
              <User className="h-4 w-4" />
              My Account
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 flex-1">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-4">
          {/* Sidebar */}
          <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:gap-1 sm:overflow-visible">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/dashboard/wishlist"
              className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
          </nav>

          {/* Content */}
          <div className="sm:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
