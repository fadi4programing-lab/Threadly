import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ data: null, error: "Forbidden" }, { status: 403 });
  }

  const [productsCount, ordersCount, usersCount, revenueResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total").in("status", ["confirmed", "shipped", "delivered"]),
  ]);

  const revenue = revenueResult.data?.reduce((sum, order) => sum + order.total, 0) || 0;

  return NextResponse.json({
    data: {
      products: productsCount.count || 0,
      orders: ordersCount.count || 0,
      users: usersCount.count || 0,
      revenue,
    },
    error: null,
  });
}
