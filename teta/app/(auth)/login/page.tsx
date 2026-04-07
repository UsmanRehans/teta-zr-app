"use client";

import Link from "next/link";
import PhoneLogin from "@/components/auth/PhoneLogin";
import DevLogin from "@/components/auth/DevLogin";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <LanguageToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-xs text-center mb-8">
          <p className="text-4xl mb-3">👋</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("welcomeToTeta")}
          </h1>
          <p className="text-sm text-foreground/60">
            {t("enterPhone")}
          </p>
        </div>

        <PhoneLogin />

        {process.env.NODE_ENV !== "production" && <DevLogin />}
      </main>
    </div>
  );
}
