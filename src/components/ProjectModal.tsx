"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/types";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}>

          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: "rgba(5,5,7,0.85)", backdropFilter: "blur(12px)" }} />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
            style={{ background: "rgba(12,10,7,0.95)", border: "1px solid rgba(212,168,71,0.2)", boxShadow: "0 0 60px rgba(212,168,71,0.12)" }}
            initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{project.emoji}</span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: "#d4a847" }}>
                    {project.impact || "Project"}
                  </div>
                  <h3 className="font-display font-black text-xl text-[#f0ead6] leading-snug">{project.title}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl font-mono text-xs text-[rgba(240,234,214,0.5)] hover:text-[#f0ead6] transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                ✕
              </button>
            </div>

            {/* Long description */}
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(240,234,214,0.78)" }}>
              {project.longDescription || project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(t => (
                <span key={t}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(212,168,71,0.07)", border: "1px solid rgba(212,168,71,0.18)", color: "#d4a847" }}>
                  {t}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-void"
                  style={{ background: "linear-gradient(135deg,#d4a847,#f8d87a)" }}>
                  View GitHub →
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-[#f0ead6]"
                  style={{ background: "rgba(212,168,71,0.06)", border: "1px solid rgba(212,168,71,0.25)" }}>
                  🚀 Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
