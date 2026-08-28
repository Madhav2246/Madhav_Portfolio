"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TECH_SKILLS = [
  { name: "Python", cat: "AI & ML", level: 5, icon: "🐍", tag: "Primary Language" },
  { name: "PyTorch", cat: "AI & ML", level: 5, icon: "🔥", tag: "Deep Learning & GNNs" },
  { name: "OpenCV / YOLO", cat: "AI & ML", level: 5, icon: "👁️", tag: "Computer Vision" },
  { name: "LangChain / RAG / SLM", cat: "AI & ML", level: 5, icon: "💬", tag: "Generative AI" },
  { name: "TensorFlow / MediaPipe", cat: "AI & ML", level: 4, icon: "🧠", tag: "Neural Networks" },
  { name: "Graph NNs (PyG)", cat: "AI & ML", level: 4, icon: "🕸️", tag: "Graph ML" },
  { name: "scikit-learn", cat: "AI & ML", level: 5, icon: "📊", tag: "Classical ML" },
  { name: "TypeScript / Next.js", cat: "Development", level: 4, icon: "⚛️", tag: "Frontend & Full Stack" },
  { name: "FastAPI / Flask", cat: "Development", level: 4, icon: "⚡", tag: "High-Perf Backend" },
  { name: "Node.js / Express", cat: "Development", level: 4, icon: "🟢", tag: "APIs & Services" },
  { name: "Docker / K8s", cat: "Tools", level: 4, icon: "🐳", tag: "Containerization" },
  { name: "SQL / Vector DBs (FAISS)", cat: "Tools", level: 4, icon: "🗄️", tag: "Databases & Embeddings" },
  { name: "Git / Linux / CI-CD", cat: "Tools", level: 5, icon: "🔧", tag: "DevOps & Tooling" },
];

const SOFT_SKILLS = [
  {
    name: "Collaborative Leadership & Mentorship",
    category: "Leadership",
    icon: "👑",
    desc: "Ex-Mentor at ACM SIG AI; conducted ML360 workshops and guided 50+ junior peers in ML pipelines.",
    tag: "SIG AI · Amrita",
  },
  {
    name: "36-Hour Hackathon Rapid Prototyping",
    category: "Execution",
    icon: "⚡",
    desc: "High-pressure product delivery: 2nd Place National Winner at IIT Madras CoERS & Top 5 at IISc Bengaluru.",
    tag: "IIT Madras · IISc",
  },
  {
    name: "First-Principles Research & Analytical Rigor",
    category: "Strategy",
    icon: "🧠",
    desc: "Formulating novel architectures in Continual Learning (HAT) and Molecular Toxicity prediction.",
    tag: "Research & Graph AI",
  },
  {
    name: "Technical Communication & Articulation",
    category: "Collaboration",
    icon: "🎯",
    desc: "Translating cutting-edge mathematical architectures into clear, compelling jury presentations and docs.",
    tag: "Storytelling & Pitching",
  },
];

const CATS = ["AI & ML", "Development", "Tools"];
const ACCENT = "#38bdf8";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
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
  const [activeTab, setActiveTab] = useState<"tech" | "soft">("tech");

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll relative" style={{ paddingTop: 64 }}>
      {/* Decorative orbit rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 600, height: 600 }}>
        {[1, 0.65, 0.38].map((scale, i) => (
          <div key={i} className="absolute inset-0 rounded-full"
               style={{ border: "1px solid rgba(56,189,248,0.06)", transform: `scale(${scale})`, animation: `spinSlow ${18 + i * 8}s linear infinite ${i % 2 ? "reverse" : ""}` }} />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 relative pb-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: ACCENT }}>
          <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />Expertise & Skills
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-6"
          style={{ fontSize: "clamp(34px,5vw,64px)" }}>
          Technical &{" "}
          <span style={{ background: `linear-gradient(120deg,#fff 0%,#7dd3fc 55%,${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Leadership Arsenal
          </span>
        </motion.h2>

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("tech")}
            className={`font-mono text-[10px] tracking-wider uppercase px-5 py-2.5 rounded-xl border transition-all ${
              activeTab === "tech"
                ? "bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            💻 Technical Arsenal ({TECH_SKILLS.length})
          </button>
          <button
            onClick={() => setActiveTab("soft")}
            className={`font-mono text-[10px] tracking-wider uppercase px-5 py-2.5 rounded-xl border transition-all ${
              activeTab === "soft"
                ? "bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white"
            }`}
          >
            👑 Leadership & Soft Skills ({SOFT_SKILLS.length})
          </button>
        </div>

        {/* Technical Skills Tab */}
        {activeTab === "tech" && (
          <div>
            {CATS.map((cat, ci) => (
              <div key={cat} className="mb-8">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.12 }}
                  className="font-mono text-[10px] tracking-[0.18em] uppercase mb-4 pl-3"
                  style={{ color: ACCENT, borderLeft: `2px solid ${ACCENT}` }}>
                  {cat}
                </motion.div>

                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TECH_SKILLS.filter(s => s.cat === cat).map((skill, si) => (
                    <motion.div key={skill.name} variants={item}
                      whileHover={{ x: 5, scale: 1.01 }}
                      className="flex items-center justify-between px-5 py-4 rounded-xl group cursor-default bg-white/[0.04] border border-white/[0.08] hover:border-sky-500/30 hover:bg-sky-500/[0.04] transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-[22px]">{skill.icon}</span>
                        <div>
                          <div className="font-sans text-[14px] font-semibold text-white">{skill.name}</div>
                          <div className="font-mono text-[8px] tracking-[0.1em] uppercase mt-[2px] text-white/40">{skill.tag}</div>
                        </div>
                      </div>
                      <AnimatedBar level={skill.level} delay={200 + ci * 100 + si * 60} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}

        {/* Soft Skills Tab */}
        {activeTab === "soft" && (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SOFT_SKILLS.map(skill => (
              <motion.div
                key={skill.name}
                variants={item}
                whileHover={{ y: -3 }}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      {skill.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white mb-2">{skill.name}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{skill.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
