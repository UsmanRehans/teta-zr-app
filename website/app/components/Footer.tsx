import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="brand">teta 🍋</div>
      <div className="footer-links">
        <Link href="/why">Why Teta</Link>
        <Link href="/sahteen">Sahteen</Link>
        <Link href="/about">About Us</Link>
        <Link href="/careers">Careers</Link>
        <a href="mailto:hello@ourteta.com">Contact</a>
      </div>
      <p className="copyright">© 2026 Teta. Built in Beirut.</p>
    </footer>
  );
}
