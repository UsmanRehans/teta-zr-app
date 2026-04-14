"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useDemo } from "@/lib/demo/DemoContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  const { t } = useTranslation();
  const { enterDemo } = useDemo();
  const router = useRouter();

  function startDemo(role: "customer" | "cook") {
    enterDemo(role);
    router.push(role === "cook" ? "/dashboard" : "/browse");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-primary tracking-tight">teta</h1>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/login"
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            {t("signIn")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md mx-auto">
          {/* Neumorphic logo circle */}
          <div className="neu-circle w-28 h-28 mx-auto mb-6">
            <span className="text-6xl">🫕</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">
            {t("heroTitle")}
          </h2>
          <p className="text-base text-sub mb-8 leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            <Link href="/login" className="neu-btn-primary text-center no-underline">
              {t("browseCooks")}
            </Link>
            <Link href="/login?role=cook" className="neu-btn-secondary text-center no-underline">
              {t("startSelling")}
            </Link>
          </div>

          {/* Demo mode entry */}
          <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <p className="text-xs text-sub mb-4 tracking-wide uppercase font-semibold">Try the demo</p>
            <div className="flex gap-3">
              <button
                onClick={() => startDemo("customer")}
                className="flex-1 neu-card flex flex-col items-center gap-2 py-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <span className="text-2xl">🍽️</span>
                <span className="text-sm font-semibold text-foreground">Order Food</span>
              </button>
              <button
                onClick={() => startDemo("cook")}
                className="flex-1 neu-card flex flex-col items-center gap-2 py-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <span className="text-2xl">👩‍🍳</span>
                <span className="text-sm font-semibold text-foreground">Be a Cook</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-center mb-8">{t("howItWorks")}</h3>
          <div className="space-y-4">
            {[
              { num: "1", title: t("step1Title"), desc: t("step1Desc"), emoji: "🔍" },
              { num: "2", title: t("step2Title"), desc: t("step2Desc"), emoji: "📱" },
              { num: "3", title: t("step3Title"), desc: t("step3Desc"), emoji: "🍽️" },
            ].map((step) => (
              <div key={step.num} className="neu-card flex items-start gap-4">
                <div className="neu-icon-inset w-11 h-11 flex-shrink-0">
                  <span className="text-lg">{step.emoji}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-sub mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-sub">
        <div className="flex items-center justify-center gap-3">
          <p>{t("madeWithLove")}</p>
          <span>&middot;</span>
          <Link href="/about" className="hover:text-primary transition-colors">
            {t("aboutTeta")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
