"use client";

import { useTranslation } from "@/lib/i18n";

function Header() {
  const { t, toggleLanguage } = useTranslation();
  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold text-primary">
          teta
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {t("header.langToggle")}
          </button>
          <a
            href="https://app.ourteta.com"
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
          >
            {t("header.openApp")}
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-7xl md:text-8xl mb-8">🍋</div>
        <h1 className="text-4xl md:text-6xl font-bold text-primary-dark leading-tight mb-6">
          {t("hero.headline")}
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://app.ourteta.com"
            className="px-8 py-3.5 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
          >
            {t("hero.browseCooks")}
          </a>
          <a
            href="https://app.ourteta.com/login?role=cook"
            className="px-8 py-3.5 text-lg font-semibold text-primary border-2 border-primary rounded-full hover:bg-primary/5 transition-colors"
          >
            {t("hero.startSelling")}
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    { icon: "📍", title: t("how.step1.title"), desc: t("how.step1.desc") },
    { icon: "🍽️", title: t("how.step2.title"), desc: t("how.step2.desc") },
    { icon: "🛵", title: t("how.step3.title"), desc: t("how.step3.desc") },
  ];
  return (
    <section id="how" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-16">
          {t("how.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="text-5xl mb-5">{step.icon}</div>
              <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-foreground/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const { t } = useTranslation();
  return (
    <section id="story" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-12">
          {t("story.title")}
        </h2>
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-6">
          <p className="text-lg leading-relaxed text-foreground/80">
            {t("story.p1")}
          </p>
          <p className="text-lg leading-relaxed text-foreground/80">
            {t("story.p2")}
          </p>
          <p className="text-lg leading-relaxed text-foreground/80">
            {t("story.p3")}
          </p>
          <p className="text-lg leading-relaxed text-foreground/80 font-medium">
            {t("story.p4")}
          </p>
        </div>
      </div>
    </section>
  );
}

function Sahteen() {
  const { t } = useTranslation();
  return (
    <section id="sahteen" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark">
            {t("sahteen.title")}
          </h2>
        </div>
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm space-y-6">
          <p className="text-lg leading-relaxed text-foreground/80 italic">
            {t("sahteen.meaning")}
          </p>
          <p className="text-lg leading-relaxed text-foreground/80">
            {t("sahteen.apply")}
          </p>
          <p className="text-lg leading-relaxed text-foreground/80">
            {t("sahteen.tetas")}
          </p>
          <p className="text-lg leading-relaxed text-foreground/80">
            {t("sahteen.culture")}
          </p>
          <p className="text-lg leading-relaxed text-primary font-semibold text-center pt-4">
            {t("sahteen.goal")}
          </p>
        </div>
      </div>
    </section>
  );
}

function Team() {
  const { t } = useTranslation();
  const members = [
    {
      name: t("team.zeinab.name"),
      role: t("team.zeinab.role"),
      bio: t("team.zeinab.bio"),
      emoji: "👩‍🍳",
    },
    {
      name: t("team.usman.name"),
      role: t("team.usman.role"),
      bio: t("team.usman.bio"),
      emoji: "💻",
    },
  ];
  return (
    <section id="team" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-16">
          {t("team.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {members.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-2xl p-8 shadow-sm text-center"
            >
              <div className="text-5xl mb-4">{m.emoji}</div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {m.name}
              </h3>
              <p className="text-primary font-medium mb-4">{m.role}</p>
              <p className="text-foreground/70 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useTranslation();
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8">
          {t("cta.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://app.ourteta.com"
            className="px-8 py-3.5 text-lg font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
          >
            {t("cta.openApp")}
          </a>
          <a
            href="mailto:hello@ourteta.com"
            className="px-8 py-3.5 text-lg font-semibold text-primary border-2 border-primary rounded-full hover:bg-primary/5 transition-colors"
          >
            {t("cta.help")}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-primary/10 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-foreground/60">
          <span>🍋</span>
          <span className="font-medium">{t("footer.madeWith")}</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <a
            href="https://app.ourteta.com"
            className="text-foreground/60 hover:text-primary transition-colors"
          >
            {t("footer.openApp")}
          </a>
          <a
            href="#story"
            className="text-foreground/60 hover:text-primary transition-colors"
          >
            {t("footer.about")}
          </a>
          <a
            href="mailto:hello@ourteta.com"
            className="text-foreground/60 hover:text-primary transition-colors"
          >
            {t("footer.contact")}
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Story />
        <Sahteen />
        <Team />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
