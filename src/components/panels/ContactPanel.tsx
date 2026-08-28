"use client";
import { motion } from "framer-motion";

const ACCENT = "#38bdf8";
const LINKS = [
  { label: "LinkedIn",           href: "https://www.linkedin.com/in/Yalamarthi-Madhav" },
  { label: "GitHub",             href: "https://github.com/Madhav2246" },
  { label: "Instagram",          href: "https://www.instagram.com/madhav_yalamarthi" },
  { label: "Portfolio Analytics",href: "/analysis" },
];

export default function ContactPanel() {
  return (
    <div className="w-full h-[calc(100vh-0px)] flex items-center justify-center relative overflow-hidden" style={{ paddingTop: 64 }}>
      {/* Animated ambient rings */}
      {[280, 440, 600].map((size, i) => (
        <motion.div key={size}
          className="absolute rounded-full pointer-events-none"
          style={{ width: size, height: size, border: "1px solid rgba(56,189,248,0.06)", left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}

      {/* Center glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div style={{ width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 65%)", filter: "blur(30px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-8 text-center">
        {/* Label */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-8" style={{ color: ACCENT }}>
          <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />
          Contact
          <span style={{ width: 28, height: 1, background: ACCENT, display: "inline-block" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black leading-none tracking-[-0.05em] text-white mb-5"
          style={{ fontSize: "clamp(32px,6vw,68px)" }}>
          Let&apos;s build something<br />
          <span style={{ background: `linear-gradient(120deg,#fff 0%,#7dd3fc 55%,${ACCENT} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            intelligent
          </span>{" "}together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}
          className="text-[17px] leading-[1.75] mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
          Open to research collaborations, AI/ML engineering roles, and innovative projects.
        </motion.p>

        {/* Primary CTA */}
        <motion.a
          href="mailto:yalamarthi.sriram123@gmail.com"
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.32 }}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.08em] uppercase font-bold text-black px-8 py-4 rounded-xl mb-8 cursor-pointer"
          style={{ background: `linear-gradient(135deg,${ACCENT},#818cf8)`, boxShadow: `0 8px 32px rgba(56,189,248,0.4)` }}>
          ✉ yalamarthi.sriram123@gmail.com
        </motion.a>

        {/* Phone */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
          className="font-mono text-[13px] mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
          <a href="tel:+919949795082" className="hover:text-white transition-colors">📞 +91 99497 95082</a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center">
          {LINKS.map((l, i) => (
            <motion.a key={l.label} href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase px-5 py-3 rounded-xl cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `rgba(56,189,248,0.4)`;
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(56,189,248,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}>
              {l.label} ↗
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
