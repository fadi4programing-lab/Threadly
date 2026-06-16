"use client";

import { useState, useEffect, useCallback } from "react";
interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  profile: {
    full_name: string;
    phone: string;
    role: string;
  };
}

export default function AdminUsersPage() {
  const [users] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    // We need a dedicated API for this, for now we'll use the orders to get user info
    // This is a placeholder - in production you'd have a proper users API
    const res = await fetch("/api/admin/stats");
    await res.json();
    // For now, we'll show a message that this feature needs a users API
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Users</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-500">
            User management requires a dedicated API endpoint.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Users are managed through Supabase Auth. Check your Supabase dashboard for user management.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">
                    User
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-zinc-500">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {user.profile?.full_name || "No name"}
                        </p>
                        <p className="text-xs text-zinc-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {user.profile?.phone || "-"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {user.profile?.role || "user"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
