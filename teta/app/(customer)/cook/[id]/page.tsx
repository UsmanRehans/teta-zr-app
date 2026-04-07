"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DishCard from "@/components/listings/DishCard";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface CookProfile {
  name: string;
  bio: string | null;
  avatar_url: string | null;
  address_hint: string | null;
  specialties: string[] | null;
  avg_rating: number;
  total_reviews: number;
  accepts_orders: boolean;
}

interface Listing {
  id: string;
  name: string;
  description: string | null;
  photo_urls: string[] | null;
  price_usd: number | null;
  is_free: boolean;
  portions_available: number;
  prep_time_mins: number;
  dietary_tags: string[] | null;
}

interface CartItem {
  listing: Listing;
  quantity: number;
}

export default function CookPage() {
  const { id } = useParams();
  const [cook, setCook] = useState<CookProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { t, locale } = useTranslation();

  useEffect(() => {
    loadCook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadCook() {
    const { data: cookProfile } = await supabase
      .from("cook_profiles")
      .select(
        `
        address_hint,
        specialties,
        avg_rating,
        total_reviews,
        accepts_orders,
        profiles!cook_profiles_user_id_fkey (name, bio, avatar_url)
      `
      )
      .eq("id", id)
      .single();

    if (!cookProfile) {
      router.push("/browse");
      return;
    }

    const profile = cookProfile.profiles as unknown as {
      name: string;
      bio: string | null;
      avatar_url: string | null;
    };

    setCook({
      name: profile?.name || "Cook",
      bio: profile?.bio || null,
      avatar_url: profile?.avatar_url || null,
      address_hint: cookProfile.address_hint,
      specialties: cookProfile.specialties,
      avg_rating: Number(cookProfile.avg_rating),
      total_reviews: cookProfile.total_reviews,
      accepts_orders: cookProfile.accepts_orders,
    });

    const { data: listingsData } = await supabase
      .from("listings")
      .select(
        "id, name, description, photo_urls, price_usd, is_free, portions_available, prep_time_mins, dietary_tags"
      )
      .eq("cook_id", id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setListings(listingsData || []);
    setLoading(false);
  }

  function addToCart(listing: Listing) {
    setCart((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id
            ? { ...item, quantity: Math.min(item.quantity + 1, listing.portions_available) }
            : item
        );
      }
      return [...prev, { listing, quantity: 1 }];
    });
  }

  function removeFromCart(listingId: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.listing.id === listingId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.listing.id === listingId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.listing.id !== listingId);
    });
  }

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + (item.listing.is_free ? 0 : (item.listing.price_usd || 0) * item.quantity),
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const backArrow = locale === "ar" ? "→" : "←";

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">{t("loading")}</p>
      </div>
    );
  }

  if (!cook) return null;

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="px-6 py-4 border-b border-foreground/5">
        <div className="flex items-center gap-3">
          <Link
            href="/browse"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-foreground/10"
          >
            {backArrow}
          </Link>
          <span className="text-lg font-bold">{cook.name}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6">
        {/* Cook info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {cook.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cook.avatar_url}
                alt={cook.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">👩‍🍳</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{cook.name}</h1>
            {cook.address_hint && (
              <p className="text-sm text-foreground/50">📍 {cook.address_hint}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              {cook.avg_rating > 0 && (
                <span className="text-sm">
                  ⭐ {cook.avg_rating} ({cook.total_reviews})
                </span>
              )}
              {!cook.accepts_orders && (
                <span className="text-xs px-2 py-0.5 bg-foreground/5 rounded-full text-foreground/40">
                  {t("notAccepting")}
                </span>
              )}
            </div>
          </div>
        </div>

        {cook.bio && (
          <p className="text-sm text-foreground/60 mb-4" dir="auto">
            {cook.bio}
          </p>
        )}

        {cook.specialties && cook.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {cook.specialties.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 bg-primary/5 text-primary rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Dishes */}
        <h2 className="text-lg font-bold mb-4">
          {t("todaysMenu")} ({listings.length})
        </h2>

        {listings.length === 0 ? (
          <p className="text-foreground/50 text-center py-8">
            {t("noDishesAvailable")}
          </p>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => {
              const inCart = cart.find((item) => item.listing.id === listing.id);
              return (
                <DishCard
                  key={listing.id}
                  listing={listing}
                  quantity={inCart?.quantity || 0}
                  onAdd={() => addToCart(listing)}
                  onRemove={() => removeFromCart(listing.id)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-foreground/10 px-6 py-4 safe-area-bottom">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => {
                // Store cart in sessionStorage for the order page
                sessionStorage.setItem(
                  "teta_cart",
                  JSON.stringify({ cookId: id, items: cart })
                );
                router.push(`/my-orders/new`);
              }}
              className="w-full py-3 bg-primary text-white font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <span>
                {t("viewOrder")} ({cartCount} {cartCount === 1 ? t("item") : t("items")})
              </span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
