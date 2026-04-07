import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teta — Home-Cooked Food from Beirut",
  description:
    "Discover authentic Lebanese meals made with love by neighborhood home cooks. Fresh, affordable, and just like mama used to make.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoArabic.variable} antialiased`}>
      <body className="min-h-screen bg-cream">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
