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

      {/* LEBANON'S REALITY */}
      <section className="section-sahteen" id="lebanon">
        <div className="section-title reveal">
          <span className="section-tag">Lebanon&apos;s Reality</span>
          <h2>A country in crisis. A community with answers.</h2>
        </div>
        <p className="subtitle reveal">
          Lebanon&apos;s economic collapse has tripled poverty and devastated livelihoods. Teta turns kitchens into engines of recovery.
        </p>

        <div className="sahteen-stats">
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="big">44%</div>
            <div className="small">of Lebanese now live in poverty</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="big">73%</div>
            <div className="small">face multidimensional deprivation</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="big">26%</div>
            <div className="small">women&apos;s unemployment rate</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.4s" }}>
            <div className="big">80%+</div>
            <div className="small">currency purchasing power lost</div>
          </div>
        </div>
        <p className="section-source reveal">Sources: World Bank 2024, UN Women, ILO</p>
      </section>

      {/* HEALTH COMPARISON */}
      <section className="section-how" id="health">
        <div className="section-title reveal">
          <span className="section-tag">Health</span>
          <h2>Real food. Real difference.</h2>
        </div>

        <div className="health-grid">
          {[
            { dim: "Sodium & fat", good: "Lower", bad: "High" },
            { dim: "Fruits & vegetables", good: "Higher", bad: "Low" },
            { dim: "Preservatives", good: "None — fresh ingredients", bad: "Yes — shelf-life driven" },
            { dim: "Portions", good: "Made with care", bad: "Oversized for profit" },
            { dim: "Personal touch", good: "Every dish is unique", bad: "Standardized recipes" },
            { dim: "Community money", good: "Stays local", bad: "Leaves immediately" },
          ].map((row, i) => (
            <div className="health-card reveal" key={i} style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>
              <div className="health-card-label">{row.dim}</div>
              <div className="health-card-values">
                <div className="health-val good">
                  <span className="health-val-tag">Home-Cooked</span>
                  {row.good}
                </div>
                <div className="health-val bad">
                  <span className="health-val-tag">Fast Food</span>
                  {row.bad}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="section-source reveal">Sources: NIH/PMC, Pew Research Center</p>
      </section>

      {/* PRICE COMPARISON */}
      <section className="section-sahteen" id="price">
        <div className="section-title reveal">
          <span className="section-tag">Price</span>
          <h2>5&times; more expensive to eat out</h2>
        </div>
        <p className="subtitle reveal">
          Home-cooked meals through Teta cost a fraction of restaurant prices.
        </p>

        <div className="sahteen-stats-3">
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="big">$4&ndash;5</div>
            <div className="small">home-cooked per serving</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="big">$6&ndash;11</div>
            <div className="small">meal delivery services</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="big">$15&ndash;25+</div>
            <div className="small">restaurant dining</div>
          </div>
        </div>
        <p className="section-source reveal">Sources: Real Plans, Delivery Rank 2026</p>
      </section>

      {/* LOCAL MULTIPLIER */}
      <section className="section-how" id="local">
        <div className="section-title reveal">
          <span className="section-tag">Local Impact</span>
          <h2>Your money works harder locally</h2>
        </div>
        <p style={{ textAlign: "center", color: "#666", maxWidth: "700px", margin: "-60px auto 80px", fontSize: "1.05rem", lineHeight: "1.6" }} className="reveal">
          For every $100 spent, here&apos;s how much stays in the community.
        </p>

        <div className="comparison-grid">
          <div className="comparison-card burgundy reveal-left">
            <div className="big">$45</div>
            <div className="label">stays local when you buy from neighbors</div>
            <div className="card-subtitle">Local Independents</div>
          </div>
          <div className="comparison-card dark reveal-right">
            <div className="big">$14</div>
            <div className="label">stays local when you buy from chains</div>
            <div className="card-subtitle">Big-Box Chains</div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "#666", maxWidth: "600px", margin: "40px auto 0", fontSize: "0.95rem", lineHeight: "1.6" }} className="reveal">
          Local businesses recirculate money 2&ndash;3&times; more within the community.
        </p>
        <p className="section-source reveal">Sources: iLocal Inc, New Economics Foundation</p>
      </section>

      {/* MARKET VALIDATION */}
      <section className="section-sahteen" id="numbers">
        <div className="section-title reveal">
          <span className="section-tag">Market Validation</span>
          <h2>A proven model, a growing market</h2>
        </div>
        <p className="subtitle reveal">
          The home-cooked food economy is one of the fastest-growing segments in food delivery.
        </p>

        <div className="sahteen-stats">
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="big">$44.5B</div>
            <div className="small">projected meal-kit market by 2032</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="big">13%</div>
            <div className="small">annual market growth rate</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.3s" }}>
            <div className="big">81%</div>
            <div className="small">of home-cook platform members are women</div>
          </div>
          <div className="sahteen-stat reveal" style={{ transitionDelay: "0.4s" }}>
            <div className="big">$40/hr</div>
            <div className="small">average cook earnings on platforms</div>
          </div>
        </div>
        <p className="section-source reveal">Sources: Data Bridge Market Research, Inc Magazine, Boston Globe</p>
      </section>

      {/* BUILT FOR BOTH SIDES */}
      <section className="section-how" id="features">
        <div className="section-title reveal">
          <span className="section-tag">Features</span>
          <h2>Built for both sides</h2>
        </div>
        <p style={{ textAlign: "center", color: "#666", maxWidth: "700px", margin: "-60px auto 80px", fontSize: "1.05rem", lineHeight: "1.6" }} className="reveal">
          Whether you&apos;re cooking or ordering, the experience is seamless.
        </p>

        <div className="both-sides-grid">
          {/* FOR FOOD LOVERS */}
          <div className="side-panel lovers reveal-left">
            <div className="side-panel-header">
              <span className="side-icon">&#127860;</span>
              <h3>For Food Lovers</h3>
            </div>
            <div className="side-features">
              <div className="side-feature">
                <div className="side-feature-icon">&#128205;</div>
                <div>
                  <strong>Discover Local Cooks</strong>
                  <p>Browse cooks in your neighborhood. See ratings, menus, and availability.</p>
                </div>
              </div>
              <div className="side-feature">
                <div className="side-feature-icon">&#128337;</div>
                <div>
                  <strong>Real-Time Menus</strong>
                  <p>Fresh menus updated daily. Know exactly what&apos;s cooking before you order.</p>
                </div>
              </div>
              <div className="side-feature">
                <div className="side-feature-icon">&#128666;</div>
                <div>
                  <strong>Flexible Pickup &amp; Delivery</strong>
                  <p>Choose what works for you. Pick up directly or get it delivered.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FOR HOME COOKS */}
          <div className="side-panel cooks reveal-right">
            <div className="side-panel-header">
              <span className="side-icon">&#127859;</span>
              <h3>For Home Cooks</h3>
            </div>
            <div className="side-features">
              <div className="side-feature">
                <div className="side-feature-icon">&#128176;</div>
                <div>
                  <strong>Zero Commission</strong>
                  <p>Keep 100% of what you earn. Your kitchen, your prices, your profit.</p>
                </div>
              </div>
              <div className="side-feature">
                <div className="side-feature-icon">&#128221;</div>
                <div>
                  <strong>Set Your Own Menu</strong>
                  <p>Cook what you love, when you want. Full control over your offerings.</p>
                </div>
              </div>
              <div className="side-feature">
                <div className="side-feature-icon">&#11088;</div>
                <div>
                  <strong>Build Your Reputation</strong>
                  <p>Grow your customer base through ratings and repeat orders.</p>
                </div>
              </div>
            </div>
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
