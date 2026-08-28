import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Space_Mono, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madhav Yalamarthi — AI/ML Engineer & Researcher",
  description:
    "AI/ML Engineer & Researcher – Continual Learning, Neuro-Symbolic RAG, Multi-Agent Systems. B.Tech AI at Amrita Vishwa Vidyapeetham. IIT Madras Hackathon Winner.",
  authors: [{ name: "Madhav Yalamarthi" }],
  keywords: ["AI Engineer", "Machine Learning", "Continual Learning", "RAG", "Portfolio", "Madhav Yalamarthi"],
  openGraph: {
    title: "Madhav Yalamarthi — AI/ML Engineer & Researcher",
    description: "AI/ML Engineer & Researcher · Continual Learning · Neuro-Symbolic RAG · Multi-Agent Systems",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${jakarta.variable} ${spaceMono.variable} ${syne.variable} font-sans bg-[#06080d] text-[#e2e8f0] antialiased selection:bg-sky-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
