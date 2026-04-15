"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import OtpVerify from "@/components/auth/OtpVerify";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { t } = useTranslation();

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-sub mb-4">{t("noEmailProvided")}</p>
        <Link href="/login" className="text-primary font-medium">
          {t("goBackToLogin")}
        </Link>
      </div>
    );
  }

  return <OtpVerify email={email} />;
}

export default function VerifyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <Link href="/login" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <LanguageToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs text-center mb-8">
          <p className="text-4xl mb-3">📧</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("checkYourEmail")}
          </h1>
        </div>

        <Suspense fallback={<div className="text-sub">{t("loading")}</div>}>
          <VerifyContent />
        </Suspense>
      </main>
    </div>
  );
}
