"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LocationPicker from "@/components/map/LocationPicker";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function CookProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [addressHint, setAddressHint] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [deliveryRadius, setDeliveryRadius] = useState(2);
  const [lng, setLng] = useState(35.5018);
  const [lat, setLat] = useState(33.8938);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  const SPECIALTY_OPTIONS: { key: string; label: string }[] = [
    { key: "Mezza", label: t("specMezza") },
    { key: "Grills", label: t("specGrills") },
    { key: "Pastries", label: t("specPastries") },
    { key: "Saj & Manaqeesh", label: t("specSaj") },
    { key: "Soups & Stews", label: t("specSoups") },
    { key: "Desserts", label: t("specDesserts") },
    { key: "Salads", label: t("specSalads") },
    { key: "Breakfast", label: t("specBreakfast") },
    { key: "Vegan", label: t("specVegan") },
    { key: "Seafood", label: t("specSeafood") },
  ];

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, bio, avatar_url")
      .eq("id", user.id)
      .single();

    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
    }

    const { data: cookProfile } = await supabase
      .from("cook_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (cookProfile) {
      setAddressHint(cookProfile.address_hint || "");
      setSpecialties(cookProfile.specialties || []);
      setDeliveryRadius(cookProfile.delivery_radius_km || 2);
      if (cookProfile.location) {
        // PostGIS returns GeoJSON — parse the coordinates
        const point = cookProfile.location as { coordinates?: number[] };
        if (point.coordinates) {
          setLng(point.coordinates[0]);
          setLat(point.coordinates[1]);
        }
      }
    }
    setLoading(false);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    setAvatarUrl(publicUrl);
    setUploading(false);
  }

  function toggleSpecialty(spec: string) {
    setSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: name.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl || null,
      })
      .eq("id", user.id);

    if (profileError) {
      setError(profileError.message);
      setSaving(false);
      return;
    }

    // Update cook profile
    const { error: cookError } = await supabase
      .from("cook_profiles")
      .update({
        address_hint: addressHint.trim(),
        specialties,
        delivery_radius_km: deliveryRadius,
        location: `SRID=4326;POINT(${lng} ${lat})`,
      })
      .eq("user_id", user.id);

    if (cookError) {
      setError(cookError.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">{t("loadingProfile")}</p>
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
          {t("dashboard")}
        </Link>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("yourCookProfile")}</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">👩‍🍳</span>
              )}
            </div>
            <div>
              <label className="inline-block px-4 py-2 bg-white border border-foreground/10 rounded-lg text-sm font-medium cursor-pointer hover:bg-foreground/5 transition-colors">
                {uploading ? t("uploading") : t("uploadPhoto")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("name")}
            </label>
            <input
              type="text"
              dir="auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("nameCookPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("aboutYou")}
            </label>
            <textarea
              dir="auto"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("aboutPlaceholder")}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {t("yourLocation")}
            </label>
            <LocationPicker
              initialLng={lng}
              initialLat={lat}
              onLocationChange={(newLng, newLat) => {
                setLng(newLng);
                setLat(newLat);
              }}
            />
          </div>

          {/* Neighborhood hint */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("neighborhood")}
            </label>
            <input
              type="text"
              dir="auto"
              value={addressHint}
              onChange={(e) => setAddressHint(e.target.value)}
              placeholder={t("neighborhoodPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Delivery radius */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1">
              {t("deliveryRadius")} {deliveryRadius} {t("km")}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-foreground/40">
              <span>1 {t("km")}</span>
              <span>10 {t("km")}</span>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              {t("specialties")}
            </label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((spec) => (
                <button
                  key={spec.key}
                  type="button"
                  onClick={() => toggleSpecialty(spec.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    specialties.includes(spec.key)
                      ? "bg-primary text-white"
                      : "bg-white border border-foreground/10 text-foreground/70 hover:border-primary/30"
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm text-primary font-medium">
              {t("profileSaved")}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? t("saving") : t("saveProfile")}
          </button>
        </form>
      </main>
    </div>
  );
}
