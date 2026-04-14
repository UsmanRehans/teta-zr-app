"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useDemo } from "@/lib/demo/DemoContext";
import { DEMO_COOKS, DEMO_LISTINGS, DEMO_ORDERS } from "@/lib/demo/mockData";
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
  const { isDemo, demoUser } = useDemo();

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDashboard() {
    if (isDemo && demoUser) {
      // Demo mode
      const demoCook = DEMO_COOKS[0]; // Teta Maryam
      setCookName(demoCook.name);
      const activeListings = DEMO_LISTINGS.filter(
        (l) => l.cook_id === demoCook.id && l.is_active
      ).length;
      const pendingOrders = DEMO_ORDERS.filter(
        (o) => o.cook_id === demoCook.id && ["pending", "confirmed", "preparing"].includes(o.status)
      ).length;
      const todayOrders = DEMO_ORDERS.filter(
        (o) => o.cook_id === demoCook.id
      ).length;
      setStats({
        activeListings,
        pendingOrders,
        todayOrders,
        acceptsOrders: demoCook.accepts_orders,
      });
      setLoading(false);
      return;
    }

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
    if (isDemo) {
      setStats((prev) => ({ ...prev, acceptsOrders: !prev.acceptsOrders }));
      return;
    }

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/50">{t("loading")}</p>
      </div>
    );
  }

  const arrow = locale === "ar" ? "←" : "→";

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={async () => {
              if (!isDemo) {
                await supabase.auth.signOut();
              }
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
          className={`w-full p-4 rounded-2xl mb-6 flex items-center justify-between transition-all neu-card ${
            stats.acceptsOrders
              ? "neu-inset-deep"
              : "opacity-75"
          }`}
        >
          <div className="text-start">
            <p className="font-semibold">
              {stats.acceptsOrders ? t("acceptingOrders") : t("notAcceptingOrders")}
            </p>
            <p className="text-xs text-foreground/50">{t("tapToToggle")}</p>
          </div>
          <div
            className={`w-12 h-7 rounded-full p-0.5 transition-all neu-circle ${
              stats.acceptsOrders ? "bg-primary" : "bg-foreground/20"
            }`}
          >
            <div
              className={`w-6 h-6 bg-background rounded-full shadow-sm transition-transform ${
                stats.acceptsOrders ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="neu-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {stats.activeListings}
            </p>
            <p className="text-xs text-foreground/50 mt-1">{t("activeDishes")}</p>
          </div>
          <div className="neu-card rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {stats.pendingOrders}
            </p>
            <p className="text-xs text-foreground/50 mt-1">{t("pending")}</p>
          </div>
          <div className="neu-card rounded-2xl p-4 text-center">
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
            className="w-full p-4 neu-card rounded-2xl flex items-center justify-between hover:neu-inset transition-all block"
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
            className="w-full p-4 neu-card rounded-2xl flex items-center justify-between hover:neu-inset transition-all block"
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
            className="w-full p-4 neu-card rounded-2xl flex items-center justify-between hover:neu-inset transition-all block"
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
