"use client";

import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Application Form                                                   */
/* ------------------------------------------------------------------ */

function ApplicationForm() {
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
      <div className="success-message">
        <div className="success-icon">🎉</div>
        <h3>Application received!</h3>
        <p>Shukran! We read every application personally and will be in touch soon. Yalla! 🙏</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className="form-row">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="text"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+961 71 123 456"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div className="form-group">
          <label>University / School (optional)</label>
          <input
            type="text"
            value={form.university}
            onChange={(e) => update("university", e.target.value)}
            placeholder="AUB, LAU, etc."
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Which role? *</label>
          <select
            required
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="Storyteller & Growth Lead">Storyteller &amp; Growth Lead</option>
            <option value="Teta Scout & Cook Relations">Teta Scout &amp; Cook Relations</option>
          </select>
        </div>
        <div className="form-group">
          <label>How did you hear about us? *</label>
          <select
            required
            value={form.heardFrom}
            onChange={(e) => update("heardFrom", e.target.value)}
          >
            <option value="">Select one</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="Friend">Friend</option>
            <option value="AUB/LAU">AUB/LAU</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-group full">
        <label>Why do you want this role? *</label>
        <textarea
          required
          rows={5}
          value={form.why}
          onChange={(e) => update("why", e.target.value)}
          placeholder="Tell us what excites you about Teta and why you'd be great for this role..."
        />
      </div>

      <div className="form-group full">
        <label>Instagram or TikTok handle (optional)</label>
        <input
          type="text"
          value={form.social}
          onChange={(e) => update("social", e.target.value)}
          placeholder="@yourhandle"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-submit">
        <button type="submit" disabled={sending} className="btn-primary">
          {sending ? "Sending..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */

const roles = [
  {
    emoji: "📣",
    title: "Storyteller & Growth Lead",
    type: "Part-time · 20 hrs/week",
    salary: "$300–$400/mo + serious equity",
    location: "Beirut, Lebanon (Remote-friendly)",
    desc: "You'll be the voice of Our Teta — telling the stories of our cooks, growing our community, and making people crave home-cooked food through content that feels real, not corporate.",
    responsibilities: [
      "Own Our Teta's Instagram, TikTok, and WhatsApp presence — make it feel alive",
      "Film and edit short videos of cooks and their dishes (the sizzle, the hands, the love)",
      "Build and engage our customer community — turn followers into regulars",
      "Run local influencer partnerships across Beirut — AUB food bloggers, neighborhood pages",
      "Track what's working and double down on it — we move fast and learn faster",
    ],
    requirements: [
      "Based in Beirut — you need to smell the food to sell it",
      "Fluent in Arabic (Lebanese dialect) and English",
      "Genuine passion for Lebanese food and community — not just a job",
      "Experience with Instagram Reels or TikTok — your own account counts, we want creators",
    ],
    niceToHave: "AUB or LAU student or recent grad. Bonus if you already know Hamra's food scene.",
  },
  {
    emoji: "🔍",
    title: "Teta Scout & Cook Relations",
    type: "Part-time · 20 hrs/week",
    salary: "$300–$400/mo + serious equity",
    location: "Beirut, Lebanon (On the ground)",
    desc: "You'll be our boots on the ground — discovering talented home cooks across Beirut, building real relationships, and making sure every teta feels supported and proud to be on the platform.",
    responsibilities: [
      "Find and sign up home cooks across Beirut neighborhoods — knock on doors, follow the smells",
      "Visit cooks at home to photograph their dishes and set up their profiles",
      "Manage the cook WhatsApp community — be the friendly face they trust",
      "Be the first point of contact when cooks have questions or need help",
      "Collect feedback from cooks and relay it to the founding team — you're their advocate",
    ],
    requirements: [
      "Based in Beirut, ideally with a scooter or car — you'll be moving",
      "Fluent in Arabic (Lebanese dialect) — the tetas don't speak startup",
      "Warm, trustworthy personality — cooks need to feel comfortable inviting you into their kitchen",
      "Organized enough to manage 30+ cook relationships without dropping anyone",
    ],
    niceToHave: "AUB or LAU student or recent grad. Knows Beirut neighborhoods well — from Achrafieh to Hamra to Dahieh.",
  },
];

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Parallax for hero
  useEffect(() => {
    const handleParallax = () => {
      const hero = document.querySelector(".hero-bg") as HTMLElement;
      const scroll = window.scrollY;
      if (hero && scroll < window.innerHeight) {
        hero.style.transform = `scale(${1.05 + scroll * 0.0002}) translateY(${scroll * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  const role = roles[activeTab];

  return (
    <>
      <Nav activePage="careers" />

      {/* HERO */}
      <section className="hero" id="home">
        <div
          className="hero-bg"
          style={{
            background: `
              linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%),
              url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1800&q=80') center/cover no-repeat
            `,
          }}
        />
        <div className="hero-content">
          <p className="hero-sub" style={{ fontStyle: "italic" }}>Careers</p>
          <h2>Come build something<br />that matters.</h2>
          <p>We&apos;re not a startup chasing growth metrics. We&apos;re neighbors feeding neighbors — and we need people who get that.</p>
          <div className="hero-buttons">
            <a href="#roles" className="btn-primary">See Open Roles</a>
            <a href="#apply" className="btn-outline">Apply Now</a>
          </div>
        </div>
      </section>

      {/* ROLE TABS */}
      <section className="careers-tabs-section" id="roles">
        {/* Tab bar */}
        <div className="careers-tab-bar">
          {roles.map((r, i) => (
            <button
              key={i}
              className={`careers-tab ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              <span className="careers-tab-emoji">{r.emoji}</span>
              {r.title}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="careers-tab-content">
          <div className="careers-tab-header">
            <div>
              <div className="careers-tab-meta">{role.type} · 📍 {role.location}</div>
              <div className="careers-tab-badges">
                <span className="role-badge salary">{role.salary}</span>
                <span className="role-badge hiring">Actively Hiring</span>
              </div>
            </div>
          </div>

          <p className="careers-tab-desc">{role.desc}</p>

          <div className="careers-tab-details">
            <div className="careers-detail-section">
              <h4>Responsibilities</h4>
              <ul>
                {role.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="careers-detail-section">
              <h4>Requirements</h4>
              <ul>
                {role.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="careers-detail-section">
              <h4>Nice to Have</h4>
              <p>{role.niceToHave}</p>
            </div>

            <div className="careers-detail-section compensation">
              <h4>Compensation</h4>
              <div className="comp-grid">
                <div className="comp-item">
                  <span className="comp-label">Salary</span>
                  <span className="comp-value">$300–$400/mo</span>
                  <span className="comp-note">Paid in USD, monthly</span>
                </div>
                <div className="comp-item">
                  <span className="comp-label">Equity</span>
                  <span className="comp-value">Real ownership</span>
                  <span className="comp-note">Serious stake, vested over 2 years</span>
                </div>
                <div className="comp-item">
                  <span className="comp-label">Schedule</span>
                  <span className="comp-value">20 hrs/week</span>
                  <span className="comp-note">Flexible hours</span>
                </div>
              </div>
            </div>
          </div>

          <a href="#apply" className="btn-primary" style={{ marginTop: "32px", display: "inline-block" }}>
            Apply for this role
          </a>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className="section-how" id="apply">
        <div className="section-title">
          <span className="section-tag">Apply</span>
          <h2>Ready? Yalla.</h2>
        </div>
        <p style={{ textAlign: "center", color: "#666", maxWidth: "500px", margin: "-60px auto 60px", fontSize: "1rem", lineHeight: "1.6" }}>
          We read every application personally. No bots, no filters — just us.
        </p>
        <ApplicationForm />
      </section>

      {/* QUESTIONS */}
      <section className="section-sahteen" style={{ padding: "60px 24px" }}>
        <p style={{ opacity: 0.6, fontSize: "0.95rem" }}>
          Questions? Reach out to us at{" "}
          <a href="mailto:hello@ourteta.com" style={{ color: "var(--color-gold)", textDecoration: "none" }}>
            hello@ourteta.com
          </a>
        </p>
      </section>

      <Footer />
    </>
  );
}
