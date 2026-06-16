"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";

interface UserProfile {
  id: string;
  email: string;
  profile: {
    full_name: string;
    phone: string;
    role: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/user", { signal: controller.signal });
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setUser(data.data);
      } catch {
        // ignore aborted requests
      } finally {
        setLoading(false);
      }
    }

    loadUser();
    return () => controller.abort();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Profile</h2>

      <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-500">Name</label>
            <p className="font-medium">{user.profile?.full_name || "Not set"}</p>
          </div>
          <div>
            <label className="text-sm text-zinc-500">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-zinc-500">Phone</label>
            <p className="font-medium">{user.profile?.phone || "Not set"}</p>
          </div>
          <div>
            <label className="text-sm text-zinc-500">Role</label>
            <p className="font-medium capitalize">{user.profile?.role || "user"}</p>
          </div>
        </div>
      </div>

      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
