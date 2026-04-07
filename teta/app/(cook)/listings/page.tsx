"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadListings() {
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-primary font-medium hover:text-primary-dark"
        >
          Dashboard
        </Link>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Dishes</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors"
          >
            + Add dish
          </button>
        </div>

        {listings.length === 0 && !showCreate ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍳</p>
            <p className="text-foreground/50 mb-4">No dishes yet</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
            >
              Add your first dish
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-colors ${
                  listing.is_active
                    ? "border-foreground/5"
                    : "border-foreground/5 opacity-60"
                }`}
              >
                <div className="w-16 h-16 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                      ? "Free (donation)"
                      : `$${listing.price_usd}`}{" "}
                    · {listing.portions_available} portions
                  </p>
                </div>
                <button
                  onClick={() => toggleActive(listing.id, listing.is_active)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    listing.is_active
                      ? "bg-primary/10 text-primary"
                      : "bg-foreground/5 text-foreground/40"
                  }`}
                >
                  {listing.is_active ? "Active" : "Hidden"}
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
}: {
  cookProfileId: string;
  onClose: () => void;
  onCreated: (listing: Listing) => void;
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

  const ALLERGEN_OPTIONS = ["Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy"];
  const DIETARY_OPTIONS = ["Halal", "Vegan", "Vegetarian", "Gluten-free"];

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      <div className="bg-cream rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-cream px-6 py-4 border-b border-foreground/5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Add a dish</h2>
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
              Photo
            </label>
            {photoUrl ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden">
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
              <label className="w-full h-32 border-2 border-dashed border-foreground/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-colors">
                <span className="text-2xl mb-1">📷</span>
                <span className="text-sm text-foreground/40">
                  {uploading ? "Uploading..." : "Tap to add a photo"}
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
              Dish name
            </label>
            <input
              type="text"
              dir="auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kibbeh, Fattoush, Mana'eesh"
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Description
            </label>
            <textarea
              dir="auto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this dish special?"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          {/* Price / Free toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground/70">
                Price
              </label>
              <button
                type="button"
                onClick={() => setIsFree(!isFree)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isFree
                    ? "bg-primary text-white"
                    : "bg-foreground/5 text-foreground/50"
                }`}
              >
                {isFree ? "Free meal ❤️" : "Mark as free"}
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
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            )}
          </div>

          {/* Portions & Prep time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Portions
              </label>
              <input
                type="number"
                min="1"
                value={portions}
                onChange={(e) => setPortions(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Prep time (min)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Select category</option>
              <option value="mezza">Mezza</option>
              <option value="main">Main Course</option>
              <option value="breakfast">Breakfast</option>
              <option value="pastry">Pastry</option>
              <option value="dessert">Dessert</option>
              <option value="drink">Drink</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Allergens
            </label>
            <div className="flex flex-wrap gap-2">
              {ALLERGEN_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleTag(allergens, a.toLowerCase(), setAllergens)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    allergens.includes(a.toLowerCase())
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-white border border-foreground/10 text-foreground/60"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary tags */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Dietary
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    toggleTag(dietaryTags, d.toLowerCase(), setDietaryTags)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    dietaryTags.includes(d.toLowerCase())
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-white border border-foreground/10 text-foreground/60"
                  }`}
                >
                  {d}
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
            <span className="text-sm text-foreground/70">Pickup only</span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Adding..." : "Add dish"}
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
