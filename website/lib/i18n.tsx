"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

type Language = "en" | "ar";

const translations: Record<string, Record<Language, string>> = {
  // Header
  "header.openApp": { en: "Open App", ar: "افتح التطبيق" },
  "header.langToggle": { en: "عربي", ar: "EN" },

  // Hero
  "hero.headline": {
    en: "Home-cooked food from Beirut's best",
    ar: "أكل بيتي من أمهر طبّاخين بيروت",
  },
  "hero.subtitle": {
    en: "Discover authentic Lebanese meals made with love by neighborhood home cooks. Fresh, affordable, and just like mama used to make.",
    ar: "اكتشف أطباق لبنانية أصيلة محضّرة بحب من طبّاخين الحي. طازجة، بسعر معقول، ومثل أكل الماما بالزبط.",
  },
  "hero.browseCooks": { en: "Browse Cooks", ar: "تصفّح الطبّاخين" },
  "hero.startSelling": { en: "Start Selling", ar: "ابدأ البيع" },

  // How it works
  "how.title": { en: "How it works", ar: "كيف بتشتغل" },
  "how.step1.title": { en: "Find a cook near you", ar: "لاقي طبّاخ قريب منّك" },
  "how.step1.desc": {
    en: "Browse the map to discover home cooks in your neighborhood.",
    ar: "تصفّح الخريطة لتكتشف طبّاخين البيت بحيّك.",
  },
  "how.step2.title": { en: "Pick your dishes", ar: "اختار أطباقك" },
  "how.step2.desc": {
    en: "Choose from today's menu — every dish is freshly prepared.",
    ar: "اختار من قائمة اليوم — كل طبق محضّر طازج.",
  },
  "how.step3.title": {
    en: "Pick up or arrange delivery",
    ar: "استلم أو رتّب التوصيل",
  },
  "how.step3.desc": {
    en: "Pay cash on delivery. Simple, no fuss.",
    ar: "ادفع كاش عند الاستلام. بسيط وبدون تعقيد.",
  },

  // Story
  "story.title": { en: "The Story", ar: "القصة" },
  "story.p1": {
    en: "Beirut is full of incredible tetas and home cooks whose food rivals any restaurant — but they have no way to reach beyond their neighborhood.",
    ar: "بيروت مليانة تيتات وطبّاخين بيت أكلن بينافس أحسن المطاعم — بس ما عندن طريقة يوصلوا لأبعد من حيّن.",
  },
  "story.p2": {
    en: "Meanwhile, students, young professionals, and expats miss the taste of homemade food. They're stuck choosing between expensive restaurants and bland delivery apps.",
    ar: "بنفس الوقت، الطلّاب والموظّفين والمغتربين مشتاقين لطعمة الأكل البيتي. محصورين بين مطاعم غالية وتطبيقات توصيل بلا طعمة.",
  },
  "story.p3": {
    en: "Given the current circumstances in Lebanon, many families are struggling to afford meals. The cost of living keeps rising, and good food shouldn't be a luxury.",
    ar: "بظل الوضع الحالي بلبنان، كتير عيل عم تتعب تأمّن الأكل. غلاء المعيشة عم يزيد، والأكل المنيح ما لازم يكون رفاهية.",
  },
  "story.p4": {
    en: "Teta connects home cooks with hungry neighbors — simple, community-driven, not corporate. No commissions eating into their earnings. Just neighbors feeding neighbors.",
    ar: "تيتا بتوصل طبّاخين البيت بجيرانن الجوعانين — بسيط، من المجتمع للمجتمع، مش شركة. بلا عمولات تاكل من أرباحن. بس جيران بيطعموا جيران.",
  },

  // Sahteen
  "sahteen.title": { en: "Sahteen — The Charity Wing", ar: "صحتين — الجناح الخيري" },
  "sahteen.meaning": {
    en: "\"Sahteen\" means \"bon appétit\" — it's what you say in Lebanon when you wish someone good health through food.",
    ar: "\"صحتين\" يعني نتمنّالك الصحة من خلال الأكل — هيدي الكلمة يلي بنقولها بلبنان لمّا حدا ياكل.",
  },
  "sahteen.apply": {
    en: "People in need can apply for free meals through the platform. No paperwork, no judgment — just a warm meal when you need it.",
    ar: "الناس المحتاجة فيها تطلب وجبات مجانية من خلال المنصة. بلا ورق وبلا أحكام — بس وجبة دافية لمّا بتحتاجها.",
  },
  "sahteen.tetas": {
    en: "The tetas themselves decide who to help and where to deliver. It stays personal, the way it should be.",
    ar: "التيتات بنفسن بيقرّروا مين يساعدوا ووين يوصّلوا. بتضل شخصية، متل ما لازم تكون.",
  },
  "sahteen.culture": {
    en: "In Lebanese culture, feeding someone is the highest form of generosity. Sahteen carries that tradition into the digital age.",
    ar: "بالثقافة اللبنانية، إطعام حدا هو أعلى أشكال الكرم. صحتين بتنقل هالتقليد للعصر الرقمي.",
  },
  "sahteen.goal": {
    en: "Our goal: no one in the neighborhood goes hungry.",
    ar: "هدفنا: ما حدا بالحي يضل جوعان.",
  },

  // Team
  "team.title": { en: "The Team", ar: "الفريق" },
  "team.zeinab.name": { en: "Zeinab Reda", ar: "زينب رضا" },
  "team.zeinab.role": { en: "Founder", ar: "المؤسسة" },
  "team.zeinab.bio": {
    en: "AUB Medical Physics Resident, living in Beirut for 2 years. Got tired of eating out and missed her mom's cooking. Became close with neighbors who are talented home cooks and wanted to help them turn their passion into a business.",
    ar: "مقيمة بالفيزياء الطبية بالجامعة الأميركية ببيروت، عايشة ببيروت من سنتين. تعبت من الأكل برّا واشتاقت لطبخ أمّها. تقرّبت من جيرانها الطبّاخين الشاطرين وحبّت تساعدن يحوّلوا شغفن لشغل.",
  },
  "team.usman.name": { en: "Usman Rehan", ar: "عثمان ريحان" },
  "team.usman.role": { en: "Volunteer, Technology", ar: "متطوّع، تكنولوجيا" },
  "team.usman.bio": {
    en: "Based in America, helps build and maintain the tech behind Teta.",
    ar: "مقيم بأميركا، بيساعد يبني ويصيّن التكنولوجيا ورا تيتا.",
  },

  // CTA
  "cta.title": { en: "Join Teta today", ar: "انضم لتيتا اليوم" },
  "cta.openApp": { en: "Open Teta", ar: "افتح تيتا" },
  "cta.help": { en: "Want to help?", ar: "بدّك تساعد؟" },

  // Footer
  "footer.madeWith": {
    en: "Made with love in Beirut",
    ar: "صُنع بحب في بيروت",
  },
  "footer.openApp": { en: "Open App", ar: "افتح التطبيق" },
  "footer.about": { en: "About", ar: "عنّا" },
  "footer.contact": { en: "Contact", ar: "تواصل" },
};

interface I18nContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("teta-lang") as Language | null;
    if (saved === "en" || saved === "ar") {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("teta-lang", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, mounted]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[key]?.[language] ?? key;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
