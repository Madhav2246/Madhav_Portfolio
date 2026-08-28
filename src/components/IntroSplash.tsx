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

  // 3D Rotating Wireframe Cube & Particle Field on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleX = 0;
    let angleY = 0;

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

    // Background floating dust particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      speedY: Math.random() * 0.4 - 0.2,
    }));

    const render = () => {
      ctx.fillStyle = "#070604";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render ambient whitish-grey particles
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3D Cube Math
      const fov = 350;
      const scale = Math.min(canvas.width, canvas.height) * 0.18;
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
        const px = (x1 * fov) / sz + cx;
        const py = (y2 * fov) / sz + cy;

        projected.push([px, py]);
      }

      // Draw wireframe edges with glowing whitish-grey stroke
      ctx.strokeStyle = "rgba(240, 234, 214, 0.45)";
      ctx.lineWidth = 1.8;
      ctx.shadowColor = "rgba(212, 168, 71, 0.4)";
      ctx.shadowBlur = 12;

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
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      angleX += 0.008;
      angleY += 0.012;

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
    try {
      proceduralAudio.unlock();
      proceduralAudio.playCinematicPulse();
      setTimeout(() => {
        proceduralAudio.playSwish();
      }, 250);
    } catch {
      // Ignore audio errors
    }

    setTimeout(() => {
      onEnter();
    }, 1100);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="intro-splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.4, filter: "blur(20px)" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070604] overflow-hidden select-none"
      >
        {/* 3D Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Ambient Top & Bottom Gold Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070604] via-transparent to-[#070604] opacity-90 pointer-events-none" />

        {/* Content Box */}
        <motion.div
          animate={isEntering ? { scale: 1.2, opacity: 0, filter: "blur(10px)" } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeIn" }}
          className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-xs uppercase tracking-widest border"
               style={{ background: "rgba(212,168,71,0.08)", borderColor: "rgba(212,168,71,0.3)", color: "#d4a847" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Initializing Experience
          </div>

          {/* Main Question */}
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-[#f0ead6] tracking-tight leading-tight">
            Do you want to know about <span className="text-gold">Madhav?</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-xs sm:text-sm max-w-md mx-auto leading-relaxed"
             style={{ color: "rgba(240,234,214,0.65)" }}>
            AI &amp; Systems Engineer · Continual Learning Researcher · IIT Madras National Finalist
          </p>

          {/* Action CTA Button */}
          <div className="pt-4">
            <button
              onClick={handleStart}
              disabled={isEntering}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-mono text-xs sm:text-sm uppercase tracking-wider font-bold transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(212,168,71,0.3)]"
              style={{
                background: "linear-gradient(135deg, #d4a847 0%, #a87e2a 100%)",
                color: "#070604",
              }}
            >
              <span>Take Me To Madhav&apos;s Universe</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">✦</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
