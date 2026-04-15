import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import AgentChat from "@/components/agent/AgentChat";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DemoProvider } from "@/lib/demo/DemoContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teta | Home-Cooked Food from Beirut",
  description:
    "Real Lebanese food made by home cooks in your neighborhood. Kibbeh, tabbouleh, mana'eesh. The way teta makes it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <DemoProvider>
            {children}
            <AgentChat />
          </DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
