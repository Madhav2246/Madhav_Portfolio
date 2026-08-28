"use client";
import React from "react";
import type { SectionId } from "@/lib/types";

const NODES: { id: SectionId; label: string; num: string; icon?: string; special?: boolean }[] = [
  { id: "about",        label: "About",          num: "01" },
  { id: "projects",     label: "Projects",       num: "02" },
  { id: "arcade",       label: "Arcade & Hobbies", num: "03", special: true, icon: "🏏" },
  { id: "skills",       label: "Skills",         num: "04" },
  { id: "research",     label: "Research",       num: "05" },
  { id: "achievements", label: "Awards",         num: "06" },
  { id: "contact",      label: "Contact",        num: "07" },
];

interface Props {
  onSelect: (id: SectionId, e?: React.MouseEvent) => void;
  active: SectionId;
}

export default function FloatingNav({ onSelect, active }: Props) {
  if (active !== "home") return null;

  return (
    <>
      <style>{`
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }
        @keyframes nodeShine {
          0%   { left: -60%; }
          100% { left: 120%; }
        }
      `}</style>

      <div
        className="fixed z-[20] flex flex-col gap-3 select-none"
        style={{
          left: "76%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(210px, 19vw, 290px)",
        }}
      >
        {NODES.map((node, i) => (
          <button
            key={node.id}
            onClick={(e) => onSelect(node.id, e)}
            style={{
              animation: `floatBob ${2.4 + i * 0.22}s ease-in-out infinite`,
              animationDelay: `${i * 0.22}s`,
              width: "100%",
            }}
            className="group relative flex items-center gap-3.5 pl-4 pr-6 py-[11px] rounded-full text-left transition-all duration-200 hover:scale-105"
          >
            {/* Glass pill background */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: node.special ? "rgba(10,24,18,0.92)" : "rgba(10,10,20,0.92)",
                border: node.special ? "1px solid rgba(52,211,153,0.45)" : "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(20px)",
                boxShadow: node.special
                  ? "0 6px 28px rgba(0,0,0,0.7), 0 0 16px rgba(52,211,153,0.2)"
                  : "0 6px 28px rgba(0,0,0,0.7), 0 2px 12px rgba(56,189,248,0.15)",
                overflow: "hidden",
              }}
            />

            {/* Hover glow */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-250"
              style={{
                border: node.special ? "1px solid rgba(52,211,153,0.85)" : "1px solid rgba(56,189,248,0.75)",
                boxShadow: node.special
                  ? "0 0 24px rgba(52,211,153,0.45)"
                  : "0 0 24px rgba(56,189,248,0.35)",
              }}
            />

            {/* Shine sweep on hover */}
            <span
              className="absolute top-0 bottom-0 w-[40%] opacity-0 group-hover:opacity-100 pointer-events-none rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                animation: "nodeShine 0.6s ease forwards",
                animationPlayState: "paused",
              }}
            />

            {/* Dot / Icon */}
            {node.icon ? (
              <span className="relative shrink-0 text-sm">
                {node.icon}
              </span>
            ) : (
              <span
                className="relative shrink-0 w-[7px] h-[7px] rounded-full"
                style={{
                  background: "#38bdf8",
                  boxShadow: "0 0 10px rgba(56,189,248,0.9)",
                  animation: `pulseDot ${1.8 + i * 0.1}s ease-in-out infinite`,
                  animationDelay: `${i * 0.35}s`,
                }}
              />
            )}

            {/* Number */}
            <span
              className="relative font-mono text-[9px] tracking-[0.18em] leading-none"
              style={{ color: node.special ? "rgba(52,211,153,0.8)" : "rgba(56,189,248,0.65)" }}
            >
              {node.num}
            </span>

            {/* Label */}
            <span className={`relative font-display font-bold text-[15px] tracking-[-0.01em] ${node.special ? "text-emerald-300" : "text-white"}`}>
              {node.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
