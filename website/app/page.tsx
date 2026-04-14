"use client";

import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { useEffect } from "react";

export default function Home() {
  useRevealOnScroll();

  // Setup parallax and nav scroll handler
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

  return (
    <>
      <Nav activePage="home" />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <p className="hero-sub">Home-cooked. Delivered.</p>
          <h1>teta <span className="lemon-logo">🍋</span></h1>
          <p>The platform connecting Beirut's best home cooks with neighbors who miss real food.</p>
          <div className="hero-buttons">
            <a href="https://app.ourteta.com/" className="btn-primary">
              Get Started
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="number">50+</div>
            <div className="label">Home Cooks</div>
          </div>
          <div className="stat-card">
            <div className="number">500+</div>
            <div className="label">Meals Served</div>
          </div>
          <div className="stat-card">
            <div className="number">5</div>
            <div className="label">Neighborhoods</div>
          </div>
        </div>

        <a href="#how" className="scroll-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-how" id="how">
        <div className="section-title reveal">
          <span className="section-tag">How It Works</span>
          <h2>Three Simple Steps</h2>
        </div>
        <div className="how-grid">
          <div className="how-card reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="how-number">1</div>
            <h3>Browse</h3>
            <p>Discover home cooks near you. See today's menus, fresh and made with care.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.25s" }}>
            <div className="how-number">2</div>
            <h3>Order</h3>
            <p>Choose your meal. Everything is prepared daily with locally sourced ingredients.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.4s" }}>
            <div className="how-number">3</div>
            <h3>Enjoy</h3>
            <p>Pick up or get it delivered. Cash on delivery — simple as that.</p>
          </div>
        </div>
      </section>

      {/* APP PREVIEW */}
      <section className="section-app-preview" id="app-preview">
        <div className="section-title reveal">
          <h2>Designed for simplicity</h2>
        </div>
        <p className="subtitle reveal">Browse menus, place orders, and support local cooks — all in one place.</p>
        <div className="app-preview-box reveal">App Preview</div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-testimonials">
        <div className="section-title reveal">
          <h2>What Our Neighbors Say</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="quote-mark">&ldquo;</span>
            <p>Exactly like my mom's cooking. I order every week now.</p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div className="author-info">
                <div className="name">Sarah M.</div>
                <div className="role">Hamra</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.25s" }}>
            <span className="quote-mark">&ldquo;</span>
            <p>I started selling kibbeh on Teta and now I have regulars every Friday.</p>
            <div className="testimonial-author">
              <div className="author-avatar">UA</div>
              <div className="author-info">
                <div className="name">Um Ali</div>
                <div className="role">Achrafieh</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.4s" }}>
            <span className="quote-mark">&ldquo;</span>
            <p>Finally, real home-cooked Lebanese food. One click away.</p>
            <div className="testimonial-author">
              <div className="author-avatar">RK</div>
              <div className="author-info">
                <div className="name">Rami K.</div>
                <div className="role">Mar Mikhael</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="reveal">
          <h2>Ready to taste the difference?</h2>
          <div className="hero-buttons" style={{ opacity: 1, transform: "none" }}>
            <a href="https://app.ourteta.com/" className="btn-primary">
              Order Now
            </a>
            <a href="https://app.ourteta.com/" className="btn-outline">
              Become a Cook
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
