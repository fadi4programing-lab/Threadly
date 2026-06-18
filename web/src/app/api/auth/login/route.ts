import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({ data, error: null });

  // Manually set auth cookies on the response
  if (data.session?.access_token && data.session?.refresh_token) {
    const expires = data.session.expires_at
      ? new Date(data.session.expires_at * 1000)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    response.cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires,
    });
    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires,
    });
  }

  return response;
}
