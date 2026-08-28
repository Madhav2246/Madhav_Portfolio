"use client";
import React, { useEffect, useRef } from "react";

interface Props {
  isPlaying?: boolean;
}

export default function AudioVisualizer({ isPlaying = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const BARS = 16;
      const barWidth = 3;
      const gap = 4;
      const startX = (canvas.width - (BARS * (barWidth + gap))) / 2;

      for (let i = 0; i < BARS; i++) {
        // Sine wave modulation for gold frequency equalizer animation
        const heightMultiplier = isPlaying
          ? Math.sin(phase + i * 0.4) * 0.4 + 0.5
          : 0.15;
        const barHeight = Math.max(4, heightMultiplier * canvas.height);
        const x = startX + i * (barWidth + gap);
        const y = (canvas.height - barHeight) / 2;

        ctx.fillStyle = isPlaying ? "rgba(212,168,71,0.85)" : "rgba(212,168,71,0.25)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += 0.08;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={24}
      className="pointer-events-none inline-block align-middle"
    />
  );
}
