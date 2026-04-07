"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface OtpVerifyProps {
  phone: string;
}

export default function OtpVerify({ phone }: OtpVerifyProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    // Check if user has a profile already
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user?.id)
      .single();

    if (!profile) {
      // New user — needs to pick a role and set up profile
      router.push("/login/role");
    } else if (profile.role === "cook" || profile.role === "both") {
      router.push("/dashboard");
    } else {
      router.push("/browse");
    }
  }

  async function handleResend() {
    setError("");
    const { error: resendError } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (resendError) {
      setError(resendError.message);
    }
  }

  return (
    <form onSubmit={handleVerify} className="w-full max-w-xs space-y-4">
      <div>
        <label
          htmlFor="otp"
          className="block text-sm font-medium text-foreground/70 mb-1"
        >
          Verification code
        </label>
        <input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-white text-foreground text-center text-2xl tracking-[0.3em] placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      <p className="text-sm text-foreground/50 text-center">
        We sent a code to {phone}
      </p>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        className="w-full text-sm text-primary hover:text-primary-dark transition-colors"
      >
        Resend code
      </button>
    </form>
  );
}
