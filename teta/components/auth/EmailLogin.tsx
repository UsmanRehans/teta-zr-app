"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleaned = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setError(t("invalidEmail"));
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: cleaned,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(`/verify?email=${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          {t("emailAddress")}
        </label>
        <input
          id="email"
          type="email"
          dir="auto"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="neu-input"
          autoComplete="email"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="neu-btn-primary"
      >
        {loading ? t("sendingCode") : t("sendCode")}
      </button>
    </form>
  );
}
