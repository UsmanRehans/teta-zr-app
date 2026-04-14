"use client";

import { useRevealOnScroll } from "@/app/hooks/useRevealOnScroll";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export default function Sahteen() {
  useRevealOnScroll();

  return (
    <>
      <Nav activePage="sahteen" />

      {/* HERO + THREE STEPS */}
      <section className="story-hero" id="home">
        <div className="hero-content-backdrop">
          <div className="section-title reveal">
            <span className="section-tag">صحتين</span>
            <h2>Sahteen</h2>
            <p className="hero-subtitle">
              Feed someone you love — or someone who needs it.<br />
              From anywhere in the world, your generosity reaches a teta&apos;s kitchen in Lebanon.
            </p>
          </div>

          <div className="sahteen-steps">
            <div className="sahteen-step reveal" style={{ transitionDelay: "0.1s" }}>
              <h3>1. Choose how to give</h3>
              <p>Buy a meal for your kids, cousins, or family in Lebanon. Sponsor a meal for someone less fortunate. Or donate to a whole neighborhood in need — you decide how your generosity lands.</p>
            </div>
            <div className="sahteen-step reveal" style={{ transitionDelay: "0.25s" }}>
              <h3>2. A teta cooks with love</h3>
              <p>Our tetas know their communities inside out. They know exactly where food is needed most — especially now, during the crisis. Your donation goes straight to their kitchen.</p>
            </div>
            <div className="sahteen-step reveal" style={{ transitionDelay: "0.4s" }}>
              <h3>3. A warm meal arrives</h3>
              <p>Whether it&apos;s your cousin in Beirut, a student who can&apos;t afford lunch, or a family affected by the crisis — real food, made with real love, delivered neighbor to neighbor.</p>
            </div>
          </div>

          <a href="https://app.ourteta.com/" className="btn-gold reveal">
            Donate a Meal
          </a>
        </div>
      </section>

      {/* WHAT IS SAHTEEN */}
      <section className="section-how" id="what">
        <div className="section-title reveal">
          <span className="section-tag">The Initiative</span>
          <h2>Ok so here&apos;s the deal</h2>
        </div>
        <div className="how-content">
          <p className="reveal">
            Sahteen literally means &ldquo;double health&rdquo; — it&apos;s what Lebanese people say instead of bon appetit. But for us it means something bigger.
          </p>
          <p className="reveal">
            Lebanon is going through one of the worst crises in its history. Families are struggling to put food on the table. And right next door, there&apos;s a teta making enough kibbeh to feed an army. We&apos;re connecting that generosity with the people who need it most.
          </p>
          <p className="reveal">
            But this isn&apos;t just for locals. If you&apos;re a parent abroad and want to make sure your kids in Beirut eat a proper home-cooked meal — you can do that. If you want to send your cousin a plate of warak enab for their birthday — you can do that too. And if you simply want to feed someone who&apos;s hungry, our tetas will make sure it reaches the right person.
          </p>
          <p className="reveal">
            No forms. No bureaucracy. Just people feeding people, from anywhere in the world.
          </p>
        </div>
      </section>

      {/* THE PROMISE */}
      <section className="section-numbers" id="numbers">
        <div className="numbers-content reveal">
          <div className="numbers-stats">
            <div className="numbers-stat-item">
              <div className="big">Zero</div>
              <div className="small">Paperwork</div>
            </div>
            <div className="numbers-stat-item">
              <div className="big">Zero</div>
              <div className="small">Overhead Fees</div>
            </div>
            <div className="numbers-stat-item">
              <div className="big">100%</div>
              <div className="small">Goes to Food</div>
            </div>
          </div>
          <p>
            Every donation stays in the community. The tetas themselves decide who needs it most. No corporate overhead, no admin fees. Just food and people who give a damn — from Beirut to the world and back.
          </p>
        </div>
      </section>

      {/* HOW TO HELP */}
      <section className="section-help" id="help">
        <div className="section-title reveal">
          <span className="section-tag">Get Involved</span>
          <h2>You don&apos;t have to be in Lebanon to help</h2>
        </div>

        <div className="how-grid">
          <div className="how-card reveal" style={{ transitionDelay: "0.1s" }}>
            <h3>Gift a Meal to Family</h3>
            <p>Buy a home-cooked meal for your kids, cousins, or relatives in Lebanon. A teta nearby will prepare and deliver it with love.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.25s" }}>
            <h3>Donate to Those in Need</h3>
            <p>Sponsor meals for families affected by the crisis. Our tetas know their neighborhoods — they know exactly where the food is needed most.</p>
          </div>
          <div className="how-card reveal" style={{ transitionDelay: "0.4s" }}>
            <h3>Cook for Your Community</h3>
            <p>If you&apos;re in Lebanon, join as a teta and opt into Sahteen. Your kitchen can change someone&apos;s day.</p>
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
            In Lebanese culture, feeding someone is the highest form of generosity. That&apos;s not marketing copy. That&apos;s just how it is.
          </blockquote>
        </div>
      </section>

      <Footer />
    </>
  );
}
