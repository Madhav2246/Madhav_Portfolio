"use client";
import React, { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { Project, AcademicData, Achievement, ResearchPaper, HobbiesData } from "@/lib/types";
import CommandCenter from "./CommandCenter";
import ProjectModal from "./ProjectModal";
import CursorGlow from "./CursorGlow";
import MiniCricketGame from "./games/MiniCricketGame";
import CinephileLab from "./games/CinephileLab";
import GitHubPulse from "./GitHubPulse";
import TiltCard from "./TiltCard";
import Footer from "./Footer";

const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), { ssr: false });
const ShaderCanvas = dynamic(() => import("./ShaderCanvas").then(m => ({ default: m.default })), { ssr: false });

const TYPED_STRINGS = [
  "AI & Systems Engineer_",
  "Continual Learning & RAG Specialist_",
  "2 First-Author Research Papers_",
  "Prabhas & Salaar Fan 🦖⚔️",
  "MS Dhoni #7 Devotee 🏏⚡",
  "IIT Madras Hackathon Finalist_",
];

const GITHUB_RESEARCH_LINKS: Record<string, string> = {
  "continual-learning-research": "https://github.com/Madhav2246/Continual_learning",
  "physics-based-slm-rag": "https://github.com/Madhav2246/Physics-Based-RAG_SLM",
};

interface Props {
  projects: Project[];
  academic: AcademicData;
  achievements: Achievement[];
  research: ResearchPaper[];
  hobbies: HobbiesData;
}

export default function PortfolioShell({
  projects,
  academic,
  achievements,
  research,
  hobbies,
}: Props) {
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectCat, setProjectCat] = useState<string>("all");
  const [activeArcadeTab, setActiveArcadeTab] = useState<"cricket" | "cinema" | "soft-skills">("cricket");
  const [skillsTab, setSkillsTab] = useState<"tech" | "soft">("tech");
  const [activeSection, setActiveSection] = useState<string>("hero");

  // Typed effect for role title
  const typedRef = React.useRef<{ destroy: () => void } | null>(null);
  useEffect(() => {
    import("typed.js").then(({ default: Typed }) => {
      typedRef.current = new Typed("#peaceful-typed", {
        strings: TYPED_STRINGS,
        typeSpeed: 45,
        backSpeed: 25,
        backDelay: 1500,
        loop: true,
        showCursor: true,
        cursorChar: "|",
      });
    });
    return () => typedRef.current?.destroy();
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsCommandCenterOpen(false);
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll spy to update active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "research", "projects", "arcade", "skills", "achievements", "about", "contact"];
      const scrollPosition = window.scrollY + 200;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const projectCategories = [
    { id: "all", label: "All Projects" },
    { id: "ai", label: "AI & Agents 🤖" },
    { id: "cv", label: "Vision 👁️" },
    { id: "nlp", label: "NLP & RAG 💬" },
    { id: "fullstack", label: "Full Stack ⚡" },
    { id: "hackathon", label: "Hackathons 🏆" },
    { id: "live", label: "Live Demos 🚀" },
  ];

  const filteredProjects = projects.filter(p => {
    if (!p.visible) return false;
    if (projectCat === "all") return true;
    if (projectCat === "live") return Boolean(p.demo && p.demo.length > 0);
    return p.category.includes(projectCat);
  });

  return (
    <div className="relative min-h-screen bg-[#06080d] text-[#e2e8f0] overflow-x-hidden selection:bg-sky-500/30 selection:text-white">
      <CursorGlow />

      {/* Ambient background canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Suspense fallback={null}>
          <NeuralCanvas />
        </Suspense>
        <Suspense fallback={null}>
          <ShaderCanvas />
        </Suspense>
      </div>

      {/* Subtle peaceful aurora gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full orb-cyan pointer-events-none z-[1]" />
      <div className="fixed top-1/3 right-10 w-[600px] h-[600px] rounded-full orb-purple pointer-events-none z-[1]" />
      <div className="fixed bottom-10 left-10 w-[600px] h-[600px] rounded-full orb-emerald pointer-events-none z-[1]" />

      {/* Top Floating Glass Navigation Bar */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto max-w-5xl w-full flex items-center justify-between px-5 py-2.5 rounded-full bg-[#0a0f1d]/75 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          
          {/* Logo & Fandom Badges */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 group text-left"
          >
            <span className="font-display font-black text-lg text-white group-hover:text-sky-300 transition-colors">
              MY<span className="text-sky-400">.</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
              <span>🦖</span> Salaar &amp; Thala #7 <span>🏏</span>
            </span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { id: "research", label: "Research" },
              { id: "projects", label: "Projects" },
              { id: "arcade", label: "Arcade 🏏🎬" },
              { id: "skills", label: "Skills" },
              { id: "achievements", label: "Awards" },
              { id: "about", label: "About" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommandCenterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all font-mono text-[10px] uppercase"
              title="Search Spotlight (Ctrl+K)"
            >
              <span className="text-sky-400">⚡</span>
              <span className="hidden sm:inline">Spotlight</span>
              <span className="text-[8px] opacity-40 px-1 py-0.2 rounded bg-white/10">⌘K</span>
            </button>

            <button
              onClick={() => scrollTo("contact")}
              className="px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider font-bold text-black bg-gradient-to-r from-sky-400 to-indigo-400 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              Connect
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-28 pb-32">

        {/* ══════════════════ HERO SECTION ══════════════════ */}
        <section id="hero" className="min-h-[80vh] flex flex-col justify-center pt-8">
          
          {/* Status badge with Salaar & Dhoni flair */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider uppercase text-sky-300 bg-sky-500/10 border border-sky-500/20 backdrop-blur-md mb-6 self-start shadow-[0_0_15px_rgba(56,189,248,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <span>Available for AI/ML Roles · 2026</span>
            <span className="text-white/30">|</span>
            <span className="text-amber-300">Rebel &amp; Thala #7 Mindset ⚡</span>
          </motion.div>

          {/* Name Display */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white mb-4"
          >
            Madhav<br />
            <span className="gradient-text-aurora">Yalamarthi</span>
          </motion.h1>

          {/* Typed Role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6 min-h-[36px]"
          >
            <span className="font-mono text-base text-white/40">Specializing in</span>
            <span id="peaceful-typed" className="font-mono font-bold text-base sm:text-lg text-sky-300" />
          </motion.div>

          {/* Tagline Bio */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed mb-8 font-light"
          >
            AI/ML Engineer &amp; Researcher crafting scalable intelligence where deep continual learning meets neuro-symbolic RAG.
            B.Tech in Artificial Intelligence at <strong className="text-white font-medium">Amrita Vishwa Vidyapeetham</strong> (CGPA: {academic.currentCGPA}/10.0).
            2 First-Author Research Papers &amp; National Hackathon Winner at IIT Madras.
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-14"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-300 hover:to-blue-300 shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all transform hover:-translate-y-0.5"
            >
              Explore Innovation Lab →
            </button>

            <button
              onClick={() => {
                setActiveArcadeTab("cricket");
                scrollTo("arcade");
              }}
              className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <span>🏏</span> Super Over Match (Dhoni #7)
            </button>

            <button
              onClick={() => {
                setActiveArcadeTab("cinema");
                scrollTo("arcade");
              }}
              className="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <span>🎬</span> Salaar Cinema Lounge 🦖
            </button>
          </motion.div>

          {/* Live Stat Counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md"
          >
            {[
              { num: "14+", label: "Projects Shipped", sub: "Production & Web" },
              { num: "2", label: "1st Author Papers", sub: "CIS 2026 & EAAI" },
              { num: "🥈 2nd", label: "IIT Madras Winner", sub: "National Road Safety" },
              { num: "30+", label: "Technologies", sub: "PyTorch, FastAPI, TS" },
            ].map(stat => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="font-display font-black text-2xl sm:text-3xl text-white mb-0.5">{stat.num}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-semibold">{stat.label}</div>
                <div className="text-[11px] text-white/40">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════ RESEARCH SECTION ══════════════════ */}
        <section id="research" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sky-400 mb-1">
                <span className="w-2 h-0.5 bg-sky-400" />
                Scholarly Research &amp; Publications
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Core <span className="gradient-text-sky">Research Tracks</span>
              </h2>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-white/40 border border-white/10 rounded-full px-4 py-1">
              3 Primary Papers
            </span>
          </div>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed">
            First-author theoretical and applied breakthroughs across continual learning, neuro-symbolic verification, and autonomous distributed systems.
          </p>

          <div className="space-y-6">
            {research.map(paper => {
              const githubUrl = GITHUB_RESEARCH_LINKS[paper.id];

              return (
                <div
                  key={paper.id}
                  className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-sky-400 font-bold">
                      {paper.num} · {paper.course}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300">
                      {paper.id === "continual-learning-research"
                        ? "✦ Accepted · CIS 2026 (Forthcoming)"
                        : paper.id === "physics-based-slm-rag"
                        ? "✦ Submitted to EAAI"
                        : "✦ Conference Paper Ready"}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">
                    {paper.domain}
                  </div>

                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-3 leading-snug">
                    {paper.title}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed mb-6">
                    {paper.abstract}
                  </p>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
                    {paper.metrics.map(m => (
                      <div key={m.label}>
                        <div className="font-display font-black text-xl text-white">{m.value}</div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-white/40">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags and Repo link */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-1.5">
                      {paper.tags.map(t => (
                        <span key={t} className="font-mono text-[9px] uppercase px-2.5 py-1 rounded bg-white/5 text-white/50 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>

                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-sky-400 hover:text-white transition-colors"
                      >
                        <span>View Research Repo</span> →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════ PROJECTS SECTION ══════════════════ */}
        <section id="projects" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sky-400 mb-1">
                <span className="w-2 h-0.5 bg-sky-400" />
                Production &amp; Applied AI Systems
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Innovation <span className="gradient-text-sky">Lab</span>
              </h2>
            </div>
          </div>

          {/* GitHub Pulse Matrix */}
          <div className="mb-8">
            <GitHubPulse />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {projectCategories.map(cat => {
              const count = projects.filter(p => {
                if (!p.visible) return false;
                if (cat.id === "all") return true;
                if (cat.id === "live") return Boolean(p.demo && p.demo.length > 0);
                return p.category.includes(cat.id);
              }).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setProjectCat(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all duration-200 ${
                    projectCat === cat.id
                      ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                      : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map(project => (
              <TiltCard
                key={project.id}
                maxTilt={6}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-default group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl">{project.emoji}</span>
                    <div className="flex items-center gap-1.5">
                      {project.demo && (
                        <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Demo
                        </span>
                      )}
                      <span className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                        {project.category[0]}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-sky-300 transition-colors leading-snug mb-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {project.impact && (
                    <div className="font-mono text-[8px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300 inline-block mb-4">
                      ✦ {project.impact}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-5">
                    {project.tags.slice(0, 4).map(t => (
                      <span key={t} className="font-mono text-[8px] uppercase px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase text-white/60 hover:text-white transition-colors"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase font-bold text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        Launch 🚀
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                  >
                    Blueprint 🔍
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ══════════════════ ARCADE & PASSIONS (DHONI & SALAAR) ══════════════════ */}
        <section id="arcade" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-emerald-400 mb-1">
                <span className="w-2 h-0.5 bg-emerald-400" />
                Interactive Lounge · Cricket &amp; Cinema Passions
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Arcade &amp; <span className="gradient-text-dhoni">Dhoni #7</span> / <span className="gradient-text-salaar">Salaar 🦖</span>
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mb-8 leading-relaxed">
            Where high-pressure game theory, cinematic world-building, and leadership instincts come alive. Play the Dhoni Super Over game or explore the Salaar &amp; Multigenre movie lab!
          </p>

          {/* Tab Selector */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <button
              onClick={() => setActiveArcadeTab("cricket")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                activeArcadeTab === "cricket"
                  ? "bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                  : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <span>🏏</span>
              MS Dhoni #7 Super Over Game
            </button>

            <button
              onClick={() => setActiveArcadeTab("cinema")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                activeArcadeTab === "cinema"
                  ? "bg-purple-500/20 border border-purple-400 text-purple-300 font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <span>🎬</span>
              Salaar &amp; Movie Lab 🦖⚔️
            </button>

            <button
              onClick={() => setActiveArcadeTab("soft-skills")}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                activeArcadeTab === "soft-skills"
                  ? "bg-sky-500/20 border border-sky-400 text-sky-300 font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              <span>👑</span>
              Soft Skills &amp; Leadership
            </button>
          </div>

          {/* Active Arcade Experience */}
          {activeArcadeTab === "cricket" && (
            <div className="space-y-6">
              <MiniCricketGame />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-400">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 mb-2 font-bold">
                    🏏 Thala #7 Mindset &amp; Philosophy
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-2">
                    Composure When The Pressure Spikes
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {hobbies.cricket.philosophy}
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 mb-3 font-bold">
                    Captain Cool DNA
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {hobbies.cricket.stats.map(s => (
                      <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="font-mono text-[8px] uppercase text-white/40">{s.label}</div>
                        <div className="font-sans font-bold text-xs text-white mt-1">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeArcadeTab === "cinema" && (
            <div className="space-y-6">
              <CinephileLab
                recommendations={hobbies.cinema.recommendations}
                trivia={hobbies.cinema.trivia}
                directors={hobbies.cinema.favoriteDirectors}
              />

              <div className="glass-card rounded-2xl p-6 border-l-4 border-l-red-500">
                <div className="font-mono text-[10px] uppercase tracking-wider text-red-400 mb-2 font-bold flex items-center gap-2">
                  <span>🦖</span> Rebel Star &amp; Cinema World-Building
                </div>
                <p className="text-xs text-white/80 leading-relaxed italic">
                  &ldquo;{hobbies.cinema.philosophy}&rdquo;
                </p>
              </div>
            </div>
          )}

          {activeArcadeTab === "soft-skills" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hobbies.softSkills.map(skill => (
                <div
                  key={skill.id}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{skill.icon}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                        {skill.category}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">{skill.name}</h3>
                    <p className="text-xs text-white/70 leading-relaxed mb-4">{skill.description}</p>
                  </div>
                  <div className="space-y-1 pt-3 border-t border-white/10">
                    {skill.highlights.map(h => (
                      <div key={h} className="flex items-center gap-2 font-mono text-[10px] text-white/80">
                        <span className="text-sky-400">✦</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════ SKILLS SECTION ══════════════════ */}
        <section id="skills" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sky-400 mb-1">
                <span className="w-2 h-0.5 bg-sky-400" />
                Technical &amp; Leadership Expertise
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Technical <span className="gradient-text-sky">Arsenal</span>
              </h2>
            </div>
          </div>

          {/* Toggle Tech / Soft */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setSkillsTab("tech")}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                skillsTab === "tech"
                  ? "bg-sky-500/20 border border-sky-400 text-sky-300 font-bold"
                  : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              💻 AI, Backend &amp; Data Engineering
            </button>
            <button
              onClick={() => setSkillsTab("soft")}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                skillsTab === "soft"
                  ? "bg-sky-500/20 border border-sky-400 text-sky-300 font-bold"
                  : "bg-white/[0.03] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              👑 Leadership &amp; Mentorship
            </button>
          </div>

          {skillsTab === "tech" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "AI & Machine Learning",
                  skills: ["PyTorch", "LoRA / Transformers", "Continual Learning", "Neuro-Symbolic RAG", "OpenCV / YOLO", "scikit-learn", "Graph NNs (PyG)"],
                  icon: "🧠",
                },
                {
                  title: "Backend & Systems",
                  skills: ["FastAPI", "Python", "TypeScript / Next.js", "Django REST Framework", "Flask / WebSockets", "Redis Priority Queues", "Celery"],
                  icon: "⚡",
                },
                {
                  title: "Data & Cloud Infrastructure",
                  skills: ["PostgreSQL", "SQLite / BigQuery", "Docker & Containers", "Kubernetes", "Git & CI/CD", "Linux Shell", "GCP Cloud"],
                  icon: "🗄️",
                },
              ].map(group => (
                <div key={group.title} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{group.icon}</span>
                    <h3 className="font-display font-bold text-base text-white">{group.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map(s => (
                      <span key={s} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hobbies.softSkills.map(skill => (
                <div key={skill.id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{skill.icon}</span>
                    <h4 className="font-display font-bold text-base text-white">{skill.name}</h4>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed mb-3">{skill.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {skill.highlights.map(h => (
                      <span key={h} className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════ ACHIEVEMENTS SECTION ══════════════════ */}
        <section id="achievements" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-amber-400 mb-1">
                <span className="w-2 h-0.5 bg-amber-400" />
                Honors &amp; Recognitions
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Awards &amp; <span className="gradient-text-sky">Leadership</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {achievements.map(ach => (
              <div key={ach.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                      {ach.rank || ach.date} · {ach.rankLabel || ach.type}
                    </span>
                    <span className="font-mono text-[9px] text-white/40">{ach.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">{ach.title}</h3>
                  <div className="font-mono text-[10px] text-sky-400 mb-3">{ach.organizer || ach.organization || ach.issuer}</div>

                  {ach.description && (
                    <p className="text-xs text-white/70 leading-relaxed mb-4">{ach.description}</p>
                  )}
                </div>

                {ach.link && (
                  <div className="pt-3 border-t border-white/10">
                    <a
                      href={ach.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] uppercase tracking-wider text-sky-400 hover:text-white transition-colors"
                    >
                      View Credential / Post ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════ ABOUT & EDUCATION ══════════════════ */}
        <section id="about" className="scroll-mt-28">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sky-400 mb-1">
                <span className="w-2 h-0.5 bg-sky-400" />
                Academic Heritage &amp; Background
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                About <span className="gradient-text-sky">Madhav</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  Engineering with First-Principles &amp; Impact
                </h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  I&apos;m a B.Tech Artificial Intelligence undergraduate at <strong className="text-white">Amrita Vishwa Vidyapeetham</strong> (CGPA: {academic.currentCGPA}/10.0), driven by curiosity at the intersection of continual machine learning, autonomous systems, and real-world high-stakes data engineering.
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  Beyond algorithms, I channel the relentless composure of <strong className="text-emerald-300">MS Dhoni #7</strong> on the cricket pitch and the fearless cinematic scale of <strong className="text-red-300">Rebel Star Prabhas (Salaar 🦖)</strong> in software architecture.
                </p>
              </div>

              {/* Education timeline cards */}
              <div className="space-y-3">
                {academic.education.map(edu => (
                  <div key={edu.institution} className="glass-card rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-sky-400">{edu.period}</div>
                      <div className="font-display font-bold text-base text-white">{edu.institution}</div>
                      <div className="text-xs text-white/60">{edu.degree}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-black text-lg text-white">{edu.grade}</div>
                      <div className="font-mono text-[9px] uppercase text-white/40">{edu.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact & Details card */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-sky-400 mb-4 font-bold">
                  Direct Connect
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="text-white/40 text-[9px] uppercase">Email</div>
                    <a href="mailto:yalamarthi.sriram123@gmail.com" className="text-white hover:text-sky-300 transition-colors">
                      yalamarthi.sriram123@gmail.com
                    </a>
                  </div>
                  <div>
                    <div className="text-white/40 text-[9px] uppercase">Phone</div>
                    <a href="tel:+919949795082" className="text-white hover:text-sky-300 transition-colors">
                      +91 99497 95082
                    </a>
                  </div>
                  <div>
                    <div className="text-white/40 text-[9px] uppercase">Location</div>
                    <div className="text-white">Kollam, Kerala &amp; Hyderabad, India</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <a
                  href="https://github.com/Madhav2246"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors"
                >
                  <span>GitHub (@Madhav2246)</span>
                  <span>↗</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/Yalamarthi-Madhav"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors"
                >
                  <span>LinkedIn (Yalamarthi-Madhav)</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ CONTACT SECTION ══════════════════ */}
        <section id="contact" className="scroll-mt-28 text-center pt-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-14 max-w-3xl mx-auto relative overflow-hidden border border-sky-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sky-400 mb-4 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              <span>✉</span> Let&apos;s Build Together
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
              Ready to create something <span className="gradient-text-sky">extraordinary?</span>
            </h2>

            <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto mb-8 leading-relaxed">
              Open for AI/ML engineering positions, research fellowship roles, and high-impact distributed systems collaborations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:yalamarthi.sriram123@gmail.com"
                className="px-8 py-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-sky-400 to-blue-400 hover:opacity-90 shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                ✉ yalamarthi.sriram123@gmail.com
              </a>

              <a
                href="tel:+919949795082"
                className="px-6 py-4 rounded-xl font-mono text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all"
              >
                📞 +91 99497 95082
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Global Interactive Command Center */}
      <CommandCenter
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onNavigate={(id) => scrollTo(id)}
        onSelectProject={(p) => setSelectedProject(p)}
        projects={projects}
        achievements={achievements}
      />

      {/* Global Project Deep Dive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
