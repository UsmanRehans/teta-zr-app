"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function RoleSelectionPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "cook" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !name.trim()) return;
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("sessionExpired"));
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      name: name.trim(),
      email: user.email || "",
      role,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (role === "cook") {
      // Create empty cook profile
      await supabase.from("cook_profiles").insert({
        user_id: user.id,
      });
      router.push("/profile");
    } else {
      router.push("/browse");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs text-center mb-8">
          <p className="text-4xl mb-3">✨</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("almostThere")}
          </h1>
          <p className="text-sm text-sub">
            {t("tellUsAbout")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground/70 mb-1"
            >
              {t("yourName")}
            </label>
            <input
              id="name"
              type="text"
              dir="auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="neu-input"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground/70 mb-3">
              {t("iWantTo")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`p-4 text-center transition-all ${
                  role === "customer"
                    ? "neu-card"
                    : "neu-raised-sm"
                }`}
              >
                <p className="text-2xl mb-1">🍽️</p>
                <p className="font-semibold text-sm">{t("orderFood")}</p>
              </button>
              <button
                type="button"
                onClick={() => setRole("cook")}
                className={`p-4 text-center transition-all ${
                  role === "cook"
                    ? "neu-card"
                    : "neu-raised-sm"
                }`}
              >
                <p className="text-2xl mb-1">👩‍🍳</p>
                <p className="font-semibold text-sm">{t("sellMyFood")}</p>
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !role || !name.trim()}
            className="neu-btn-primary"
          >
            {loading ? t("settingUp") : t("letsGo")}
          </button>
        </form>
      </main>
    </div>
  );
}
