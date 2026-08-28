"use client";
import { useEffect, useRef } from "react";
import type { AcademicData } from "@/lib/types";
import type { SectionId } from "../PortfolioShell";

const TYPED_STRINGS = [
  "AI & Systems Engineer_",
  "Autonomous Agent Builder_",
  "Computer Vision Researcher_",
  "IIT Madras Hackathon Finalist_",
  "Cricket Enthusiast & Strategist_",
];

const STATS = [
  { num: 14, suffix: "+", label: "Projects Shipped" },
  { num: 3,  suffix: "",  label: "Hackathon Wins" },
  { num: 3,  suffix: "",  label: "Research Tracks" },
  { num: 30, suffix: "+", label: "Technologies" },
];

interface Props {
  academic: AcademicData;
  onSection: (s: SectionId, e?: React.MouseEvent) => void;
  onOpenCommandCenter?: () => void;
}

export default function HeroPanel({ academic, onSection, onOpenCommandCenter }: Props) {
  const typedRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    import("typed.js").then(({ default: Typed }) => {
      typedRef.current = new Typed("#hero-typed", {
        strings: TYPED_STRINGS,
        typeSpeed: 50,
        backSpeed: 28,
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
    <div className="absolute bottom-10 left-[6%] z-[16] pointer-events-none max-w-[540px]">

      {/* Status badge */}
      <div
        className="inline-flex items-center gap-2 mb-4 px-4 py-[6px] rounded-full font-mono text-[10px] tracking-[0.14em] uppercase pointer-events-auto"
        style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8" }}
      >
        <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#38bdf8", boxShadow: "0 0 8px #38bdf8", animation: "pulseDot 2s ease-in-out infinite" }} />
        Available for High-Impact Roles · 2026
      </div>

      {/* Name */}
      <h1
        className="font-display font-black leading-[0.9] tracking-[-0.05em] text-white mb-2"
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
      <div className="flex items-center gap-2 mb-3" style={{ minHeight: 30 }}>
        <span className="font-mono text-[14px]" style={{ color: "rgba(255,255,255,0.4)" }}>I&apos;m an</span>
        <span
          id="hero-typed"
          className="font-mono font-semibold text-[14px]"
          style={{ color: "#7dd3fc" }}
        />
      </div>

      {/* Tagline */}
      <p className="font-sans text-[13px] leading-[1.7] mb-5" style={{ color: "rgba(255,255,255,0.65)" }}>
        B.Tech AI at Amrita Vishwa Vidyapeetham · CGPA {academic.currentCGPA} · 🥈 2nd Place National Road Safety Hackathon (IIT Madras).
      </p>

      {/* Animated counters */}
      <div ref={countersRef} className="flex gap-6 mb-6">
        {STATS.map(s => (
          <div key={s.label}>
            <div
              className="font-display font-black text-[24px] leading-none tracking-[-0.03em] text-white"
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
      <div className="flex flex-wrap gap-2.5 pointer-events-auto">
        <button
          onClick={(e) => onSection("projects", e)}
          className="font-mono text-[10px] tracking-[0.1em] uppercase font-bold text-black px-5 py-[10px] rounded-[9px] transition-all hover:opacity-85 hover:-translate-y-[1px]"
          style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)", boxShadow: "0 5px 20px rgba(56,189,248,0.3)" }}
        >
          Explore Projects →
        </button>

        <button
          onClick={(e) => onSection("arcade", e)}
          className="font-mono text-[10px] tracking-[0.1em] uppercase font-bold text-black px-5 py-[10px] rounded-[9px] transition-all hover:opacity-90 hover:-translate-y-[1px]"
          style={{ background: "linear-gradient(135deg,#34d399,#10b981)", boxShadow: "0 5px 20px rgba(52,211,153,0.3)" }}
        >
          Play Mini Cricket 🏏
        </button>

        {onOpenCommandCenter && (
          <button
            onClick={onOpenCommandCenter}
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/75 px-4 py-[10px] rounded-[9px] transition-all hover:bg-white/10 flex items-center gap-1.5"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)" }}
          >
            <span>⚡</span>
            <span className="hidden sm:inline">Spotlight</span>
            <span className="text-[9px] opacity-40 px-1 py-0.5 rounded bg-white/10">Ctrl+K</span>
          </button>
        )}
      </div>

      {/* Hint */}
      <div className="mt-5 font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
        ✦ Orbiting navigation ready · Click any node to explore
      </div>
    </div>
  );
}
