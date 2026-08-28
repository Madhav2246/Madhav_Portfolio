"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, Achievement } from "@/lib/types";
import type { SectionId } from "./PortfolioShell";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
  onSelectProject: (p: Project) => void;
  projects: Project[];
  achievements: Achievement[];
}

export default function CommandCenter({
  isOpen,
  onClose,
  onNavigate,
  onSelectProject,
  projects,
  achievements,
}: Props) {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Ctrl+K / Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Navigation shortcuts
  const navItems: { label: string; id: SectionId; icon: string; desc: string }[] = [
    { label: "Home Terminal", id: "home", icon: "🏠", desc: "Return to central 3D neural core" },
    { label: "Innovation Lab (Projects)", id: "projects", icon: "🔬", desc: "Explore AI, Vision, RAG & Web platforms" },
    { label: "Arcade & Hobbies", id: "arcade" as SectionId, icon: "🏏", desc: "Play Mini-Cricket & Cinephile Trivia" },
    { label: "Technical Arsenal (Skills)", id: "skills", icon: "⚡", desc: "PyTorch, Vision, DevOps & Soft Skills" },
    { label: "Research Publications", id: "research", icon: "📄", desc: "Drug toxicity GNNs & Continual Learning" },
    { label: "Awards & Recognitions", id: "achievements", icon: "🏆", desc: "IIT Madras, IISc Bengaluru & Certifications" },
    { label: "About & Academic History", id: "about", icon: "👤", desc: "B.Tech AI at Amrita VV · CGPA 8.01" },
    { label: "Get In Touch", id: "contact", icon: "📫", desc: "Hire or collaborate with Madhav" },
  ];

  const filteredNav = navItems.filter(
    n => n.label.toLowerCase().includes(cleanQuery) || n.desc.toLowerCase().includes(cleanQuery)
  );

  const filteredProjects = projects.filter(
    p =>
      p.title.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery) ||
      p.tags.some(t => t.toLowerCase().includes(cleanQuery))
  );

  const filteredAchievements = achievements.filter(
    a =>
      a.title.toLowerCase().includes(cleanQuery) ||
      (a.organizer && a.organizer.toLowerCase().includes(cleanQuery))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-start justify-center pt-20 px-4 md:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Palette Dialog */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: -10 }}
          className="relative w-full max-w-2xl bg-zinc-950/95 border border-white/20 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10"
          style={{
            boxShadow: "0 0 0 1px rgba(56,189,248,0.2), 0 20px 40px rgba(0,0,0,0.8)",
          }}
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-5 py-4 border-b border-white/10 gap-3">
            <span className="text-xl text-sky-400">⚡</span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search projects, skills, games, cricket, research, or type to navigate..."
              className="w-full bg-transparent text-white font-sans text-sm outline-none placeholder:text-white/30"
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/30 border border-white/10 px-2 py-1 rounded">
              ESC
            </span>
          </div>

          {/* Search Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            
            {/* Quick Actions / Navigation */}
            {filteredNav.length > 0 && (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-sky-400/70 px-3 py-1">
                  Navigation Shortcuts
                </div>
                <div className="space-y-1 mt-1">
                  {filteredNav.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-sans font-semibold text-xs text-white group-hover:text-sky-300">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-white/40">{item.desc}</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-white/20 group-hover:text-white/60">
                        Go →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Projects */}
            {filteredProjects.length > 0 && (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400/70 px-3 py-1">
                  Projects & Repositories ({filteredProjects.length})
                </div>
                <div className="space-y-1 mt-1">
                  {filteredProjects.slice(0, 5).map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{p.emoji}</span>
                        <div>
                          <div className="font-sans font-semibold text-xs text-white group-hover:text-emerald-300">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-white/40">{p.description.slice(0, 70)}...</div>
                        </div>
                      </div>
                      <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 text-white/50">
                        Inspect
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Achievements */}
            {filteredAchievements.length > 0 && (
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-amber-400/70 px-3 py-1">
                  Recognitions & Awards
                </div>
                <div className="space-y-1 mt-1">
                  {filteredAchievements.map(a => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span>🏆</span>
                        <div>
                          <div className="font-sans text-xs text-white font-medium">{a.title}</div>
                          <div className="font-mono text-[9px] text-white/40">{a.organizer} · {a.rank || a.date}</div>
                        </div>
                      </div>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[9px] uppercase text-sky-400 hover:underline"
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-5 py-2.5 bg-black/50 border-t border-white/10 flex items-center justify-between text-white/40 font-mono text-[9px] uppercase">
            <span>Use ↑↓ to navigate · ENTER to select</span>
            <span>Madhav Yalamarthi · AI Engineer</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
