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
  "header.howItWorks": { en: "How It Works", ar: "كيف بتشتغل" },
  "header.story": { en: "Our Story", ar: "قصتنا" },
  "header.sahteen": { en: "Sahteen", ar: "صحتين" },
  "header.team": { en: "Team", ar: "الفريق" },
  "header.careers": { en: "Careers", ar: "وظائف" },

  // Hero
  "hero.headline": {
    en: "Taste home, even when you're far from it",
    ar: "طعمة البيت، حتى لو بعيد عنّو",
  },
  "hero.subtitle": {
    en: "Authentic meals from Beirut's best home cooks. Fresh, affordable, and just like mama used to make.",
    ar: "أطباق أصيلة من أمهر طبّاخين بيروت. طازجة، بسعر معقول، ومتل ما بتعملها الماما.",
  },
  "hero.browseCooks": { en: "Browse Cooks", ar: "تصفّح الطبّاخين" },
  "hero.startSelling": { en: "Start Selling", ar: "ابدأ البيع" },
  "hero.primaryCta": { en: "Order Your First Meal", ar: "اطلب أول وجبة" },
  "hero.secondaryCta": { en: "Become a Cook", ar: "صير/ي طبّاخ/ة" },
  "hero.socialProof": { en: "Trusted by 50+ home cooks across Beirut", ar: "موثوق من قبل ٥٠+ طبّاخ بيتي ببيروت" },

  // Stats
  "stats.cooksCount": { en: "50+", ar: "٥٠+" },
  "stats.cooksLabel": { en: "Home Cooks", ar: "طبّاخ بيتي" },
  "stats.mealsCount": { en: "500+", ar: "٥٠٠+" },
  "stats.mealsLabel": { en: "Meals Shared", ar: "وجبة مشتركة" },
  "stats.hoodsCount": { en: "5", ar: "٥" },
  "stats.hoodsLabel": { en: "Neighborhoods", ar: "أحياء" },

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
  "story.label1": { en: "The Problem", ar: "المشكلة" },
  "story.label2": { en: "The Reality", ar: "الواقع" },
  "story.label3": { en: "The Solution", ar: "الحل" },
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

  // Testimonials
  "testimonials.title": { en: "What Our Neighbors Say", ar: "شو عم يقولوا جيراننا" },
  "testimonials.1.quote": {
    en: "I haven't cooked in weeks — Teta's tabbouleh tastes exactly like my mom's. I'm hooked.",
    ar: "ما طبخت من أسابيع — تبولة تيتا طعمتها بالزبط متل يلي بتعملها أمي. ما فيي وقّف.",
  },
  "testimonials.1.name": { en: "Sarah M.", ar: "سارة م." },
  "testimonials.1.desc": { en: "Student in Hamra", ar: "طالبة بالحمرا" },
  "testimonials.2.quote": {
    en: "I started selling my kibbeh through Teta and now I have regular customers every week. It changed my life.",
    ar: "بلّشت بيع الكبة عتيتا وهلق عندي زبائن دائمين كل أسبوع. غيّرت حياتي.",
  },
  "testimonials.2.name": { en: "Um Ali", ar: "أم علي" },
  "testimonials.2.desc": { en: "Home cook in Achrafieh", ar: "طبّاخة بيت بالأشرفية" },
  "testimonials.3.quote": {
    en: "As an expat, finding real home-cooked Lebanese food was impossible until Teta. Now it's just a tap away.",
    ar: "كمغترب، كان مستحيل لاقي أكل لبناني بيتي حقيقي قبل تيتا. هلق صار على بعد ضغطة.",
  },
  "testimonials.3.name": { en: "Rami K.", ar: "رامي ك." },
  "testimonials.3.desc": { en: "Working in Mar Mikhael", ar: "بيشتغل بمار مخايل" },

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
  "sahteen.headlineAr": { en: "صحتين", ar: "صحتين" },
  "sahteen.subtitle": {
    en: "\"Sahteen\" means \"bon appetit\" in Lebanese — it's what we say when we wish someone health through food.",
    ar: "\"صحتين\" يعني نتمنّالك الصحة من خلال الأكل — هيدي الكلمة يلي بنقولها بلبنان لمّا حدا ياكل.",
  },
  "sahteen.headline": { en: "No One Goes Hungry", ar: "ما حدا يضل جوعان" },
  "sahteen.subheadline": {
    en: "\"Sahteen\" — said when you wish someone health through food. It's how we say bon appétit in Lebanon.",
    ar: "\"صحتين\" — بنقولها لمّا نتمنّى لحدا الصحة من خلال الأكل. هيك منقول بالعافية بلبنان.",
  },
  "sahteen.step1Title": { en: "Apply for a meal", ar: "قدّم طلب لوجبة" },
  "sahteen.step1Desc": {
    en: "Anyone in need can request a free meal through the platform. No paperwork, no judgment.",
    ar: "أي حدا محتاج فيه يطلب وجبة مجانية من المنصة. بلا ورق، بلا أحكام.",
  },
  "sahteen.step2Title": { en: "Tetas choose to help", ar: "التيتات بتختار تساعد" },
  "sahteen.step2Desc": {
    en: "The home cooks themselves decide who to help. It stays personal, neighbor to neighbor.",
    ar: "طبّاخين البيت بنفسن بيقرّروا مين يساعدوا. بتضل شخصية، من جار لجار.",
  },
  "sahteen.step3Title": { en: "A warm meal arrives", ar: "بتوصل وجبة دافية" },
  "sahteen.step3Desc": {
    en: "A fresh home-cooked meal delivered with care. Because everyone deserves to eat well.",
    ar: "وجبة بيتية طازجة موصّلة بحب. لأنو كل حدا بيستاهل ياكل منيح.",
  },
  "sahteen.stat1": { en: "100+", ar: "١٠٠+" },
  "sahteen.stat1Label": { en: "Meals Donated", ar: "وجبة متبرّع فيها" },
  "sahteen.stat2": { en: "Zero", ar: "صفر" },
  "sahteen.stat2Label": { en: "Paperwork Required", ar: "ورق مطلوب" },
  "sahteen.stat3": { en: "100%", ar: "١٠٠٪" },
  "sahteen.stat3Label": { en: "Community-Driven", ar: "من المجتمع" },
  "sahteen.trustStatement": {
    en: "Every donation stays in your neighborhood. The tetas themselves decide who needs help most.",
    ar: "كل تبرّع بيضل بحيّك. التيتات بنفسن بيقرّروا مين أكتر محتاج.",
  },
  "sahteen.culturalQuote": {
    en: "In Lebanese culture, feeding someone is the highest form of generosity.",
    ar: "بالثقافة اللبنانية، إطعام حدا هو أعلى أشكال الكرم.",
  },
  "sahteen.ctaTitle": { en: "Want to help feed your neighbors?", ar: "بدّك تساعد تطعم جيرانك؟" },
  "sahteen.ctaButton": { en: "Donate a Meal", ar: "تبرّع بوجبة" },

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

  "team.zeinab.quote": {
    en: "I missed my mom's cooking, so I built a way for everyone to share theirs.",
    ar: "اشتقت لطبخ أمي، فبنيت طريقة ليشارك الكل طبخاتن.",
  },
  "team.usman.quote": {
    en: "Good tech should connect people, not replace them.",
    ar: "التكنولوجيا المنيحة لازم توصّل الناس ببعض، مش تستبدلن.",
  },

  // CTA
  "cta.title": { en: "Join Teta today", ar: "انضم لتيتا اليوم" },
  "cta.openApp": { en: "Open Teta", ar: "افتح تيتا" },
  "cta.help": { en: "Want to help?", ar: "بدّك تساعد؟" },
  "cta.headline": { en: "Your next home-cooked meal is waiting", ar: "وجبتك البيتية الجاي عم تستنّاك" },
  "cta.primaryButton": { en: "Open Teta", ar: "افتح تيتا" },
  "cta.secondaryLink": { en: "Questions? Email us", ar: "أسئلة؟ راسلنا" },

  // Careers
  "careers.heroTitle": { en: "Join Our Teta", ar: "انضم لفريق تيتا" },
  "careers.heroSubtitle": { en: "Help us feed Beirut, one meal at a time", ar: "ساعدنا نطعم بيروت، وجبة بوجبة" },
  "careers.introP1": {
    en: "We're building something different — a food platform that actually cares about the community it serves. No venture capital, no growth-at-all-costs. Just neighbors feeding neighbors.",
    ar: "عم نبني شي مختلف — منصة أكل فعلاً مهتمة بالمجتمع يلي بتخدمو. بلا رأس مال مخاطر، بلا نمو على حساب كل شي. بس جيران بيطعموا جيران.",
  },
  "careers.hiringIn": { en: "Currently hiring in Beirut 🇱🇧", ar: "عم نوظّف ببيروت حالياً 🇱🇧" },

  "careers.role1.title": { en: "Storyteller & Growth Lead", ar: "مسؤول النمو والتواصل" },
  "careers.role1.titleAr": { en: "مسؤول النمو والتواصل", ar: "مسؤول النمو والتواصل" },
  "careers.role1.type": { en: "Part-time · 20 hrs/week · Paid in USD", ar: "دوام جزئي · ٢٠ ساعة/أسبوع · الدفع بالدولار" },
  "careers.role1.location": { en: "📍 Beirut, Lebanon (Remote-friendly)", ar: "📍 بيروت، لبنان (ممكن عن بعد)" },
  "careers.role1.desc": {
    en: "You'll be the voice of Our Teta — telling the stories of our cooks, growing our community, and making people crave home-cooked food through content that feels real.",
    ar: "رح تكون صوت تيتا — بتحكي قصص طبّاخينا، بتكبّر مجتمعنا، وبتخلّي الناس تشتهي الأكل البيتي من خلال محتوى حقيقي.",
  },
  "careers.role1.resp1": { en: "Manage Our Teta's Instagram, TikTok, and WhatsApp presence", ar: "إدارة حسابات تيتا عانستغرام وتيك توك وواتساب" },
  "careers.role1.resp2": { en: "Film and edit short videos of cooks and their dishes", ar: "تصوير ومونتاج فيديوات قصيرة للطبّاخين وأطباقن" },
  "careers.role1.resp3": { en: "Build and engage our customer community", ar: "بناء وتفعيل مجتمع الزبائن" },
  "careers.role1.resp4": { en: "Run local influencer partnerships in Beirut", ar: "إدارة شراكات مع مؤثرين محليين ببيروت" },
  "careers.role1.resp5": { en: "Track what's working and double down on it", ar: "تتبّع شو عم ينجح وركّز عليه أكتر" },
  "careers.role1.req1": { en: "Based in Beirut", ar: "مقيم/ة ببيروت" },
  "careers.role1.req2": { en: "Fluent in Arabic and English", ar: "بتحكي عربي وإنكليزي بطلاقة" },
  "careers.role1.req3": { en: "Genuine passion for Lebanese food and community", ar: "شغف حقيقي بالأكل اللبناني والمجتمع" },
  "careers.role1.req4": { en: "Experience with Instagram Reels or TikTok (your own account counts)", ar: "خبرة بريلز إنستغرام أو تيك توك (حسابك الشخصي بيحتسب)" },
  "careers.role1.nice": { en: "AUB or LAU student or recent grad", ar: "طالب/ة أو خرّيج/ة من الـ AUB أو الـ LAU" },

  "careers.role2.title": { en: "Teta Scout & Cook Relations", ar: "كاشف التيتات ومسؤول العلاقات" },
  "careers.role2.titleAr": { en: "كاشف التيتات ومسؤول العلاقات", ar: "كاشف التيتات ومسؤول العلاقات" },
  "careers.role2.type": { en: "Part-time · 20 hrs/week · Paid in USD", ar: "دوام جزئي · ٢٠ ساعة/أسبوع · الدفع بالدولار" },
  "careers.role2.location": { en: "📍 Beirut, Lebanon (On the ground)", ar: "📍 بيروت، لبنان (على الأرض)" },
  "careers.role2.desc": {
    en: "You'll be our boots on the ground — discovering talented home cooks across Beirut, building real relationships, and making sure every cook feels supported.",
    ar: "رح تكون على الأرض — بتكتشف طبّاخين بيت شاطرين بكل بيروت، بتبني علاقات حقيقية، وبتتأكّد إنو كل طبّاخ/ة حاسس/ة بالدعم.",
  },
  "careers.role2.resp1": { en: "Find and sign up home cooks across Beirut neighborhoods", ar: "إيجاد وتسجيل طبّاخين بيت بأحياء بيروت" },
  "careers.role2.resp2": { en: "Visit cooks at home to photograph their dishes and set up profiles", ar: "زيارة الطبّاخين ببيوتن لتصوير أطباقن وتجهيز بروفايلاتن" },
  "careers.role2.resp3": { en: "Manage the cook WhatsApp community", ar: "إدارة مجتمع الطبّاخين على واتساب" },
  "careers.role2.resp4": { en: "Be the first point of contact when cooks have questions", ar: "تكون أول حدا بيتواصلوا معو الطبّاخين لمّا عندن أسئلة" },
  "careers.role2.resp5": { en: "Collect feedback from cooks and relay it to the founding team", ar: "جمع ملاحظات الطبّاخين وإيصالها لفريق التأسيس" },
  "careers.role2.req1": { en: "Based in Beirut, ideally with a scooter or car", ar: "مقيم/ة ببيروت، ويفضّل معك سكوتر أو سيارة" },
  "careers.role2.req2": { en: "Fluent in Arabic (Lebanese dialect)", ar: "بتحكي عربي (لهجة لبنانية) بطلاقة" },
  "careers.role2.req3": { en: "Warm, trustworthy personality — cooks need to feel comfortable inviting you in", ar: "شخصية دافية وموثوقة — الطبّاخين لازم يحسّوا بالراحة يستقبلوك" },
  "careers.role2.req4": { en: "Organized enough to manage 30+ cook relationships", ar: "منظّم/ة كفاية تدير ٣٠+ علاقة مع طبّاخين" },
  "careers.role2.nice": { en: "AUB or LAU student or recent grad, knows Beirut neighborhoods well", ar: "طالب/ة أو خرّيج/ة من الـ AUB أو الـ LAU، بيعرف أحياء بيروت منيح" },

  "careers.applyTitle": { en: "Apply Now", ar: "قدّم الآن" },
  "careers.applySubtext": { en: "We read every application personally.", ar: "منقرا كل طلب شخصياً." },
  "careers.form.name": { en: "Full Name", ar: "الاسم الكامل" },
  "careers.form.phone": { en: "Phone Number", ar: "رقم الهاتف" },
  "careers.form.email": { en: "Email", ar: "الإيميل" },
  "careers.form.university": { en: "University / School (optional)", ar: "الجامعة / المدرسة (اختياري)" },
  "careers.form.role": { en: "Which role?", ar: "أي وظيفة؟" },
  "careers.form.rolePlaceholder": { en: "Select a role", ar: "اختار وظيفة" },
  "careers.form.why": { en: "Why do you want this role?", ar: "ليش بدّك هالوظيفة؟" },
  "careers.form.social": { en: "Instagram or TikTok handle (optional)", ar: "حساب إنستغرام أو تيك توك (اختياري)" },
  "careers.form.heardFrom": { en: "How did you hear about us?", ar: "كيف سمعت فينا؟" },
  "careers.form.heardPlaceholder": { en: "Select one", ar: "اختار" },
  "careers.form.heardInstagram": { en: "Instagram", ar: "إنستغرام" },
  "careers.form.heardTikTok": { en: "TikTok", ar: "تيك توك" },
  "careers.form.heardFriend": { en: "Friend", ar: "صديق/ة" },
  "careers.form.heardUni": { en: "AUB/LAU", ar: "AUB/LAU" },
  "careers.form.heardWhatsApp": { en: "WhatsApp", ar: "واتساب" },
  "careers.form.heardOther": { en: "Other", ar: "غيرو" },
  "careers.form.submit": { en: "Submit Application", ar: "قدّم الطلب" },
  "careers.form.sending": { en: "Sending...", ar: "عم نبعت..." },
  "careers.success": { en: "شكراً! We'll be in touch soon — yalla! 🙏", ar: "شكراً! رح نتواصل معك قريباً — يلّا! 🙏" },
  "careers.seeDetails": { en: "See full details ▼", ar: "شوف كل التفاصيل ▼" },
  "careers.hideDetails": { en: "Hide details ▲", ar: "خبّي التفاصيل ▲" },
  "careers.questions": { en: "Questions? Reach out to us at hello@ourteta.com", ar: "أسئلة؟ تواصلوا معنا على hello@ourteta.com" },
  "careers.responsibilities": { en: "Responsibilities", ar: "المسؤوليات" },
  "careers.requirements": { en: "Requirements", ar: "المتطلبات" },
  "careers.niceToHave": { en: "Nice to have", ar: "ميزة إضافية" },

  // Footer
  "footer.madeWith": {
    en: "Made with love in Beirut",
    ar: "صُنع بحب في بيروت",
  },
  "footer.openApp": { en: "Open App", ar: "افتح التطبيق" },
  "footer.about": { en: "About", ar: "عنّا" },
  "footer.contact": { en: "Contact", ar: "تواصل" },
  "footer.sahtteenLine": {
    en: "Part of the Sahteen initiative — feeding Beirut, one meal at a time",
    ar: "جزء من مبادرة صحتين — منطعم بيروت، وجبة بوجبة",
  },
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
