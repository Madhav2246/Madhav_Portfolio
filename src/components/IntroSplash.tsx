"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { proceduralAudio } from "@/utils/proceduralAudio";

interface Props {
  onEnter: () => void;
}

export default function IntroSplash({ onEnter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [progress, setProgress] = useState(0);

  const isEnteringRef = useRef(false);

  // 3D Rotating Wireframe Cube & Hyper-Warp Particle Field on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0;
    let angleY = 0;
    let speedMult = 1.0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 3D Cube vertices
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
    ];

    // Edges connecting vertices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Floating particles
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 1000,
      radius: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      speedZ: Math.random() * 2 + 1,
    }));

    const render = () => {
      ctx.fillStyle = "#070604";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isEnteringRef.current) {
        speedMult = Math.min(speedMult * 1.05, 10.0);
      }

      // Starfield / hyper-drive warp particles
      particles.forEach((p) => {
        p.z -= isEnteringRef.current ? p.speedZ * speedMult : p.speedZ;
        if (p.z <= 0) p.z = 1000;

        const k = 400 / p.z;
        const px = (p.x - canvas.width / 2) * k + canvas.width / 2;
        const py = (p.y - canvas.height / 2) * k + canvas.height / 2;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = Math.max(0.4, p.radius * k);
          ctx.fillStyle = isEnteringRef.current
            ? `rgba(212, 168, 71, ${Math.min(1, p.alpha * 1.8)})`
            : `rgba(226, 232, 240, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3D Cube Math — Refined compact scale (0.11)
      const fov = 340;
      const baseScale = Math.min(canvas.width, canvas.height) * 0.11;
      const currentScale = isEnteringRef.current ? baseScale * (1 + (speedMult * 0.12)) : baseScale;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected: [number, number][] = [];

      for (const [vx, vy, vz] of vertices) {
        // Rotate Y
        const x1 = vx * cosY - vz * sinY;
        const z1 = vx * sinY + vz * cosY;

        // Rotate X
        const y2 = vy * cosX - z1 * sinX;
        const z2 = vy * sinX + z1 * cosX;

        const distance = 3.5;
        const sz = z2 + distance;
        const px = (x1 * currentScale * fov) / (sz * 100) + cx;
        const py = (y2 * currentScale * fov) / (sz * 100) + cy;

        projected.push([px, py]);
      }

      // Draw wireframe edges with glowing whitish-grey / gold stroke
      ctx.strokeStyle = isEnteringRef.current ? "rgba(212, 168, 71, 0.9)" : "rgba(240, 234, 214, 0.5)";
      ctx.lineWidth = isEnteringRef.current ? 2.2 : 1.5;
      ctx.shadowColor = "rgba(212, 168, 71, 0.5)";
      ctx.shadowBlur = isEnteringRef.current ? 20 : 10;

      for (const [start, end] of edges) {
        const [x1, y1] = projected[start];
        const [x2, y2] = projected[end];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw node points
      for (const [px, py] of projected) {
        ctx.fillStyle = "#d4a847";
        ctx.beginPath();
        ctx.arc(px, py, isEnteringRef.current ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
      }

      angleX += 0.008 * speedMult;
      angleY += 0.012 * speedMult;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleStart = () => {
    setIsEntering(true);
    isEnteringRef.current = true;

    try {
      proceduralAudio.unlock();
      proceduralAudio.playPortalWarpSound();
    } catch {
      // Ignore audio errors
    }

    // 3.0 Second Progress counter
    const startTime = Date.now();
    const duration = 3000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed >= duration) {
        clearInterval(timer);
        onEnter();
      }
    }, 30);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="intro-splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 2.8, filter: "blur(30px)" }}
        transition={{ duration: 3.0, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070604] overflow-hidden select-none p-4 sm:p-6"
      >
        {/* 3D Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Ambient Top & Bottom Gold Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070604] via-transparent to-[#070604] opacity-95 pointer-events-none" />

        {/* Content Box — Compact, elegant layout */}
        <motion.div
          animate={isEntering ? { scale: 1.25, opacity: 0, filter: "blur(15px)" } : { scale: 1, opacity: 1 }}
          transition={{ duration: 3.0, ease: "easeIn" }}
          className="relative z-10 text-center max-w-lg mx-auto space-y-4"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full font-mono text-[9px] sm:text-[11px] uppercase tracking-widest border"
               style={{ background: "rgba(212,168,71,0.08)", borderColor: "rgba(212,168,71,0.3)", color: "#d4a847" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            {isEntering ? "WARPING INTO MADHAV'S UNIVERSE..." : "INITIALIZING EXPERIENCE"}
          </div>

          {/* Main Question */}
          <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-[#f0ead6] tracking-tight leading-snug">
            Do you want to know about <span className="text-gold">Madhav?</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm max-w-sm mx-auto leading-relaxed"
             style={{ color: "rgba(240,234,214,0.65)" }}>
            AI &amp; Systems Engineer · Continual Learning Researcher · IIT Madras National Finalist
          </p>

          {/* Action CTA Button or 3-Sec Progress Bar */}
          <div className="pt-2 flex flex-col items-center justify-center min-h-[75px]">
            {!isEntering ? (
              <button
                onClick={handleStart}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-xs sm:text-sm uppercase tracking-wider font-bold transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(212,168,71,0.3)]"
                style={{
                  background: "linear-gradient(135deg, #d4a847 0%, #a87e2a 100%)",
                  color: "#070604",
                }}
              >
                <span>Take Me To Madhav&apos;s Universe</span>
                <span className="text-sm group-hover:translate-x-1 transition-transform">✦</span>
              </button>
            ) : (
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between font-mono text-[11px] text-gold">
                  <span>HYPER-DRIVE WARP</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-gold/30">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-gold transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="font-mono text-[9px] text-[rgba(240,234,214,0.5)] animate-pulse">
                  🔊 USSSHHH PORTAL AUDIO SYNTHESIS...
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
