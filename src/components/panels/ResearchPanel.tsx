"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ResearchPaper } from "@/lib/types";

const ACCENT = "#38bdf8";
const container = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } };
const item = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

const GITHUB_RESEARCH_LINKS: Record<string, string> = {
  "continual-learning-research": "https://github.com/Madhav2246/Continual_learning",
  "physics-based-slm-rag": "https://github.com/Madhav2246/Physics-Based-RAG_SLM",
};

function CountUp({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const num = parseFloat(target);
    if (isNaN(num)) { el.textContent = target; return; }
    const isFloat = target.includes(".");
    let cur = 0;
    const step = num / 55;
    const id = setInterval(() => {
      cur += step;
      if (cur >= num) { cur = num; clearInterval(id); }
      el.textContent = (isFloat ? cur.toFixed(1) : Math.floor(cur)) + suffix;
    }, 22);
    return () => clearInterval(id);
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function ResearchPanel({ papers }: { papers: ResearchPaper[] }) {
  const visible = papers.filter(p => p.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Decorative ambient lines */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] pointer-events-none"
           style={{ background: "linear-gradient(to bottom, transparent, rgba(56,189,248,0.15), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-[2px] pointer-events-none"
           style={{ background: "linear-gradient(to bottom, transparent, rgba(129,140,248,0.1), transparent)" }} />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] pointer-events-none rounded-full"
           style={{ background: "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 pb-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ACCENT }}>
          <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />Research &amp; Publications
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-4"
          style={{ fontSize: "clamp(34px,5vw,64px)" }}>
          Research{" "}
          <span style={{ background: `linear-gradient(120deg,#fff 0%,#7dd3fc 55%,${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Publications
          </span>
        </motion.h2>

        <p className="text-white/60 text-sm md:text-base max-w-2xl mb-10 leading-relaxed">
          First-author contributions in Continual Learning (CIS 2026), Neuro-Symbolic RAG (EAAI), and Autonomous Distributed Systems (Nexus).
        </p>

        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
          {visible.map(paper => {
            const githubUrl = GITHUB_RESEARCH_LINKS[paper.id];

            return (
              <motion.div key={paper.id} variants={item}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="rounded-2xl p-7 md:p-8 relative overflow-hidden group cursor-default"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.25)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(56,189,248,0.03)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}>
                {/* Hover top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                     style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }} />

                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: ACCENT }}>
                    {paper.num} · {paper.course}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300">
                    {paper.id === "continual-learning-research" ? "✦ Accepted · CIS 2026 (Forthcoming)" :
                     paper.id === "physics-based-slm-rag" ? "✦ Submitted to EAAI" : "✦ Paper Ready for Submission"}
                  </span>
                </div>

                <div className="font-mono text-[10px] tracking-[0.14em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {paper.domain}
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-3 leading-snug">{paper.title}</h3>
                <p className="text-[14px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.72)" }}>{paper.abstract}</p>

                {paper.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-6 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    {paper.metrics.map(m => (
                      <div key={m.label}>
                        <div className="font-display font-black text-[22px] text-white leading-none">
                          <CountUp target={m.value} />
                        </div>
                        <div className="font-mono text-[8px] tracking-[0.12em] uppercase mt-1 text-white/40">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {paper.tags.map(tag => (
                      <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-sky-400 hover:text-white transition-colors"
                    >
                      <span>Research Code / Repo</span> →
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
