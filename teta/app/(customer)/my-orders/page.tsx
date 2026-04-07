"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderCard from "@/components/orders/OrderCard";

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

  useEffect(() => {
    loadOrders();
    // Subscribe to realtime updates
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5">
        <Link href="/browse" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <Link
          href="/browse"
          className="text-sm text-primary font-medium hover:text-primary-dark"
        >
          Browse
        </Link>
      </header>

      <main className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-foreground/50 mb-4">No orders yet</p>
            <Link
              href="/browse"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
            >
              Browse cooks
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
