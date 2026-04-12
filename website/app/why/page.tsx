"use client";

import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { useEffect } from "react";

export default function Why() {
  useRevealOnScroll();

  // Setup parallax for hero
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
      <Nav activePage="why" />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <p className="hero-sub" style={{ fontStyle: "italic" }}>Why Teta</p>
          <h2>Not another delivery app.</h2>
          <p>We're building the infrastructure for home-cooked food — one neighborhood at a time.</p>
        </div>
      </section>

      {/* THE DIFFERENCE */}
      <section className="section-how" id="difference">
        <div className="section-title reveal">
          <span className="section-tag">The Difference</span>
          <h2>What makes Teta different</h2>
        </div>

        <div className="comparison-grid">
          {/* LEFT CARD: Delivery Apps */}
          <div className="comparison-card dark reveal-left">
            <h3>Delivery Apps</h3>
            <ul>
              <li data-icon="✗">Generic restaurant food</li>
              <li data-icon="✗">High commissions on every order</li>
              <li data-icon="✗">No connection between cook and customer</li>
              <li data-icon="✗">Speed over quality</li>
            </ul>
          </div>

          {/* RIGHT CARD: Teta */}
          <div className="comparison-card burgundy reveal-right">
            <h3>Teta</h3>
            <ul>
              <li data-icon="✓">Home-cooked by your actual neighbors</li>
              <li data-icon="✓">Zero commissions for cooks</li>
              <li data-icon="✓">Direct relationship, cook to customer</li>
              <li data-icon="✓">Quality and authenticity first</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="section-sahteen" id="numbers">
        <div className="section-title reveal">
          <span className="section-tag">Impact</span>
          <h2>By the numbers</h2>
        </div>
        <p className="subtitle reveal">The data speaks for itself.</p>

        <div className="sahteen-stats">
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="big">[X]%</div>
            <div className="small">of orders are repeat customers</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="big">[X] min</div>
            <div className="small">average time from order to table</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="big">$[X]</div>
            <div className="small">average saved per meal vs. restaurants</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.4s" }}>
            <div className="big">[X]+</div>
            <div className="small">home cooks and growing</div>
          </div>
        </div>
      </section>

      {/* BUILT FOR BOTH SIDES */}
      <section className="section-how" id="features">
        <div className="section-title reveal">
          <span className="section-tag">Features</span>
          <h2>Built for both sides</h2>
        </div>
        <p style={{ textAlign: "center", color: "#666", maxWidth: "700px", margin: "-60px auto 80px", fontSize: "1.05rem", lineHeight: "1.6" }} className="reveal">
          Whether you're cooking or ordering, the experience is seamless.
        </p>

        {/* FOR FOOD LOVERS */}
        <div className="feature-section-title reveal">For Food Lovers</div>
        <div className="how-grid" style={{ marginBottom: "80px" }}>
          <div className="how-card reveal" style={{ transitionDelay: "0.1s" }}>
            <h3>Discover Local Cooks</h3>
            <p>Browse cooks in your neighborhood. See ratings, menus, and availability.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.25s" }}>
            <h3>Real-Time Menus</h3>
            <p>Fresh menus updated daily. Know exactly what's cooking before you order.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.4s" }}>
            <h3>Flexible Pickup & Delivery</h3>
            <p>Choose what works for you. Pick up directly or get it delivered.</p>
          </div>
        </div>

        {/* FOR HOME COOKS */}
        <div className="feature-section-title reveal">For Home Cooks</div>
        <div className="how-grid">
          <div className="how-card reveal" style={{ transitionDelay: "0.1s" }}>
            <h3>Zero Commission</h3>
            <p>Keep 100% of what you earn. Your kitchen, your prices, your profit.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.25s" }}>
            <h3>Set Your Own Menu</h3>
            <p>Cook what you love, when you want. Full control over your offerings.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.4s" }}>
            <h3>Build Your Reputation</h3>
            <p>Grow your customer base through ratings and repeat orders.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta">
        <div className="reveal">
          <h2>See what the community is cooking</h2>
          <p>Join thousands of neighbors discovering real home-cooked food.</p>
          <div className="hero-buttons" style={{ opacity: 1, transform: "none" }}>
            <a href="https://app.ourteta.com/" className="btn-primary">Explore the App</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
