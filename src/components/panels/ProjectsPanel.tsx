"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import TiltCard from "../TiltCard";
import ProjectModal from "../ProjectModal";
import GitHubPulse from "../GitHubPulse";

const CATS = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI & Agents" },
  { id: "cv", label: "Computer Vision" },
  { id: "nlp", label: "NLP & RAG" },
  { id: "fullstack", label: "Full Stack Web" },
  { id: "hackathon", label: "Hackathons 🏆" },
  { id: "live", label: "Live Demos 🚀" },
];

const item = { hidden: { opacity: 0, y: 28, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function ProjectsPanel({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const visible = projects
    .filter(p => {
      if (!p.visible) return false;
      if (cat === "all") return true;
      if (cat === "live") return Boolean(p.demo && p.demo.length > 0);
      return p.category.includes(cat);
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2"
           style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 pb-24">
        
        {/* Section Tag */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#38bdf8" }}>
          <span style={{ width: 28, height: 1, background: "#38bdf8", display: "inline-block" }} />Portfolio & Lab
        </motion.div>

        {/* Section Heading */}
        <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-4"
          style={{ fontSize: "clamp(34px,5vw,64px)" }}>
          Innovation{" "}
          <span style={{ background: "linear-gradient(120deg,#fff 0%,#7dd3fc 55%,#38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Lab
          </span>
        </motion.h2>

        <p className="text-white/60 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
          Production-grade AI systems, autonomous agents, and computer vision architectures built to solve high-stakes challenges.
        </p>

        {/* GitHub Pulse Widget */}
        <div className="mb-10">
          <GitHubPulse />
        </div>

        {/* Filter Bar with Counts */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="flex flex-wrap gap-2 mb-8">
          {CATS.map(c => {
            const count = projects.filter(p => {
              if (!p.visible) return false;
              if (c.id === "all") return true;
              if (c.id === "live") return Boolean(p.demo && p.demo.length > 0);
              return p.category.includes(c.id);
            }).length;

            return (
              <motion.button
                key={c.id}
                onClick={() => setCat(c.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase px-4 py-2 rounded-xl transition-all duration-200"
                style={cat === c.id
                  ? { background: "rgba(56,189,248,0.18)", border: "1px solid rgba(56,189,248,0.6)", color: "#38bdf8", boxShadow: "0 4px 16px rgba(56,189,248,0.25)" }
                  : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
              >
                <span>{c.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={cat} variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(p => (
              <TiltCard
                key={p.id}
                maxTilt={8}
                className="rounded-2xl p-6 flex flex-col justify-between cursor-default group transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{p.emoji}</span>
                    <div className="flex items-center gap-2">
                      {p.demo && (
                        <span className="flex items-center gap-1 font-mono text-[8px] tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      )}
                      <span className="font-mono text-[8px] tracking-[0.16em] uppercase px-2 py-1 rounded"
                            style={{ background: "rgba(56,189,248,0.08)", color: "rgba(56,189,248,0.8)", border: "1px solid rgba(56,189,248,0.2)" }}>
                        {p.category[0]}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white leading-snug mb-2 group-hover:text-sky-300 transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-[13px] leading-[1.7] text-white/70 mb-4">
                    {p.description}
                  </p>

                  {p.impact && (
                    <div className="font-mono text-[8px] tracking-[0.12em] uppercase px-3 py-1 rounded-full self-start inline-block mb-4"
                         style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8" }}>
                      ✦ {p.impact}
                    </div>
                  )}

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1 mb-5">
                    {p.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 rounded"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Links */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer"
                        className="font-mono text-[9px] tracking-[0.1em] uppercase transition-colors hover:text-white flex items-center gap-1"
                        style={{ color: "rgba(255,255,255,0.6)" }}>
                        GitHub →
                      </a>
                    )}
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noreferrer"
                        className="font-mono text-[9px] tracking-[0.1em] uppercase font-bold text-sky-400 hover:text-sky-300 transition-colors">
                        Launch 🚀
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProject(p)}
                    className="font-mono text-[9px] uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                  >
                    Blueprint 🔍
                  </button>
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </div>
  );
}
