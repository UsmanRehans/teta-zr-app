"use client";

import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export default function Sahteen() {
  useRevealOnScroll();

  return (
    <>
      <Nav activePage="sahteen" />

      {/* HERO */}
      <section className="story-hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} id="home">
        <div className="section-title reveal">
          <span className="section-tag">صحتين</span>
          <h2>Sahteen</h2>
          <p className="hero-subtitle">No one should go hungry when your neighbor is cooking.</p>
        </div>
      </section>

      {/* WHAT IS SAHTEEN */}
      <section className="section-how" id="what">
        <div className="section-title reveal">
          <span className="section-tag">The Initiative</span>
          <h2>Ok so here's the deal</h2>
        </div>
        <div className="how-content">
          <p className="reveal">
            Sahteen literally means "double health" — it's what Lebanese people say instead of bon appetit. But for us it means something bigger.
          </p>
          <p className="reveal">
            Here's the thing: there are people in Beirut who can't afford a proper meal. And right next door, there's a teta making enough kibbeh to feed an army. The math didn't make sense to us either.
          </p>
          <p className="reveal">
            So we built Sahteen into the platform. It's dead simple: if you need a meal, you request one. No forms, no means testing, no bureaucratic nonsense. A teta in your area sees it and decides to help. That's it. Neighbor to neighbor.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-sahteen" id="how">
        <div className="section-title reveal">
          <span className="section-tag">How It Works</span>
          <h2>Three steps. That's it.</h2>
        </div>

        <div className="sahteen-steps">
          <div className="sahteen-step reveal" style={{ transitionDelay: "0.1s" }}>
            <h3>Request a meal</h3>
            <p>Anyone can do it through the app. We don't ask why. We don't ask for proof. If you're hungry, that's enough.</p>
          </div>
          <div className="sahteen-step reveal" style={{ transitionDelay: "0.25s" }}>
            <h3>A cook decides to help</h3>
            <p>The tetas choose who they want to help and when. It's personal. It's their kitchen, their call.</p>
          </div>
          <div className="sahteen-step reveal" style={{ transitionDelay: "0.4s" }}>
            <h3>A warm meal shows up</h3>
            <p>Fresh, home-cooked, made with actual love. Not leftovers. Not charity food. Real food from a real person.</p>
          </div>
        </div>
      </section>

      {/* THE NUMBERS */}
      <section className="section-numbers" id="numbers">
        <div className="numbers-content reveal">
          <div className="numbers-stats">
            <div className="numbers-stat-item">
              <div className="big">100+</div>
              <div className="small">Meals Donated</div>
            </div>
            <div className="numbers-stat-item">
              <div className="big">Zero</div>
              <div className="small">Paperwork</div>
            </div>
            <div className="numbers-stat-item">
              <div className="big">100%</div>
              <div className="small">Community-Driven</div>
            </div>
          </div>
          <p>
            Every donation stays in your neighborhood. The tetas themselves decide who needs it most. No corporate overhead, no admin fees. Just food and people who give a damn.
          </p>
        </div>
      </section>

      {/* HOW TO HELP */}
      <section className="section-help" id="help">
        <div className="section-title reveal">
          <span className="section-tag">Get Involved</span>
          <h2>You don't have to be a cook to help</h2>
        </div>

        <div className="how-grid">
          <div className="how-card reveal" style={{ transitionDelay: "0.1s" }}>
            <h3>Donate a Meal</h3>
            <p>Sponsor a meal through the platform and a teta will prepare and deliver it.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.25s" }}>
            <h3>Spread the Word</h3>
            <p>Share the initiative so people who need it know it exists.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.4s" }}>
            <h3>Cook for Your Neighbors</h3>
            <p>Join as a teta and opt into Sahteen.</p>
          </div>
        </div>

        <a href="https://app.ourteta.com/" className="btn-gold reveal">
          Donate a Meal
        </a>
      </section>

      {/* QUOTE */}
      <section className="section-quote" id="quote">
        <div className="quote-block reveal">
          <blockquote>
            In Lebanese culture, feeding someone is the highest form of generosity. That's not marketing copy. That's just how it is.
          </blockquote>
        </div>
      </section>

      <Footer />
    </>
  );
}
