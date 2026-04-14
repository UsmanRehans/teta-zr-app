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
            <div className="number">0%</div>
            <div className="label">Commission</div>
          </div>
          <div className="stat-card">
            <div className="number">100%</div>
            <div className="label">Home-Cooked</div>
          </div>
          <div className="stat-card">
            <div className="number">Hyperlocal</div>
            <div className="label">Neighbor to Neighbor</div>
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

      {/* THE VISION */}
      <section className="section-testimonials">
        <div className="section-title reveal">
          <h2>The Vision</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.1s" }}>
            <span className="quote-mark">🍽️</span>
            <p>A student orders a home-cooked meal from the teta down the street — real food, not fast food.</p>
            <div className="testimonial-author">
              <div className="author-info">
                <div className="name">For Food Lovers</div>
                <div className="role">Affordable, authentic, local</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.25s" }}>
            <span className="quote-mark">👩‍🍳</span>
            <p>A home cook turns her kitchen into a small business — zero commissions, full control, real income.</p>
            <div className="testimonial-author">
              <div className="author-info">
                <div className="name">For Home Cooks</div>
                <div className="role">Empowerment through food</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: "0.4s" }}>
            <span className="quote-mark">🌍</span>
            <p>A parent abroad buys their kid in Beirut a warm plate of warak enab — from anywhere in the world.</p>
            <div className="testimonial-author">
              <div className="author-info">
                <div className="name">For the Diaspora</div>
                <div className="role">Stay connected through food</div>
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
