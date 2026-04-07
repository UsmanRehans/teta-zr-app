"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RoleSelectionPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "cook" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !name.trim()) return;
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      name: name.trim(),
      phone: user.phone!,
      role,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (role === "cook") {
      // Create empty cook profile
      await supabase.from("cook_profiles").insert({
        user_id: user.id,
      });
      router.push("/profile");
    } else {
      router.push("/browse");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs text-center mb-8">
          <p className="text-4xl mb-3">✨</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Almost there
          </h1>
          <p className="text-sm text-foreground/60">
            Tell us a bit about yourself
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground/70 mb-1"
            >
              Your name
            </label>
            <input
              id="name"
              type="text"
              dir="auto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rima"
              className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground/70 mb-3">
              I want to...
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  role === "customer"
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 bg-white hover:border-foreground/20"
                }`}
              >
                <p className="text-2xl mb-1">🍽️</p>
                <p className="font-semibold text-sm">Order food</p>
              </button>
              <button
                type="button"
                onClick={() => setRole("cook")}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  role === "cook"
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 bg-white hover:border-foreground/20"
                }`}
              >
                <p className="text-2xl mb-1">👩‍🍳</p>
                <p className="font-semibold text-sm">Sell my food</p>
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !role || !name.trim()}
            className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting up..." : "Let's go"}
          </button>
        </form>
      </main>
    </div>
  );
}
