"use client";
import React, { useState, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { Project, AcademicData, Achievement, ResearchPaper, HobbiesData } from "@/lib/types";
import FloatingNav from "./FloatingNav";
import HeroPanel from "./panels/HeroPanel";
import AboutPanel from "./panels/AboutPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import ArcadePanel from "./panels/ArcadePanel";
import SkillsPanel from "./panels/SkillsPanel";
import ResearchPanel from "./panels/ResearchPanel";
import AchievementsPanel from "./panels/AchievementsPanel";
import ContactPanel from "./panels/ContactPanel";
import CursorGlow from "./CursorGlow";
import Footer from "./Footer";
import CommandCenter from "./CommandCenter";
import ProjectModal from "./ProjectModal";
import { useClickRipple } from "./ClickRipple";

const NeuralCanvas = dynamic(() => import("./NeuralCanvas"), { ssr: false });
const ShaderCanvas = dynamic(() => import("./ShaderCanvas").then(m => ({ default: m.default })), { ssr: false });

export type SectionId = "home" | "about" | "projects" | "arcade" | "skills" | "research" | "achievements" | "contact";

const SECTION_LABELS: Record<SectionId, string> = {
  home: "Home",
  about: "About",
  projects: "Projects & Lab",
  arcade: "Arcade & Hobbies 🏏🎬",
  skills: "Skills & Leadership",
  research: "Research",
  achievements: "Awards & Honors",
  contact: "Contact",
};

interface Props {
  projects: Project[];
  academic: AcademicData;
  achievements: Achievement[];
  research: ResearchPaper[];
  hobbies: HobbiesData;
}

// Panel materializes out of the star field
const panelVariants = {
  initial: { opacity: 0, clipPath: "circle(6% at 50% 50%)", scale: 0.96 },
  animate: {
    opacity: 1, clipPath: "circle(150% at 50% 50%)", scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, clipPath: "circle(4% at 50% 50%)", scale: 0.96,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

export default function PortfolioShell({ projects, academic, achievements, research, hobbies }: Props) {
  const [section, setSection] = useState<SectionId>("home");
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const { trigger: triggerRipple, RippleLayer } = useClickRipple();

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandCenterOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        if (isCommandCenterOpen) {
          setIsCommandCenterOpen(false);
        } else {
          setSection("home");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCommandCenterOpen]);

  const goHome = () => setSection("home");

  // Section select with ripple at click position
  const handleSelect = (id: SectionId, e?: React.MouseEvent) => {
    if (e) triggerRipple(e.clientX, e.clientY);
    setSection(id);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <CursorGlow />

      {/* Always-on 3D sphere + star canvas */}
      <Suspense fallback={null}>
        <NeuralCanvas />
      </Suspense>

      {/* GLSL mouse-reactive ripple shader */}
      <Suspense fallback={null}>
        <ShaderCanvas />
      </Suspense>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 z-[1] pointer-events-none grid-overlay" />

      {/* Hero content — always visible on landing */}
      <AnimatePresence>
        {section === "home" && (
          <motion.div
            key="hero-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 z-[15] pointer-events-none"
          >
            <HeroPanel
              academic={academic}
              onSection={(id, e) => handleSelect(id, e)}
              onOpenCommandCenter={() => setIsCommandCenterOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating orbiting section nodes */}
      <FloatingNav active={section} onSelect={(id, e) => handleSelect(id, e)} />

      {/* Floating Spotlight Command Bar Trigger (Bottom Right) */}
      {section === "home" && (
        <button
          onClick={() => setIsCommandCenterOpen(true)}
          className="fixed bottom-12 right-12 z-[25] flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] tracking-wider uppercase text-white/70 bg-black/60 border border-white/20 hover:border-sky-400 hover:text-white backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
        >
          <span className="text-sky-400">⚡</span>
          <span>Command Palette</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/40">Ctrl+K</span>
        </button>
      )}

      {/* Click ripple layer */}
      {RippleLayer}

      {/* Section panels — materialize from stars */}
      <AnimatePresence mode="wait">
        {section !== "home" && (
          <motion.div
            key={section}
            className="absolute inset-0 z-[30]"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(24px)" }}
          >
            {/* Minimal back button — top left */}
            <button
              onClick={goHome}
              className="fixed top-5 left-6 z-[100] flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase transition-all hover:scale-105"
              style={{
                background: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px)",
                color: "rgba(255,255,255,0.8)",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Core
            </button>

            {/* Quick Command Center button */}
            <button
              onClick={() => setIsCommandCenterOpen(true)}
              className="fixed top-5 left-36 z-[100] flex items-center gap-1.5 font-mono text-[9px] tracking-wider uppercase px-3 py-2 rounded-lg bg-black/60 border border-white/15 text-white/60 hover:text-white hover:border-sky-400/50 backdrop-blur-md transition-all"
            >
              <span>⚡</span> Search (Ctrl+K)
            </button>

            {/* Section label — top right */}
            <div
              className="fixed top-5 right-6 z-[100] font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "rgba(56,189,248,0.85)" }}
            >
              {SECTION_LABELS[section]}
            </div>

            {/* Admin link */}
            <a
              href="/admin"
              className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] font-mono text-[9px] tracking-[0.1em] uppercase hover:text-white transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              ⚙ Admin
            </a>

            {/* Render section */}
            {section === "about"        && <AboutPanel        academic={academic} />}
            {section === "projects"     && <ProjectsPanel     projects={projects} />}
            {section === "arcade"       && <ArcadePanel       hobbies={hobbies} />}
            {section === "skills"       && <SkillsPanel />}
            {section === "research"     && <ResearchPanel     papers={research} />}
            {section === "achievements" && <AchievementsPanel achievements={achievements} />}
            {section === "contact"      && <ContactPanel />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Command Center */}
      <CommandCenter
        isOpen={isCommandCenterOpen}
        onClose={() => setIsCommandCenterOpen(false)}
        onNavigate={(id) => handleSelect(id)}
        onSelectProject={(p) => setModalProject(p)}
        projects={projects}
        achievements={achievements}
      />

      {/* Global Project Deep Dive Modal */}
      <ProjectModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />

      {/* Persistent HUD footer */}
      <Footer />
    </div>
  );
}
