"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CookMap from "@/components/map/CookMap";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { useDemo } from "@/lib/demo/DemoContext";
import { DEMO_COOKS, DEMO_LISTINGS } from "@/lib/demo/mockData";

interface Cook {
  id: string;
  name: string;
  address_hint: string | null;
  specialties: string[] | null;
  avg_rating: number;
  accepts_orders: boolean;
  lng: number;
  lat: number;
  avatar_url: string | null;
}

type ViewMode = "map" | "list";

export default function BrowsePage() {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [filter, setFilter] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t, locale } = useTranslation();
  const { isDemo } = useDemo();

  useEffect(() => {
    loadCooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCooks() {
    if (isDemo) {
      // Use mock data in demo mode
      const mapped = DEMO_COOKS.map((c) => ({
        id: c.id,
        name: c.name,
        address_hint: c.address_hint,
        specialties: c.specialties,
        avg_rating: c.avg_rating,
        accepts_orders: c.accepts_orders,
        lng: c.longitude,
        lat: c.latitude,
        avatar_url: c.avatar_url,
      }));
      setCooks(mapped);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("cook_profiles")
      .select(
        `
        id,
        address_hint,
        specialties,
        avg_rating,
        accepts_orders,
        location,
        user_id,
        profiles!cook_profiles_user_id_fkey (name, avatar_url)
      `
      )
      .eq("accepts_orders", true);

    if (data) {
      const mapped = data
        .filter((c) => c.location)
        .map((c) => {
          const loc = c.location as { coordinates?: number[] };
          const profile = c.profiles as unknown as {
            name: string;
            avatar_url: string | null;
          };
          return {
            id: c.id,
            name: profile?.name || "Cook",
            address_hint: c.address_hint,
            specialties: c.specialties,
            avg_rating: Number(c.avg_rating),
            accepts_orders: c.accepts_orders,
            lng: loc.coordinates?.[0] || 35.5018,
            lat: loc.coordinates?.[1] || 33.8938,
            avatar_url: profile?.avatar_url || null,
          };
        });
      setCooks(mapped);
    }
    setLoading(false);
  }

  const handleCookClick = useCallback(
    (cookId: string) => {
      router.push(`/cook/${cookId}`);
    },
    [router]
  );

  const filteredCooks = filter
    ? cooks.filter(
        (c) =>
          c.specialties?.some((s) =>
            s.toLowerCase().includes(filter.toLowerCase())
          ) || c.name.toLowerCase().includes(filter.toLowerCase())
      )
    : cooks;

  const arrow = locale === "ar" ? "←" : "→";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sub">{t("findingCooks")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-foreground/5 bg-background">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-2xl font-bold text-primary">
            teta
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button
              onClick={async () => {
                const {
                  data: { user },
                } = await supabase.auth.getUser();
                if (user) {
                  router.push("/my-orders");
                } else {
                  router.push("/login");
                }
              }}
              className="text-sm text-primary font-medium"
            >
              {t("myOrders")}
            </button>
          </div>
        </div>

        {/* Search & filters */}
        <div className="flex gap-2">
          <input
            type="text"
            dir="auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 neu-input text-sm"
          />
          <div className="flex neu-card overflow-hidden">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-2 text-sm font-medium transition-all ${
                viewMode === "map"
                  ? "neu-chip-active text-primary"
                  : "text-sub"
              }`}
            >
              {t("map")}
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm font-medium transition-all ${
                viewMode === "list"
                  ? "neu-chip-active text-primary"
                  : "text-sub"
              }`}
            >
              {t("list")}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {viewMode === "map" ? (
          <div className="h-[calc(100vh-140px)]">
            <CookMap cooks={filteredCooks} onCookClick={handleCookClick} />
          </div>
        ) : (
          <div className="max-w-md mx-auto px-6 py-4 space-y-3">
            {filteredCooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-sub">{t("noCooksFound")}</p>
              </div>
            ) : (
              filteredCooks.map((cook) => (
                <Link
                  key={cook.id}
                  href={`/cook/${cook.id}`}
                  className="neu-card flex items-center gap-4 hover:shadow-lg transition-shadow block"
                >
                  <div className="w-14 h-14 neu-well flex-shrink-0">
                    {cook.avatar_url && cook.avatar_url !== "👩‍🍳" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cook.avatar_url}
                        alt={cook.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{cook.avatar_url || "👩‍🍳"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{cook.name}</p>
                      {cook.avg_rating > 0 && (
                        <span className="text-xs text-primary">
                          ⭐ {cook.avg_rating}
                        </span>
                      )}
                    </div>
                    {cook.address_hint && (
                      <p className="text-sm text-sub">
                        📍 {cook.address_hint}
                      </p>
                    )}
                    {cook.specialties && cook.specialties.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {cook.specialties.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-0.5 neu-chip text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sub">{arrow}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
