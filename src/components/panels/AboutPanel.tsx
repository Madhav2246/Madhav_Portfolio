"use client";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import type { AcademicData } from "@/lib/types";

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

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

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Label */}
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color:"#38bdf8" }}>
          <span style={{ width:28, height:1, background:"#38bdf8", display:"inline-block" }} />About Me
        </motion.div>

        <motion.h2 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
          className="font-display font-black tracking-[-0.04em] leading-none text-white mb-10"
          style={{ fontSize:"clamp(36px,5.5vw,68px)" }}>
          The Mind Behind<br />
          <span style={{ background:"linear-gradient(120deg,#fff 0%,#7dd3fc 55%,#38bdf8 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            the Machine
          </span>
        </motion.h2>

        {/* Animated stat pills */}
        <div ref={counterRef}>
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { label:"CGPA",        count: academic.currentCGPA, suffix:`/${academic.cgpaOutOf}` },
              { label:"Projects",    count: 10,  suffix:"+" },
              { label:"Hackathon Wins", count: 3, suffix:"" },
              { label:"Technologies",count: 30,  suffix:"+" },
            ].map(s => (
              <motion.div key={s.label} variants={item}
                whileHover={{ scale:1.05, y:-3 }}
                className="rounded-2xl p-5 text-center cursor-default"
                style={{ background:"rgba(56,189,248,0.06)", border:"1px solid rgba(56,189,248,0.2)", boxShadow:"0 4px 20px rgba(56,189,248,0.08)" }}>
                <div className="font-display font-black text-[30px] text-white leading-none" data-count={s.count}>0</div>
                <div className="font-mono text-[8px] tracking-[0.14em] uppercase mt-2" style={{ color:"rgba(56,189,248,0.7)" }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bio columns */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-5 mb-12">
          <motion.p variants={item} className="text-[16px] leading-[1.85]" style={{ color:"rgba(255,255,255,0.78)" }}>
            I&apos;m an <strong className="text-white">AI-focused software developer</strong> pursuing B.Tech in
            Computer Science with AI Specialization at{" "}
            <span className="text-white">Amrita Vishwa Vidyapeetham</span>{" "}
            (CGPA: {academic.currentCGPA}/{academic.cgpaOutOf}).
          </motion.p>
          <motion.p variants={item} className="text-[16px] leading-[1.85]" style={{ color:"rgba(255,255,255,0.78)" }}>
            Competed nationally at <span className="text-white">IIT Madras</span> and{" "}
            <span className="text-white">IISc Bengaluru</span>. Research interests:{" "}
            <strong className="text-white">LLM systems, GNNs, continual learning, and AI for science</strong>.
          </motion.p>
        </motion.div>

        {/* Education timeline */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4, duration:0.5 }}
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color:"#38bdf8" }}>
          <span style={{ width:28, height:1, background:"#38bdf8", display:"inline-block" }} />Education
        </motion.div>
        <motion.div variants={container} initial="hidden" animate="show" className="relative pl-7">
          <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background:"linear-gradient(to bottom, rgba(56,189,248,0.4), transparent)" }} />
          {academic.education.map((edu, i) => (
            <motion.div key={i} variants={item} whileHover={{ x:4 }}
              className="relative rounded-2xl p-6 mb-3 transition-colors duration-200 cursor-default"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <div className="absolute left-[-27px] top-6 w-[11px] h-[11px] rounded-full"
                   style={{ background:"#000", border:"2px solid #38bdf8", boxShadow:"0 0 10px rgba(56,189,248,0.5)" }} />
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase mb-1" style={{ color:"rgba(56,189,248,0.7)" }}>{edu.period}</div>
              <div className="font-display font-bold text-[17px] text-white mb-1">{edu.institution}</div>
              <div className="text-[14px] mb-2" style={{ color:"rgba(255,255,255,0.6)" }}>{edu.degree}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[9px] uppercase" style={{ color:"rgba(255,255,255,0.3)" }}>{edu.location}</span>
                {edu.grade && <span className="font-display font-extrabold text-[16px] text-white">{edu.grade}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
