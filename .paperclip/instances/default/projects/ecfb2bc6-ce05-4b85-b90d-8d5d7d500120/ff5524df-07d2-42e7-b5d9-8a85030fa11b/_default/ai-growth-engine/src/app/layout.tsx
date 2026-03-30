import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The AI Growth Engine — Install Proven AI Systems for $19/mo",
  description:
    "The exact AI systems used to generate $100M+ in client revenue — templates, playbooks, and automations from named companies. Built by Max Mayes.",
  openGraph: {
    title: "The AI Growth Engine",
    description:
      "Install proven AI growth systems for $19/mo. 60-day money-back guarantee.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-primary text-text-primary min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
