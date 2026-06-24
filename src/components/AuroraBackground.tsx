"use client";

export default function AuroraBackground() {
  // Monochrome: subtle dark smoke wisps — no color blobs
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Large radial vignette — pure black center fade */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 70% 40%, rgba(255,255,255,0.025) 0%, transparent 70%)",
        }}
      />
      {/* Subtle smoke blob 1 */}
      <div
        style={{
          position: "absolute", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          top: "-10%", right: "-5%",
          borderRadius: "50%",
          animation: "floatBlob 30s linear infinite",
          filter: "blur(60px)",
        }}
      />
      {/* Subtle smoke blob 2 */}
      <div
        style={{
          position: "absolute", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          bottom: "10%", left: "10%",
          borderRadius: "50%",
          animation: "floatBlob 38s linear infinite",
          animationDelay: "-12s",
          filter: "blur(80px)",
        }}
      />
      {/* Very subtle center glow */}
      <div
        style={{
          position: "absolute", width: 400, height: 400,
          background: "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
          top: "40%", left: "30%",
          borderRadius: "50%",
          animation: "floatBlob 25s linear infinite",
          animationDelay: "-6s",
          filter: "blur(100px)",
        }}
      />
    </div>
  );
}
