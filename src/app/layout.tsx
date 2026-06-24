import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Space_Mono } from "next/font/google";
import { Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madhav Yalamarthi — AI Engineer & ML Researcher",
  description:
    "AI Engineer, Machine Learning Researcher, Full Stack Developer. B.Tech AI at Amrita Vishwa Vidyapeetham. Hackathon finalist, builder, research aspirant.",
  authors: [{ name: "Madhav Yalamarthi" }],
  keywords: ["AI Engineer", "Machine Learning", "Full Stack", "Portfolio", "Madhav Yalamarthi"],
  openGraph: {
    title: "Madhav Yalamarthi — AI Engineer",
    description: "AI Engineer · ML Researcher · Full Stack Developer · Hackathon Builder",
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
        className={`${inter.variable} ${spaceMono.variable} ${syne.variable} font-sans bg-black text-[#f0f0f0] overflow-x-hidden antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
