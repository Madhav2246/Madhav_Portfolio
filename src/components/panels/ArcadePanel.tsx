"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import type { HobbiesData } from "@/lib/types";
import MiniCricketGame from "../games/MiniCricketGame";
import CinephileLab from "../games/CinephileLab";

interface Props {
  hobbies: HobbiesData;
}

export default function ArcadePanel({ hobbies }: Props) {
  const [activeMode, setActiveMode] = useState<"cricket" | "cinema" | "soft-skills">("cricket");

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Decorative ambient gradients */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 relative pb-20">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3"
          style={{ color: "#34d399" }}
        >
          <span style={{ width: 28, height: 1, background: "#34d399", display: "inline-block" }} />
          Creative Lounge & Hobbies
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-6"
          style={{ fontSize: "clamp(34px,5vw,64px)" }}
        >
          Arcade &{" "}
          <span style={{
            background: "linear-gradient(120deg,#fff 0%,#34d399 50%,#a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Passions
          </span>
        </motion.h2>

        <p className="text-white/60 text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
          Beyond the neural networks and code: where strategy, cinema aesthetics, and high-pressure composure meet.
          Play interactive challenges and explore the mindset that fuels my engineering!
        </p>

        {/* Mode Switcher */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          <button
            onClick={() => setActiveMode("cricket")}
            className={`flex items-center gap-2 font-mono text-xs tracking-wider uppercase px-5 py-3 rounded-xl border transition-all ${
              activeMode === "cricket"
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            <span>🏏</span>
            Mini-Cricket Super Over Game
          </button>

          <button
            onClick={() => setActiveMode("cinema")}
            className={`flex items-center gap-2 font-mono text-xs tracking-wider uppercase px-5 py-3 rounded-xl border transition-all ${
              activeMode === "cinema"
                ? "bg-purple-500/20 border-purple-400 text-purple-300 font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            <span>🎬</span>
            Cinephile Lab & Trivia
          </button>

          <button
            onClick={() => setActiveMode("soft-skills")}
            className={`flex items-center gap-2 font-mono text-xs tracking-wider uppercase px-5 py-3 rounded-xl border transition-all ${
              activeMode === "soft-skills"
                ? "bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            <span>👑</span>
            Soft Skills & Leadership
          </button>
        </div>

        {/* Render Active Playground Component */}
        {activeMode === "cricket" && (
          <div className="space-y-6">
            <MiniCricketGame />

            {/* Cricket Philosophy & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/10 rounded-xl p-5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 mb-2">
                  🏏 The Striker&apos;s Mindset
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2">
                  Applied Strategy Under Pressure
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {hobbies.cricket.philosophy}
                </p>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 mb-3">
                  Match DNA & Role
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {hobbies.cricket.stats.map(s => (
                    <div key={s.label} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <div className="font-mono text-[8px] uppercase tracking-wider text-white/40">{s.label}</div>
                      <div className="font-sans font-bold text-xs text-white mt-0.5">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === "cinema" && (
          <div className="space-y-6">
            <CinephileLab
              recommendations={hobbies.cinema.recommendations}
              trivia={hobbies.cinema.trivia}
              directors={hobbies.cinema.favoriteDirectors}
            />

            <div className="bg-black/40 border border-white/10 rounded-xl p-5">
              <div className="font-mono text-[9px] uppercase tracking-wider text-purple-400 mb-2">
                🎬 Cinematic Philosophy
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">
                &ldquo;{hobbies.cinema.philosophy}&rdquo;
              </p>
            </div>
          </div>
        )}

        {activeMode === "soft-skills" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hobbies.softSkills.map(skill => (
                <motion.div
                  key={skill.id}
                  whileHover={{ y: -4 }}
                  className="bg-black/50 border border-white/10 hover:border-sky-500/40 rounded-2xl p-6 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {skill.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {skill.name}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed mb-4">
                    {skill.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-white/10">
                    {skill.highlights.map(h => (
                      <div key={h} className="flex items-center gap-2 font-mono text-[10px] text-white/80">
                        <span className="text-sky-400">✦</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
