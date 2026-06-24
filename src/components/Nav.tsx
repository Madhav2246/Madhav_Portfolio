"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#research", label: "Research" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-[6%] h-[68px] transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(0,0,0,0.92)] backdrop-blur-xl border-b border-white/[0.06]"
            : ""
        }`}
      >
        {/* Logo */}
        <Link href="#hero" className="font-display font-extrabold text-[22px] tracking-[-0.04em] text-white z-10">
          MY
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 list-none">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/40 px-[14px] py-[6px] rounded-md transition-all hover:text-white hover:bg-white/[0.05]"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/admin" className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/25 px-[14px] py-[6px] rounded-md hover:text-white/50 transition-colors">
              Admin ⚙
            </a>
          </li>
        </ul>

        {/* CTA */}
        <a
          href="mailto:yalamarthi.sriram123@gmail.com"
          className="hidden md:inline-flex font-mono text-[10px] tracking-[0.1em] uppercase text-black bg-white px-[18px] py-[8px] rounded-[8px] hover:bg-white/85 transition-all font-bold shadow-[0_4px_20px_rgba(255,255,255,0.12)]"
        >
          Hire Me
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-[6px] z-[600]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-[22px] h-[2px] bg-white rounded transition-all ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-white rounded transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-[22px] h-[2px] bg-white rounded transition-all ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile nav */}
      <div
        className={`md:hidden fixed inset-0 z-[499] bg-black flex flex-col items-center justify-center gap-0 transition-transform duration-400 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="font-display font-bold text-[clamp(28px,7vw,48px)] text-white/50 py-[14px] hover:text-white transition-colors tracking-[-0.02em]"
          >
            {l.label}
          </a>
        ))}
        <a href="/admin" onClick={() => setMenuOpen(false)} className="mt-4 font-mono text-[12px] tracking-[0.1em] uppercase text-white/30">
          Admin ↗
        </a>
      </div>
    </>
  );
}
