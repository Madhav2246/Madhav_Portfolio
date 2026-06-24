"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import TiltCard from "../TiltCard";

const CATS = [
  { id: "all", label: "All" }, { id: "ai", label: "AI / ML" },
  { id: "cv", label: "Vision" }, { id: "nlp", label: "NLP" },
  { id: "fullstack", label: "Full Stack" }, { id: "hackathon", label: "Hackathon" },
];

const item = { hidden: { opacity: 0, y: 28, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function ProjectsPanel({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState("all");
  const visible = projects.filter(p => p.visible && (cat === "all" || p.category.includes(cat))).sort((a,b)=>a.order-b.order);

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Decorative blob */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2"
           style={{ background:"radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)", filter:"blur(80px)" }} />

      <div className="max-w-6xl mx-auto px-8 py-12">
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color:"#38bdf8" }}>
          <span style={{ width:28, height:1, background:"#38bdf8", display:"inline-block" }} />Portfolio
        </motion.div>

        <motion.h2 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-8"
          style={{ fontSize:"clamp(34px,5vw,64px)" }}>
          Innovation{" "}
          <span style={{ background:"linear-gradient(120deg,#fff 0%,#7dd3fc 55%,#38bdf8 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Lab
          </span>
        </motion.h2>

        {/* Filter bar */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }} className="flex flex-wrap gap-2 mb-8">
          {CATS.map(c => (
            <motion.button key={c.id} onClick={() => setCat(c.id)} whileHover={{ scale:1.06 }} whileTap={{ scale:0.96 }}
              className="font-mono text-[10px] tracking-[0.1em] uppercase px-[18px] py-[8px] rounded-[8px] transition-all duration-200"
              style={cat===c.id
                ? { background:"rgba(56,189,248,0.18)", border:"1px solid rgba(56,189,248,0.5)", color:"#38bdf8", boxShadow:"0 4px 16px rgba(56,189,248,0.2)" }
                : { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)" }}>
              {c.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div key={cat} variants={container} initial="hidden" animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {visible.map(p => (
              <TiltCard
                key={p.id}
                maxTilt={10}
                className="rounded-2xl p-6 flex flex-col gap-3 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <span className="text-[28px]">{p.emoji}</span>
                  <span className="font-mono text-[8px] tracking-[0.16em] uppercase px-2 py-1 rounded"
                        style={{ background:"rgba(56,189,248,0.08)", color:"rgba(56,189,248,0.7)", border:"1px solid rgba(56,189,248,0.15)" }}>
                    {p.category[0]}
                  </span>
                </div>
                <h3 className="font-display font-bold text-[16px] text-white leading-[1.25]">{p.title}</h3>
                <p className="text-[13px] leading-[1.7] flex-1" style={{ color:"rgba(255,255,255,0.65)" }}>{p.description}</p>
                {p.impact && (
                  <div className="font-mono text-[8px] tracking-[0.12em] uppercase px-3 py-1 rounded-full self-start"
                       style={{ background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.2)", color:"#38bdf8" }}>
                    ✦ {p.impact}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {p.tags.slice(0,4).map(tag => (
                    <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 rounded"
                          style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.38)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 pt-2" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer"
                    className="font-mono text-[9px] tracking-[0.1em] uppercase transition-colors hover:text-white" style={{ color:"rgba(255,255,255,0.38)" }}>
                    GitHub →
                  </a>}
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer"
                    className="font-mono text-[9px] tracking-[0.1em] uppercase transition-colors hover:text-white" style={{ color:"rgba(255,255,255,0.38)" }}>
                    Live Demo →
                  </a>}
                </div>
              </TiltCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
