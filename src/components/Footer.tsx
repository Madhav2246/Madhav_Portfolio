"use client";
import { motion } from "framer-motion";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/Madhav2246/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.021C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/Yalamarthi-Madhav",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/madhav_yalamarthi",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:yalamarthi.sriram123@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <polyline points="2,4 12,13 22,4" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-[25] pointer-events-none"
    >
      <div
        className="pointer-events-auto flex items-center justify-between px-6 py-2.5"
        style={{
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Left — identity + university */}
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-[9px] tracking-[0.18em] uppercase"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            © 2026 Madhav Yalamarthi
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)", fontSize: 10 }}>|</span>
          <span
            className="font-mono text-[9px] tracking-[0.14em] uppercase hidden sm:block"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            B.Tech AI &amp; Data Science · Amrita Vishwa Vidyapeetham
          </span>
        </div>

        {/* Centre — open-to-work pulse badge */}
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.2)",
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#4ade80" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: "#4ade80" }}
            />
          </span>
          <span
            className="font-mono text-[8px] tracking-[0.16em] uppercase"
            style={{ color: "#4ade80" }}
          >
            Open to Opportunities
          </span>
        </motion.div>

        {/* Right — social icons + analytics link */}
        <div className="flex items-center gap-1">
          {SOCIALS.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ color: "rgba(255,255,255,0.35)" }}
              whileHover={{ scale: 1.2, color: "#38bdf8" } as any}
              whileTap={{ scale: 0.92 }}
            >
              {s.icon}
            </motion.a>
          ))}

          {/* Divider */}
          <span className="mx-1.5 h-3 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Analytics shortcut */}
          <motion.a
            href="/analysis"
            target="_blank"
            rel="noreferrer"
            title="Academic Analytics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[8px] tracking-[0.12em] uppercase"
            style={{
              color: "rgba(56,189,248,0.55)",
              border: "1px solid rgba(56,189,248,0.15)",
              background: "rgba(56,189,248,0.05)",
            }}
            whileHover={{
              color: "#38bdf8",
              borderColor: "rgba(56,189,248,0.4)",
              background: "rgba(56,189,248,0.1)",
              scale: 1.04,
            } as any}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3 h-3">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Analytics
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
}
