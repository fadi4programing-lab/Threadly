import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/products" className="hover:text-black dark:hover:text-white">All Products</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-black dark:hover:text-white">Featured</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link href="/login" className="hover:text-black dark:hover:text-white">Login</Link></li>
              <li><Link href="/register" className="hover:text-black dark:hover:text-white">Register</Link></li>
              <li><Link href="/dashboard" className="hover:text-black dark:hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Help</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><span>Cash on Delivery</span></li>
              <li><span>Free Returns</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><span>support@clothesstore.com</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500 dark:border-zinc-800">
          2026 Threadly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
