"use client";
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    dot.style.display  = "block";
    ring.style.display = "block";

    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let rafId = 0;
    let visible = false;

    const show = () => {
      if (!visible) {
        visible = true;
        dot.style.opacity  = "1";
        ring.style.opacity = "1";
      }
    };
    const hide = () => {
      visible = false;
      dot.style.opacity  = "0";
      ring.style.opacity = "0";
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
      show();
    };

    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      rafId = requestAnimationFrame(loop);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", hide);
    rafId = requestAnimationFrame(loop);

    // Hover expand — re-scan every 800ms for dynamic content
    const applyHover = () => {
      document.querySelectorAll<HTMLElement>("a, button, [data-cursor]").forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "1";
        el.addEventListener("mouseenter", () => {
          dot.classList.add("expand");
          ring.classList.add("expand");
        });
        el.addEventListener("mouseleave", () => {
          dot.classList.remove("expand");
          ring.classList.remove("expand");
        });
      });
    };
    applyHover();
    const interval = setInterval(applyHover, 800);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", hide);
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Main dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ display: "none", opacity: 0, pointerEvents: "none", zIndex: 999999 }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ display: "none", opacity: 0, pointerEvents: "none", zIndex: 999999 }}
      />
    </>
  );
}
