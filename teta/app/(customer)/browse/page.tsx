"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CookMap from "@/components/map/CookMap";

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

  useEffect(() => {
    loadCooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCooks() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">Finding cooks near you...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-foreground/5 bg-cream">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="text-2xl font-bold text-primary">
            teta
          </Link>
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
            My Orders
          </button>
        </div>

        {/* Search & filters */}
        <div className="flex gap-2">
          <input
            type="text"
            dir="auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search cooks or cuisines..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-foreground/10 bg-white text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex bg-white rounded-xl border border-foreground/10 overflow-hidden">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-2 text-sm ${
                viewMode === "map"
                  ? "bg-primary text-white"
                  : "text-foreground/50"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-foreground/50"
              }`}
            >
              List
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
                <p className="text-foreground/50">No cooks found</p>
              </div>
            ) : (
              filteredCooks.map((cook) => (
                <Link
                  key={cook.id}
                  href={`/cook/${cook.id}`}
                  className="bg-white rounded-xl border border-foreground/5 p-4 flex items-center gap-4 hover:border-primary/20 transition-colors block"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {cook.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cook.avatar_url}
                        alt={cook.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👩‍🍳</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{cook.name}</p>
                      {cook.avg_rating > 0 && (
                        <span className="text-xs text-foreground/50">
                          ⭐ {cook.avg_rating}
                        </span>
                      )}
                    </div>
                    {cook.address_hint && (
                      <p className="text-sm text-foreground/50">
                        📍 {cook.address_hint}
                      </p>
                    )}
                    {cook.specialties && cook.specialties.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {cook.specialties.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-0.5 bg-primary/5 text-primary rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-foreground/30">→</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
