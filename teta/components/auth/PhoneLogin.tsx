"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("+961");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleaned = phone.replace(/\s/g, "");
    if (!/^\+961\d{7,8}$/.test(cleaned)) {
      setError(t("invalidPhone"));
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: cleaned,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(`/verify?phone=${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          {t("phoneNumber")}
        </label>
        <input
          id="phone"
          type="tel"
          dir="auto"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("phonePlaceholder")}
          className="neu-input"
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
