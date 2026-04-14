"use client";

import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

interface Order {
  id: string;
  items: { listing_id: string; name: string; qty: number; price_usd: number }[];
  total_usd: number;
  status: string;
  delivery_type: string;
  created_at: string;
  cook_name: string;
}

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export default function OrderCard({
  order,
  role,
  onStatusChange,
}: {
  order: Order;
  role: "customer" | "cook";
  onStatusChange?: (orderId: string, newStatus: string) => void;
}) {
  const supabase = createClient();
  const { t } = useTranslation();

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: t("statusPending"), color: "text-yellow-700", bg: "bg-yellow-50" },
    confirmed: { label: t("statusConfirmed"), color: "text-blue-700", bg: "bg-blue-50" },
    preparing: { label: t("statusPreparing"), color: "text-orange-700", bg: "bg-orange-50" },
    ready: { label: t("statusReady"), color: "text-primary", bg: "bg-primary/10" },
    delivered: { label: t("statusDelivered"), color: "text-foreground/50", bg: "bg-foreground/5" },
    cancelled: { label: t("statusCancelled"), color: "text-red-700", bg: "bg-red-50" },
  };

  const STATUS_LABEL_KEYS: Record<string, TranslationKey> = {
    pending: "statusPending",
    confirmed: "statusConfirmed",
    preparing: "statusPreparing",
    ready: "statusReady",
    delivered: "statusDelivered",
    cancelled: "statusCancelled",
  };

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  async function advanceStatus() {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;

    await supabase
      .from("orders")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", order.id);

    onStatusChange?.(order.id, nextStatus);
  }

  async function cancelOrder() {
    await supabase
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    onStatusChange?.(order.id, "cancelled");
  }

  const timeAgo = getTimeAgo(order.created_at, t);

  const nextStatus = NEXT_STATUS[order.status];
  const nextStatusLabel = nextStatus
    ? t(STATUS_LABEL_KEYS[nextStatus] || "statusPending")
    : "";

  return (
    <div className="neu-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm">{order.cook_name}</p>
        <span
          className={`neu-badge text-xs px-2.5 py-1 rounded-full font-medium ${status.color} ${status.bg}`}
        >
          {status.label}
        </span>
      </div>

      <div className="space-y-0.5 mb-2">
        {order.items.map((item, i) => (
          <p key={i} className="text-sm text-sub">
            {item.qty}x {item.name}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground/40 text-xs">{timeAgo}</span>
        <span className="font-semibold text-primary">${order.total_usd.toFixed(2)}</span>
      </div>

      {/* Cook actions */}
      {role === "cook" && nextStatus && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-foreground/5">
          <button
            onClick={advanceStatus}
            className="neu-btn-green flex-1 py-2 text-sm font-medium rounded-full"
          >
            {t("markAs")} {nextStatusLabel}
          </button>
          {order.status === "pending" && (
            <button
              onClick={cancelOrder}
              className="neu-btn-secondary py-2 px-4 text-sm font-medium rounded-full"
            >
              {t("cancel")}
            </button>
          )}
        </div>
      )}

      {/* Customer cancel */}
      {role === "customer" && order.status === "pending" && (
        <div className="mt-3 pt-3 border-t border-foreground/5">
          <button
            onClick={cancelOrder}
            className="text-sm text-red-500 hover:text-red-700"
          >
            {t("cancelOrder")}
          </button>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(
  dateStr: string,
  t: (key: TranslationKey) => string
): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return `${mins}${t("mAgo")}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${t("hAgo")}`;
  const days = Math.floor(hours / 24);
  return `${days}${t("dAgo")}`;
}
