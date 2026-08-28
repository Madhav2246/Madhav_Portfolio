"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, AcademicData, Achievement, ResearchPaper, HobbiesData } from "@/lib/types";
import ProjectModal from "./ProjectModal";
import CursorGlow from "./CursorGlow";

const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), { ssr: false });

// SectionId exported so legacy components (FloatingNav, GameNav, HeroPanel) still compile
export type SectionId = "hero" | "research" | "projects" | "skills" | "achievements" | "about" | "passions" | "contact" | "home" | "arcade";

// ────────── animation helpers ──────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

// ────────── data types ──────────
interface Props {
  projects: Project[];
  academic: AcademicData;
  achievements: Achievement[];
  research: ResearchPaper[];
  hobbies: HobbiesData;
}

// ────────── nav sections ──────────
const SECTIONS = [
  { id: "hero",         label: "Home" },
  { id: "research",     label: "Research" },
  { id: "projects",     label: "Projects" },
  { id: "skills",       label: "Skills" },
  { id: "achievements", label: "Awards" },
  { id: "about",        label: "About" },
  { id: "passions",     label: "Passions" },
  { id: "contact",      label: "Contact" },
];

// ────────── tech skill groups ──────────
const TECH_SKILLS = [
  {
    group: "AI & Machine Learning",
    icon: "🧠",
    skills: ["PyTorch", "TensorFlow", "Continual Learning (HAT/EWC)", "Graph Neural Networks (PyG)", "LoRA / PEFT Fine-tuning", "Neuro-Symbolic RAG", "LangChain / LlamaIndex", "OpenCV / YOLO", "scikit-learn", "HuggingFace Transformers"],
  },
  {
    group: "Backend & Distributed Systems",
    icon: "⚙️",
    skills: ["FastAPI", "Django REST Framework", "Flask", "Redis (Priority Queues)", "Celery / Distributed Tasks", "DAG Workflow Execution", "WebSockets", "Docker / Containers", "Kubernetes (basics)", "Linux & Shell Scripting"],
  },
  {
    group: "Frontend & Full Stack",
    icon: "💻",
    skills: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Framer Motion", "Streamlit", "HTML5 / CSS3", "JavaScript (ES2023+)", "REST API Design", "VS Code Extension API"],
  },
  {
    group: "Data, Cloud & Research Tools",
    icon: "📊",
    skills: ["PostgreSQL", "SQLite", "FAISS / Vector DBs", "BM25 / Hybrid Retrieval", "SymPy (Symbolic Math)", "RDKit (Cheminformatics)", "PyMuPDF / NLP Parsing", "Git / GitHub", "LaTeX", "Jupyter / Colab"],
  },
];

// ────────── research status badge colour ──────────
const statusMeta: Record<string, { label: string; color: string }> = {
  published: { label: "✦ Accepted · CIS 2026",     color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" },
  submitted: { label: "✦ Submitted · EAAI",         color: "text-sky-300 border-sky-500/40 bg-sky-500/10" },
  ready:     { label: "✦ Paper Ready",              color: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10" },
};

function researchStatus(paper: ResearchPaper) {
  if (paper.id === "continual-learning-research") return statusMeta.published;
  if (paper.id === "physics-based-slm-rag")       return statusMeta.submitted;
  return statusMeta.ready;
}

const GITHUB_LINKS: Record<string, string> = {
  "continual-learning-research": "https://github.com/Madhav2246/Continual_learning",
  "physics-based-slm-rag":       "https://github.com/Madhav2246/Physics-Based-RAG_SLM",
};

export default function PortfolioShell({ projects, academic, achievements, research, hobbies }: Props) {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectCat, setProjectCat] = useState("all");
  const [achCat, setAchCat] = useState("all");
  const [skillsTab, setSkillsTab] = useState(0);
  const [arcadeTab, setArcadeTab] = useState<"cricket" | "cinema">("cinema");
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaChoice, setTriviaChoice] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const typedRef = useRef<{ destroy: () => void } | null>(null);

  // Typed.js for hero tagline
  useEffect(() => {
    import("typed.js").then(({ default: Typed }) => {
      typedRef.current = new Typed("#hero-typed", {
        strings: [
          "AI & Systems Engineer_",
          "Continual Learning Researcher_",
          "Neuro-Symbolic RAG Architect_",
          "Distributed Systems Builder_",
          "IIT Madras National Finalist_",
        ],
        typeSpeed: 42,
        backSpeed: 22,
        backDelay: 1600,
        loop: true,
        showCursor: true,
        cursorChar: "|",
      });
    });
    return () => typedRef.current?.destroy();
  }, []);

  // Ctrl+K to open command center (we'll just scroll to projects for now)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.35 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredProjects = projects.filter((p) => {
    if (!p.visible) return false;
    if (projectCat === "all") return true;
    if (projectCat === "live") return Boolean(p.demo);
    if (projectCat === "featured") return p.featured;
    return p.category.includes(projectCat);
  });

  const triviaQ = hobbies.cinema.trivia[triviaIdx];

  return (
    <div className="relative min-h-screen bg-void" style={{ color: "#f0ead6" }}>
      <CursorGlow />

      {/* Ambient canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}><NeuralCanvas /></Suspense>
      </div>

      {/* Ambient orbs */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[700px] orb-gold z-[1]" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] orb-deep-red z-[1]" />
      <div className="fixed top-1/2 left-0 w-[400px] h-[400px] orb-amber z-[1]" />

      {/* ══════════ FLOATING NAVIGATION ══════════ */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="nav-pill pointer-events-auto px-4 py-2 flex items-center gap-1 max-w-5xl w-full justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-display font-black text-lg text-[#f0ead6] hover:text-gold transition-colors"
            style={{ color: "#f0ead6" }}
          >
            MY<span className="text-gold">.</span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {SECTIONS.filter(s => s.id !== "hero").map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase transition-all duration-200 ${
                  activeSection === s.id
                    ? "bg-[rgba(212,168,71,0.15)] text-gold border border-[rgba(212,168,71,0.4)]"
                    : "text-[rgba(240,234,214,0.55)] hover:text-[#f0ead6]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Connect CTA */}
          <button
            onClick={() => scrollTo("contact")}
            className="px-5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider font-bold text-void"
            style={{ background: "linear-gradient(135deg, #d4a847, #f8d87a)" }}
          >
            Hire Me
          </button>
        </nav>
      </header>

      <main className="relative z-10">

        {/* ══════════════════════════════════════
            SECTION 1: HERO — TECH-FIRST INTRODUCTION
        ══════════════════════════════════════ */}
        <section id="hero" className="snap-section flex flex-col justify-center min-h-screen px-6 md:px-16 pt-28 pb-16 max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="show" variants={stagger}>

            {/* Status badge */}
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase border"
              style={{ borderColor: "rgba(212,168,71,0.3)", background: "rgba(212,168,71,0.06)", color: "#d4a847" }}>
              <span className="pulse-gold" />
              Available for AI/ML Engineering Roles · 2026
            </motion.div>

            {/* Name */}
            <motion.h1 variants={fadeUp} custom={1}
              className="font-display font-black leading-[0.92] tracking-tight text-[#f0ead6] mb-4"
              style={{ fontSize: "clamp(52px, 9vw, 110px)" }}>
              Madhav<br />
              <span className="text-gold">Yalamarthi</span>
            </motion.h1>

            {/* Typed role */}
            <motion.div variants={fadeUp} custom={2} className="flex items-center gap-3 mb-5 h-9">
              <span className="font-mono text-base" style={{ color: "rgba(212,168,71,0.6)" }}>—</span>
              <span id="hero-typed" className="font-mono text-base text-[#f0ead6]" />
            </motion.div>

            {/* Bio paragraph */}
            <motion.p variants={fadeUp} custom={3}
              className="text-base sm:text-lg leading-relaxed max-w-2xl mb-10 font-light"
              style={{ color: "rgba(240,234,214,0.7)" }}>
              Building the frontier of{" "}
              <strong style={{ color: "#f0ead6" }}>Continual Learning, Neuro-Symbolic RAG, and Autonomous Distributed Systems</strong>.
              {" "}Pursuing B.Tech in AI at <span style={{ color: "#f0ead6" }}>Amrita Vishwa Vidyapeetham</span> (CGPA {academic.currentCGPA}/10).
              Two first-author papers. National Hackathon winner at IIT Madras.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3 mb-14">
              <button onClick={() => scrollTo("research")}
                className="px-7 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-void transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#d4a847,#f8d87a)", boxShadow: "0 0 25px rgba(212,168,71,0.4)" }}>
                View Research Publications →
              </button>
              <button onClick={() => scrollTo("projects")}
                className="px-7 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider text-[#f0ead6] transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(212,168,71,0.06)", border: "1px solid rgba(212,168,71,0.25)" }}>
                Explore Projects →
              </button>
            </motion.div>

            {/* Live stats row */}
            <motion.div variants={fadeUp} custom={5}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { num: "14+", label: "Projects Shipped",    sub: "AI · Vision · Full Stack" },
                { num: "2",   label: "First-Author Papers", sub: "CIS 2026 · EAAI" },
                { num: "🥈",  label: "IIT Madras Winner",   sub: "National Road Safety" },
                { num: `${academic.currentCGPA}`,   label: "CGPA / 10.0",         sub: "Amrita VV" },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="font-display font-black text-2xl sm:text-3xl text-gold mb-1">{stat.num}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "rgba(212,168,71,0.7)" }}>{stat.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "rgba(240,234,214,0.4)" }}>{stat.sub}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 2: RESEARCH — PRIMARY TECH FOCUS
        ══════════════════════════════════════ */}
        <section id="research" className="snap-section min-h-screen px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="section-eyebrow">
              <span className="gold-line" />Research &amp; Publications
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-2 tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,64px)" }}>
              Scholarly <span className="text-gold">Research</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={2}
              className="text-sm mb-8 max-w-xl leading-relaxed"
              style={{ color: "rgba(240,234,214,0.55)" }}>
              First-author research in <strong style={{ color: "#f0ead6" }}>Continual Learning</strong>,{" "}
              <strong style={{ color: "#f0ead6" }}>Neuro-Symbolic RAG</strong>, and{" "}
              <strong style={{ color: "#f0ead6" }}>Autonomous Distributed Systems</strong>.
            </motion.p>

            {/* 2-col grid — first paper spans full width as featured, next two side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {research.filter(p => p.visible).sort((a, b) => a.order - b.order).map((paper, i) => {
                const status = researchStatus(paper);
                const ghUrl = GITHUB_LINKS[paper.id];
                const isFeatured = i === 0;
                return (
                  <motion.article
                    key={paper.id}
                    variants={fadeUp}
                    custom={i + 3}
                    className={isFeatured ? "lg:col-span-2" : ""}
                    style={{
                      background: "rgba(10,8,5,0.82)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderLeft: "3px solid rgba(212,168,71,0.5)",
                      borderRadius: 16,
                      padding: "28px 28px 22px",
                      transition: "border-color 0.3s, box-shadow 0.3s",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    whileHover={{ borderLeftColor: "#d4a847", boxShadow: "0 0 30px rgba(212,168,71,0.07)" }}
                  >
                    {/* Subtle top gradient accent */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1,
                      background: "linear-gradient(90deg, rgba(212,168,71,0.3), transparent)",
                    }} />

                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-3xl" style={{ color: "rgba(212,168,71,0.2)", lineHeight: 1 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className="mono-tag" style={{ fontSize: 8, color: "rgba(240,234,214,0.35)" }}>{paper.domain}</div>
                          <div className="mono-tag mt-0.5" style={{ fontSize: 8, color: "rgba(212,168,71,0.5)" }}>{paper.num}</div>
                        </div>
                      </div>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-[#f0ead6] mb-2 leading-snug"
                      style={{ fontSize: isFeatured ? "clamp(16px,1.6vw,20px)" : "clamp(14px,1.2vw,17px)" }}>
                      {paper.title}
                    </h3>

                    {/* Course / venue line */}
                    <div className="mono-tag mb-3" style={{ fontSize: 9, color: "rgba(212,168,71,0.55)" }}>
                      {paper.course}
                    </div>

                    {/* Abstract — 3-line clamp */}
                    <p className="text-xs leading-relaxed mb-4"
                      style={{
                        color: "rgba(240,234,214,0.62)",
                        display: "-webkit-box",
                        WebkitLineClamp: isFeatured ? 3 : 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                      {paper.abstract}
                    </p>

                    {/* Metrics — compact horizontal pills */}
                    {paper.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.metrics.map(m => (
                          <div key={m.label}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                            style={{ background: "rgba(212,168,71,0.06)", border: "1px solid rgba(212,168,71,0.12)" }}>
                            <span className="font-display font-black text-sm text-gold">{m.value}</span>
                            <span className="mono-tag" style={{ fontSize: 8, color: "rgba(240,234,214,0.4)" }}>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer: tags + repo */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex flex-wrap gap-1.5">
                        {paper.tags.slice(0, 4).map(t => <span key={t} className="tech-pill">{t}</span>)}
                        {paper.tags.length > 4 && (
                          <span className="tech-pill" style={{ opacity: 0.5 }}>+{paper.tags.length - 4}</span>
                        )}
                      </div>
                      {ghUrl && (
                        <a href={ghUrl} target="_blank" rel="noreferrer"
                          className="mono-tag hover:text-gold transition-colors" style={{ fontSize: 9 }}>
                          Repo →
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </section>



        {/* ══════════════════════════════════════
            SECTION 3: PROJECTS — TECH BUILDS
        ══════════════════════════════════════ */}
        <section id="projects" className="snap-section min-h-screen px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="section-eyebrow">
              <span className="gold-line" />Production &amp; Applied AI Systems
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-3 tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,64px)" }}>
              Innovation <span className="text-gold">Lab</span>
            </motion.h2>

            {/* Category filter */}
            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap gap-2 mb-8">
              {[
                { id: "all",      label: "All Projects" },
                { id: "featured", label: "Featured 🔥" },
                { id: "ai",       label: "AI & ML 🧠" },
                { id: "cv",       label: "Computer Vision 👁️" },
                { id: "nlp",      label: "NLP & RAG 💬" },
                { id: "fullstack",label: "Full Stack 💻" },
                { id: "hackathon",label: "Hackathon 🏆" },
                { id: "live",     label: "Live Demos 🚀" },
              ].map(cat => {
                const count = projects.filter(p => {
                  if (!p.visible) return false;
                  if (cat.id === "all") return true;
                  if (cat.id === "live") return Boolean(p.demo);
                  if (cat.id === "featured") return p.featured;
                  return p.category.includes(cat.id);
                }).length;
                return (
                  <button key={cat.id} onClick={() => setProjectCat(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all ${
                      projectCat === cat.id
                        ? "border font-bold"
                        : "text-[rgba(240,234,214,0.5)] hover:text-[#f0ead6]"
                    }`}
                    style={projectCat === cat.id
                      ? { background: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.45)", color: "#d4a847" }
                      : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {cat.label}
                    <span className="px-1.5 py-0.5 rounded text-[9px]"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(240,234,214,0.6)" }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj, i) => (
                <motion.div key={proj.id} variants={fadeUp} custom={i}
                  className="cine-card p-6 flex flex-col justify-between group cursor-default">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-3xl">{proj.emoji}</span>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {proj.demo && (
                          <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                          </span>
                        )}
                        {proj.featured && (
                          <span className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{ background: "rgba(212,168,71,0.1)", border: "1px solid rgba(212,168,71,0.25)", color: "#d4a847" }}>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-[#f0ead6] mb-2 leading-snug text-base group-hover:text-gold transition-colors">
                      {proj.title}
                    </h3>

                    <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(240,234,214,0.65)" }}>
                      {proj.description}
                    </p>

                    {proj.impact && (
                      <div className="inline-block font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md mb-3"
                        style={{ background: "rgba(212,168,71,0.08)", border: "1px solid rgba(212,168,71,0.2)", color: "#d4a847" }}>
                        ✦ {proj.impact}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {proj.tags.slice(0, 5).map(t => <span key={t} className="tech-pill">{t}</span>)}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex gap-3">
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer"
                          className="mono-tag hover:text-gold transition-colors">GitHub →</a>
                      )}
                      {proj.demo && (
                        <a href={proj.demo} target="_blank" rel="noreferrer"
                          className="font-mono text-[10px] uppercase tracking-wider font-bold transition-colors hover:opacity-80"
                          style={{ color: "#d4a847" }}>
                          Launch 🚀
                        </a>
                      )}
                    </div>
                    <button onClick={() => setSelectedProject(proj)}
                      className="mono-tag hover:text-gold transition-colors">
                      Blueprint 🔍
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 4: SKILLS — FULL TECH ARSENAL
        ══════════════════════════════════════ */}
        <section id="skills" className="snap-section min-h-screen px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="section-eyebrow">
              <span className="gold-line" />Technical Expertise
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-3 tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,64px)" }}>
              Technical <span className="text-gold">Arsenal</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={2}
              className="text-sm sm:text-base mb-10 max-w-2xl leading-relaxed"
              style={{ color: "rgba(240,234,214,0.6)" }}>
              Deep expertise across the full AI/ML research-to-deployment pipeline — from graph neural networks and continual learning to distributed systems and frontend.
            </motion.p>

            {/* Skill group tabs */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-2 mb-8">
              {TECH_SKILLS.map((g, i) => (
                <button key={g.group} onClick={() => setSkillsTab(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all ${
                    skillsTab === i
                      ? "font-bold"
                      : "text-[rgba(240,234,214,0.5)] hover:text-[#f0ead6]"
                  }`}
                  style={skillsTab === i
                    ? { background: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.45)", color: "#d4a847" }
                    : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {g.icon} {g.group}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div key={skillsTab}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="cine-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{TECH_SKILLS[skillsTab].icon}</span>
                  <h3 className="font-display font-bold text-xl text-[#f0ead6]">{TECH_SKILLS[skillsTab].group}</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {TECH_SKILLS[skillsTab].skills.map(s => (
                    <span key={s}
                      className="font-mono text-sm px-4 py-2.5 rounded-xl border transition-all hover:-translate-y-0.5"
                      style={{
                        background: "rgba(212,168,71,0.06)",
                        border: "1px solid rgba(212,168,71,0.18)",
                        color: "rgba(240,234,214,0.88)",
                      }}>
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Soft skills row */}
            <motion.div variants={fadeUp} custom={4} className="mt-8">
              <div className="section-eyebrow mb-4"><span className="gold-line" />Leadership &amp; Collaboration</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {hobbies.softSkills.map(sk => (
                  <div key={sk.id} className="cine-card-accent p-5">
                    <span className="text-2xl mb-3 block">{sk.icon}</span>
                    <h4 className="font-display font-bold text-[#f0ead6] text-sm mb-2">{sk.name}</h4>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(240,234,214,0.6)" }}>{sk.description}</p>
                    <div className="space-y-1">
                      {sk.highlights.map(h => (
                        <div key={h} className="flex items-center gap-1.5">
                          <span className="text-gold text-xs">✦</span>
                          <span className="text-xs" style={{ color: "rgba(240,234,214,0.75)" }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 5: ACHIEVEMENTS
        ══════════════════════════════════════ */}
        <section id="achievements" className="snap-section min-h-screen px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="section-eyebrow">
              <span className="gold-line" />Honors &amp; Recognition
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-10 tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,64px)" }}>
              Awards &amp; <span className="text-gold">Leadership</span>
            </motion.h2>

            {/* Filter tabs */}
            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap gap-2 mb-8">
              {[
                { id: "all",           label: "All Honors & Badges" },
                { id: "hackathon",     label: "Hackathons & Awards 🏆" },
                { id: "certification", label: "Google Cloud & Certifications ☁️" },
                { id: "leadership",    label: "Leadership & Community 👑" },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setAchCat(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all ${
                    achCat === cat.id
                      ? "border font-bold text-gold bg-[rgba(212,168,71,0.12)] border-[rgba(212,168,71,0.45)]"
                      : "text-[rgba(240,234,214,0.5)] hover:text-[#f0ead6] bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] border"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements
                .filter(ach => ach.visible !== false)
                .filter(ach => achCat === "all" || ach.type === achCat)
                .map((ach, i) => (
                  <motion.div key={ach.id} variants={fadeUp} custom={i + 2}
                    className="cine-card p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                        <span className="mono-tag px-2.5 py-0.5 rounded-full border"
                          style={{ background: "rgba(212,168,71,0.08)", borderColor: "rgba(212,168,71,0.25)", color: "#d4a847" }}>
                          {ach.rank || ach.type} {ach.rankLabel ? `· ${ach.rankLabel}` : ""}
                        </span>
                        <span className="mono-tag" style={{ color: "rgba(240,234,214,0.35)", fontSize: 9 }}>{ach.date}</span>
                      </div>

                      <h3 className="font-display font-bold text-[#f0ead6] text-base mb-1 leading-snug">{ach.title}</h3>
                      <div className="mono-tag mb-2" style={{ color: "#d4a847", fontSize: 10 }}>
                        {ach.organizer || ach.organization || ach.issuer}
                      </div>

                      {ach.description && (
                        <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(240,234,214,0.65)" }}>
                          {ach.description}
                        </p>
                      )}

                      {ach.tags && ach.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {ach.tags.map(t => (
                            <span key={t} className="tech-pill">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {ach.link && (
                      <a href={ach.link} target="_blank" rel="noreferrer"
                        className="mono-tag hover:text-gold transition-colors pt-3 block"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 9 }}>
                        View Credential ↗
                      </a>
                    )}
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 6: ABOUT — EDUCATION + BACKGROUND
        ══════════════════════════════════════ */}
        <section id="about" className="snap-section min-h-screen px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="section-eyebrow">
              <span className="gold-line" />Background &amp; Academic Journey
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-8 tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,64px)" }}>
              About <span className="text-gold">Madhav</span>
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bio + Experience */}
              <div className="lg:col-span-2 space-y-5">
                <motion.div variants={fadeUp} custom={2} className="cine-card p-7">
                  <h3 className="font-display font-bold text-xl text-[#f0ead6] mb-4">
                    Engineering Intelligence from First Principles
                  </h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(240,234,214,0.72)" }}>
                    AI/ML Engineer and Research Aspirant building scalable, verifiable, and autonomous intelligent systems.
                    My research sits at the intersection of <strong style={{ color: "#f0ead6" }}>Continual Learning</strong>,{" "}
                    <strong style={{ color: "#f0ead6" }}>Neuro-Symbolic Reasoning</strong>, and{" "}
                    <strong style={{ color: "#f0ead6" }}>Distributed AI Operations</strong>.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(240,234,214,0.72)" }}>
                    I approach problems with the same composure and strategic patience as{" "}
                    <strong style={{ color: "#d4a847" }}>MS Dhoni 🏏</strong> — calm under pressure, reading the field, and finishing it off in style.
                  </p>
                </motion.div>

                {/* Work experience */}
                <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="cine-card-accent p-5">
                    <div className="mono-tag mb-1" style={{ color: "rgba(240,234,214,0.4)", fontSize: 9 }}>Jan 2024 — May 2024</div>
                    <h4 className="font-display font-bold text-[#f0ead6] text-base mb-2">AI Intern · 1STOP.AI</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(240,234,214,0.65)" }}>
                      End-to-end ML pipeline engineering: data preprocessing, model training, evaluation, and real-world optimization on enterprise datasets.
                    </p>
                  </div>
                  <div className="cine-card-accent p-5" style={{ borderLeftColor: "#34d399" }}>
                    <div className="mono-tag mb-1" style={{ color: "rgba(240,234,214,0.4)", fontSize: 9 }}>Dec 2024 — May 2025</div>
                    <h4 className="font-display font-bold text-[#f0ead6] text-base mb-2">Virasat — SSR Coordinator</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(240,234,214,0.65)" }}>
                      Led AI-assisted multilingual digital heritage archive spanning 8 languages, preserving coastal oral histories and folk traditions.
                    </p>
                  </div>
                </motion.div>

                {/* Education timeline */}
                <motion.div variants={fadeUp} custom={4} className="space-y-3">
                  {academic.education.map(edu => (
                    <div key={edu.institution} className="cine-card p-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="mono-tag mb-0.5" style={{ color: "#d4a847", fontSize: 9 }}>{edu.period}</div>
                        <div className="font-display font-bold text-[#f0ead6]">{edu.institution}</div>
                        <div className="text-xs mt-0.5" style={{ color: "rgba(240,234,214,0.55)" }}>{edu.degree}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display font-black text-xl text-gold">{edu.grade}</div>
                        <div className="mono-tag" style={{ color: "rgba(240,234,214,0.35)", fontSize: 9 }}>{edu.location}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Contact card */}
              <motion.div variants={fadeUp} custom={5} className="cine-card p-7 flex flex-col justify-between">
                <div>
                  <div className="section-eyebrow mb-4">
                    <span style={{ width: 24, height: 1, background: "#a07830", display: "inline-block" }} />
                    Quick Connect
                  </div>
                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <div className="mono-tag mb-1" style={{ fontSize: 8 }}>Email</div>
                      <a href="mailto:yalamarthi.sriram123@gmail.com"
                        className="hover:text-gold transition-colors text-[#f0ead6]">
                        yalamarthi.sriram123@gmail.com
                      </a>
                    </div>
                    <div>
                      <div className="mono-tag mb-1" style={{ fontSize: 8 }}>Phone</div>
                      <a href="tel:+919949795082" className="text-[#f0ead6] hover:text-gold transition-colors">
                        +91 99497 95082
                      </a>
                    </div>
                    <div>
                      <div className="mono-tag mb-1" style={{ fontSize: 8 }}>Location</div>
                      <span className="text-[#f0ead6]">Kollam, Kerala · Hyderabad, India</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  {[
                    { href: "https://github.com/Madhav2246", label: "GitHub @Madhav2246" },
                    { href: "https://www.linkedin.com/in/Yalamarthi-Madhav", label: "LinkedIn Profile" },
                    { href: "https://www.instagram.com/madhav_yalamarthi", label: "Instagram" },
                  ].map(l => (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs text-[#f0ead6] hover:text-gold transition-colors"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <span>{l.label}</span><span>↗</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 7: PASSIONS — CINEMA & CRICKET
        ══════════════════════════════════════ */}
        <section id="passions" className="snap-section min-h-screen px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>

            <motion.div variants={fadeUp} custom={0} className="section-eyebrow">
              <span className="gold-line" />Beyond the Algorithm
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-3 tracking-tight"
              style={{ fontSize: "clamp(32px,5vw,64px)" }}>
              Passions &amp; <span className="text-gold">Influences</span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={2}
              className="text-sm sm:text-base mb-8 max-w-2xl leading-relaxed"
              style={{ color: "rgba(240,234,214,0.6)" }}>
              The same strategic patience that drives rigorous research also powers finishing under pressure on the cricket pitch — and the same love for world-building that captivates me in Rajamouli&apos;s universe shapes how I architect systems.
            </motion.p>

            {/* Tab toggle */}
            <motion.div variants={fadeUp} custom={3} className="flex gap-2 mb-8">
              <button onClick={() => setArcadeTab("cinema")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  arcadeTab === "cinema" ? "font-bold" : "text-[rgba(240,234,214,0.5)]"
                }`}
                style={arcadeTab === "cinema"
                  ? { background: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.4)", color: "#d4a847" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                🎬 Telugu Cinema Lounge
              </button>
              <button onClick={() => setArcadeTab("cricket")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                  arcadeTab === "cricket" ? "font-bold" : "text-[rgba(240,234,214,0.5)]"
                }`}
                style={arcadeTab === "cricket"
                  ? { background: "rgba(212,168,71,0.12)", border: "1px solid rgba(212,168,71,0.4)", color: "#d4a847" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                🏏 Dhoni #7 Cricket
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {arcadeTab === "cinema" && (
                <motion.div key="cinema"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}>

                  {/* Directors */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {(hobbies.cinema.favoriteDirectors as Array<{name:string; signature:string; emoji:string}>).map(dir => (
                      <div key={dir.name} className="cine-card p-4 text-center">
                        <div className="text-3xl mb-2">{dir.emoji}</div>
                        <div className="font-display font-bold text-sm text-[#f0ead6] mb-1">{dir.name}</div>
                        <div className="text-[10px] leading-relaxed" style={{ color: "rgba(240,234,214,0.5)" }}>{dir.signature}</div>
                      </div>
                    ))}
                  </div>

                  {/* Favourite movies grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {(hobbies.cinema.favoriteMovies as Array<{id:string;title:string;year:number;director:string;genre:string;note:string}>).map(m => (
                      <div key={m.id} className="cine-card p-4">
                        <div className="mono-tag mb-1" style={{ fontSize: 9 }}>{m.year} · {m.genre}</div>
                        <h4 className="font-display font-bold text-sm text-[#f0ead6] mb-1">{m.title}</h4>
                        <div className="text-[10px] mb-2" style={{ color: "rgba(212,168,71,0.7)" }}>{m.director}</div>
                        <p className="text-[10px] italic leading-relaxed" style={{ color: "rgba(240,234,214,0.55)" }}>{m.note}</p>
                      </div>
                    ))}
                  </div>

                  {/* Trivia game */}
                  <div className="cine-card p-6 max-w-2xl">
                    <div className="mono-tag mb-2">Cinema &amp; Cricket Trivia — Score: {triviaScore}/{hobbies.cinema.trivia.length}</div>
                    <h4 className="font-display font-semibold text-[#f0ead6] text-base mb-4 leading-snug">
                      {triviaQ.quoteOrQuestion}
                    </h4>
                    {triviaQ.context && (
                      <div className="mono-tag mb-4" style={{ color: "rgba(240,234,214,0.4)", fontSize: 9 }}>
                        Context: {triviaQ.context}
                      </div>
                    )}
                    <div className="space-y-2">
                      {triviaQ.options.map((opt, i) => {
                        const chosen = triviaChoice === i;
                        const correct = i === triviaQ.answer;
                        let style = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0ead6" };
                        if (triviaChoice !== null) {
                          if (correct) style = { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.5)", color: "#34d399" };
                          else if (chosen) style = { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" };
                          else style = { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "rgba(240,234,214,0.3)" };
                        }
                        return (
                          <button key={i} disabled={triviaChoice !== null}
                            onClick={() => {
                              setTriviaChoice(i);
                              if (i === triviaQ.answer) setTriviaScore(s => s + 1);
                            }}
                            className="w-full text-left px-4 py-3 rounded-xl font-sans text-xs transition-all"
                            style={style}>
                            {opt} {triviaChoice !== null && correct && "✅"}
                            {triviaChoice !== null && chosen && !correct && "❌"}
                          </button>
                        );
                      })}
                    </div>
                    {triviaChoice !== null && (
                      <div className="mt-4">
                        <p className="text-xs mb-3 italic" style={{ color: "rgba(240,234,214,0.7)" }}>{triviaQ.explanation}</p>
                        <button
                          onClick={() => {
                            setTriviaChoice(null);
                            setTriviaIdx(idx => (idx + 1) % hobbies.cinema.trivia.length);
                          }}
                          className="px-5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-void"
                          style={{ background: "#d4a847" }}>
                          Next Question →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {arcadeTab === "cricket" && (
                <motion.div key="cricket"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="cine-card p-7" style={{ borderLeft: "2px solid #d4a847" }}>
                    <div className="mono-tag mb-2">🏏 Thala #7 Philosophy</div>
                    <h3 className="font-display font-bold text-xl text-[#f0ead6] mb-3">Captain Cool Mindset</h3>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(240,234,214,0.72)" }}>
                      {hobbies.cricket.philosophy}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {hobbies.cricket.stats.map(s => (
                        <div key={s.label} className="p-3 rounded-xl"
                          style={{ background: "rgba(212,168,71,0.06)", border: "1px solid rgba(212,168,71,0.12)" }}>
                          <div className="mono-tag mb-0.5" style={{ fontSize: 8 }}>{s.label}</div>
                          <div className="font-sans font-bold text-sm text-[#f0ead6]">{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cine-card p-7">
                    <div className="mono-tag mb-3">The Dhoni-Madhav Connection</div>
                    <div className="space-y-4">
                      {[
                        { icon: "🚁", title: "Helicopter Shot", desc: "High-risk, high-reward — same philosophy as a hard ML research problem with an audacious solution approach." },
                        { icon: "🧊", title: "Ice Under Pressure", desc: "Whether it's a 36-hour hackathon crunch or a last-over finish, composure and focus win." },
                        { icon: "🎯", title: "Tactical Reading", desc: "Reading bowlers and field placements mirrors reading data distributions and model failure modes." },
                        { icon: "💡", title: "Finishing It Off", desc: "The ability to take a half-baked prototype to a full production system, completed and shipped." },
                      ].map(item => (
                        <div key={item.icon} className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5">{item.icon}</span>
                          <div>
                            <div className="font-display font-bold text-sm text-gold mb-0.5">{item.title}</div>
                            <div className="text-xs leading-relaxed" style={{ color: "rgba(240,234,214,0.65)" }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            SECTION 8: CONTACT
        ══════════════════════════════════════ */}
        <section id="contact" className="snap-section min-h-screen flex flex-col justify-center px-6 md:px-16 py-20 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">

            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase border"
              style={{ borderColor: "rgba(212,168,71,0.3)", background: "rgba(212,168,71,0.06)", color: "#d4a847" }}>
              <span className="pulse-gold" />
              Open to AI/ML Engineering &amp; Research Roles
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className="font-display font-black text-[#f0ead6] mb-5 tracking-tight leading-tight"
              style={{ fontSize: "clamp(36px,6vw,80px)" }}>
              Let&apos;s build<br />
              <span className="text-gold">the future</span> together.
            </motion.h2>

            <motion.p variants={fadeUp} custom={2}
              className="text-base mb-10 max-w-lg mx-auto leading-relaxed"
              style={{ color: "rgba(240,234,214,0.65)" }}>
              Open for AI/ML engineering positions, research roles, and impactful system collaborations.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:yalamarthi.sriram123@gmail.com"
                className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-void transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#d4a847,#f8d87a)", boxShadow: "0 0 30px rgba(212,168,71,0.4)" }}>
                ✉ yalamarthi.sriram123@gmail.com
              </a>
              <a href="tel:+919949795082"
                className="px-6 py-4 rounded-xl font-mono text-xs uppercase tracking-wider text-[#f0ead6] transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(212,168,71,0.06)", border: "1px solid rgba(212,168,71,0.25)" }}>
                📞 +91 99497 95082
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex items-center justify-center gap-4 mt-10">
              {[
                { href: "https://github.com/Madhav2246", label: "GitHub" },
                { href: "https://www.linkedin.com/in/Yalamarthi-Madhav", label: "LinkedIn" },
                { href: "https://www.instagram.com/madhav_yalamarthi", label: "Instagram" },
              ].map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
                  className="mono-tag hover:text-gold transition-colors">
                  {l.label} ↗
                </a>
              ))}
            </motion.div>

            {/* Footer note */}
            <motion.div variants={fadeUp} custom={5}
              className="mt-16 mono-tag text-center"
              style={{ color: "rgba(240,234,214,0.22)", fontSize: 10 }}>
              © 2026 Madhav Yalamarthi · B.Tech AI · Amrita Vishwa Vidyapeetham · Built with Next.js
            </motion.div>
          </motion.div>
        </section>

      </main>

      {/* Project deep-dive modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
