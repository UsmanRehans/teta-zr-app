import { SupabaseClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function executeAgentTool(
  toolName: string,
  input: any,
  supabase: SupabaseClient
): Promise<any> {
  switch (toolName) {
    case "get_order_status":
      return getOrderStatus(input, supabase);
    case "get_cook_listings":
      return getCookListings(input, supabase);
    case "cancel_order":
      return cancelOrder(input, supabase);
    case "flag_for_admin":
      return flagForAdmin(input, supabase);
    case "get_platform_stats":
      return getPlatformStats(input, supabase);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

async function getOrderStatus(
  input: { order_id?: string; customer_phone?: string },
  supabase: SupabaseClient
) {
  if (input.order_id) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, status, total_usd, delivery_type, created_at, updated_at, items"
      )
      .eq("id", input.order_id)
      .single();

    if (error) return { error: "Order not found" };
    return data;
  }

  if (input.customer_phone) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", input.customer_phone)
      .single();

    if (!profile) return { error: "No user found with that phone number" };

    const { data } = await supabase
      .from("orders")
      .select("id, status, total_usd, delivery_type, created_at, items")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(3);

    return { recent_orders: data || [] };
  }

  return { error: "Provide either order_id or customer_phone" };
}

async function getCookListings(
  input: { cook_id: string },
  supabase: SupabaseClient
) {
  const { data } = await supabase
    .from("listings")
    .select(
      "id, name, description, price_usd, is_free, portions_available, is_active, dietary_tags"
    )
    .eq("cook_id", input.cook_id)
    .eq("is_active", true);

  return { listings: data || [] };
}

async function cancelOrder(
  input: { order_id: string; reason: string },
  supabase: SupabaseClient
) {
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", input.order_id)
    .single();

  if (!order) return { error: "Order not found" };
  if (order.status !== "pending")
    return {
      error: `Cannot cancel — order is already ${order.status}. Only pending orders can be cancelled.`,
    };

  const { error } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      special_instructions: `[CANCELLED via Agent] ${input.reason}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.order_id);

  if (error) return { error: error.message };
  return { success: true, message: "Order cancelled successfully" };
}

async function flagForAdmin(
  input: {
    issue_type: string;
    description: string;
    related_order_id?: string;
    user_id?: string;
  },
  supabase: SupabaseClient
) {
  // Store flags in agent_logs with a special session_id prefix
  const { error } = await supabase.from("agent_logs").insert({
    session_id: `FLAG_${input.issue_type}_${Date.now()}`,
    user_id: input.user_id || null,
    user_message: `[FLAG] ${input.issue_type}: ${input.description}`,
    agent_response: `Flagged for admin review. Order: ${input.related_order_id || "N/A"}`,
    tools_used: ["flag_for_admin"],
  });

  if (error) return { error: error.message };
  return {
    success: true,
    message: "Issue flagged for admin review. The team will look into it.",
  };
}

async function getPlatformStats(
  input: { metric: string },
  supabase: SupabaseClient
) {
  const today = new Date().toISOString().split("T")[0];

  switch (input.metric) {
    case "total_orders": {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      return { total_orders: count || 0 };
    }
    case "active_cooks": {
      const { count } = await supabase
        .from("cook_profiles")
        .select("*", { count: "exact", head: true })
        .eq("accepts_orders", true);
      return { active_cooks: count || 0 };
    }
    case "revenue_today": {
      const { data } = await supabase
        .from("orders")
        .select("total_usd")
        .gte("created_at", today)
        .eq("status", "delivered");
      const total = (data || []).reduce(
        (sum, o) => sum + Number(o.total_usd || 0),
        0
      );
      return { revenue_today_usd: total };
    }
    case "new_users_today": {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today);
      return { new_users_today: count || 0 };
    }
    default:
      return { error: "Unknown metric" };
  }
}
