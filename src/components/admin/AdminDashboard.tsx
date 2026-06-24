"use client";
import { useState } from "react";
import type { Project, Achievement, ResearchPaper, AcademicData } from "@/lib/types";
import ProjectsAdmin from "./ProjectsAdmin";
import AcademicAdmin from "./AcademicAdmin";
import AchievementsAdmin from "./AchievementsAdmin";
import ResearchAdmin from "./ResearchAdmin";

type Tab = "projects" | "academic" | "achievements" | "research";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "projects", label: "Projects", emoji: "💼" },
  { id: "academic", label: "Academic", emoji: "🎓" },
  { id: "achievements", label: "Achievements", emoji: "🏆" },
  { id: "research", label: "Research", emoji: "🔬" },
];

interface Props {
  projects: Project[];
  achievements: Achievement[];
  research: ResearchPaper[];
  academic: AcademicData;
}

export default function AdminDashboard({ projects, achievements, research, academic }: Props) {
  const [tab, setTab] = useState<Tab>("projects");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen" style={{ background: "#05050f", color: "#f0f4ff", fontFamily: "var(--font-inter, sans-serif)" }}>
      {/* Header */}
      <div className="border-b border-white/[0.07] px-8 py-5 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50"
           style={{ background: "rgba(5,5,15,0.9)" }}>
        <div className="flex items-center gap-4">
          <a href="/" className="font-extrabold text-[20px] tracking-[-0.04em]"
             style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            MY
          </a>
          <div className="w-px h-5 bg-white/10" />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/40">Admin Dashboard</span>
        </div>
        <a href="/" className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors">
          ← View Portfolio
        </a>
      </div>

      {/* Tab bar */}
      <div className="px-8 py-4 border-b border-white/[0.07] flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-[10px] tracking-[0.1em] uppercase transition-all ${
              tab === t.id
                ? "text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)]"
                : "text-white/40 hover:text-white/70"
            }`}
            style={tab === t.id ? { background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" } : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 max-w-5xl">
        {tab === "projects" && <ProjectsAdmin projects={projects} onToast={showToast} />}
        {tab === "academic" && <AcademicAdmin academic={academic} onToast={showToast} />}
        {tab === "achievements" && <AchievementsAdmin achievements={achievements} onToast={showToast} />}
        {tab === "research" && <ResearchAdmin research={research} onToast={showToast} />}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl font-mono text-[11px] tracking-[0.1em] shadow-2xl transition-all ${
            toast.type === "success"
              ? "text-emerald-300"
              : "text-rose-300"
          }`}
          style={{ background: "rgba(5,5,15,0.95)", border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}` }}
        >
          {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
        </div>
      )}
    </div>
  );
}
