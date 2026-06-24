"use client";
import { useRef, useEffect } from "react";

/**
 * TiltCard — wraps children in a 3D perspective tilt that tracks the mouse.
 * Includes a moving specular shine gradient overlay.
 */
export default function TiltCard({
  children,
  className = "",
  style = {},
  maxTilt = 12,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const target = useRef({ rx: 0, ry: 0, ox: 50, oy: 50 });
  const current = useRef({ rx: 0, ry: 0, ox: 50, oy: 50 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      target.current = {
        rx: -y * maxTilt,
        ry:  x * maxTilt,
        ox: (x + 0.5) * 100,
        oy: (y + 0.5) * 100,
      };
    };

    const onLeave = () => {
      target.current = { rx: 0, ry: 0, ox: 50, oy: 50 };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.rx = lerp(c.rx, t.rx, 0.1);
      c.ry = lerp(c.ry, t.ry, 0.1);
      c.ox = lerp(c.ox, t.ox, 0.1);
      c.oy = lerp(c.oy, t.oy, 0.1);

      if (card) {
        card.style.transform = `perspective(700px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) translateZ(8px)`;
      }
      if (shineRef.current) {
        const intensity = Math.min(Math.abs(c.rx) + Math.abs(c.ry), maxTilt) / maxTilt;
        shineRef.current.style.opacity = String(intensity * 0.18);
        shineRef.current.style.background =
          `radial-gradient(circle at ${c.ox}% ${c.oy}%, rgba(255,255,255,0.9) 0%, transparent 65%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ ...style, position: "relative", transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
      {/* Specular shine overlay */}
      <div
        ref={shineRef}
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          pointerEvents: "none", opacity: 0,
          transition: "opacity 0.1s",
        }}
      />
    </div>
  );
}
