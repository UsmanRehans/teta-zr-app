"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import OtpVerify from "@/components/auth/OtpVerify";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function VerifyContent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const { t } = useTranslation();

  if (!phone) {
    return (
      <div className="text-center">
        <p className="text-foreground/60 mb-4">{t("noPhoneProvided")}</p>
        <Link href="/login" className="text-primary font-medium">
          {t("goBackToLogin")}
        </Link>
      </div>
    );
  }

  return <OtpVerify phone={phone} />;
}

export default function VerifyPage() {
  const { t } = useTranslation();

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
            {t("checkYourPhone")}
          </h1>
        </div>

        <Suspense fallback={<div className="text-foreground/50">{t("loading")}</div>}>
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
