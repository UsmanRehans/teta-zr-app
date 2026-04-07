"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="px-3 py-1.5 text-xs font-semibold rounded-full border-2 border-primary/20 bg-white text-primary hover:bg-primary/5 transition-colors"
      aria-label="Toggle language"
    >
      {locale === "en" ? "عربي" : "EN"}
    </button>
  );
}
