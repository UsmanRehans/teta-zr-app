"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface CookStats {
  activeListings: number;
  pendingOrders: number;
  todayOrders: number;
  acceptsOrders: boolean;
}

export default function CookDashboard() {
  const [stats, setStats] = useState<CookStats>({
    activeListings: 0,
    pendingOrders: 0,
    todayOrders: 0,
    acceptsOrders: true,
  });
  const [cookName, setCookName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { t, locale } = useTranslation();

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboard() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    setCookName(profile?.name || "Cook");

    const { data: cookProfile } = await supabase
      .from("cook_profiles")
      .select("id, accepts_orders")
      .eq("user_id", user.id)
      .single();

    if (!cookProfile) {
      router.push("/profile");
      return;
    }

    const { count: activeListings } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("cook_id", cookProfile.id)
      .eq("is_active", true);

    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("cook_id", cookProfile.id)
      .in("status", ["pending", "confirmed", "preparing"]);

    const today = new Date().toISOString().split("T")[0];
    const { count: todayOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("cook_id", cookProfile.id)
      .gte("created_at", today);

    setStats({
      activeListings: activeListings || 0,
      pendingOrders: pendingOrders || 0,
      todayOrders: todayOrders || 0,
      acceptsOrders: cookProfile.accepts_orders,
    });
    setLoading(false);
  }

  async function toggleAcceptOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const newValue = !stats.acceptsOrders;
    await supabase
      .from("cook_profiles")
      .update({ accepts_orders: newValue })
      .eq("user_id", user.id);

    setStats((prev) => ({ ...prev, acceptsOrders: newValue }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">{t("loading")}</p>
      </div>
    );
  }

  const arrow = locale === "ar" ? "←" : "→";

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-sm text-foreground/50 hover:text-foreground"
          >
            {t("signOut")}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("ahla")} {cookName} 👋</h1>
          <p className="text-sm text-foreground/50 mt-1">
            {t("heresYourKitchen")}
          </p>
        </div>

        {/* Status toggle */}
        <button
          onClick={toggleAcceptOrders}
          className={`w-full p-4 rounded-xl mb-6 flex items-center justify-between transition-colors ${
            stats.acceptsOrders
              ? "bg-primary/10 border-2 border-primary"
              : "bg-foreground/5 border-2 border-foreground/10"
          }`}
        >
          <div className="text-start">
            <p className="font-semibold">
              {stats.acceptsOrders ? t("acceptingOrders") : t("notAcceptingOrders")}
            </p>
            <p className="text-xs text-foreground/50">{t("tapToToggle")}</p>
          </div>
          <div
            className={`w-12 h-7 rounded-full p-0.5 transition-colors ${
              stats.acceptsOrders ? "bg-primary" : "bg-foreground/20"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                stats.acceptsOrders ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 text-center border border-foreground/5">
            <p className="text-2xl font-bold text-primary">
              {stats.activeListings}
            </p>
            <p className="text-xs text-foreground/50 mt-1">{t("activeDishes")}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-foreground/5">
            <p className="text-2xl font-bold text-primary">
              {stats.pendingOrders}
            </p>
            <p className="text-xs text-foreground/50 mt-1">{t("pending")}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-foreground/5">
            <p className="text-2xl font-bold text-primary">
              {stats.todayOrders}
            </p>
            <p className="text-xs text-foreground/50 mt-1">{t("today")}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <Link
            href="/listings"
            className="w-full p-4 bg-white rounded-xl border border-foreground/5 flex items-center justify-between hover:border-primary/20 transition-colors block"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🍽️</span>
              <div>
                <p className="font-semibold">{t("myDishes")}</p>
                <p className="text-xs text-foreground/50">
                  {t("addOrEditMenu")}
                </p>
              </div>
            </div>
            <span className="text-foreground/30">{arrow}</span>
          </Link>

          <Link
            href="/orders"
            className="w-full p-4 bg-white rounded-xl border border-foreground/5 flex items-center justify-between hover:border-primary/20 transition-colors block"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-semibold">{t("orders")}</p>
                <p className="text-xs text-foreground/50">
                  {t("viewManageOrders")}
                </p>
              </div>
            </div>
            <span className="text-foreground/30">{arrow}</span>
          </Link>

          <Link
            href="/profile"
            className="w-full p-4 bg-white rounded-xl border border-foreground/5 flex items-center justify-between hover:border-primary/20 transition-colors block"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">👤</span>
              <div>
                <p className="font-semibold">{t("profile")}</p>
                <p className="text-xs text-foreground/50">
                  {t("editCookProfile")}
                </p>
              </div>
            </div>
            <span className="text-foreground/30">{arrow}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
