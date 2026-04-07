"use client";

import { useTranslation } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function Header() {
  const { t, toggleLanguage } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = (
    <>
      <a href="#how" className="hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
        {t("header.howItWorks")}
      </a>
      <a href="#story" className="hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
        {t("header.story")}
      </a>
      <a href="#sahteen" className="hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
        {t("header.sahteen")}
      </a>
      <a href="#team" className="hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
        {t("header.team")}
      </a>
      <a href="/careers" className="hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
        {t("header.careers")}
      </a>
    </>
  );

  return (
    <header
      className={`sticky top-0 z-50 bg-cream/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left – wordmark */}
        <a href="#" className="flex items-center gap-1.5 text-2xl font-bold text-primary">
          teta <span className="text-lg">🍋</span>
        </a>

        {/* Center – nav (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          {navLinks}
        </nav>

        {/* Right – actions */}
        <div className="flex items-center gap-3">
          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-foreground/70 hover:text-primary transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-sm font-medium text-primary border border-primary/30 rounded-full hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {t("header.langToggle")}
          </button>
          <a
            href="https://app.ourteta.com"
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors animate-pulse-subtle"
          >
            {t("header.openApp")}
          </a>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-primary/10 bg-cream/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 text-sm font-medium text-foreground/70">
          {navLinks}
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-b from-cream to-[#FFF0E0] py-24 md:py-36 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left — text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-dark leading-tight mb-6 animate-fade-in-up">
            {t("hero.headline")}
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed animate-fade-in-up animate-fade-in-up-delay-1">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up animate-fade-in-up-delay-2">
            <a
              href="https://app.ourteta.com"
              className="px-8 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              {t("hero.primaryCta")}
            </a>
            <a
              href="https://app.ourteta.com/login?role=cook"
              className="px-8 py-3.5 text-lg font-semibold text-primary border-2 border-primary rounded-full hover:bg-primary/5 transition-colors"
            >
              {t("hero.secondaryCta")}
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center md:justify-start mt-10 animate-fade-in-up animate-fade-in-up-delay-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full border-2 border-cream bg-[#C2185B]" />
              <div className="w-8 h-8 rounded-full border-2 border-cream bg-[#A2C2E0] -ml-2" />
              <div className="w-8 h-8 rounded-full border-2 border-cream bg-[#FFB300] -ml-2" />
            </div>
            <span className="ml-3 text-sm text-foreground/60">{t("hero.socialProof")}</span>
          </div>
        </div>

        {/* Right — hero image (hidden on mobile) */}
        <div className="hidden md:block flex-1 animate-fade-in-up animate-fade-in-up-delay-2">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero-food.jpg"
              alt="Authentic Lebanese hummus and mezze spread"
              width={600}
              height={450}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats Bar                                                          */
/* ------------------------------------------------------------------ */

function StatItem({ target, label }: { target: number; label: string }) {
  const { count, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold text-primary">{count}+</div>
      <div className="text-sm text-foreground/60 uppercase tracking-wider mt-2">{label}</div>
    </div>
  );
}

function StatsBar() {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
        <StatItem target={50} label={t("stats.cooksLabel")} />
        <StatItem target={500} label={t("stats.mealsLabel")} />
        <StatItem target={5} label={t("stats.hoodsLabel")} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      num: "1",
      title: t("how.step1.title"),
      desc: t("how.step1.desc"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
      delay: "reveal-delay-1",
    },
    {
      num: "2",
      title: t("how.step2.title"),
      desc: t("how.step2.desc"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
          <path d="M3 2v7c0 1.1.9 2 2 2h4V2M7 2v20M21 15V2l-4 4-4-4v13a4 4 0 004 4h0a4 4 0 004-4z" />
        </svg>
      ),
      delay: "reveal-delay-2",
    },
    {
      num: "3",
      title: t("how.step3.title"),
      desc: t("how.step3.desc"),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
        </svg>
      ),
      delay: "reveal-delay-3",
    },
  ];

  return (
    <section id="how" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-16">
          {t("how.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`reveal ${step.delay} bg-white rounded-2xl p-8 relative overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300`}
            >
              {/* Watermark number */}
              <span className="absolute top-2 right-4 rtl:left-4 rtl:right-auto text-7xl font-bold text-primary/5 select-none">
                {step.num}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                {step.icon}
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Story (timeline)                                                   */
/* ------------------------------------------------------------------ */

function Story() {
  const { t } = useTranslation();

  const blocks = [
    { label: t("story.label1"), text: t("story.p1"), borderColor: "border-primary", badgeBg: "bg-primary/10 text-primary" },
    { label: t("story.label2"), text: t("story.p2"), borderColor: "border-[#A2C2E0]", badgeBg: "bg-[#A2C2E0]/10 text-[#A2C2E0]" },
    { label: t("story.label3"), text: t("story.p4"), borderColor: "border-[#FFB300]", badgeBg: "bg-[#FFB300]/10 text-[#FFB300]", cardBg: "bg-[#FFB300]/5" },
  ];

  return (
    <section id="story" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-12">
          {t("story.title")}
        </h2>
        {/* Beirut skyline photo */}
        <div className="reveal rounded-2xl overflow-hidden mb-10 shadow-lg">
          <Image
            src="/images/beirut-skyline.jpg"
            alt="Beirut skyline with the Lebanese flag"
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
        </div>

        <div className="space-y-8">
          {blocks.map((block, i) => (
            <div
              key={i}
              className={`reveal bg-white ${block.cardBg ?? ""} rounded-2xl p-8 border-l-4 rtl:border-l-0 rtl:border-r-4 ${block.borderColor}`}
            >
              <span className={`${block.badgeBg} text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3`}>
                {block.label}
              </span>
              <p className="text-lg leading-relaxed text-foreground/80">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

function Testimonials() {
  const { t } = useTranslation();

  const cards = [
    { quote: t("testimonials.1.quote"), name: t("testimonials.1.name"), desc: t("testimonials.1.desc"), delay: "reveal-delay-1" },
    { quote: t("testimonials.2.quote"), name: t("testimonials.2.name"), desc: t("testimonials.2.desc"), delay: "reveal-delay-2" },
    { quote: t("testimonials.3.quote"), name: t("testimonials.3.name"), desc: t("testimonials.3.desc"), delay: "reveal-delay-3" },
  ];

  const StarIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#FFB300]">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-16">
          {t("testimonials.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i} className={`reveal ${card.delay} bg-cream rounded-2xl p-8 relative`}>
              {/* Decorative quote */}
              <span className="absolute top-4 left-6 rtl:left-auto rtl:right-6 text-6xl text-primary/10 font-serif leading-none select-none">
                {"\u275D"}
              </span>
              <p className="text-foreground/80 leading-relaxed mt-8 italic">{card.quote}</p>
              <div className="flex gap-0.5 mt-4">
                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
              </div>
              <p className="font-semibold mt-3">{card.name}</p>
              <p className="text-sm text-foreground/50">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sahteen                                                            */
/* ------------------------------------------------------------------ */

function Sahteen() {
  const { t } = useTranslation();

  return (
    <section id="sahteen">
      {/* 7a — Header area */}
      <div className="py-20 px-6 bg-gradient-to-b from-[#FFF0E0] to-cream">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary mx-auto md:mx-0 mb-4">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h2 className="text-4xl font-bold text-primary-dark" dir="rtl">
              {t("sahteen.headlineAr")}
            </h2>
            <p className="text-2xl font-semibold text-primary-dark mt-1">{t("sahteen.headline")}</p>
            <p className="text-lg text-foreground/70 mt-4 max-w-2xl leading-relaxed">
              {t("sahteen.subtitle")}
            </p>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/home-cooking.jpg"
              alt="Home cook preparing a traditional Lebanese meal"
              width={500}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* 7b — 3-step charity flow */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 py-12 px-6">
        {/* Step 1 */}
        <div className="reveal reveal-delay-1 bg-white rounded-2xl p-6 text-center shadow-sm">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-primary">
              <path d="M18 11V6a2 2 0 00-2-2H8a2 2 0 00-2 2v5M5 11h14l1 9H4l1-9z" />
              <path d="M12 2v4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("sahteen.step1Title")}</h3>
          <p className="text-sm text-foreground/60 leading-relaxed">{t("sahteen.step1Desc")}</p>
        </div>

        {/* Step 2 */}
        <div className="reveal reveal-delay-2 bg-white rounded-2xl p-6 text-center shadow-sm">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-primary">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("sahteen.step2Title")}</h3>
          <p className="text-sm text-foreground/60 leading-relaxed">{t("sahteen.step2Desc")}</p>
        </div>

        {/* Step 3 */}
        <div className="reveal reveal-delay-3 bg-white rounded-2xl p-6 text-center shadow-sm">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-primary">
              <path d="M3 12h2a7 7 0 017-7h0a7 7 0 017 7h2" />
              <path d="M5 12v3a7 7 0 007 7h0a7 7 0 007-7v-3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="9" y1="3" x2="9" y2="4" />
              <line x1="15" y1="3" x2="15" y2="4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("sahteen.step3Title")}</h3>
          <p className="text-sm text-foreground/60 leading-relaxed">{t("sahteen.step3Desc")}</p>
        </div>
      </div>

      {/* 7c — Impact stats */}
      <div className="flex flex-wrap justify-center gap-12 py-8 px-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{t("sahteen.stat1")}</div>
          <div className="text-sm text-foreground/60">{t("sahteen.stat1Label")}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{t("sahteen.stat2")}</div>
          <div className="text-sm text-foreground/60">{t("sahteen.stat2Label")}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{t("sahteen.stat3")}</div>
          <div className="text-sm text-foreground/60">{t("sahteen.stat3Label")}</div>
        </div>
      </div>

      {/* 7d — Trust statement */}
      <div className="max-w-2xl mx-auto text-center py-4 px-6">
        <p className="text-lg text-foreground/70 leading-relaxed">{t("sahteen.trustStatement")}</p>
      </div>

      {/* 7e — Cultural blockquote */}
      <div className="max-w-2xl mx-auto py-8 px-6">
        <blockquote className="border-l-4 border-[#FFB300] rtl:border-l-0 rtl:border-r-4 pl-6 rtl:pl-0 rtl:pr-6">
          <p className="text-xl italic text-foreground/80">{t("sahteen.culturalQuote")}</p>
        </blockquote>
      </div>

      {/* 7f — Charity CTA */}
      <div className="text-center py-8 px-6">
        <h3 className="text-2xl font-bold text-primary-dark mb-4">{t("sahteen.ctaTitle")}</h3>
        <a
          href="mailto:hello@ourteta.com"
          className="inline-block px-8 py-3.5 text-lg font-semibold text-white bg-gradient-to-r from-primary to-primary-dark rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          {t("sahteen.ctaButton")}
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Team                                                               */
/* ------------------------------------------------------------------ */

function Team() {
  const { t } = useTranslation();

  const members = [
    {
      initials: "ZR",
      bgColor: "bg-primary",
      name: t("team.zeinab.name"),
      role: t("team.zeinab.role"),
      bio: t("team.zeinab.bio"),
      quote: t("team.zeinab.quote"),
    },
  ];

  return (
    <section id="team" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark text-center mb-16">
          {t("team.title")}
        </h2>
        <div className="grid gap-8">
          {members.map((m) => (
            <div
              key={m.initials}
              className="reveal bg-white rounded-2xl p-8 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 ${m.bgColor} rounded-full flex items-center justify-center text-white font-bold text-xl`}
                >
                  {m.initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{m.name}</h3>
                  <p className="text-primary font-medium">{m.role}</p>
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed">{m.bio}</p>
              <p className="italic text-foreground/60 mt-4">— {m.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Final CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  const { t } = useTranslation();
  return (
    <section className="bg-primary py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          {t("cta.headline")}
        </h2>
        <a
          href="https://app.ourteta.com"
          className="inline-block bg-white text-primary font-semibold px-10 py-4 rounded-full hover:shadow-lg hover:scale-105 transition-all"
        >
          {t("cta.primaryButton")}
        </a>
        <p className="mt-6">
          <a href="mailto:hello@ourteta.com" className="text-white/70 hover:text-white transition-colors underline">
            {t("cta.secondaryLink")}
          </a>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-primary/10 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div>
          <div className="flex items-center gap-1.5 text-xl font-bold text-primary">
            teta <span className="text-base">🍋</span>
          </div>
          <p className="text-sm text-foreground/50 mt-1">{t("footer.sahtteenLine")}</p>
        </div>

        {/* Right — nav + social */}
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm">
            <a href="https://app.ourteta.com" className="text-foreground/60 hover:text-primary transition-colors">
              {t("footer.openApp")}
            </a>
            <a href="#story" className="text-foreground/60 hover:text-primary transition-colors">
              {t("footer.about")}
            </a>
            <a href="mailto:hello@ourteta.com" className="text-foreground/60 hover:text-primary transition-colors">
              {t("footer.contact")}
            </a>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a href="https://instagram.com/ourteta" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/96170000000" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.13 12.06c.003-5.45 4.437-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  useRevealOnScroll();
  return (
    <div className="bg-cream min-h-screen">
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <Story />
        <Testimonials />
        {/* Full-width photo divider */}
        <div
          className="h-64 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/mezze-spread.jpg')" }}
          role="img"
          aria-label="Mediterranean mezze spread"
        />
        <Sahteen />
        <Team />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
