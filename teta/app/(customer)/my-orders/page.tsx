"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderCard from "@/components/orders/OrderCard";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useDemo } from "@/lib/demo/DemoContext";
import { DEMO_ORDERS } from "@/lib/demo/mockData";

interface Order {
  id: string;
  items: { listing_id: string; name: string; qty: number; price_usd: number }[];
  total_usd: number;
  status: string;
  delivery_type: string;
  created_at: string;
  cook_name: string;
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const { isDemo, demoUser } = useDemo();

  useEffect(() => {
    loadOrders();
    // Subscribe to realtime updates (non-demo only)
    if (!isDemo) {
      const channel = supabase
        .channel("customer-orders")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders" },
          (payload) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id
                  ? { ...o, status: payload.new.status }
                  : o
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  async function loadOrders() {
    if (isDemo) {
      // Use demo orders for demo mode
      const filtered = DEMO_ORDERS.filter(
        (o) => o.customer_id === demoUser?.id
      ).map((o) => ({
        id: o.id,
        items: [
          {
            listing_id: o.listing_id,
            name: "Order item",
            qty: 1,
            price_usd: o.total_price_usd,
          },
        ],
        total_usd: o.total_price_usd,
        status: o.status,
        delivery_type: "pickup",
        created_at: o.created_at,
        cook_name: "Cook",
      }));
      setOrders(filtered);
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

    const { data } = await supabase
      .from("orders")
      .select(
        `
        id, items, total_usd, status, delivery_type, created_at,
        cook_profiles!orders_cook_id_fkey (
          profiles!cook_profiles_user_id_fkey (name)
        )
      `
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const mapped = data.map((o) => {
        const cookProfiles = o.cook_profiles as unknown as {
          profiles: { name: string };
        };
        return {
          id: o.id,
          items: o.items as Order["items"],
          total_usd: Number(o.total_usd),
          status: o.status,
          delivery_type: o.delivery_type,
          created_at: o.created_at,
          cook_name: cookProfiles?.profiles?.name || "Cook",
        };
      });
      setOrders(mapped);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sub">{t("loadingOrders")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <Link href="/browse" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <Link
          href="/browse"
          className="text-sm text-primary font-medium"
        >
          {t("browse")}
        </Link>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("myOrders")}</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sub mb-4">{t("noOrdersYetCustomer")}</p>
            <Link
              href="/browse"
              className="inline-block neu-btn-primary"
            >
              {t("browseCooksButton")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} role="customer" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
