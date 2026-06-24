"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Project, AcademicData, Achievement, ResearchPaper } from "@/lib/types";

interface Props {
  projects: Project[];
  academic: AcademicData;
  achievements: Achievement[];
  research: ResearchPaper[];
}

const ACCENT = "#38bdf8";
const GOLD   = "#e2b96f";

const card = "rounded-2xl p-6";
const cardStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" };

const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
const containerAnim = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

function StatCard({ label, value, sub, accent = false }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <motion.div variants={itemAnim} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className={card} style={accent
        ? { background: "rgba(56,189,248,0.07)", border: "1px solid rgba(56,189,248,0.25)", boxShadow: "0 4px 20px rgba(56,189,248,0.1)" }
        : cardStyle}>
      <div className="font-display font-black text-[30px] text-white leading-none mb-1">{value}</div>
      <div className="font-mono text-[9px] tracking-[0.16em] uppercase mb-1" style={{ color: accent ? ACCENT : "rgba(255,255,255,0.4)" }}>{label}</div>
      {sub && <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</div>}
    </motion.div>
  );
}

function AttendanceBar({ subject, pct }: { subject: string; pct: number }) {
  const color = pct >= 90 ? "#4ade80" : pct >= 75 ? ACCENT : "#f87171";
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="font-sans text-[13px] text-white/80">{subject}</span>
        <span className="font-mono text-[12px] font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${color}99, ${color})`, borderRadius: 4 }} />
      </div>
    </div>
  );
}

function CGPAChart({ history }: { history: { semester: string; cgpa: number }[] }) {
  const max = 10;
  const W = 100 / (history.length - 1);
  const pts = history.map((h, i) => `${i * W},${100 - (h.cgpa / max) * 90}`).join(" ");

  return (
    <div className="relative" style={{ height: 120 }}>
      <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        {[8, 8.5, 9, 9.5, 10].map(v => (
          <line key={v} x1="0" y1={100 - (v / max) * 90} x2="100" y2={100 - (v / max) * 90}
            stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        ))}
        {/* Area fill */}
        <polyline points={`0,100 ${pts} 100,100`} fill="rgba(56,189,248,0.08)" />
        {/* Line */}
        <polyline points={pts} fill="none" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {history.map((h, i) => (
          <circle key={i} cx={i * W} cy={100 - (h.cgpa / max) * 90} r="2.5" fill={ACCENT} />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {history.map(h => (
          <div key={h.semester} className="text-center">
            <div className="font-mono text-[8px] text-white/40">{h.semester}</div>
            <div className="font-mono text-[9px] font-bold" style={{ color: ACCENT }}>{h.cgpa}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsClient({ projects, academic, achievements, research }: Props) {
  const visibleProjects = projects.filter(p => p.visible);
  const hackathons = achievements.filter(a => a.type === "hackathon");
  const certs = achievements.filter(a => a.type === "certification");
  const avgAttendance = academic.attendance.reduce((s, a) => s + a.percentage, 0) / academic.attendance.length;

  // Category breakdown
  const catCount: Record<string, number> = {};
  visibleProjects.forEach(p => p.category.forEach(c => { catCount[c] = (catCount[c] || 0) + 1; }));

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--font-inter)" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(56,189,248,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(129,140,248,0.04) 0%, transparent 60%)" }} />

      {/* Nav */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-8 h-[60px]"
           style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link href="/" className="font-display font-black text-[18px] text-white hover:opacity-70 transition-opacity">
          MY<span style={{ color: ACCENT }}>.</span>
        </Link>
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: ACCENT }}>
          Portfolio Analytics
        </div>
        <Link href="/" className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors">
          ← Back
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ACCENT }}>
            <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />Dashboard
          </div>
          <h1 className="font-display font-black leading-none tracking-[-0.04em] text-white mb-3"
              style={{ fontSize: "clamp(36px,5vw,64px)" }}>
            Portfolio <span style={{ background: `linear-gradient(120deg,#fff 0%,#7dd3fc 55%,${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analytics</span>
          </h1>
          <p className="text-[16px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Real-time overview of projects, academic performance, and achievements.
          </p>
        </motion.div>

        {/* ── Top KPIs ── */}
        <motion.div variants={containerAnim} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Projects"    value={visibleProjects.length}     sub="All categories"   accent />
          <StatCard label="Current CGPA"      value={`${academic.currentCGPA}/10`} sub={`Year ${academic.year} of ${academic.totalYears}`} accent />
          <StatCard label="Hackathons"         value={hackathons.length}           sub="National level" />
          <StatCard label="Research Tracks"    value={research.filter(r=>r.visible).length} sub="In progress" />
        </motion.div>

        {/* ── Row 2: CGPA + Attendance ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* CGPA trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={card} style={cardStyle}>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-4" style={{ color: ACCENT }}>CGPA Trend</div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display font-black text-[42px] text-white leading-none">{academic.currentCGPA}</span>
              <span className="font-mono text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>/ 10.0</span>
              <span className="ml-auto font-mono text-[10px] px-2 py-1 rounded"
                    style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                ↑ Progressing
              </span>
            </div>
            <CGPAChart history={academic.semesterHistory} />
          </motion.div>

          {/* Attendance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className={card} style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: ACCENT }}>Attendance</div>
              <div className="font-mono text-[11px] font-bold" style={{ color: "#4ade80" }}>{avgAttendance.toFixed(1)}% avg</div>
            </div>
            {academic.attendance.map(a => (
              <AttendanceBar key={a.subject} subject={a.subject} pct={a.percentage} />
            ))}
          </motion.div>
        </div>

        {/* ── Projects breakdown ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className={`${card} mb-8`} style={cardStyle}>
          <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-6" style={{ color: ACCENT }}>Projects Breakdown</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {Object.entries(catCount).map(([cat, count]) => (
              <div key={cat} className="text-center p-4 rounded-xl" style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.12)" }}>
                <div className="font-display font-black text-[26px] text-white mb-1">{count}</div>
                <div className="font-mono text-[8px] tracking-[0.14em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>{cat}</div>
              </div>
            ))}
          </div>

          {/* Project list */}
          <div className="space-y-2">
            {visibleProjects.slice(0, 8).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-[18px]">{p.emoji}</span>
                  <div>
                    <div className="font-sans text-[13px] font-semibold text-white">{p.title}</div>
                    <div className="font-mono text-[8px] tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {p.category.join(" · ")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.featured && (
                    <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 rounded"
                          style={{ background: "rgba(226,185,111,0.1)", border: "1px solid rgba(226,185,111,0.2)", color: GOLD }}>
                      Featured
                    </span>
                  )}
                  {p.impact && (
                    <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 rounded"
                          style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.15)", color: ACCENT }}>
                      {p.impact}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Research + Achievements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Research */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className={card} style={cardStyle}>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-5" style={{ color: ACCENT }}>Research</div>
            {research.filter(r => r.visible).map(p => (
              <div key={p.id} className="mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-mono text-[8px] tracking-[0.12em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{p.domain}</div>
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-[2px] rounded"
                        style={p.status === "published"
                          ? { background: "rgba(56,189,248,0.08)", color: ACCENT, border: "1px solid rgba(56,189,248,0.2)" }
                          : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {p.status}
                  </span>
                </div>
                <div className="font-display font-bold text-[14px] text-white leading-snug">{p.title}</div>
                {p.metrics.length > 0 && (
                  <div className="flex gap-4 mt-2">
                    {p.metrics.map(m => (
                      <div key={m.label}>
                        <span className="font-mono font-bold text-[13px] text-white">{m.value}</span>
                        <span className="font-mono text-[8px] uppercase ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          {/* Hackathons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
            className={card} style={cardStyle}>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase mb-5" style={{ color: GOLD }}>Hackathon Wins</div>
            {hackathons.map(h => (
              <div key={h.id} className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="font-mono text-[8px] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{h.organizer} · {h.date}</div>
                  <div className="font-display font-bold text-[14px] text-white leading-snug">{h.title}</div>
                  {h.prize && <div className="font-mono text-[9px] mt-1" style={{ color: GOLD }}>{h.prize}</div>}
                </div>
                {h.rank && (
                  <div className="font-display font-black text-[32px] shrink-0 ml-4" style={{ color: GOLD, textShadow: "0 0 20px rgba(226,185,111,0.4)" }}>
                    {h.rank}
                  </div>
                )}
              </div>
            ))}

            {/* Certs count */}
            <div className="flex items-center justify-between pt-2">
              <div className="font-mono text-[9px] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Certifications</div>
              <div className="font-display font-black text-[22px] text-white">{certs.length}</div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-center font-mono text-[10px] tracking-[0.14em] uppercase pb-8" style={{ color: "rgba(255,255,255,0.2)" }}>
          Data sourced directly from portfolio JSON · Updated in real-time
        </div>
      </div>
    </div>
  );
}
