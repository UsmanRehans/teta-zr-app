"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDemo } from "@/lib/demo/DemoContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const { isDemo } = useDemo();

  useEffect(() => {
    if (!isDemo) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setUserId(user.id);
      });
    }
  }, [supabase.auth, isDemo]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    if (isDemo) {
      // Demo mode - mock response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm here to help with your Teta kitchen! In demo mode, I'm just a preview. Feel free to ask me about orders, dishes, or anything else on Teta.",
          },
        ]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const apiMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId,
          userId,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      const text = data.content
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { text: string }) => b.text)
        .join("");

      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble connecting. Please try again in a moment.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neu-circle fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
        aria-label="Chat with Teta Assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="neu-raised fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-background rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-primary text-white flex items-center gap-3">
            <span className="text-xl">🤖</span>
            <div>
              <p className="font-semibold text-sm">Teta Assistant</p>
              <p className="text-xs text-white/70">
                {"\u0643\u064A\u0641 \u0623\u0633\u0627\u0639\u062F\u0643\u061F"}{" "}
                / How can I help?
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">👋</p>
                <p className="text-sm text-foreground/50">
                  Marhaba! I&apos;m here to help with orders, finding cooks, or
                  anything else on Teta.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-md shadow-md"
                      : "neu-card rounded-bl-md text-foreground"
                  }`}
                  dir="auto"
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="neu-card px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="px-4 py-3 border-t border-foreground/5 flex gap-2"
          >
            <input
              type="text"
              dir="auto"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="neu-input flex-1 px-3 py-2 rounded-xl text-sm text-foreground placeholder:text-foreground/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="neu-btn-primary px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
