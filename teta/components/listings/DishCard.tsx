"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

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

interface DishCardProps {
  listing: Listing;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function DishCard({
  listing,
  quantity,
  onAdd,
  onRemove,
}: DishCardProps) {
  const { t } = useTranslation();

  return (
    <div className="neu-card rounded-2xl overflow-hidden">
      <div className="flex">
        {/* Info */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold" dir="auto">
            {listing.name}
          </h3>
          {listing.description && (
            <p
              className="text-sm text-foreground/50 mt-1 line-clamp-2"
              dir="auto"
            >
              {listing.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {listing.is_free ? (
              <span className="text-sm font-semibold text-primary">
                {t("free")} ❤️
              </span>
            ) : (
              <span className="text-sm font-semibold text-primary">
                ${listing.price_usd}
              </span>
            )}
            <span className="text-xs text-foreground/30">·</span>
            <span className="text-xs text-foreground/40">
              {listing.prep_time_mins} {t("min")}
            </span>
            {listing.portions_available <= 3 && (
              <>
                <span className="text-xs text-foreground/30">·</span>
                <span className="text-xs text-orange-500">
                  {listing.portions_available} {t("left")}
                </span>
              </>
            )}
          </div>
          {listing.dietary_tags && listing.dietary_tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {listing.dietary_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 neu-chip rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Photo + Add button */}
        <div className="w-28 relative flex-shrink-0">
          <div className="neu-well w-full h-full min-h-[100px] flex items-center justify-center">
            {listing.photo_urls?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.photo_urls[0]}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">🍽️</span>
            )}
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            {quantity === 0 ? (
              <button
                onClick={onAdd}
                className="neu-btn-primary px-5 py-1.5 text-sm font-bold rounded-full shadow-sm"
              >
                {t("addButton")}
              </button>
            ) : (
              <div className="flex items-center bg-primary rounded-full shadow-sm">
                <button
                  onClick={onRemove}
                  className="w-8 h-8 text-white font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-6 text-center text-white font-bold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={onAdd}
                  className="w-8 h-8 text-white font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
