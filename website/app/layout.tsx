import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, Playfair_Display } from "next/font/google";
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

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Teta — Home-Cooked Meal Delivery in Beirut | Order Authentic Lebanese Food",
  description:
    "Teta connects you with Beirut's best home cooks. Order authentic Lebanese home-cooked meals from neighbors who care. Fresh, daily, locally sourced ingredients.",
  openGraph: {
    title: "Teta — Home-Cooked Meal Delivery in Beirut",
    description:
      "The platform connecting Beirut's best home cooks with neighbors who miss real food.",
    url: "https://ourteta.com",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teta — Home-Cooked Meal Delivery in Beirut",
    description: "Order authentic Lebanese home-cooked meals from your neighbors.",
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoArabic.variable} ${playfairDisplay.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Teta",
              description: "Home-cooked meal delivery platform connecting Beirut's best home cooks with neighbors",
              url: "https://ourteta.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Beirut",
                addressCountry: "LB",
              },
              priceRange: "$$",
              cuisine: ["Lebanese", "Home-cooked"],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-cream">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
