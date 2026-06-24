"use client";
import { useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import type { AcademicData } from "@/lib/types";

const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), { ssr: false });

function useTyped(elementId: string, strings: string[]) {
  useEffect(() => {
    let typed: { destroy: () => void } | null = null;
    const load = async () => {
      const { default: Typed } = await import("typed.js");
      typed = new Typed(`#${elementId}`, {
        strings,
        typeSpeed: 60,
        backSpeed: 35,
        backDelay: 1800,
        loop: true,
        cursorChar: "_",
      });
    };
    load();
    return () => typed?.destroy();
  }, [elementId, strings]);
}

const TYPED_STRINGS = [
  "AI Engineer",
  "ML Researcher",
  "Full Stack Developer",
  "Research Aspirant",
  "Hackathon Builder",
  "Problem Solver",
];

const STATS = [
  { num: 10, suffix: "+", label: "Projects Shipped" },
  { num: 3,  suffix: "",  label: "Hackathons Won" },
  { num: 3,  suffix: "",  label: "Research Tracks" },
  { num: 30, suffix: "+", label: "Technologies" },
];

interface HeroProps { academic: AcademicData }

export default function Hero({ academic }: HeroProps) {
  useTyped("typed-text", TYPED_STRINGS);

  const countersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = countersRef.current?.querySelectorAll("[data-count]");
    if (!els) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const target = parseInt(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        let cur = 0;
        const step = target / 50;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = Math.floor(cur) + suffix;
        }, 28);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden px-[6%] bg-black">
      {/* 3D Sphere Canvas */}
      <Suspense fallback={null}>
        <NeuralCanvas />
      </Suspense>

      <div className="relative z-10 max-w-4xl pt-24">
        {/* Badge */}
        <div
          data-gsap="fade-right"
          className="inline-flex items-center gap-2 border border-white/[0.12] rounded-full px-4 py-[6px] font-mono text-[10px] tracking-[0.12em] uppercase text-white/50 mb-8"
        >
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-[pulseDot_2s_ease-in-out_infinite]" />
          Available for opportunities · 2026
        </div>

        {/* Name */}
        <h1
          data-gsap="chars"
          className="font-display font-black leading-none tracking-[-0.05em] text-white mb-3"
          style={{ fontSize: "clamp(52px,9vw,116px)" }}
        >
          Madhav<br />
          <span className="gradient-text">Yalamarthi</span>
        </h1>

        {/* Typed */}
        <div className="flex items-center gap-3 mb-8 min-h-[44px]" data-gsap="fade-up" data-delay="0.3">
          <span className="font-mono text-white/20" style={{ fontSize: "clamp(13px,1.8vw,18px)" }}>I am a</span>
          <span
            id="typed-text"
            className="font-mono font-bold text-white"
            style={{ fontSize: "clamp(14px,2vw,20px)" }}
          />
        </div>

        {/* Tagline */}
        <p
          data-gsap="fade-up" data-delay="0.45"
          className="text-white/40 leading-[1.8] max-w-[540px] mb-12"
          style={{ fontSize: "clamp(14px,1.6vw,17px)" }}
        >
          AI Engineer designing intelligent systems where machine learning meets
          scalable architecture. B.Tech AI at Amrita · CGPA {academic.currentCGPA} · Hackathon Finalist.
        </p>

        {/* CTA Buttons */}
        <div data-gsap="fade-up" data-delay="0.6" className="flex flex-wrap gap-3 mb-16">
          <a href="#projects" className="btn-primary magnetic-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            View Projects
          </a>
          <a href="/resume.pdf" target="_blank" className="btn-secondary magnetic-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Resume
          </a>
          <a href="#contact" className="btn-secondary magnetic-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            Contact
          </a>
        </div>

        {/* Stats */}
        <div ref={countersRef} data-gsap="fade-up" data-delay="0.75" className="flex flex-wrap gap-10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-[6px]">
              <span
                className="font-display font-black text-[30px] leading-none tracking-[-0.03em] text-white"
                data-count={s.num}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </span>
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/25">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/20 animate-[scrollPulse_2s_ease-in-out_infinite]" />
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/20">Scroll</span>
      </div>
    </section>
  );
}
