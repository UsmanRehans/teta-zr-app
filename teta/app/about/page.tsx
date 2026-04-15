"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          teta
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {t("signIn")}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-5xl mb-6">🫓</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {t("ourStory")}
            </h1>
            <p className="text-lg text-foreground/60 mt-6 max-w-lg mx-auto leading-relaxed">
              {t("aboutHeroSubtitle")}
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="px-6 py-12 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t("aboutProblemTitle")}
            </h2>
            <div className="space-y-6 text-foreground/70 leading-relaxed">
              <p>{t("aboutProblemP1")}</p>
              <p>{t("aboutProblemP2")}</p>
              <p>{t("aboutProblemP3")}</p>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t("aboutSolutionTitle")}
            </h2>
            <p className="text-foreground/70 leading-relaxed mb-8 text-center max-w-lg mx-auto">
              {t("aboutSolutionSubtitle")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3">
                  🍽
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("aboutFreshMenus")}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {t("aboutFreshMenusDesc")}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3">
                  🏘
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("aboutNeighborhood")}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {t("aboutNeighborhoodDesc")}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3">
                  💵
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("aboutCash")}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {t("aboutCashDesc")}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg mb-3">
                  🤝
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t("aboutCommunity")}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {t("aboutCommunityDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Charity Wing — Sahteen */}
        <section className="px-6 py-12 bg-primary/5">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-3xl font-bold mb-2" dir="rtl">
              صحتين
            </p>
            <p className="text-sm text-foreground/50 mb-2">Sahteen</p>
            <p className="text-xs text-foreground/40 italic mb-6">
              &ldquo;Bon app&eacute;tit&rdquo; in Arabic. Said when you
              wish someone good health through food.
            </p>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {t("aboutSahteenTitle")}
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed text-start max-w-lg mx-auto">
              <p>{t("aboutSahteenP1")}</p>
              <p>{t("aboutSahteenP2")}</p>
              <p className="font-semibold text-foreground text-center pt-2">
                {t("aboutSahteenGoal")}
              </p>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="px-6 py-12 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-10 text-center">
              {t("aboutTeamTitle")}
            </h2>
            <div className="space-y-10">
              {/* Zeinab */}
              <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    👩‍🍳
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Zeinab Reda
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {t("aboutZeinabRole")}
                    </p>
                  </div>
                </div>
                <div className="text-foreground/70 leading-relaxed space-y-3 text-sm">
                  <p>{t("aboutZeinabP1")}</p>
                  <p>{t("aboutZeinabP2")}</p>
                  <p>{t("aboutZeinabP3")}</p>
                </div>
              </div>

              {/* Usman */}
              <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    💻
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Usman Rehan
                    </h3>
                    <p className="text-sm text-primary font-medium">
                      {t("aboutUsmanRole")}
                    </p>
                  </div>
                </div>
                <p className="text-foreground/70 leading-relaxed text-sm">
                  {t("aboutUsmanDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 py-16 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {t("aboutCtaTitle")}
            </h2>
            <p className="text-foreground/60 mb-8">
              {t("aboutCtaSubtitle")}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <Link
                href="/login"
                className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-full text-center hover:bg-primary-dark transition-colors"
              >
                {t("joinTeta")}
              </Link>
              <a
                href="mailto:hello@teta.lol"
                className="w-full py-3 px-6 bg-white text-primary font-semibold rounded-full text-center border-2 border-primary hover:bg-primary/5 transition-colors"
              >
                {t("wantToHelp")}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-foreground/40">
        <div className="flex items-center justify-center gap-3">
          <p>{t("madeWithLove")}</p>
          <span>&middot;</span>
          <Link
            href="/about"
            className="hover:text-primary transition-colors"
          >
            {t("aboutTeta")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
