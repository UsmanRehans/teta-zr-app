"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface NavProps {
  activePage?: string;
}

export default function Nav({ activePage }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : ""} id="mainNav">
      <Link href="/" className={activePage === "home" ? "active" : ""}>
        Home
      </Link>
      <Link href="/why" className={activePage === "why" ? "active" : ""}>
        Why Teta
      </Link>
      <Link href="/sahteen" className={activePage === "sahteen" ? "active" : ""}>
        Sahteen
      </Link>
      <Link href="/about" className={activePage === "about" ? "active" : ""}>
        About Us
      </Link>
      <a href="https://app.ourteta.com/" className="cta-nav" target="_blank" rel="noopener noreferrer">
        Open App
      </a>
    </nav>
  );
}
