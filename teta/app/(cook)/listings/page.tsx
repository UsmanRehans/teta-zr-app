"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useDemo } from "@/lib/demo/DemoContext";
import { DEMO_COOKS, DEMO_LISTINGS } from "@/lib/demo/mockData";

interface Listing {
  id: string;
  name: string;
  price_usd: number | null;
  is_free: boolean;
  portions_available: number;
  is_active: boolean;
  photo_urls: string[] | null;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [cookProfileId, setCookProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const { isDemo, demoUser } = useDemo();

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadListings() {
    if (isDemo && demoUser) {
      // Demo mode
      const demoCook = DEMO_COOKS[0]; // Teta Maryam
      setCookProfileId(demoCook.id);
      const demoListings = DEMO_LISTINGS.filter((l) => l.cook_id === demoCook.id);
      const mapped = demoListings.map((l) => ({
        id: l.id,
        name: l.name,
        price_usd: l.price_usd,
        is_free: l.is_free,
        portions_available: l.portions_available,
        is_active: l.is_active,
        photo_urls: [] as string[],
      }));
      setListings(mapped);
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

    const { data: cookProfile } = await supabase
      .from("cook_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cookProfile) {
      router.push("/profile");
      return;
    }

    setCookProfileId(cookProfile.id);

    const { data } = await supabase
      .from("listings")
      .select("id, name, price_usd, is_free, portions_available, is_active, photo_urls")
      .eq("cook_id", cookProfile.id)
      .order("created_at", { ascending: false });

    setListings(data || []);
    setLoading(false);
  }

  async function toggleActive(id: string, currentActive: boolean) {
    if (isDemo) {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_active: !currentActive } : l))
      );
      return;
    }

    await supabase
      .from("listings")
      .update({ is_active: !currentActive })
      .eq("id", id);

    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, is_active: !currentActive } : l))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/50">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-primary font-medium hover:text-primary-dark"
        >
          {t("dashboard")}
        </Link>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("myDishes")}</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="neu-btn-primary px-4 py-2 text-sm font-semibold rounded-full"
          >
            {t("addDish")}
          </button>
        </div>

        {listings.length === 0 && !showCreate ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍳</p>
            <p className="text-foreground/50 mb-4">{t("noDishesYet")}</p>
            <button
              onClick={() => setShowCreate(true)}
              className="neu-btn-primary px-6 py-3 font-semibold rounded-full"
            >
              {t("addFirstDish")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className={`neu-card rounded-2xl p-4 flex items-center gap-4 transition-all ${
                  !listing.is_active ? "opacity-60" : ""
                }`}
              >
                <div className="neu-well rounded-xl p-2 w-16 h-16 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {listing.photo_urls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={listing.photo_urls[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🍽️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{listing.name}</p>
                  <p className="text-sm text-foreground/50">
                    {listing.is_free
                      ? t("freeDonation")
                      : `$${listing.price_usd}`}{" "}
                    · {listing.portions_available} {t("portions")}
                  </p>
                </div>
                <button
                  onClick={() => toggleActive(listing.id, listing.is_active)}
                  className={`neu-chip rounded-full text-xs font-medium px-3 py-1 transition-all ${
                    listing.is_active ? "neu-chip-active" : ""
                  }`}
                >
                  {listing.is_active ? t("active") : t("hidden")}
                </button>
              </div>
            ))}
          </div>
        )}

        {showCreate && cookProfileId && (
          <CreateListingModal
            cookProfileId={cookProfileId}
            onClose={() => setShowCreate(false)}
            onCreated={(listing) => {
              setListings((prev) => [listing, ...prev]);
              setShowCreate(false);
            }}
            isDemo={isDemo}
          />
        )}
      </main>
    </div>
  );
}

function CreateListingModal({
  cookProfileId,
  onClose,
  onCreated,
  isDemo,
}: {
  cookProfileId: string;
  onClose: () => void;
  onCreated: (listing: Listing) => void;
  isDemo: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [portions, setPortions] = useState("1");
  const [prepTime, setPrepTime] = useState("60");
  const [category, setCategory] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const { t } = useTranslation();

  const ALLERGEN_OPTIONS: { key: string; label: string }[] = [
    { key: "nuts", label: t("allergenNuts") },
    { key: "dairy", label: t("allergenDairy") },
    { key: "gluten", label: t("allergenGluten") },
    { key: "shellfish", label: t("allergenShellfish") },
    { key: "eggs", label: t("allergenEggs") },
    { key: "soy", label: t("allergenSoy") },
  ];

  const DIETARY_OPTIONS: { key: string; label: string }[] = [
    { key: "halal", label: t("dietHalal") },
    { key: "vegan", label: t("dietVegan") },
    { key: "vegetarian", label: t("dietVegetarian") },
    { key: "gluten-free", label: t("dietGlutenFree") },
  ];

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (isDemo) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Compress image client-side
    const compressed = await compressImage(file, 1200, 0.8);

    const ext = file.name.split(".").pop();
    const path = `dishes/${cookProfileId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("dishes")
      .upload(path, compressed, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("dishes").getPublicUrl(path);

    setPhotoUrl(publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    if (isDemo) {
      // Demo mode - just create a mock listing
      const mockListing: Listing = {
        id: `listing-${Date.now()}`,
        name: name.trim(),
        price_usd: isFree ? null : parseFloat(priceUsd) || null,
        is_free: isFree,
        portions_available: parseInt(portions) || 1,
        is_active: true,
        photo_urls: photoUrl ? [photoUrl] : [],
      };
      onCreated(mockListing);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("listings")
      .insert({
        cook_id: cookProfileId,
        name: name.trim(),
        description: description.trim() || null,
        photo_urls: photoUrl ? [photoUrl] : [],
        price_usd: isFree ? null : parseFloat(priceUsd) || null,
        is_free: isFree,
        portions_available: parseInt(portions) || 1,
        prep_time_mins: parseInt(prepTime) || 60,
        category: category || null,
        allergens,
        dietary_tags: dietaryTags,
        pickup_only: pickupOnly,
      })
      .select("id, name, price_usd, is_free, portions_available, is_active, photo_urls")
      .single();

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    if (data) onCreated(data);
  }

  function toggleTag(list: string[], item: string, setter: (v: string[]) => void) {
    setter(
      list.includes(item) ? list.filter((t) => t !== item) : [...list, item]
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-background rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background px-6 py-4 border-b border-foreground/5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("addADish")}</h2>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {t("photo")}
            </label>
            {photoUrl ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden neu-well">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Dish"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl("")}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="neu-well w-full h-32 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:neu-inset transition-all">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-sm text-foreground/40">
                  {uploading ? t("uploading") : t("tapToAddPhoto")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("dishName")}
            </label>
            <input
              type="text"
              dir="auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("dishNamePlaceholder")}
              className="neu-input w-full px-4 py-3 rounded-xl text-foreground placeholder:text-foreground/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("description")}
            </label>
            <textarea
              dir="auto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={2}
              className="neu-input w-full px-4 py-3 rounded-xl text-foreground placeholder:text-foreground/30 resize-none"
            />
          </div>

          {/* Price / Free toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground/70">
                {t("price")}
              </label>
              <button
                type="button"
                onClick={() => setIsFree(!isFree)}
                className={`neu-chip px-3 py-1 rounded-full text-xs font-medium ${
                  isFree ? "neu-chip-active" : ""
                }`}
              >
                {isFree ? t("freeMeal") + " ❤️" : t("markAsFree")}
              </button>
            </div>
            {!isFree && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
                  $
                </span>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(e.target.value)}
                  placeholder="0.00"
                  className="neu-input w-full pl-8 pr-4 py-3 rounded-xl text-foreground placeholder:text-foreground/30"
                />
              </div>
            )}
          </div>

          {/* Portions & Prep time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                {t("portionsLabel")}
              </label>
              <input
                type="number"
                min="1"
                value={portions}
                onChange={(e) => setPortions(e.target.value)}
                className="neu-input w-full px-4 py-3 rounded-xl text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                {t("prepTime")}
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="neu-input w-full px-4 py-3 rounded-xl text-foreground"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="neu-input w-full px-4 py-3 rounded-xl text-foreground"
            >
              <option value="">{t("selectCategory")}</option>
              <option value="mezza">{t("catMezza")}</option>
              <option value="main">{t("catMain")}</option>
              <option value="breakfast">{t("catBreakfast")}</option>
              <option value="pastry">{t("catPastry")}</option>
              <option value="dessert">{t("catDessert")}</option>
              <option value="drink">{t("catDrink")}</option>
              <option value="other">{t("catOther")}</option>
            </select>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {t("allergens")}
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => toggleTag(allergens, a.key, setAllergens)}
                  className={`neu-chip px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    allergens.includes(a.key)
                      ? "neu-chip-active bg-red-100 text-red-700"
                      : ""
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary tags */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {t("dietary")}
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() =>
                    toggleTag(dietaryTags, d.key, setDietaryTags)
                  }
                  className={`neu-chip px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    dietaryTags.includes(d.key) ? "neu-chip-active" : ""
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup only */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pickupOnly}
              onChange={(e) => setPickupOnly(e.target.checked)}
              className="w-5 h-5 rounded border-foreground/20 accent-primary"
            />
            <span className="text-sm text-foreground/70">{t("pickupOnly")}</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="neu-btn-primary w-full py-3 px-6 font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t("adding") : t("addDish").replace("+ ", "")}
          </button>
        </form>
      </div>
    </div>
  );
}

function compressImage(
  file: File,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(blob || file),
        "image/jpeg",
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
}
