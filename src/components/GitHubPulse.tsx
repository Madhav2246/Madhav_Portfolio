"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  className?: string;
}

export default function GitHubPulse({ className = "" }: Props) {
  const languages = [
    { name: "Python", pct: 52, color: "#38bdf8" },
    { name: "TypeScript", pct: 26, color: "#818cf8" },
    { name: "CSS / Web", pct: 12, color: "#f472b6" },
    { name: "TeX / Research", pct: 10, color: "#34d399" },
  ];

  const highlights = [
    { label: "Public Repos", val: "15+" },
    { label: "Hackathons Won", val: "3" },
    { label: "Lines Shipped", val: "50k+" },
    { label: "Active Domain", val: "AI & CV" },
  ];

  return (
    <div
      className={`rounded-2xl p-5 border border-white/10 bg-zinc-950/80 backdrop-blur-md relative overflow-hidden ${className}`}
      style={{
        boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">
            GitHub Pulse · @Madhav2246
          </span>
        </div>
        <a
          href="https://github.com/Madhav2246"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[9px] uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors"
        >
          View Profile ↗
        </a>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {highlights.map(h => (
          <div key={h.label} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="font-display font-black text-lg text-white leading-none">{h.val}</div>
            <div className="font-mono text-[8px] uppercase tracking-wider text-white/40 mt-1">{h.label}</div>
          </div>
        ))}
      </div>

      {/* Language breakdown bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between font-mono text-[9px] text-white/40 uppercase">
          <span>Primary Language Breakdown</span>
          <span>Python 52% · TypeScript 26%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
          {languages.map(l => (
            <motion.div
              key={l.name}
              initial={{ width: 0 }}
              animate={{ width: `${l.pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ background: l.color }}
              title={`${l.name}: ${l.pct}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          {languages.map(l => (
            <div key={l.name} className="flex items-center gap-1.5 font-mono text-[9px] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
              <span>{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
