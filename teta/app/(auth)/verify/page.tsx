"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import OtpVerify from "@/components/auth/OtpVerify";

function VerifyContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  if (!phone) {
    return (
      <div className="text-center">
        <p className="text-foreground/60 mb-4">No phone number provided.</p>
        <Link href="/login" className="text-primary font-medium">
          Go back to login
        </Link>
      </div>
    );
  }

  return <OtpVerify phone={phone} />;
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs text-center mb-8">
          <p className="text-4xl mb-3">🔐</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check your phone
          </h1>
        </div>

        <Suspense fallback={<div className="text-foreground/50">Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
