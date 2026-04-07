import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { agentTools } from "@/lib/agent/tools";
import { executeAgentTool } from "@/lib/agent/teta-agent";
import { TETA_AGENT_SYSTEM_PROMPT } from "@/lib/agent/prompts";

export async function POST(request: Request) {
  const { messages, sessionId, userId } = await request.json();

  const supabase = await createClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Get user context if logged in
  let userContext = "";
  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", userId)
      .single();
    if (profile) {
      userContext = `\nCurrent user: ${profile.name} (role: ${profile.role})`;
    }
  }

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: TETA_AGENT_SYSTEM_PROMPT + userContext,
    tools: agentTools,
    messages,
  });

  // Handle tool use — agentic loop
  let finalResponse = response;
  if (response.stop_reason === "tool_use") {
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type === "tool_use") {
        const result = await executeAgentTool(block.name, block.input, supabase);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }
    }

    finalResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: TETA_AGENT_SYSTEM_PROMPT + userContext,
      tools: agentTools,
      messages: [
        ...messages,
        { role: "assistant" as const, content: response.content },
        { role: "user" as const, content: toolResults },
      ],
    });
  }

  // Log the interaction
  const agentText = finalResponse.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  await supabase.from("agent_logs").insert({
    session_id: sessionId || `session_${Date.now()}`,
    user_id: userId || null,
    user_message:
      typeof messages[messages.length - 1]?.content === "string"
        ? messages[messages.length - 1].content
        : "tool_result",
    agent_response: agentText,
    tools_used:
      response.stop_reason === "tool_use"
        ? response.content
            .filter(
              (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
            )
            .map((b) => b.name)
        : null,
  });

  return Response.json({
    content: finalResponse.content,
    usage: finalResponse.usage,
  });
}
