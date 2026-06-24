"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const SKILLS = [
  { name: "Python",          cat: "AI & ML",     level: 5, icon: "🐍", tag: "Primary Language" },
  { name: "PyTorch",         cat: "AI & ML",     level: 5, icon: "🔥", tag: "Deep Learning" },
  { name: "TensorFlow",      cat: "AI & ML",     level: 4, icon: "🧠", tag: "Neural Networks" },
  { name: "OpenCV",          cat: "AI & ML",     level: 5, icon: "👁️", tag: "Computer Vision" },
  { name: "NLP & LLMs",      cat: "AI & ML",     level: 4, icon: "💬", tag: "Language AI" },
  { name: "Graph NNs",       cat: "AI & ML",     level: 4, icon: "🕸️", tag: "Graph ML" },
  { name: "scikit-learn",    cat: "AI & ML",     level: 5, icon: "📊", tag: "Classical ML" },
  { name: "React / Next.js", cat: "Development", level: 4, icon: "⚛️", tag: "Frontend" },
  { name: "FastAPI",         cat: "Development", level: 4, icon: "⚡", tag: "Backend" },
  { name: "Node.js",         cat: "Development", level: 3, icon: "🟢", tag: "Backend" },
  { name: "Docker / K8s",    cat: "Tools",       level: 4, icon: "🐳", tag: "DevOps" },
  { name: "SQL / MongoDB",   cat: "Tools",       level: 4, icon: "🗄️", tag: "Databases" },
  { name: "Git / Linux",     cat: "Tools",       level: 5, icon: "🔧", tag: "Tools" },
];
const CATS = ["AI & ML", "Development", "Tools"];
const ACCENT = "#38bdf8";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

function AnimatedBar({ level, delay }: { level: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.transition = "width 0.9s cubic-bezier(0.22,1,0.36,1)";
      el.style.width = `${(level / 5) * 100}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [level, delay]);

  return (
    <div className="relative h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)", width: "80px" }}>
      <div ref={ref} className="absolute inset-y-0 left-0 rounded-full"
           style={{ background: `linear-gradient(90deg, ${ACCENT}, #818cf8)`, boxShadow: `0 0 8px ${ACCENT}60`, width: 0 }} />
    </div>
  );
}

export default function SkillsPanel() {
  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Decorative orbit rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 600, height: 600 }}>
        {[1, 0.65, 0.38].map((scale, i) => (
          <div key={i} className="absolute inset-0 rounded-full"
               style={{ border: "1px solid rgba(56,189,248,0.06)", transform: `scale(${scale})`, animation: `spinSlow ${18 + i * 8}s linear infinite ${i % 2 ? "reverse" : ""}` }} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 relative">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ACCENT }}>
          <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />Expertise
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-12"
          style={{ fontSize: "clamp(34px,5vw,64px)" }}>
          Technical{" "}
          <span style={{ background: `linear-gradient(120deg,#fff 0%,#7dd3fc 55%,${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Arsenal
          </span>
        </motion.h2>

        {CATS.map((cat, ci) => (
          <div key={cat} className="mb-10">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.12 }}
              className="font-mono text-[10px] tracking-[0.18em] uppercase mb-4 pl-3"
              style={{ color: ACCENT, borderLeft: `2px solid ${ACCENT}` }}>
              {cat}
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SKILLS.filter(s => s.cat === cat).map((skill, si) => (
                <motion.div key={skill.name} variants={item}
                  whileHover={{ x: 5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="flex items-center justify-between px-5 py-4 rounded-xl group cursor-default"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(56,189,248,0.25)`; (e.currentTarget as HTMLElement).style.background = "rgba(56,189,248,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[22px]">{skill.icon}</span>
                    <div>
                      <div className="font-sans text-[15px] font-semibold text-white">{skill.name}</div>
                      <div className="font-mono text-[8px] tracking-[0.1em] uppercase mt-[2px]" style={{ color: "rgba(255,255,255,0.3)" }}>{skill.tag}</div>
                    </div>
                  </div>
                  <AnimatedBar level={skill.level} delay={300 + ci * 120 + si * 80} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
