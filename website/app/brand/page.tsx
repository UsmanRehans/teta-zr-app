"use client";

import { useState, useEffect, FormEvent } from "react";

/* ------------------------------------------------------------------ */
/*  Password Gate                                                      */
/* ------------------------------------------------------------------ */

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (username === "usman" && password === "zeinab") {
      sessionStorage.setItem("brand_auth", "true");
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-primary mb-2">teta</p>
          <h1 className="text-xl font-semibold text-foreground">
            Brand Guidelines — Access Required
          </h1>
          <p className="text-sm text-foreground/50 mt-2">
            This page is for internal use only.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(false);
              }}
              className="w-full rounded-xl border border-foreground/10 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full rounded-xl border border-foreground/10 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">
              Incorrect credentials. Try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-full py-2.5 text-sm transition"
          >
            View Brand Guidelines
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="border-b border-foreground/10 pb-4 mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-foreground/50 mt-1 text-base">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Color swatch                                                       */
/* ------------------------------------------------------------------ */

function ColorSwatch({
  hex,
  name,
  usage,
  textLight,
}: {
  hex: string;
  name: string;
  usage: string;
  textLight?: boolean;
}) {
  return (
    <div className="flex-1 min-w-[200px]">
      <div
        className="w-full h-24 rounded-xl flex items-end p-3"
        style={{ backgroundColor: hex }}
      >
        <span
          className={`text-xs font-mono font-semibold ${
            textLight ? "text-white" : "text-foreground/70"
          }`}
        >
          {hex}
        </span>
      </div>
      <p className="font-semibold text-sm mt-2">{name}</p>
      <p className="text-xs text-foreground/50">{usage}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Star component                                                     */
/* ------------------------------------------------------------------ */

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-accent" : "text-foreground/15"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand Content                                                      */
/* ------------------------------------------------------------------ */

function BrandContent() {
  const NAV_ITEMS = [
    { id: "overview", label: "Overview" },
    { id: "colors", label: "Colors" },
    { id: "typography", label: "Typography" },
    { id: "logo", label: "Logo" },
    { id: "tone", label: "Tone of Voice" },
    { id: "photography", label: "Photography" },
    { id: "social", label: "Social Media" },
    { id: "components", label: "UI Components" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-foreground/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">teta</span>
          <span className="text-xs font-medium text-foreground/40 tracking-wider uppercase">
            Brand Guidelines
          </span>
        </div>
        {/* Section nav */}
        <div className="max-w-5xl mx-auto px-6 pb-3 flex gap-3 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-xs font-medium text-foreground/40 hover:text-primary whitespace-nowrap transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* ============ 1. Brand Overview ============ */}
        <Section
          id="overview"
          title="Brand Overview"
          subtitle="Who we are and what we stand for"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground/40 mb-1">
                  Brand Name
                </p>
                <p className="text-2xl font-bold">
                  Teta{" "}
                  <span className="font-normal text-foreground/40">(تيتا)</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/40 mb-1">
                  Tagline
                </p>
                <p className="text-lg font-semibold text-primary">
                  Home-cooked food from Beirut&apos;s best
                </p>
                <p className="text-base text-foreground/50 font-[family-name:var(--font-arabic)]" dir="rtl">
                  أكل بيتي من أمهر طبّاخين بيروت
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/40 mb-1">
                  Mission
                </p>
                <p className="text-base leading-relaxed text-foreground/70">
                  Connecting home cooks with hungry neighbors in Beirut.
                  Community-first, not corporate.
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/40 mb-3">
                Values
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    title: "Community",
                    desc: "Neighbors feeding neighbors",
                  },
                  {
                    title: "Authenticity",
                    desc: "Real food, real people",
                  },
                  {
                    title: "Generosity",
                    desc: "Share what you have",
                  },
                  {
                    title: "Lebanese Pride",
                    desc: "Our culture, our flavor",
                  },
                ].map((v) => (
                  <div
                    key={v.title}
                    className="bg-white rounded-2xl p-5 shadow-sm"
                  >
                    <p className="font-semibold text-sm">{v.title}</p>
                    <p className="text-xs text-foreground/50 mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ============ 2. Color Palette ============ */}
        <Section
          id="colors"
          title="Color Palette"
          subtitle="Our colors reflect warmth, community, and Lebanese heritage"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ColorSwatch
              hex="#C2185B"
              name="Burgundy (Sumac Red)"
              usage="Main brand color. CTAs, headings, key UI elements."
              textLight
            />
            <ColorSwatch
              hex="#A2C2E0"
              name="Mediterranean Blue"
              usage="Supporting color. Cards, highlights, secondary elements."
            />
            <ColorSwatch
              hex="#FFB300"
              name="Golden Amber"
              usage="Warm highlights, stars, ratings, special callouts."
            />
            <ColorSwatch
              hex="#F4A460"
              name="Sandy Sesame"
              usage="Subtle warm tones, borders, backgrounds."
            />
            <ColorSwatch
              hex="#2D5016"
              name="Cedar Green"
              usage="Heritage accents only. Sparingly used for Lebanese cultural references."
              textLight
            />
            <ColorSwatch
              hex="#FFFBF0"
              name="Warm Cream"
              usage="Primary background color."
            />
            <ColorSwatch
              hex="#2C2C2C"
              name="Dark Charcoal"
              usage="Body text."
              textLight
            />
          </div>
        </Section>

        {/* ============ 3. Typography ============ */}
        <Section
          id="typography"
          title="Typography"
          subtitle="Inter for Latin, Noto Sans Arabic for Arabic text"
        >
          <div className="space-y-10">
            {/* Font families */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3">
                  Primary — Inter
                </p>
                <p className="text-3xl font-bold">
                  The quick brown fox jumps over the lazy dog
                </p>
                <p className="text-base text-foreground/50 mt-2">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3">
                  Arabic — Noto Sans Arabic
                </p>
                <p
                  className="text-3xl font-bold font-[family-name:var(--font-arabic)]"
                  dir="rtl"
                >
                  أكل بيتي من أمهر طبّاخين بيروت
                </p>
                <p
                  className="text-base text-foreground/50 mt-2 font-[family-name:var(--font-arabic)]"
                  dir="rtl"
                >
                  أبجد هوز حطي كلمن سعفص قرشت
                </p>
              </div>
            </div>

            {/* Heading scale */}
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-5">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-4">
                Heading Scale
              </p>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-foreground/30 w-20 shrink-0 font-mono">
                    text-4xl
                  </span>
                  <p className="text-4xl font-bold">Heading 1</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-foreground/30 w-20 shrink-0 font-mono">
                    text-3xl
                  </span>
                  <p className="text-3xl font-bold">Heading 2</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-foreground/30 w-20 shrink-0 font-mono">
                    text-2xl
                  </span>
                  <p className="text-2xl font-semibold">Heading 3</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-foreground/30 w-20 shrink-0 font-mono">
                    text-xl
                  </span>
                  <p className="text-xl font-semibold">Heading 4</p>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-xs text-foreground/30 w-20 shrink-0 font-mono">
                    text-base
                  </span>
                  <p className="text-base leading-relaxed">
                    Body text — text-base with leading-relaxed for comfortable
                    reading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============ 4. Logo & Wordmark ============ */}
        <Section
          id="logo"
          title="Logo & Wordmark"
          subtitle="Our logo is the word 'teta' — always lowercase, always bold"
        >
          <div className="space-y-10">
            {/* Size showcase */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-6">
                Sizes
              </p>
              <div className="flex items-end gap-10">
                <div className="text-center">
                  <span className="text-lg font-bold text-primary">teta</span>
                  <p className="text-xs text-foreground/30 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">teta</span>
                  <p className="text-xs text-foreground/30 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <span className="text-6xl font-bold text-primary">teta</span>
                  <p className="text-xs text-foreground/30 mt-2">Large</p>
                </div>
              </div>
            </div>

            {/* Light vs dark */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-4">
                  On Light Background
                </p>
                <span className="text-4xl font-bold text-primary">teta</span>
              </div>
              <div className="bg-foreground rounded-2xl p-8 text-center">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">
                  On Dark Background
                </p>
                <span className="text-4xl font-bold text-white">teta</span>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-cedar/20">
                <p className="text-sm font-semibold text-cedar mb-4">
                  &#10003; Do
                </p>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li>Always lowercase: <span className="font-bold text-primary">teta</span></li>
                  <li>Always in primary color (on light bg) or white (on dark bg)</li>
                  <li>Keep clear space around the wordmark</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-200">
                <p className="text-sm font-semibold text-red-500 mb-4">
                  &#10007; Don&apos;t
                </p>
                <ul className="space-y-2 text-sm text-foreground/60">
                  <li>
                    Never all caps:{" "}
                    <span className="font-bold text-foreground/30 line-through">
                      TETA
                    </span>
                  </li>
                  <li>
                    Never in other colors:{" "}
                    <span className="font-bold text-blue-400 line-through">
                      teta
                    </span>
                  </li>
                  <li>
                    Never with effects/shadows:{" "}
                    <span className="font-bold text-foreground/30 line-through" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                      teta
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ============ 5. Tone of Voice ============ */}
        <Section
          id="tone"
          title="Tone of Voice"
          subtitle="Warm, personal, community-focused — never corporate"
        >
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
              <p className="text-sm font-semibold">Guiding Principles</p>
              <ul className="space-y-2 text-sm text-foreground/60 leading-relaxed">
                <li>
                  <strong className="text-foreground/80">Warm &amp; personal</strong> — Write
                  like you&apos;re texting a friend, not drafting a press release.
                </li>
                <li>
                  <strong className="text-foreground/80">Lebanese dialect</strong> — Use Lebanese
                  Arabic (&quot;شو&quot; not &quot;ماذا&quot;, &quot;كيفك&quot; not
                  &quot;كيف حالك&quot;).
                </li>
                <li>
                  <strong className="text-foreground/80">Light humor</strong> — A smile, not a
                  stand-up routine.
                </li>
                <li>
                  <strong className="text-foreground/80">Never corporate</strong> — No jargon, no
                  buzzwords, no &quot;synergy&quot;.
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-cedar/20">
                <p className="text-sm font-semibold text-cedar mb-4">
                  &#10003; Good Copy
                </p>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li>&quot;Yalla, your kibbeh is waiting!&quot;</li>
                  <li>
                    &quot;No one in the neighborhood goes hungry&quot;
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-200">
                <p className="text-sm font-semibold text-red-500 mb-4">
                  &#10007; Bad Copy
                </p>
                <ul className="space-y-3 text-sm text-foreground/70">
                  <li>
                    &quot;Please proceed to view available menu items&quot;
                  </li>
                  <li>
                    &quot;Our charitable initiative aims to reduce food
                    insecurity&quot;
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* ============ 6. Photography Style ============ */}
        <Section
          id="photography"
          title="Photography Style"
          subtitle="Warm, real, inviting — like walking into a Lebanese kitchen"
        >
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <ul className="space-y-2 text-sm text-foreground/60 leading-relaxed">
                <li>Warm, natural lighting — no harsh flash</li>
                <li>Real food, not styled or artificial looking</li>
                <li>People in real kitchens, not studios</li>
                <li>Beirut streets and neighborhoods</li>
                <li>Colors should feel warm and match the brand palette</li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: "Cook in her kitchen",
                  color: "bg-warm/30",
                },
                {
                  label: "Fresh mana'oushe on table",
                  color: "bg-primary/10",
                },
                {
                  label: "Beirut neighborhood street",
                  color: "bg-secondary/30",
                },
                {
                  label: "Hands shaping kibbeh",
                  color: "bg-warm/20",
                },
                {
                  label: "Family sharing a meal",
                  color: "bg-accent/20",
                },
                {
                  label: "Delivery arriving at door",
                  color: "bg-cedar/10",
                },
              ].map((p) => (
                <div
                  key={p.label}
                  className={`${p.color} rounded-2xl h-48 flex items-center justify-center p-4`}
                >
                  <span className="text-sm text-foreground/40 text-center font-medium">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ============ 7. Social Media ============ */}
        <Section
          id="social"
          title="Social Media Guidelines"
          subtitle="How we show up on every platform"
        >
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  platform: "Instagram",
                  content:
                    "Warm food photos, cook spotlights, behind-the-scenes, Sahteen stories",
                  freq: "3-5x / week",
                },
                {
                  platform: "TikTok",
                  content:
                    "Quick recipe videos, cook day-in-life, funny moments",
                  freq: "2-3x / week",
                },
                {
                  platform: "Facebook",
                  content:
                    "Community updates, charity impact, cook features",
                  freq: "2-3x / week",
                },
              ].map((s) => (
                <div
                  key={s.platform}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <p className="font-semibold text-sm">{s.platform}</p>
                  <p className="text-sm text-foreground/50 mt-1">
                    {s.content}
                  </p>
                  <p className="text-xs text-primary font-medium mt-3">
                    {s.freq}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-semibold mb-3">Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "#Teta",
                  "#OurTeta",
                  "#TetaFood",
                  "#SahteenBeirut",
                  "#HomeCookedBeirut",
                  "#طبخ_بيتي",
                  "#تيتا",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ============ 8. UI Components Showcase ============ */}
        <Section
          id="components"
          title="UI Components"
          subtitle="Reusable building blocks across the product"
        >
          <div className="space-y-10">
            {/* Buttons */}
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
                Buttons
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-full px-6 py-2.5 text-sm transition">
                  Primary Button
                </button>
                <button className="border-2 border-primary text-primary font-semibold rounded-full px-6 py-2.5 text-sm hover:bg-primary/5 transition">
                  Secondary Button
                </button>
                <button className="text-primary font-semibold text-sm hover:underline transition">
                  Text Link
                </button>
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
                Card
              </p>
              <div className="max-w-xs">
                <div className="bg-white rounded-2xl shadow-sm border border-foreground/5 overflow-hidden">
                  <div className="bg-warm/20 h-36 flex items-center justify-center">
                    <span className="text-sm text-foreground/30">
                      Food Photo
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm">
                      Kibbeh bil Sanieh
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      By Um Ali — Achrafieh
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} filled={i <= 4} />
                      ))}
                      <span className="text-xs text-foreground/40 ml-1">
                        4.0
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-primary text-sm">
                        85,000 LBP
                      </span>
                      <button className="bg-primary text-white text-xs font-semibold rounded-full px-4 py-1.5">
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
                Badges &amp; Tags
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  Lebanese
                </span>
                <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  Homemade
                </span>
                <span className="bg-accent/15 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  Popular
                </span>
                <span className="bg-cedar/10 text-cedar text-xs font-medium px-3 py-1.5 rounded-full">
                  Sahteen Verified
                </span>
                <span className="bg-secondary/20 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  New Cook
                </span>
              </div>
            </div>

            {/* Star Rating */}
            <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
                Star Rating
              </p>
              <div className="space-y-3">
                {[5, 4, 3].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} filled={i <= rating} />
                      ))}
                    </div>
                    <span className="text-sm text-foreground/40">
                      {rating}.0
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="text-center pt-16 pb-8 border-t border-foreground/5">
          <p className="text-4xl font-bold text-primary mb-2">teta</p>
          <p className="text-xs text-foreground/30">
            Brand Guidelines — Internal Use Only — Last updated April 2026
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function BrandPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("brand_auth") === "true") {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="text-2xl font-bold text-primary animate-pulse">
          teta
        </span>
      </div>
    );
  }

  if (!authed) {
    return <LoginGate onSuccess={() => setAuthed(true)} />;
  }

  return <BrandContent />;
}
