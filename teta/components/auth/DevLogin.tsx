"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function DevLogin() {
  const [loading, setLoading] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

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
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} className="pt-6">
        <p className="text-xs text-sub text-center mb-3 tracking-wide uppercase font-semibold">
          {t("devMode")}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => devSignIn("cook")}
            disabled={!!loading}
            className="flex-1 neu-chip"
          >
            {loading === "cook" ? t("signingIn") : t("signInAsCook")}
          </button>
          <button
            onClick={() => devSignIn("customer")}
            disabled={!!loading}
            className="flex-1 neu-chip"
          >
            {loading === "customer" ? t("signingIn") : t("signInAsCustomer")}
          </button>
        </div>
      </div>
    </div>
  );
}
