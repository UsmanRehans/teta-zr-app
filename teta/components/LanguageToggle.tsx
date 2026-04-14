"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="neu-chip px-3 py-1.5 text-xs font-semibold rounded-full"
      aria-label="Toggle language"
    >
      {locale === "en" ? "عربي" : "EN"}
    </button>
  );
}
