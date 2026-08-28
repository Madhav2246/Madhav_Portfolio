"use client";
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef  = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId   = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const onDown = () => {
      dotRef.current?.classList.add("expand");
      ringRef.current?.classList.add("expand");
    };
    const onUp = () => {
      dotRef.current?.classList.remove("expand");
      ringRef.current?.classList.remove("expand");
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = el.closest("a, button, [data-hover]");
      if (isInteractive) {
        dotRef.current?.classList.add("expand");
        ringRef.current?.classList.add("expand");
      } else {
        dotRef.current?.classList.remove("expand");
        ringRef.current?.classList.remove("expand");
      }
    };

    // Smooth ring follow
    const animate = () => {
      const dx = posRef.current.x - ringPos.current.x;
      const dy = posRef.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.12;
      ringPos.current.y += dy * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top  = `${ringPos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
