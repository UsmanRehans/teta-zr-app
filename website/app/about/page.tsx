"use client";

import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export default function About() {
  useRevealOnScroll();

  return (
    <>
      <Nav activePage="about" />

      {/* HERO */}
      <section className="story-hero" id="home">
        <div className="section-title reveal">
          <span className="section-tag">About Us</span>
          <h2>Built from a craving</h2>
        </div>
        <p style={{ color: "var(--color-text-light)", maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem", lineHeight: "1.7" }}>
          What started as missing home-cooked food became a mission to connect communities through every meal.
        </p>
      </section>

      {/* THE STORY */}
      <section className="story-hero" style={{ padding: "60px 24px 120px" }}>
        <div className="story-grid" style={{ margin: "0 auto", textAlign: "left" }}>
          <div className="story-card reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="emoji">💔</span>
            <h3>The Problem</h3>
            <p>
              Beirut is home to thousands of talented home cooks whose culinary expertise rarely extends beyond their immediate neighbors. Meanwhile, an entire generation of students, professionals, and expats struggle to find authentic, affordable home-cooked meals.
            </p>
          </div>
          <div className="story-card reveal" style={{ transitionDelay: "0.25s" }}>
            <span className="emoji">🍽️</span>
            <h3>The Reality</h3>
            <p>
              The market is saturated with overpriced restaurants and generic delivery apps that prioritize speed over quality. Home cooks — many of them women with decades of experience — have no viable path to monetize their skills.
            </p>
          </div>
          <div className="story-card reveal" style={{ transitionDelay: "0.4s" }}>
            <span className="emoji">❤️</span>
            <h3>The Solution</h3>
            <p>Teta is a hyperlocal marketplace that connects home cooks directly with their communities. Zero commissions. Zero middlemen. Just neighbors feeding neighbors.</p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="section-team">
        <div className="section-title reveal">
          <span className="section-tag">The Founder</span>
          <h2>Meet Zeinab</h2>
        </div>
        <div className="team-content">
          <div className="team-photo reveal-left">👩‍🍳</div>
          <div className="team-info reveal-right">
            <h3>Zeinab Reda</h3>
            <div className="title">Founder</div>
            <p>
              Medical Physics resident at AUB. After two years in Beirut, the gap between incredible neighborhood cooks and the people craving real food became impossible to ignore. What started as swapping meals with neighbors turned into a platform serving hundreds across the city.
            </p>
            <blockquote>
              I missed my mother's cooking. So I built a way for everyone to share theirs.
            </blockquote>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section-sahteen">
        <div className="section-title reveal">
          <span className="section-tag">Our Values</span>
          <h2>What We Believe</h2>
        </div>

        <div className="sahteen-steps">
          <div className="sahteen-step reveal" style={{ transitionDelay: "0.1s" }}>
            <h3>Community First</h3>
            <p>Every feature we build starts with one question: does this strengthen the bond between cook and neighbor?</p>
          </div>
          <div className="sahteen-step reveal" style={{ transitionDelay: "0.25s" }}>
            <h3>Zero Commissions</h3>
            <p>We don't take a cut from home cooks. Their craft, their earnings.</p>
          </div>
          <div className="sahteen-step reveal" style={{ transitionDelay: "0.4s" }}>
            <h3>Sahteen for All</h3>
            <p>Through our Sahteen initiative, we ensure no one in the community goes hungry.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="reveal">
          <h2>Want to be part of what we're building?</h2>
          <div className="hero-buttons" style={{ opacity: 1, transform: "none" }}>
            <a href="https://app.ourteta.com/" className="btn-primary">
              Start Cooking
            </a>
            <a href="mailto:hello@ourteta.com" className="btn-outline">
              Join the Team
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
