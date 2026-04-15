"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import EmailLogin from "@/components/auth/EmailLogin";
import DevLogin from "@/components/auth/DevLogin";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useDemo } from "@/lib/demo/DemoContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function LoginPage() {
  const { t } = useTranslation();
  const { enterDemo } = useDemo();
  const router = useRouter();

  function startDemo(role: "customer" | "cook") {
    enterDemo(role);
    router.push(role === "cook" ? "/dashboard" : "/browse");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <p className="text-sm text-sub">
            {t("enterEmail")}
          </p>
        </div>

        <EmailLogin />

        {process.env.NODE_ENV !== "production" && <DevLogin />}

        {/* Try Demo Instead section */}
        <div className="mt-8 w-full max-w-xs">
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} className="pt-6">
            <p className="text-xs text-sub text-center mb-4 tracking-wide uppercase font-semibold">
              {t("tryDemoInstead") || "Or try the demo"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => startDemo("customer")}
                className="flex-1 neu-card flex flex-col items-center gap-2 py-3 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <span className="text-xl">🍽️</span>
                <span className="text-xs font-semibold text-foreground">{t("demoModeCustomer")}</span>
              </button>
              <button
                onClick={() => startDemo("cook")}
                className="flex-1 neu-card flex flex-col items-center gap-2 py-3 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <span className="text-xl">👩‍🍳</span>
                <span className="text-xs font-semibold text-foreground">{t("demoModeCook")}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
