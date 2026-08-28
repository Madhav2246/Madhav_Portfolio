"use client";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { AcademicData } from "@/lib/types";

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

interface Props { academic: AcademicData }

export default function AboutPanel({ academic }: Props) {
  // Animated counters
  const counterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = counterRef.current?.querySelectorAll<HTMLElement>("[data-count]");
    els?.forEach(el => {
      const target = parseFloat(el.dataset.count!);
      const isFloat = String(target).includes(".");
      let cur = 0;
      const step = target / 60;
      const id = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(id); }
        el.textContent = isFloat ? cur.toFixed(2) : Math.floor(cur).toString();
      }, 20);
    });
  }, []);

  return (
    <div className="w-full h-[calc(100vh-0px)] overflow-y-auto panel-scroll" style={{ paddingTop: 64 }}>
      {/* Decorative top-right blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-10 pb-24">
        {/* Label */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "#38bdf8" }}>
          <span style={{ width: 28, height: 1, background: "#38bdf8", display: "inline-block" }} />About & Background
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-8"
          style={{ fontSize: "clamp(36px,5.5vw,68px)" }}>
          The Mind Behind<br />
          <span style={{ background: "linear-gradient(120deg,#fff 0%,#7dd3fc 55%,#38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            the Architecture
          </span>
        </motion.h2>

        {/* Animated stat pills */}
        <div ref={counterRef}>
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label: "CGPA", count: academic.currentCGPA, suffix: `/${academic.cgpaOutOf}` },
              { label: "1st Author Papers", count: 2, suffix: "" },
              { label: "Hackathon Wins", count: 3, suffix: "" },
              { label: "Projects Shipped", count: 14, suffix: "+" },
            ].map(s => (
              <motion.div key={s.label} variants={item}
                whileHover={{ scale: 1.04, y: -3 }}
                className="rounded-2xl p-5 text-center cursor-default bg-sky-500/[0.06] border border-sky-500/20 shadow-[0_4px_20px_rgba(56,189,248,0.08)]">
                <div className="font-display font-black text-[28px] text-white leading-none" data-count={s.count}>0</div>
                <div className="font-mono text-[8px] tracking-[0.14em] uppercase mt-2 text-sky-400/80">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bio columns */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-5 mb-10">
          <motion.p variants={item} className="text-[15px] leading-[1.8] text-white/80">
            I&apos;m an <strong className="text-white">AI/ML Engineer &amp; Researcher</strong> specializing in{" "}
            <span className="text-sky-300">continual learning, neuro-symbolic RAG, multi-agent systems, and distributed processing</span>.
            Pursuing B.Tech in Computer Science (AI) at <strong className="text-white">Amrita Vishwa Vidyapeetham</strong> (CGPA: {academic.currentCGPA}/10.0).
          </motion.p>
          <motion.p variants={item} className="text-[15px] leading-[1.8] text-white/80">
            Author of <strong className="text-white">2 first-author research papers</strong> (Accepted at CIS 2026 and Submitted to EAAI).
            National finalist &amp; winner at <span className="text-white">IIT Madras (2nd Prize)</span> and <span className="text-white">IISc Bengaluru (Top 5)</span>.
          </motion.p>
        </motion.div>

        {/* Experience & Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Work Experience */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-sky-400">Industry Experience</span>
              <span className="font-mono text-[9px] text-white/40">Jan 2024 — May 2024</span>
            </div>
            <h3 className="font-display font-bold text-base text-white">AI Intern · 1STOP.AI</h3>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              Developed end-to-end ML pipelines covering data preprocessing, training, evaluation, and optimization using real-world enterprise datasets.
            </p>
          </div>

          {/* Social Responsibility */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">Community Outreach</span>
              <span className="font-mono text-[9px] text-white/40">Dec 2024 — May 2025</span>
            </div>
            <h3 className="font-display font-bold text-base text-white">Virasat — Cultural Heritage Vault</h3>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              Student Social Responsibility (SSR) Project Coordinator: Led an AI-assisted multilingual digital archive spanning 8 languages to preserve coastal oral histories and folk traditions.
            </p>
          </div>
        </div>

        {/* Education timeline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: "#38bdf8" }}>
          <span style={{ width: 28, height: 1, background: "#38bdf8", display: "inline-block" }} />Academic Journey
        </motion.div>
        
        <motion.div variants={container} initial="hidden" animate="show" className="relative pl-7">
          <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, rgba(56,189,248,0.4), transparent)" }} />
          {academic.education.map((edu, i) => (
            <motion.div key={i} variants={item} whileHover={{ x: 4 }}
              className="relative rounded-2xl p-5 mb-3 transition-colors duration-200 cursor-default bg-white/[0.03] border border-white/[0.08]">
              <div className="absolute left-[-27px] top-6 w-[11px] h-[11px] rounded-full bg-black border-2 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase mb-1 text-sky-400/80">{edu.period}</div>
              <div className="font-display font-bold text-[16px] text-white mb-0.5">{edu.institution}</div>
              <div className="text-[13px] mb-2 text-white/60">{edu.degree}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[9px] uppercase text-white/30">{edu.location}</span>
                {edu.grade && <span className="font-display font-extrabold text-[15px] text-white">{edu.grade}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
