"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("+961");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleaned = phone.replace(/\s/g, "");
    if (!/^\+961\d{7,8}$/.test(cleaned)) {
      setError("Please enter a valid Lebanese number (+961 XX XXX XXX)");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: cleaned,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(`/verify?phone=${encodeURIComponent(cleaned)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          dir="auto"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+961 71 123 456"
          className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending code..." : "Send verification code"}
      </button>
    </form>
  );
}
