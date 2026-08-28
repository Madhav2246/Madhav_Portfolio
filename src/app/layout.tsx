import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Space_Mono, Syne } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madhav Yalamarthi — AI/ML Engineer & Researcher",
  description:
    "AI/ML Engineer & Researcher specializing in Continual Learning, Neuro-Symbolic RAG, and Distributed AI Systems. B.Tech AI @ Amrita Vishwa Vidyapeetham. IIT Madras National Winner.",
  authors: [{ name: "Madhav Yalamarthi" }],
  keywords: ["AI Engineer", "Machine Learning", "Continual Learning", "RAG", "Distributed Systems", "Madhav Yalamarthi", "Amrita"],
  openGraph: {
    title: "Madhav Yalamarthi — AI/ML Engineer & Researcher",
    description: "AI/ML Research Engineer · Continual Learning · Neuro-Symbolic RAG · IIT Madras National Winner",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jakarta.variable} ${spaceMono.variable} ${syne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
