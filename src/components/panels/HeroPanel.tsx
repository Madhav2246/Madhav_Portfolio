"use client";
import { useEffect, useRef } from "react";
import type { AcademicData } from "@/lib/types";
import type { SectionId } from "../PortfolioShell";

const TYPED_STRINGS = [
  "AI Engineer_",
  "ML Researcher_",
  "Full Stack Dev_",
  "Research Aspirant_",
  "Hackathon Builder_",
];

const STATS = [
  { num: 10, suffix: "+", label: "Projects" },
  { num: 3,  suffix: "",  label: "Hackathon Wins" },
  { num: 3,  suffix: "",  label: "Research" },
  { num: 30, suffix: "+", label: "Technologies" },
];

interface Props { academic: AcademicData; onSection: (s: SectionId, e?: React.MouseEvent) => void }

export default function HeroPanel({ academic, onSection }: Props) {
  const typedRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    import("typed.js").then(({ default: Typed }) => {
      typedRef.current = new Typed("#hero-typed", {
        strings: TYPED_STRINGS,
        typeSpeed: 55,
        backSpeed: 30,
        backDelay: 1600,
        loop: true,
        showCursor: true,
        cursorChar: "|",
      });
    });
    return () => typedRef.current?.destroy();
  }, []);

  // Animated counters with RAF + ease-out-cubic
  const countersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    countersRef.current?.querySelectorAll<HTMLElement>("[data-count]").forEach(el => {
      const target = parseInt(el.dataset.count || "0");
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      setTimeout(() => requestAnimationFrame(tick), 400);
    });
  }, []);

  return (
    <div className="absolute bottom-12 left-[6%] z-[16] pointer-events-none max-w-[520px]">

      {/* Status badge */}
      <div
        className="inline-flex items-center gap-2 mb-6 px-4 py-[6px] rounded-full font-mono text-[10px] tracking-[0.14em] uppercase pointer-events-auto"
        style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8" }}
      >
        <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8", animation: "pulseDot 2s ease-in-out infinite" }} />
        Available · {new Date().getFullYear()}
      </div>

      {/* Name — clean display, no scramble */}
      <h1
        className="font-display font-black leading-[0.9] tracking-[-0.05em] text-white mb-3"
        style={{ fontSize: "clamp(40px,7vw,88px)" }}
      >
        Madhav<br />
        <span style={{
          background: "linear-gradient(115deg,#ffffff 0%,#7dd3fc 55%,#38bdf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Yalamarthi
        </span>
      </h1>

      {/* Typed role */}
      <div className="flex items-center gap-2 mb-4" style={{ minHeight: 32 }}>
        <span className="font-mono text-[15px]" style={{ color: "rgba(255,255,255,0.4)" }}>I&apos;m a</span>
        <span
          id="hero-typed"
          className="font-mono font-semibold text-[15px]"
          style={{ color: "#7dd3fc" }}
        />
      </div>

      {/* Tagline */}
      <p className="font-sans text-[14px] leading-[1.7] mb-6" style={{ color: "rgba(255,255,255,0.62)" }}>
        B.Tech AI · Amrita VV · CGPA {academic.currentCGPA}
      </p>

      {/* Animated counters */}
      <div ref={countersRef} className="flex gap-6 mb-6">
        {STATS.map(s => (
          <div key={s.label}>
            <div
              className="font-display font-black text-[26px] leading-none tracking-[-0.03em] text-white"
              data-count={s.num} data-suffix={s.suffix}
            >
              0{s.suffix}
            </div>
            <div className="font-mono text-[8px] tracking-[0.14em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-3 pointer-events-auto">
        <button
          onClick={(e) => onSection("projects", e)}
          className="font-mono text-[10px] tracking-[0.1em] uppercase font-bold text-black px-6 py-[11px] rounded-[9px] transition-all hover:opacity-85 hover:-translate-y-[1px]"
          style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", boxShadow: "0 5px 20px rgba(56,189,248,0.3)" }}
        >
          Explore Projects →
        </button>
        <a
          href="mailto:yalamarthimadhav05@gmail.com"
          className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/75 px-6 py-[11px] rounded-[9px] transition-all hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)" }}
        >
          Hire Me
        </a>
      </div>

      {/* Hint */}
      <div className="mt-6 font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
        ✦ Click any floating node to explore
      </div>
    </div>
  );
}
