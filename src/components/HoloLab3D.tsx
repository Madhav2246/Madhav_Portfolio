"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { proceduralAudio } from "@/utils/proceduralAudio";

type ShapeType = "cube" | "octahedron" | "quantum";

export default function HoloLab3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("cube");
  const [isRotatingFast, setIsRotatingFast] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0.5;
    let angleY = 0.5;

    let width = canvas.width = canvas.parentElement?.clientWidth || 320;
    let height = canvas.height = 260;

    const resize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 260;
      }
    };
    window.addEventListener("resize", resize);

    // 3D Geometry definitions
    const cubeVerts = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const octaVerts = [
      [0, -1.3, 0], [1.3, 0, 0], [0, 0, 1.3], [-1.3, 0, 0], [0, 0, -1.3], [0, 1.3, 0]
    ];
    const octaEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const verts = shapeType === "octahedron" ? octaVerts : cubeVerts;
      const edges = shapeType === "octahedron" ? octaEdges : cubeEdges;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected: [number, number][] = [];
      const cx = width / 2;
      const cy = height / 2;
      const radius = 65;

      for (const [vx, vy, vz] of verts) {
        const x1 = vx * cosY - vz * sinY;
        const z1 = vx * sinY + vz * cosY;

        const y2 = vy * cosX - z1 * sinX;
        const z2 = vy * sinX + z1 * cosX;

        const sz = z2 + 3.5;
        const px = cx + (x1 * radius * 3.5) / sz;
        const py = cy + (y2 * radius * 3.5) / sz;

        projected.push([px, py]);
      }

      // Draw quantum inner core sphere if quantum mode
      if (shapeType === "quantum") {
        ctx.fillStyle = "rgba(212, 168, 71, 0.25)";
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(212, 168, 71, 0.6)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw wireframe edges
      ctx.strokeStyle = "rgba(212, 168, 71, 0.6)";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "rgba(212, 168, 71, 0.4)";
      ctx.shadowBlur = 10;

      for (const [start, end] of edges) {
        if (projected[start] && projected[end]) {
          ctx.beginPath();
          ctx.moveTo(projected[start][0], projected[start][1]);
          ctx.lineTo(projected[end][0], projected[end][1]);
          ctx.stroke();
        }
      }

      // Draw node points
      for (const [px, py] of projected) {
        ctx.fillStyle = "#f8d87a";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const speed = isRotatingFast ? 0.04 : 0.01;
      angleX += speed * 0.7;
      angleY += speed;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [shapeType, isRotatingFast]);

  const handleShapeSelect = (type: ShapeType) => {
    proceduralAudio.playClick();
    setShapeType(type);
  };

  const handleSpinClick = () => {
    proceduralAudio.playCinematicPulse();
    setIsRotatingFast(true);
    setTimeout(() => setIsRotatingFast(false), 1200);
  };

  return (
    <div className="cine-card p-5 border-l-2 relative overflow-hidden"
         style={{ borderLeftColor: "#d4a847" }}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="mono-tag" style={{ color: "#d4a847", fontSize: 9 }}>Interactive 3D Holo-Lab</div>
          <h4 className="font-display font-bold text-[#f0ead6] text-base">3D Geometric Sandbox</h4>
        </div>
        <button
          onClick={handleSpinClick}
          className="px-3 py-1 rounded-xl font-mono text-[10px] uppercase font-bold text-void transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #d4a847, #f8d87a)" }}
        >
          Spin ⚡
        </button>
      </div>

      {/* Canvas */}
      <div className="relative rounded-xl overflow-hidden cursor-pointer"
           onClick={handleSpinClick}
           style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(212,168,71,0.2)" }}>
        <canvas ref={canvasRef} className="w-full h-[260px] block" />
        <div className="absolute bottom-2 right-3 font-mono text-[9px] text-[rgba(240,234,214,0.4)]">
          Click canvas to pulse
        </div>
      </div>

      {/* Geometry Selector Tabs */}
      <div className="flex items-center justify-between gap-1 mt-3">
        {(["cube", "octahedron", "quantum"] as ShapeType[]).map((t) => (
          <button
            key={t}
            onClick={() => handleShapeSelect(t)}
            className={`flex-1 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all border ${
              shapeType === t
                ? "bg-[rgba(212,168,71,0.15)] border-[rgba(212,168,71,0.4)] text-gold font-bold"
                : "bg-white/[0.02] border-white/10 text-[rgba(240,234,214,0.5)] hover:text-[#f0ead6]"
            }`}
          >
            {t === "cube" ? "Cube 🧊" : t === "octahedron" ? "Octa 💎" : "Quantum ⚛️"}
          </button>
        ))}
      </div>
    </div>
  );
}
