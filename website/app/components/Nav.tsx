"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavProps {
  activePage?: string;
}

export default function Nav({ activePage }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change / link click
  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <nav className={`${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`} id="mainNav">
      <span className="nav-brand">🍋</span>
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
      </button>

      <div className={`nav-links ${menuOpen ? "show" : ""}`}>
        <Link href="/" className={activePage === "home" ? "active" : ""} onClick={handleLinkClick}>
          Home
        </Link>
        <Link href="/why" className={activePage === "why" ? "active" : ""} onClick={handleLinkClick}>
          Why Teta
        </Link>
        <Link href="/sahteen" className={activePage === "sahteen" ? "active" : ""} onClick={handleLinkClick}>
          Sahteen
        </Link>
        <Link href="/about" className={activePage === "about" ? "active" : ""} onClick={handleLinkClick}>
          About Us
        </Link>
        <Link href="/careers" className={activePage === "careers" ? "active" : ""} onClick={handleLinkClick}>
          Careers
        </Link>
        <a href="https://app.ourteta.com/" className="cta-nav" target="_blank" rel="noopener noreferrer">
          Open App
        </a>
      </div>
    </nav>
  );
}
