"use client";
import type { SectionId } from "./PortfolioShell";

const NODES: { id: SectionId; label: string; num: string }[] = [
  { id: "about",        label: "About",    num: "01" },
  { id: "projects",     label: "Projects", num: "02" },
  { id: "skills",       label: "Skills",   num: "03" },
  { id: "research",     label: "Research", num: "04" },
  { id: "achievements", label: "Awards",   num: "05" },
  { id: "contact",      label: "Contact",  num: "06" },
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
          50%       { transform: translateY(-10px); }
        }
        @keyframes nodeShine {
          0%   { left: -60%; }
          100% { left: 120%; }
        }
      `}</style>

      <div
        className="fixed z-[20] flex flex-col gap-4 select-none"
        style={{
          left: "75%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "clamp(200px, 18vw, 280px)",
        }}
      >
        {NODES.map((node, i) => (
          <button
            key={node.id}
            onClick={(e) => onSelect(node.id, e)}
            style={{
              animation: `floatBob ${2.4 + i * 0.25}s ease-in-out infinite`,
              animationDelay: `${i * 0.28}s`,
              width: "100%",
            }}
            className="group relative flex items-center gap-4 pl-5 pr-7 py-[14px] rounded-full text-left transition-all duration-200 hover:scale-105"
          >
            {/* Glass pill background */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(10,10,20,0.92)",
                border: "1px solid rgba(255,255,255,0.32)",
                backdropFilter: "blur(20px)",
                boxShadow: [
                  "0 6px 28px rgba(0,0,0,0.7)",
                  "0 0 0 1px rgba(56,189,248,0.12)",
                  "inset 0 1px 0 rgba(255,255,255,0.14)",
                  "0 2px 12px rgba(56,189,248,0.15)",
                ].join(", "),
                overflow: "hidden",
              }}
            />

            {/* Hover glow */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-250"
              style={{
                border: "1px solid rgba(56,189,248,0.75)",
                boxShadow: "0 0 24px rgba(56,189,248,0.35), inset 0 0 12px rgba(56,189,248,0.06)",
              }}
            />

            {/* Shine sweep on hover */}
            <span
              className="absolute top-0 bottom-0 w-[40%] opacity-0 group-hover:opacity-100 pointer-events-none rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                animation: "nodeShine 0.6s ease forwards",
                animationPlayState: "paused",
              }}
            />

            {/* Live cyan dot */}
            <span
              className="relative shrink-0 w-[8px] h-[8px] rounded-full"
              style={{
                background: "#38bdf8",
                boxShadow: "0 0 10px rgba(56,189,248,0.9)",
                animation: `pulseDot ${1.8 + i * 0.1}s ease-in-out infinite`,
                animationDelay: `${i * 0.35}s`,
              }}
            />

            {/* Number */}
            <span
              className="relative font-mono text-[10px] tracking-[0.18em] leading-none"
              style={{ color: "rgba(56,189,248,0.65)" }}
            >
              {node.num}
            </span>

            {/* Label */}
            <span className="relative font-display font-bold text-[16px] tracking-[-0.01em] text-white">
              {node.label}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
