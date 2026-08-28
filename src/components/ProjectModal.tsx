"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-2xl p-6 md:p-8 bg-zinc-950/95 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10 overflow-hidden"
          style={{
            boxShadow: "0 0 0 1px rgba(56,189,248,0.15), 0 25px 50px -12px rgba(0,0,0,0.8)",
          }}
        >
          {/* Ambient header glow */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20 font-mono text-sm"
          >
            ✕
          </button>

          {/* Top category & order */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{project.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-widest uppercase text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                  {project.category.join(" · ")}
                </span>
                {project.impact && (
                  <span className="font-mono text-[9px] tracking-widest uppercase text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    ✦ {project.impact}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-2xl text-white mt-1">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Body description */}
          <div className="space-y-4 text-white/80 text-sm leading-relaxed mb-6">
            <p>{project.description}</p>
            {project.longDescription && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/70 space-y-2">
                <div className="font-mono text-[10px] tracking-wider uppercase text-sky-400 font-semibold">
                  Engineering Architecture & Core Blueprint:
                </div>
                <p>{project.longDescription}</p>
              </div>
            )}
          </div>

          {/* Tech Stack Pills */}
          <div className="mb-6">
            <div className="font-mono text-[10px] tracking-wider uppercase text-white/40 mb-2">
              Technologies & Frameworks
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-white/90 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View Repository →
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-sky-500 hover:bg-sky-400 text-black shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
              >
                <span>🚀</span> Live Launch →
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
