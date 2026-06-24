"use client";
import { useState, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { Project, AcademicData, Achievement, ResearchPaper } from "@/lib/types";
import FloatingNav from "./FloatingNav";
import HeroPanel from "./panels/HeroPanel";
import AboutPanel from "./panels/AboutPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import SkillsPanel from "./panels/SkillsPanel";
import ResearchPanel from "./panels/ResearchPanel";
import AchievementsPanel from "./panels/AchievementsPanel";
import ContactPanel from "./panels/ContactPanel";
import CursorGlow from "./CursorGlow";
import Footer from "./Footer";
import { useClickRipple } from "./ClickRipple";

const NeuralCanvas  = dynamic(() => import("./NeuralCanvas"),  { ssr: false });
const ShaderCanvas  = dynamic(() => import("./ShaderCanvas").then(m => ({ default: m.default })), { ssr: false });

export type SectionId = "home" | "about" | "projects" | "skills" | "research" | "achievements" | "contact";

const SECTION_LABELS: Record<SectionId, string> = {
  home: "Home", about: "About", projects: "Projects",
  skills: "Skills", research: "Research", achievements: "Awards", contact: "Contact",
};

interface Props {
  projects: Project[];
  academic: AcademicData;
  achievements: Achievement[];
  research: ResearchPaper[];
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

export default function PortfolioShell({ projects, academic, achievements, research }: Props) {
  const [section, setSection] = useState<SectionId>("home");
  const { trigger: triggerRipple, RippleLayer } = useClickRipple();

  // ESC = go back to landing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSection("home"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
            <HeroPanel academic={academic} onSection={(id) => handleSelect(id)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating orbiting section nodes */}
      <FloatingNav active={section} onSelect={(id, e) => handleSelect(id, e)} />

      {/* Click ripple layer — z-[29] so it shows above canvas but below panels */}
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
            style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(20px)" }}
          >
            {/* Minimal back button — top left */}
            <button
              onClick={goHome}
              className="fixed top-5 left-6 z-[100] flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase transition-all hover:scale-105"
              style={{
                background: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(14px)",
                color: "rgba(255,255,255,0.7)",
                padding: "8px 16px",
                borderRadius: 8,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>

            {/* Section label — top right */}
            <div
              className="fixed top-5 right-6 z-[100] font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "rgba(56,189,248,0.7)" }}
            >
              {SECTION_LABELS[section]}
            </div>

            {/* Admin link */}
            <a
              href="/admin"
              className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] font-mono text-[9px] tracking-[0.1em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              ⚙ Admin
            </a>

            {/* Render section */}
            {section === "about"        && <AboutPanel        academic={academic} />}
            {section === "projects"     && <ProjectsPanel     projects={projects} />}
            {section === "skills"       && <SkillsPanel />}
            {section === "research"     && <ResearchPanel     papers={research} />}
            {section === "achievements" && <AchievementsPanel achievements={achievements} />}
            {section === "contact"      && <ContactPanel />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent HUD footer — always on top of everything except cursor */}
      <Footer />
    </div>
  );
}
