"use client";
import { useState } from "react";
import type { Project } from "@/lib/types";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI / ML" },
  { id: "cv", label: "Computer Vision" },
  { id: "nlp", label: "NLP" },
  { id: "fullstack", label: "Full Stack" },
  { id: "hackathon", label: "Hackathon" },
];

interface ProjectsProps { projects: Project[] }

export default function Projects({ projects }: ProjectsProps) {
  const [active, setActive] = useState("all");
  const visible = projects
    .filter(p => p.visible && (active === "all" || p.category.includes(active)))
    .sort((a, b) => a.order - b.order);
  const featured = visible.filter(p => p.featured);
  const rest = visible.filter(p => !p.featured);

  return (
    <section id="projects" className="relative z-10 px-[6%] py-[120px] bg-black">
      <div data-gsap="fade-right" className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/35 mb-4">
        <span className="section-line" />Portfolio
      </div>
      <h2 data-gsap="chars" className="font-display font-extrabold tracking-[-0.04em] leading-none mb-4" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
        Innovation <span className="gradient-text">Lab</span>
      </h2>
      <p data-gsap="fade-up" className="text-white/40 text-[16px] leading-[1.7] max-w-[520px] mb-10">
        Intelligent systems built to solve real-world problems at scale.
      </p>

      {/* Filter bar */}
      <div data-gsap="fade-up" className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`font-mono text-[10px] tracking-[0.1em] uppercase px-[18px] py-[8px] rounded-[8px] border transition-all duration-200 ${
              active === c.id
                ? "bg-white border-transparent text-black font-bold"
                : "bg-transparent border-white/[0.1] text-white/40 hover:border-white/[0.25] hover:text-white/70"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="perspective-container">
        {/* Featured cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {featured.map((p, i) => (
            <div
              key={p.id}
              data-gsap="flip-in"
              data-delay={String(i * 0.1)}
              className={`glass rounded-2xl overflow-hidden hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-300 group glow-border ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
              data-tilt
            >
              {/* Top banner */}
              <div className={`relative flex items-center justify-center text-[52px] ${i === 0 ? "h-[180px]" : "h-[130px]"} bg-white/[0.03] border-b border-white/[0.06]`}>
                <span className="relative z-10 grayscale">{p.emoji}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                <span className="absolute top-4 right-4 font-mono text-[9px] tracking-[0.16em] text-white/20">
                  {String(p.order).padStart(2, "0")}
                </span>
                {p.impact && (
                  <span className="absolute bottom-4 left-4 font-mono text-[8px] tracking-[0.12em] uppercase text-white/40 bg-white/[0.06] border border-white/[0.1] px-2 py-1 rounded">
                    {p.impact}
                  </span>
                )}
              </div>

              <div className="p-7">
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.category.map(cat => (
                    <span key={cat} className="font-mono text-[8px] tracking-[0.14em] uppercase text-white/35 border border-white/[0.1] rounded px-2 py-[3px]">
                      {cat}
                    </span>
                  ))}
                </div>
                <h3 className="font-display font-bold text-[clamp(17px,2.2vw,22px)] tracking-[-0.02em] text-white mb-3 leading-[1.2]">
                  {p.title}
                </h3>
                <p className="text-[14px] text-white/45 leading-[1.7] mb-5">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.map(tag => (
                    <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/25 border border-white/[0.07] rounded px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-5">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer"
                      className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/50 hover:text-white transition-colors hover:gap-3">
                      GitHub →
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noreferrer"
                      className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/50 hover:text-white transition-colors">
                      Live →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini grid */}
        {rest.length > 0 && (
          <>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/20 mb-4">More Projects</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((p, i) => (
                <a
                  key={p.id}
                  href={p.github || p.demo || "#"}
                  target="_blank" rel="noreferrer"
                  data-gsap="fade-up"
                  data-delay={String(i * 0.07)}
                  className="glass rounded-xl p-6 hover:border-white/[0.18] hover:bg-white/[0.04] hover:-translate-y-1 transition-all duration-300 block group"
                >
                  <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/25 mb-3">
                    {String(p.order).padStart(2, "0")} · {p.category[0]}
                  </div>
                  <div className="text-[22px] mb-3 grayscale">{p.emoji}</div>
                  <h3 className="font-display font-bold text-[15px] text-white mb-2 leading-[1.3] group-hover:text-white/80 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[12px] text-white/40 leading-[1.65] mb-4">{p.description.substring(0, 110)}...</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase text-white/30 border border-white/[0.08] rounded px-2 py-[3px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
