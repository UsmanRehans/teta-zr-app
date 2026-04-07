"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

interface Stats {
  ordersToday: number;
  revenueToday: number;
  totalOrders: number;
  activeCooks: number;
  totalCooks: number;
  totalCustomers: number;
}

interface OrderRow {
  id: string;
  status: string;
  total_usd: number;
  delivery_type: string;
  created_at: string;
  customer_name: string;
  cook_name: string;
}

interface CookRow {
  id: string;
  user_id: string;
  name: string;
  verified: boolean;
  accepts_orders: boolean;
  avg_rating: number;
  total_reviews: number;
}

interface AgentLog {
  id: string;
  session_id: string;
  user_message: string;
  agent_response: string;
  tools_used: string[] | null;
  created_at: string;
}

type Tab = "orders" | "cooks" | "logs";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    ordersToday: 0,
    revenueToday: 0,
    totalOrders: 0,
    activeCooks: 0,
    totalCooks: 0,
    totalCustomers: 0,
  });
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [cooks, setCooks] = useState<CookRow[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [tab, setTab] = useState<Tab>("orders");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuth() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/");
      return;
    }

    setAuthorized(true);
    await Promise.all([loadStats(), loadOrders(), loadCooks(), loadLogs()]);
    setLoading(false);
  }

  async function loadStats() {
    const today = new Date().toISOString().split("T")[0];

    const [ordersToday, totalOrders, activeCooks, totalCooks, totalCustomers, revenueData] =
      await Promise.all([
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", today),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
          .from("cook_profiles")
          .select("*", { count: "exact", head: true })
          .eq("accepts_orders", true),
        supabase.from("cook_profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer"),
        supabase
          .from("orders")
          .select("total_usd")
          .gte("created_at", today)
          .in("status", ["delivered", "ready", "preparing", "confirmed"]),
      ]);

    const revenue = (revenueData.data || []).reduce(
      (sum, o) => sum + Number(o.total_usd || 0),
      0
    );

    setStats({
      ordersToday: ordersToday.count || 0,
      revenueToday: revenue,
      totalOrders: totalOrders.count || 0,
      activeCooks: activeCooks.count || 0,
      totalCooks: totalCooks.count || 0,
      totalCustomers: totalCustomers.count || 0,
    });
  }

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select(
        `
        id, status, total_usd, delivery_type, created_at,
        profiles!orders_customer_id_fkey (name),
        cook_profiles!orders_cook_id_fkey (
          profiles!cook_profiles_user_id_fkey (name)
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (data) {
      setOrders(
        data.map((o) => {
          const customer = o.profiles as unknown as { name: string };
          const cookProfile = o.cook_profiles as unknown as {
            profiles: { name: string };
          };
          return {
            id: o.id,
            status: o.status,
            total_usd: Number(o.total_usd),
            delivery_type: o.delivery_type,
            created_at: o.created_at,
            customer_name: customer?.name || "Unknown",
            cook_name: cookProfile?.profiles?.name || "Unknown",
          };
        })
      );
    }
  }

  async function loadCooks() {
    const { data } = await supabase
      .from("cook_profiles")
      .select(
        `
        id, user_id, verified, accepts_orders, avg_rating, total_reviews,
        profiles!cook_profiles_user_id_fkey (name)
      `
      )
      .order("created_at", { ascending: false });

    if (data) {
      setCooks(
        data.map((c) => {
          const profile = c.profiles as unknown as { name: string };
          return {
            id: c.id,
            user_id: c.user_id,
            name: profile?.name || "Unknown",
            verified: c.verified,
            accepts_orders: c.accepts_orders,
            avg_rating: Number(c.avg_rating),
            total_reviews: c.total_reviews,
          };
        })
      );
    }
  }

  async function loadLogs() {
    const { data } = await supabase
      .from("agent_logs")
      .select("id, session_id, user_message, agent_response, tools_used, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    setLogs(data || []);
  }

  async function toggleCookVerified(cookId: string, current: boolean) {
    await supabase
      .from("cook_profiles")
      .update({ verified: !current })
      .eq("id", cookId);

    setCooks((prev) =>
      prev.map((c) => (c.id === cookId ? { ...c, verified: !current } : c))
    );
  }

  const tabLabels: Record<Tab, string> = {
    orders: t("orders"),
    cooks: t("cooks"),
    logs: t("agentLogs"),
  };

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-foreground/50">{t("loadingAdmin")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-foreground/5 bg-white">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
            {t("admin")}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">{t("dashboard")}</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          <StatCard label={t("ordersToday")} value={stats.ordersToday} />
          <StatCard
            label={t("revenueToday")}
            value={`$${stats.revenueToday.toFixed(2)}`}
          />
          <StatCard label={t("totalOrders")} value={stats.totalOrders} />
          <StatCard
            label={t("activeCooks")}
            value={`${stats.activeCooks}/${stats.totalCooks}`}
          />
          <StatCard label={t("customers")} value={stats.totalCustomers} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-foreground/5 p-1 mb-6">
          {(["orders", "cooks", "logs"] as Tab[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === tabKey
                  ? "bg-primary text-white"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {tabLabels[tabKey]}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="space-y-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-foreground/5 p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-foreground/30">
                      {order.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm">
                    <span className="text-foreground/50">{order.customer_name}</span>
                    {" → "}
                    <span className="font-medium">{order.cook_name}</span>
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-semibold">${order.total_usd.toFixed(2)}</p>
                  <p className="text-xs text-foreground/40">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-foreground/50 py-8">{t("noOrdersAdmin")}</p>
            )}
          </div>
        )}

        {/* Cooks tab */}
        {tab === "cooks" && (
          <div className="space-y-2">
            {cooks.map((cook) => (
              <div
                key={cook.id}
                className="bg-white rounded-xl border border-foreground/5 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{cook.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {cook.avg_rating > 0 && (
                      <span className="text-xs text-foreground/50">
                        ⭐ {cook.avg_rating} ({cook.total_reviews})
                      </span>
                    )}
                    <span
                      className={`text-xs ${cook.accepts_orders ? "text-primary" : "text-foreground/30"}`}
                    >
                      {cook.accepts_orders ? t("online") : t("offline")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleCookVerified(cook.id, cook.verified)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    cook.verified
                      ? "bg-primary/10 text-primary"
                      : "bg-foreground/5 text-foreground/40 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {cook.verified ? t("verified") + " ✓" : t("verifyButton")}
                </button>
              </div>
            ))}
            {cooks.length === 0 && (
              <p className="text-center text-foreground/50 py-8">{t("noCooksAdmin")}</p>
            )}
          </div>
        )}

        {/* Agent logs tab */}
        {tab === "logs" && (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-foreground/5 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-foreground/30">
                    {log.session_id.slice(0, 20)}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm">
                    <span className="font-medium text-foreground/50">{t("user")} </span>
                    {log.user_message}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium text-primary">{t("agent")} </span>
                    {log.agent_response.slice(0, 200)}
                    {log.agent_response.length > 200 ? "..." : ""}
                  </p>
                  {log.tools_used && log.tools_used.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {log.tools_used.map((tool, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 bg-foreground/5 text-foreground/40 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-foreground/50 py-8">
                {t("noLogsAdmin")}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-xl border border-foreground/5 p-4">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-foreground/50 mt-1">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const colors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    preparing: "bg-orange-50 text-orange-700",
    ready: "bg-primary/10 text-primary",
    delivered: "bg-foreground/5 text-foreground/50",
    cancelled: "bg-red-50 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    preparing: t("statusPreparing"),
    ready: t("statusReady"),
    delivered: t("statusDelivered"),
    cancelled: t("statusCancelled"),
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || "bg-foreground/5 text-foreground/50"}`}
    >
      {statusLabels[status] || status}
    </span>
  );
}
