# Teta Agent — Full Specification
# This agent is built in Phase 1 and scales through all phases.

## What is the Teta Agent?

The Teta Agent is a Claude-powered AI that acts as:
- Customer support (order questions, refunds, complaints)
- Cook support (listing help, order management, pricing advice)
- Internal ops monitor (flags problems, alerts admin)
- Eventually: autonomous platform manager (Phase 4)

It is available as a floating chat widget in the app (bottom-right corner).
It is also called internally by the platform for automated tasks.

## Phase 1 capabilities (build these now)

### Tools the agent can use:

```typescript
// lib/agent/tools.ts

export const agentTools = [
  {
    name: "get_order_status",
    description: "Look up the current status of an order by order ID or customer phone number",
    input_schema: {
      type: "object",
      properties: {
        order_id: { type: "string", description: "UUID of the order" },
        customer_phone: { type: "string", description: "Customer phone number" }
      }
    }
  },
  {
    name: "get_cook_listings",
    description: "Get all active listings for a specific cook",
    input_schema: {
      type: "object",
      properties: {
        cook_id: { type: "string" }
      },
      required: ["cook_id"]
    }
  },
  {
    name: "cancel_order",
    description: "Cancel a pending order. Only works if status is 'pending'. Requires reason.",
    input_schema: {
      type: "object",
      properties: {
        order_id: { type: "string" },
        reason: { type: "string" }
      },
      required: ["order_id", "reason"]
    }
  },
  {
    name: "flag_for_admin",
    description: "Flag an issue for human admin review. Use for refund requests, complaints, or anything requiring human judgment.",
    input_schema: {
      type: "object",
      properties: {
        issue_type: { type: "string", enum: ["refund", "complaint", "cook_issue", "safety", "other"] },
        description: { type: "string" },
        related_order_id: { type: "string" },
        user_id: { type: "string" }
      },
      required: ["issue_type", "description"]
    }
  },
  {
    name: "get_platform_stats",
    description: "Get basic platform metrics. Admin only.",
    input_schema: {
      type: "object",
      properties: {
        metric: { type: "string", enum: ["total_orders", "active_cooks", "revenue_today", "new_users_today"] }
      },
      required: ["metric"]
    }
  }
];
```

### System prompt for Phase 1:

```
You are Teta Assistant — the friendly AI helper for the Teta platform,
a home-cooked food marketplace in Beirut, Lebanon.

Your personality:
- Warm, helpful, and community-minded
- Speak in a mix of English and very light Lebanese Arabic phrases when appropriate
  (e.g., "yalla" for "let's go", "marhaba" for hello, "shukran" for thanks)
- Never robotic or corporate — this is a community platform, not a bank
- Always honest about what you can and can't do

What you can do:
- Check order status
- Help with cancellations (pending orders only)
- Answer questions about how Teta works
- Help cooks set up their listings
- Flag issues to the admin team

What you CANNOT do:
- Process refunds (flag to admin instead)
- Change completed orders
- Access other users' private information
- Make promises about delivery times
- Override cook decisions

Lebanon context you know:
- Many users pay cash on delivery
- Power cuts are common — be understanding if a cook goes offline
- Some users prefer Arabic — respond in Arabic if they write to you in Arabic
- Prices are in USD because of the lira situation
- Pickup is more common than delivery in Phase 1

When you don't know something, say so clearly and offer to flag it for the team.
Always end with something actionable the user can do next.
```

## Phase 2 additions (add these when building Phase 2)

New tools to add:
- `send_notification` — send push notification to a user
- `update_listing` — update a dish listing on behalf of a cook
- `get_cook_analytics` — show cook their sales data
- `suggest_dish_price` — suggest optimal price based on similar dishes
- `create_review_request` — prompt customer to leave review after delivery

## Phase 3 additions

New tools:
- `assign_rider` — assign a delivery rider to an order
- `get_neighborhood_demand` — what dishes are popular near a cook's location
- `generate_menu_suggestion` — suggest new dishes for a cook to add
- `detect_anomaly` — check if an order pattern looks fraudulent

## Phase 4 — Autonomous ops agent

At this phase, the agent runs on a cron job every 15 minutes and:
1. Checks for stuck orders (pending > 30 min with no confirmation)
2. Checks for offline cooks with active listings
3. Checks for payment failures
4. Summarizes daily ops and sends you a WhatsApp message
5. Automatically resolves common issues without human input

The agent's authority levels:
- Level 1 (auto): Cancel stuck orders, send reminder notifications
- Level 2 (auto with log): Update listing availability, reschedule orders
- Level 3 (human approval): Refunds, cook suspension, pricing changes
- Level 4 (human only): Policy changes, new market launch, legal issues

## API route implementation

```typescript
// app/api/agent/route.ts

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { agentTools } from '@/lib/agent/tools';
import { executeAgentTool } from '@/lib/agent/teta-agent';
import { TETA_AGENT_SYSTEM_PROMPT } from '@/lib/agent/prompts';

export async function POST(request: Request) {
  const { messages, sessionId, userId } = await request.json();
  
  const supabase = createClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Get user context if logged in
  let userContext = '';
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', userId)
      .single();
    if (profile) {
      userContext = `\nCurrent user: ${profile.name} (role: ${profile.role})`;
    }
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: TETA_AGENT_SYSTEM_PROMPT + userContext,
    tools: agentTools,
    messages: messages
  });

  // Handle tool use
  let finalResponse = response;
  if (response.stop_reason === 'tool_use') {
    const toolResults = [];
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        const result = await executeAgentTool(block.name, block.input, supabase);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result)
        });
      }
    }

    // Continue conversation with tool results
    finalResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: TETA_AGENT_SYSTEM_PROMPT + userContext,
      tools: agentTools,
      messages: [
        ...messages,
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResults }
      ]
    });
  }

  // Log the interaction
  const agentText = finalResponse.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  await supabase.from('agent_logs').insert({
    session_id: sessionId,
    user_id: userId || null,
    user_message: messages[messages.length - 1]?.content,
    agent_response: agentText,
    tools_used: response.stop_reason === 'tool_use' 
      ? response.content.filter(b => b.type === 'tool_use').map(b => b.name)
      : null
  });

  return Response.json({ 
    content: finalResponse.content,
    usage: finalResponse.usage 
  });
}
```

## Floating chat widget

```typescript
// components/agent/AgentChat.tsx
// A floating button bottom-right that opens a chat panel
// Sends messages to /api/agent
// Shows typing indicator while waiting
// Persists conversation in localStorage per session
// Bilingual placeholder: "كيف أساعدك؟ / How can I help?"
```

## Cost management

Phase 1 at 100 users: ~$5–15/month Claude API costs
Phase 2 at 1,000 users: ~$50–150/month
Phase 3 at 10,000 users: ~$200–500/month (switch to caching for repeated queries)
Phase 4: Implement prompt caching + batch for non-urgent ops tasks

Always log every API call to agent_logs so you can audit and optimize.
