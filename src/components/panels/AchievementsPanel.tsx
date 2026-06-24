"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Achievement } from "@/lib/types";

const ACCENT = "#38bdf8";
const GOLD = "#e2b96f";
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

function AnimatedRank({ rank }: { rank: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "scale(0.4)";
    const t = setTimeout(() => {
      el.style.transition = "all 0.7s cubic-bezier(0.34,1.56,0.64,1)";
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    }, 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref} className="text-center shrink-0">
      <div className="font-display font-black leading-none" style={{ fontSize: "clamp(56px,8vw,88px)", color: GOLD, textShadow: `0 0 40px rgba(226,185,111,0.5), 0 0 80px rgba(226,185,111,0.2)` }}>
        {rank}
      </div>
    </div>
  );
}

export default function AchievementsPanel({ achievements }: { achievements: Achievement[] }) {
  const hackathons = achievements.filter(a => a.type === "hackathon"    && a.visible);
  const certs      = achievements.filter(a => a.type === "certification" && a.visible);
  const leadership = achievements.filter(a => a.type === "leadership"   && a.visible);

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(226,185,111,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="max-w-5xl mx-auto px-8 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ACCENT }}>
          <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />Recognition
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-12"
          style={{ fontSize: "clamp(34px,5vw,64px)" }}>
          Milestones &{" "}
          <span style={{ background: `linear-gradient(120deg,#fff 0%,${GOLD} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Awards
          </span>
        </motion.h2>

        {/* Hackathons */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4 mb-8">
          {hackathons.map(ach => (
            <motion.div key={ach.id} variants={item}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="rounded-2xl p-8 relative overflow-hidden group cursor-default"
              style={{ background: "rgba(226,185,111,0.04)", border: "1px solid rgba(226,185,111,0.14)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(226,185,111,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(226,185,111,0.14)"; }}>
              {/* Hover shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                   style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="font-mono text-[9px] tracking-[0.16em] uppercase mb-2" style={{ color: "rgba(226,185,111,0.65)" }}>
                    {ach.organizer} · {ach.date}
                  </div>
                  <h3 className="font-display font-bold text-[18px] text-white mb-2 leading-[1.25]">{ach.title}</h3>
                  {ach.description && (
                    <p className="text-[14px] leading-[1.7] mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>{ach.description}</p>
                  )}
                  {ach.prize && (
                    <div className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1 rounded-full"
                         style={{ background: "rgba(226,185,111,0.08)", border: `1px solid rgba(226,185,111,0.25)`, color: GOLD }}>
                      🏆 {ach.prize}
                    </div>
                  )}
                  {ach.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ach.tags.map(tag => (
                        <span key={tag} className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 rounded"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.38)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {ach.rank && (
                  <div>
                    <AnimatedRank rank={ach.rank} />
                    <div className="font-mono text-[9px] tracking-[0.14em] uppercase mt-2 text-center" style={{ color: "rgba(255,255,255,0.32)" }}>
                      {ach.rankLabel}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Certs + Leadership */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
          {/* Certs */}
          <motion.div variants={item} className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-5" style={{ color: ACCENT }}>Certifications</div>
            <div className="flex flex-col gap-3">
              {certs.map((c, i) => (
                <motion.a key={c.id} href={c.link} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex justify-between items-center p-4 rounded-xl transition-colors cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(56,189,248,0.25)`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.12em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.32)" }}>{c.issuer}</div>
                    <div className="text-[13px] font-semibold text-white">{c.title}</div>
                  </div>
                  <span style={{ color: ACCENT, fontSize: 18 }}>↗</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Leadership */}
          <motion.div variants={item} className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-5" style={{ color: ACCENT }}>Leadership</div>
            {leadership.map((l, i) => (
              <motion.div key={l.id}
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.12 }}
                className="mb-5 pb-5" style={{ borderBottom: i < leadership.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div className="font-mono text-[9px] tracking-[0.1em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.32)" }}>
                  {l.role} · {l.organization}
                </div>
                <div className="font-display font-bold text-[15px] text-white mb-1">{l.title}</div>
                <div className="text-[13px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.6)" }}>{l.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
