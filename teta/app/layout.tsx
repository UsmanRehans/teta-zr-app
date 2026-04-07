import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AgentChat from "@/components/agent/AgentChat";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teta — Home-Cooked Food from Beirut",
  description:
    "Discover authentic Lebanese home-cooked meals from local cooks in your neighborhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <AgentChat />
      </body>
    </html>
  );
}
