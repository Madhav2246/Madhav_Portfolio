"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { proceduralAudio } from "@/utils/proceduralAudio";

const ACTS = [
  {
    id: "act-1",
    actNum: "ACT I",
    title: "The Ascent",
    timeline: "2022 — Present",
    subtitle: "Foundations of Intelligence & Leadership",
    emoji: "🚀",
    details: [
      "B.Tech in Artificial Intelligence @ Amrita Vishwa Vidyapeetham (CGPA 8.7 / 10.0)",
      "Technical Mentor at ACM Student Chapter (SIG-AI) — conducting ML360 workshops & deep learning labs",
      "Built production AI MVPs covering Computer Vision, Multilingual EdTech, and Edge Biometrics"
    ],
    highlight: "Amrita School of Computing · ACM SIG-AI Mentor"
  },
  {
    id: "act-2",
    actNum: "ACT II",
    title: "High-Stakes Arena",
    timeline: "2024 — 2025",
    subtitle: "National Competition Victory & Rapid Engineering",
    emoji: "🏆",
    details: [
      "🥈 2nd Place National Winner @ IIT Madras MoRTH CoERS National Road Safety Hackathon (₹90K Prize)",
      "Top 5 National Finalist @ IISc Bengaluru Urban Vision Hackathon (565+ Teams, AIRAWAT Mobility)",
      "Engineered real-time YOLOv11 & RT-DETR traffic perception pipelines for 1.8M annotations"
    ],
    highlight: "IIT Madras 2nd Place Winner · IISc Bengaluru Top 5 Finalist"
  },
  {
    id: "act-3",
    actNum: "ACT III",
    title: "Theoretical Breakthrough",
    timeline: "2025 — 2026",
    subtitle: "First-Author Theoretical Research & Published Papers",
    emoji: "🔬",
    details: [
      "Accepted at CIS 2026: FACL/FAKD Tri-Level Continual Learning engine (+12.61% over DER++)",
      "Submitted to EAAI: Verification-Guided Neuro-Symbolic RAG using fine-tuned Qwen2.5 & SymPy (+135% vs 70B baseline)",
      "Paper Ready: Nexus LLM Self-Healing Distributed Task Queue with Redis & DAG execution (91.2% auto-recovery)"
    ],
    highlight: "1st-Author CIS 2026 Accepted · EAAI Neuro-Symbolic RAG"
  },
  {
    id: "act-4",
    actNum: "ACT IV",
    title: "The Next Blockbuster",
    timeline: "2026 & Beyond",
    subtitle: "Open for AI/ML Engineering & Research Roles",
    emoji: "🎬",
    details: [
      "Ready to join high-impact AI research labs, autonomous systems teams, and frontier ML engineering squads",
      "Bringing first-principles mathematical rigor, battle-tested hackathon agility, and Thala #7 composure under pressure",
      "Open for internships, full-time AI roles, and research collaborations worldwide"
    ],
    highlight: "Open to Work 2026 · AI Research & Engineering"
  }
];

export default function StoryboardTimeline() {
  const [activeAct, setActiveAct] = useState(0);

  return (
    <div className="w-full cine-card p-6 md:p-8 relative overflow-hidden"
         style={{ borderLeft: "3px solid #d4a847" }}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="mono-tag mb-1" style={{ color: "#d4a847" }}>
            🎬 Rajamouli-Style Motion Storyboard
          </div>
          <h3 className="font-display font-black text-2xl text-[#f0ead6]">
            Directing My <span className="text-gold">Journey</span>
          </h3>
        </div>
        <div className="mono-tag" style={{ color: "rgba(240,234,214,0.4)", fontSize: 9 }}>
          4-Act Cinematic Narrative
        </div>
      </div>

      {/* Act Nav Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {ACTS.map((act, i) => {
          const isActive = activeAct === i;
          return (
            <button
              key={act.id}
              onClick={() => {
                proceduralAudio.playClick();
                setActiveAct(i);
              }}
              className={`p-3 rounded-xl text-left transition-all font-mono text-xs border ${
                isActive
                  ? "bg-[rgba(212,168,71,0.15)] border-[rgba(212,168,71,0.45)] text-gold font-bold shadow-[0_0_15px_rgba(212,168,71,0.15)]"
                  : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] text-[rgba(240,234,214,0.5)] hover:text-[#f0ead6]"
              }`}
            >
              <div className="text-[9px] uppercase opacity-60 mb-0.5">{act.actNum}</div>
              <div className="font-sans font-bold text-xs truncate">{act.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Act Display Card */}
      <motion.div
        key={ACTS[activeAct].id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-2xl"
        style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,168,71,0.18)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ACTS[activeAct].emoji}</span>
            <div>
              <div className="mono-tag" style={{ color: "#d4a847", fontSize: 9 }}>
                {ACTS[activeAct].actNum} · {ACTS[activeAct].timeline}
              </div>
              <h4 className="font-display font-bold text-xl text-[#f0ead6]">
                {ACTS[activeAct].title}
              </h4>
            </div>
          </div>
          <span className="mono-tag px-3 py-1 rounded-full border"
                style={{ background: "rgba(212,168,71,0.08)", borderColor: "rgba(212,168,71,0.25)", color: "#d4a847" }}>
            {ACTS[activeAct].highlight}
          </span>
        </div>

        <p className="text-xs italic mb-4" style={{ color: "rgba(240,234,214,0.6)" }}>
          {ACTS[activeAct].subtitle}
        </p>

        <div className="space-y-2.5 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {ACTS[activeAct].details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs" style={{ color: "rgba(240,234,214,0.85)" }}>
              <span className="text-gold text-sm mt-0.5">✦</span>
              <span className="leading-relaxed">{detail}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
