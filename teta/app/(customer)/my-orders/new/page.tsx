"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  useEffect(() => {
    const stored = sessionStorage.getItem("teta_cart");
    if (!stored) {
      router.push("/browse");
      return;
    }
    setCart(JSON.parse(stored));
  }, [router]);

  if (!cart) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">Loading...</p>
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
    <div className="min-h-screen bg-cream">
      <header className="px-6 py-4 border-b border-foreground/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-foreground/10"
          >
            ←
          </button>
          <span className="text-lg font-bold">Confirm Order</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Items */}
        <div className="bg-white rounded-xl border border-foreground/5 p-4">
          <h2 className="font-semibold mb-3">Your items</h2>
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
                    ? "Free"
                    : `$${((item.listing.price_usd || 0) * item.quantity).toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-foreground/5 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery type */}
        <div className="bg-white rounded-xl border border-foreground/5 p-4">
          <h2 className="font-semibold mb-3">How do you want it?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDeliveryType("pickup")}
              className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${
                deliveryType === "pickup"
                  ? "border-primary bg-primary/5"
                  : "border-foreground/10"
              }`}
            >
              <p className="text-xl mb-1">🚶</p>
              <p className="font-medium">Pickup</p>
            </button>
            <button
              onClick={() => setDeliveryType("delivery")}
              className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${
                deliveryType === "delivery"
                  ? "border-primary bg-primary/5"
                  : "border-foreground/10"
              }`}
            >
              <p className="text-xl mb-1">🛵</p>
              <p className="font-medium">Delivery</p>
            </button>
          </div>

          {deliveryType === "delivery" && (
            <div className="mt-3">
              <p className="text-xs text-orange-600 mb-2">
                Note: Contact the cook to arrange delivery details
              </p>
              <input
                type="text"
                dir="auto"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Your delivery address"
                className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-cream text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          )}
        </div>

        {/* Special instructions */}
        <div className="bg-white rounded-xl border border-foreground/5 p-4">
          <h2 className="font-semibold mb-2">Special instructions</h2>
          <textarea
            dir="auto"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Any allergies or preferences?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-cream text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-foreground/5 p-4">
          <h2 className="font-semibold mb-2">Payment</h2>
          <div className="flex items-center gap-3 text-sm text-foreground/60">
            <span className="text-xl">💵</span>
            <span>Cash on delivery</span>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={placeOrder}
          disabled={placing || (deliveryType === "delivery" && !deliveryAddress)}
          className="w-full py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {placing ? "Placing order..." : `Place order — $${total.toFixed(2)}`}
        </button>

        <p className="text-xs text-center text-foreground/30">
          By placing this order you agree to pay the cook directly
        </p>
      </main>
    </div>
  );
}
