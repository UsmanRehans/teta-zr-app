"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DevLogin() {
  const [loading, setLoading] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function devSignIn(role: "cook" | "customer") {
    setLoading(role);

    const email =
      role === "cook" ? "testcook@teta.dev" : "testcustomer@teta.dev";

    const res = await fetch("/api/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      setLoading("");
      return;
    }

    // Set the session in the browser client
    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    if (role === "cook") {
      router.push("/dashboard");
    } else {
      router.push("/browse");
    }
  }

  return (
    <div className="mt-8 w-full max-w-xs">
      <div className="border-t border-foreground/10 pt-6">
        <p className="text-xs text-foreground/30 text-center mb-3">
          Dev mode — quick sign in
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => devSignIn("cook")}
            disabled={!!loading}
            className="flex-1 py-2.5 px-4 bg-foreground/5 text-foreground/70 text-sm font-medium rounded-full hover:bg-foreground/10 transition-colors disabled:opacity-50"
          >
            {loading === "cook" ? "Signing in..." : "Sign in as Cook"}
          </button>
          <button
            onClick={() => devSignIn("customer")}
            disabled={!!loading}
            className="flex-1 py-2.5 px-4 bg-foreground/5 text-foreground/70 text-sm font-medium rounded-full hover:bg-foreground/10 transition-colors disabled:opacity-50"
          >
            {loading === "customer" ? "Signing in..." : "Sign in as Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
