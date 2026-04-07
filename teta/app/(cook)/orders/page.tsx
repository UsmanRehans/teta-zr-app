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

export default function CookOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel("cook-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadOrders();
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

    const { data: cookProfile } = await supabase
      .from("cook_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!cookProfile) {
      router.push("/profile");
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select(
        `
        id, items, total_usd, status, delivery_type, created_at,
        profiles!orders_customer_id_fkey (name)
      `
      )
      .eq("cook_id", cookProfile.id)
      .order("created_at", { ascending: false });

    if (data) {
      const mapped = data.map((o) => {
        const customer = o.profiles as unknown as { name: string };
        return {
          id: o.id,
          items: o.items as Order["items"],
          total_usd: Number(o.total_usd),
          status: o.status,
          delivery_type: o.delivery_type,
          created_at: o.created_at,
          cook_name: customer?.name || "Customer",
        };
      });
      setOrders(mapped);
    }
    setLoading(false);
  }

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  }

  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "preparing", "ready"].includes(o.status)
  );
  const pastOrders = orders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );

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
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-foreground/50">No orders yet</p>
          </div>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-medium text-foreground/40 uppercase tracking-wider mb-3">
                  Active ({activeOrders.length})
                </h2>
                <div className="space-y-3">
                  {activeOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      role="cook"
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-foreground/40 uppercase tracking-wider mb-3">
                  Past ({pastOrders.length})
                </h2>
                <div className="space-y-3">
                  {pastOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      role="cook"
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
