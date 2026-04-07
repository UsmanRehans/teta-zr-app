import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Dev-only endpoint — creates a test user and returns a session
// Remove this before going to production!
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { email, role } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Check if user exists, if not create them
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let user = existingUsers?.users.find((u) => u.email === email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: "testpassword123",
      email_confirm: true,
      user_metadata: { role },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    user = data.user;
  }

  // Create a profile if it doesn't exist
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      name: role === "cook" ? "Test Cook" : "Test Customer",
      phone: role === "cook" ? "+961700000001" : "+961700000002",
      role,
    });

    if (role === "cook") {
      await supabase.from("cook_profiles").insert({
        user_id: user.id,
        address_hint: "Hamra, Beirut",
        specialties: ["Mezza", "Grills", "Pastries"],
        accepts_orders: true,
        location: "SRID=4326;POINT(35.4788 33.8969)",
      });
    }
  }

  // Generate a session by signing in
  const { data: session, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password: "testpassword123",
    });

  if (signInError)
    return NextResponse.json({ error: signInError.message }, { status: 400 });

  return NextResponse.json({
    access_token: session.session?.access_token,
    refresh_token: session.session?.refresh_token,
    user: session.user,
  });
}
