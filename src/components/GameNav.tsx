"use client";
import React from "react";
import type { SectionId } from "./PortfolioShell";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "home",         label: "Home" },
  { id: "about",        label: "About" },
  { id: "projects",     label: "Projects" },
  { id: "arcade",       label: "Arcade 🏏🎬" },
  { id: "skills",       label: "Skills" },
  { id: "research",     label: "Research" },
  { id: "achievements", label: "Awards" },
  { id: "contact",      label: "Contact" },
];

interface Props {
  active: SectionId;
  onSelect: (s: SectionId) => void;
}

export default function GameNav({ active, onSelect }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-8 h-[64px]"
         style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Logo */}
      <button
        onClick={() => onSelect("home")}
        className="font-display font-black text-[20px] tracking-[-0.04em] text-white hover:opacity-70 transition-opacity"
      >
        MY<span style={{ color: "#38bdf8" }}>.</span>
      </button>

      {/* Nav links */}
      <ul className="hidden md:flex items-center gap-1 list-none">
        {SECTIONS.map(s => (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className="relative font-mono text-[10px] tracking-[0.1em] uppercase px-[14px] py-[7px] rounded-md transition-all duration-200"
              style={{
                color: active === s.id ? "#38bdf8" : "rgba(255,255,255,0.4)",
                background: active === s.id ? "rgba(56,189,248,0.08)" : "transparent",
                border: active === s.id ? "1px solid rgba(56,189,248,0.2)" : "1px solid transparent",
              }}
            >
              {s.label}
              {active === s.id && (
                <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full" style={{ background: "#38bdf8" }} />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="mailto:yalamarthimadhav05@gmail.com"
        className="hidden md:inline-flex font-mono text-[10px] tracking-[0.1em] uppercase text-black font-bold px-[18px] py-[8px] rounded-[8px] transition-all hover:opacity-85"
        style={{ background: "#38bdf8", boxShadow: "0 4px 20px rgba(56,189,248,0.3)" }}
      >
        Hire Me
      </a>
    </nav>
  );
}
