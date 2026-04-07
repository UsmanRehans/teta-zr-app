"use client";

import { useTranslation } from "@/lib/i18n";
import { useState, useEffect } from "react";

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
      <a href="/" className="hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
        Home
      </a>
      <a href="/careers" className="text-primary font-semibold" onClick={() => setMenuOpen(false)}>
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
        <a href="/" className="flex items-center gap-1.5 text-2xl font-bold text-primary">
          teta <span className="text-lg">🍋</span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          {navLinks}
        </nav>

        <div className="flex items-center gap-3">
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
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
          >
            {t("header.openApp")}
          </a>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-primary/10 bg-cream/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4 text-sm font-medium text-foreground/70">
          {navLinks}
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Role Card                                                          */
/* ------------------------------------------------------------------ */

interface RoleCardProps {
  borderColor: string;
  title: string;
  titleAr: string;
  type: string;
  location: string;
  desc: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string;
  t: (key: string) => string;
}

function RoleCard({
  borderColor,
  title,
  titleAr,
  type,
  location,
  desc,
  responsibilities,
  requirements,
  niceToHave,
  t,
}: RoleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-t-4 ${borderColor} hover:shadow-md transition-shadow duration-300 p-8`}
    >
      <span className="inline-block bg-accent/15 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-4">
        {type}
      </span>
      <h3 className="text-xl font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-foreground/50 mb-2" dir="rtl">{titleAr}</p>
      <p className="text-sm text-foreground/60 mb-4">{location}</p>
      <p className="text-foreground/70 leading-relaxed mb-4">{desc}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-primary text-sm font-medium hover:underline cursor-pointer"
      >
        {expanded ? t("careers.hideDetails") : t("careers.seeDetails")}
      </button>

      {expanded && (
        <div className="mt-6 space-y-5 animate-fade-in-up">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">{t("careers.responsibilities")}</h4>
            <ul className="space-y-1.5">
              {responsibilities.map((r, i) => (
                <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x2022;</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">{t("careers.requirements")}</h4>
            <ul className="space-y-1.5">
              {requirements.map((r, i) => (
                <li key={i} className="text-sm text-foreground/70 flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#x2022;</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">{t("careers.niceToHave")}</h4>
            <p className="text-sm text-foreground/70">{niceToHave}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Application Form                                                   */
/* ------------------------------------------------------------------ */

function ApplicationForm() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    university: "",
    role: "",
    why: "",
    social: "",
    heardFrom: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <p className="text-2xl font-semibold text-foreground">{t("careers.success")}</p>
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 bg-white text-foreground";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.name")} *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.phone")} *</label>
        <input
          type="text"
          required
          placeholder="+961 71 123 456"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.email")} *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* University */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.university")}</label>
        <input
          type="text"
          value={form.university}
          onChange={(e) => update("university", e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.role")} *</label>
        <select
          required
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          className={inputClasses}
        >
          <option value="">{t("careers.form.rolePlaceholder")}</option>
          <option value="Storyteller & Growth Lead">Storyteller &amp; Growth Lead</option>
          <option value="Teta Scout & Cook Relations">Teta Scout &amp; Cook Relations</option>
        </select>
      </div>

      {/* Why */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.why")} *</label>
        <textarea
          required
          rows={4}
          value={form.why}
          onChange={(e) => update("why", e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Social */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.social")}</label>
        <input
          type="text"
          placeholder="@yourhandle"
          value={form.social}
          onChange={(e) => update("social", e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Heard from */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("careers.form.heardFrom")} *</label>
        <select
          required
          value={form.heardFrom}
          onChange={(e) => update("heardFrom", e.target.value)}
          className={inputClasses}
        >
          <option value="">{t("careers.form.heardPlaceholder")}</option>
          <option value="Instagram">{t("careers.form.heardInstagram")}</option>
          <option value="TikTok">{t("careers.form.heardTikTok")}</option>
          <option value="Friend">{t("careers.form.heardFriend")}</option>
          <option value="AUB/LAU">{t("careers.form.heardUni")}</option>
          <option value="WhatsApp">{t("careers.form.heardWhatsApp")}</option>
          <option value="Other">{t("careers.form.heardOther")}</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="text-center pt-2">
        <button
          type="submit"
          disabled={sending}
          className="bg-primary text-white rounded-full px-10 py-3 font-semibold hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100 cursor-pointer"
        >
          {sending ? t("careers.form.sending") : t("careers.form.submit")}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-primary/10 py-8 px-6 text-center">
      <p className="text-sm text-foreground/50">Made with love in Beirut 🍋</p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CareersPage() {
  const { t } = useTranslation();

  const role1Resp = [
    t("careers.role1.resp1"),
    t("careers.role1.resp2"),
    t("careers.role1.resp3"),
    t("careers.role1.resp4"),
    t("careers.role1.resp5"),
  ];
  const role1Reqs = [
    t("careers.role1.req1"),
    t("careers.role1.req2"),
    t("careers.role1.req3"),
    t("careers.role1.req4"),
  ];

  const role2Resp = [
    t("careers.role2.resp1"),
    t("careers.role2.resp2"),
    t("careers.role2.resp3"),
    t("careers.role2.resp4"),
    t("careers.role2.resp5"),
  ];
  const role2Reqs = [
    t("careers.role2.req1"),
    t("careers.role2.req2"),
    t("careers.role2.req3"),
    t("careers.role2.req4"),
  ];

  return (
    <div className="bg-cream min-h-screen">
      <Header />

      <main>
        {/* Hero banner */}
        <section className="bg-gradient-to-r from-primary to-primary-dark py-20 md:py-28 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
              {t("careers.heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-4" dir="rtl">
              انضم لفريق تيتا
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t("careers.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-foreground/80 leading-relaxed mb-4">
              {t("careers.introP1")}
            </p>
            <p className="text-base font-medium text-primary">
              {t("careers.hiringIn")}
            </p>
          </div>
        </section>

        {/* Role cards */}
        <section className="px-6 pb-20">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <RoleCard
              borderColor="border-primary"
              title={t("careers.role1.title")}
              titleAr={t("careers.role1.titleAr")}
              type={t("careers.role1.type")}
              location={t("careers.role1.location")}
              desc={t("careers.role1.desc")}
              responsibilities={role1Resp}
              requirements={role1Reqs}
              niceToHave={t("careers.role1.nice")}
              t={t}
            />
            <RoleCard
              borderColor="border-secondary"
              title={t("careers.role2.title")}
              titleAr={t("careers.role2.titleAr")}
              type={t("careers.role2.type")}
              location={t("careers.role2.location")}
              desc={t("careers.role2.desc")}
              responsibilities={role2Resp}
              requirements={role2Reqs}
              niceToHave={t("careers.role2.nice")}
              t={t}
            />
          </div>
        </section>

        {/* Application form */}
        <section id="apply" className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-3">
                {t("careers.applyTitle")}
              </h2>
              <p className="text-foreground/60">{t("careers.applySubtext")}</p>
            </div>
            <ApplicationForm />
          </div>
        </section>

        {/* Questions */}
        <section className="py-12 px-6 text-center">
          <p className="text-foreground/60">{t("careers.questions")}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
