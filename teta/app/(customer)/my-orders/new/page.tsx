"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useDemo } from "@/lib/demo/DemoContext";

interface CartData {
  cookId: string;
  items: {
    listing: {
      id: string;
      name: string;
      price_usd: number | null;
      is_free: boolean;
    };
    quantity: number;
  }[];
}

export default function NewOrderPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">(
    "pickup"
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { t, locale } = useTranslation();
  const { isDemo } = useDemo();

  useEffect(() => {
    const stored = sessionStorage.getItem("teta_cart");
    if (!stored) {
      router.push("/browse");
      return;
    }
    setCart(JSON.parse(stored));
  }, [router]);

  const backArrow = locale === "ar" ? "→" : "←";

  if (!cart) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sub">{t("loading")}</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) =>
      sum +
      (item.listing.is_free ? 0 : (item.listing.price_usd || 0) * item.quantity),
    0
  );

  async function placeOrder() {
    setError("");
    setPlacing(true);

    if (isDemo) {
      // Simulate order placement in demo mode
      await new Promise((resolve) => setTimeout(resolve, 800));
      sessionStorage.removeItem("teta_cart");
      router.push("/my-orders");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const items = cart!.items.map((item) => ({
      listing_id: item.listing.id,
      name: item.listing.name,
      qty: item.quantity,
      price_usd: item.listing.is_free ? 0 : item.listing.price_usd || 0,
    }));

    const hasFreeItems =
      cart!.items.some((item) => item.listing.is_free) && total === 0;

    const { error: orderError } = await supabase.from("orders").insert({
      customer_id: user.id,
      cook_id: cart!.cookId,
      items,
      total_usd: total,
      is_free_claim: hasFreeItems,
      delivery_type: deliveryType,
      delivery_address: deliveryType === "delivery" ? deliveryAddress : null,
      special_instructions: instructions || null,
      payment_method: "cash",
      platform_fee_usd: 0,
    });

    if (orderError) {
      setError(orderError.message);
      setPlacing(false);
      return;
    }

    sessionStorage.removeItem("teta_cart");
    router.push("/my-orders");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b border-foreground/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 neu-icon"
          >
            {backArrow}
          </button>
          <span className="text-lg font-bold">{t("confirmOrder")}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Items */}
        <div className="neu-card">
          <h2 className="font-semibold mb-3">{t("yourItems")}</h2>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div
                key={item.listing.id}
                className="flex justify-between items-center"
              >
                <div>
                  <span className="text-sm">{item.quantity}x </span>
                  <span className="text-sm font-medium">{item.listing.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {item.listing.is_free
                    ? t("free")
                    : `$${((item.listing.price_usd || 0) * item.quantity).toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
          <div className="neu-divider"></div>
          <div className="flex justify-between font-bold">
            <span>{t("total")}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery type */}
        <div className="neu-card">
          <h2 className="font-semibold mb-3">{t("howDoYouWantIt")}</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDeliveryType("pickup")}
              className={`p-3 rounded-xl text-center text-sm font-medium transition-all ${
                deliveryType === "pickup"
                  ? "neu-chip-active text-primary"
                  : "neu-chip text-sub"
              }`}
            >
              <p className="text-xl mb-1">🚶</p>
              <p>{t("pickup")}</p>
            </button>
            <button
              onClick={() => setDeliveryType("delivery")}
              className={`p-3 rounded-xl text-center text-sm font-medium transition-all ${
                deliveryType === "delivery"
                  ? "neu-chip-active text-primary"
                  : "neu-chip text-sub"
              }`}
            >
              <p className="text-xl mb-1">🛵</p>
              <p>{t("delivery")}</p>
            </button>
          </div>

          {deliveryType === "delivery" && (
            <div className="mt-3">
              <p className="text-xs text-primary mb-2">
                {t("deliveryNote")}
              </p>
              <input
                type="text"
                dir="auto"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={t("deliveryAddress")}
                className="neu-input text-sm"
              />
            </div>
          )}
        </div>

        {/* Special instructions */}
        <div className="neu-card">
          <h2 className="font-semibold mb-2">{t("specialInstructions")}</h2>
          <textarea
            dir="auto"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={t("allergiesPlaceholder")}
            rows={2}
            className="neu-input text-sm resize-none"
          />
        </div>

        {/* Payment */}
        <div className="neu-card">
          <h2 className="font-semibold mb-2">{t("payment")}</h2>
          <div className="flex items-center gap-3 text-sm text-sub">
            <span className="text-xl">💵</span>
            <span>{t("cashOnDelivery")}</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={placing || (deliveryType === "delivery" && !deliveryAddress)}
          className="neu-btn-primary"
        >
          {placing ? t("placingOrder") : `${t("placeOrder")} · $${total.toFixed(2)}`}
        </button>

        <p className="text-xs text-center text-sub">
          {t("paymentDisclaimer")}
        </p>
      </main>
    </div>
  );
}
