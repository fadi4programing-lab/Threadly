"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function HeroButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex justify-center gap-4 mt-8">
      <Link
        href="/products"
        className="px-8 py-3 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Browse Collection
      </Link>
      {isLoggedIn ? (
        <Link
          href="/dashboard"
          className="px-8 py-3 border border-black/[.08] rounded-full hover:bg-black/[.04] transition-colors dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          My Account
        </Link>
      ) : (
        <Link
          href="/login"
          className="px-8 py-3 border border-black/[.08] rounded-full hover:bg-black/[.04] transition-colors dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
