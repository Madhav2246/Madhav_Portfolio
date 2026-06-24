"use client";
import { useState, useCallback, useEffect } from "react";

interface Ripple { id: number; x: number; y: number; }

/**
 * useClickRipple — call triggerRipple(x, y) on any click.
 * Returns the ripple list + the JSX layer to render.
 */
export function useClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const trigger = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 900);
  }, []);

  const RippleLayer = (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 29 }}>
      {ripples.map(rp => (
        <span
          key={rp.id}
          style={{
            position: "absolute",
            left: rp.x,
            top: rp.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            animation: "rippleExpand 0.85s cubic-bezier(0,0.5,0.5,1) forwards",
          }}
        />
      ))}
      <style>{`
        @keyframes rippleExpand {
          0%   { box-shadow: 0 0 0 0px rgba(56,189,248,0.8),  0 0 0 0px  rgba(56,189,248,0.3);  opacity:1; }
          40%  { box-shadow: 0 0 0 40px rgba(56,189,248,0.25), 0 0 0 80px rgba(56,189,248,0.08); opacity:1; }
          100% { box-shadow: 0 0 0 120px rgba(56,189,248,0),  0 0 0 200px rgba(56,189,248,0);   opacity:0; }
        }
      `}</style>
    </div>
  );

  return { trigger, RippleLayer };
}
