import type Anthropic from "@anthropic-ai/sdk";

export const agentTools: Anthropic.Tool[] = [
  {
    name: "get_order_status",
    description:
      "Look up the current status of an order by order ID or customer phone number",
    input_schema: {
      type: "object" as const,
      properties: {
        order_id: { type: "string", description: "UUID of the order" },
        customer_phone: {
          type: "string",
          description: "Customer phone number",
        },
      },
    },
  },
  {
    name: "get_cook_listings",
    description: "Get all active listings for a specific cook",
    input_schema: {
      type: "object" as const,
      properties: {
        cook_id: { type: "string" },
      },
      required: ["cook_id"],
    },
  },
  {
    name: "cancel_order",
    description:
      "Cancel a pending order. Only works if status is 'pending'. Requires reason.",
    input_schema: {
      type: "object" as const,
      properties: {
        order_id: { type: "string" },
        reason: { type: "string" },
      },
      required: ["order_id", "reason"],
    },
  },
  {
    name: "flag_for_admin",
    description:
      "Flag an issue for human admin review. Use for refund requests, complaints, or anything requiring human judgment.",
    input_schema: {
      type: "object" as const,
      properties: {
        issue_type: {
          type: "string",
          enum: ["refund", "complaint", "cook_issue", "safety", "other"],
        },
        description: { type: "string" },
        related_order_id: { type: "string" },
        user_id: { type: "string" },
      },
      required: ["issue_type", "description"],
    },
  },
  {
    name: "get_platform_stats",
    description: "Get basic platform metrics. Admin only.",
    input_schema: {
      type: "object" as const,
      properties: {
        metric: {
          type: "string",
          enum: [
            "total_orders",
            "active_cooks",
            "revenue_today",
            "new_users_today",
          ],
        },
      },
      required: ["metric"],
    },
  },
];
