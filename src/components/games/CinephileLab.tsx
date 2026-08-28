"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MovieRecommendation, TriviaQuestion } from "@/lib/types";

interface Props {
  recommendations: MovieRecommendation[];
  trivia: TriviaQuestion[];
  directors: string[];
}

export default function CinephileLab({ recommendations, trivia, directors }: Props) {
  const [activeTab, setActiveTab] = useState<"vibe-matcher" | "trivia" | "aesthetics">("vibe-matcher");
  const [selectedVibe, setSelectedVibe] = useState<string>("all");
  
  // Trivia state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const filteredMovies = selectedVibe === "all"
    ? recommendations
    : recommendations.filter(m => m.vibe === selectedVibe);

  const currentQuestion = trivia[currentQIndex] || trivia[0];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setShowExplanation(true);
    if (index === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setCurrentQIndex((prev) => (prev + 1) % trivia.length);
  };

  return (
    <div className="w-full rounded-2xl p-6 md:p-8 relative overflow-hidden"
         style={{
           background: "linear-gradient(135deg, rgba(20,12,30,0.92) 0%, rgba(10,8,20,0.95) 100%)",
           border: "1px solid rgba(168,85,247,0.25)",
           boxShadow: "0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(168,85,247,0.15)",
         }}>

      {/* Cinematic ambient glow */}
      <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-purple-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-purple-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Cinephile Lounge · Multi-Genre &amp; Prabhas Salaar 🦖⚔️
          </div>
          <h3 className="font-display font-black text-2xl text-white mt-1">
            Cinema <span className="text-purple-400">Lab</span> &amp; Vision
          </h3>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-black/50 border border-purple-500/30 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("vibe-matcher")}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all ${
              activeTab === "vibe-matcher"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            All Genres 🎞️
          </button>
          <button
            onClick={() => setActiveTab("trivia")}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all ${
              activeTab === "trivia"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Trivia Quiz ({score}/{trivia.length}) 🧠
          </button>
          <button
            onClick={() => setActiveTab("aesthetics")}
            className={`px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all ${
              activeTab === "aesthetics"
                ? "bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            Directors 🎥
          </button>
        </div>
      </div>

      {/* Tab 1: Vibe Matcher */}
      {activeTab === "vibe-matcher" && (
        <div>
          {/* Mood Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "all", label: "All Genres & Epics 🌟" },
              { id: "epic", label: "Pan-Indian & Mass Epics 🦖" },
              { id: "mindbender", label: "Sci-Fi Mindbender 🌀" },
              { id: "thriller", label: "Psychological Thriller ⚡" },
            ].map(vibe => (
              <button
                key={vibe.id}
                onClick={() => setSelectedVibe(vibe.id)}
                className={`font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg border transition-all ${
                  selectedVibe === vibe.id
                    ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-bold"
                    : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                }`}
              >
                {vibe.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMovies.map(movie => (
              <motion.div
                key={movie.id}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-black/50 border border-white/10 hover:border-purple-500/40 rounded-xl p-5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      {movie.year} · {movie.rating}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-white/40">
                      {movie.vibe}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                    {movie.title}
                  </h4>
                  <p className="font-mono text-[10px] text-white/50 mb-3">
                    Directed by <span className="text-white/80">{movie.director}</span>
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {movie.genre.map(g => (
                      <span key={g} className="font-mono text-[8px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                        {g}
                      </span>
                    ))}
                  </div>

                  <p className="font-sans text-xs text-white/70 leading-relaxed italic border-l-2 border-purple-500/40 pl-3">
                    &ldquo;{movie.takeaway}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive Cinema Trivia */}
      {activeTab === "trivia" && (
        <div className="max-w-2xl mx-auto bg-black/60 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400">
              Question {currentQIndex + 1} of {trivia.length}
            </span>
            <span className="font-mono text-xs text-white/60">
              Current Score: <strong className="text-purple-300">{score}</strong>
            </span>
          </div>

          <div className="mb-6">
            {currentQuestion.context && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block mb-1">
                Context: {currentQuestion.context}
              </span>
            )}
            <h4 className="font-display font-semibold text-lg text-white leading-snug">
              {currentQuestion.quoteOrQuestion}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {currentQuestion.options.map((opt, i) => {
              const isChosen = selectedOption === i;
              const isCorrect = i === currentQuestion.answer;
              let btnStyle = "bg-white/[0.04] border-white/10 text-white hover:bg-white/[0.08]";
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                } else if (isChosen) {
                  btnStyle = "bg-red-500/20 border-red-500 text-red-300";
                } else {
                  btnStyle = "bg-white/[0.02] border-white/5 text-white/30";
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(i)}
                  className={`w-full p-3.5 rounded-xl border text-left font-sans text-xs transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <span>✅</span>}
                  {isAnswered && isChosen && !isCorrect && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation Box & Next Button */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-purple-950/40 border border-purple-500/30 mb-4"
              >
                <div className="font-mono text-[9px] uppercase tracking-wider text-purple-300 font-bold mb-1">
                  Cinephile Insight:
                </div>
                <p className="text-xs text-white/80">{currentQuestion.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {isAnswered && (
            <button
              onClick={nextQuestion}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
            >
              {currentQIndex === trivia.length - 1 ? "Restart / Play Again 🎬" : "Next Question →"}
            </button>
          )}
        </div>
      )}

      {/* Tab 3: Directors & Aesthetics */}
      {activeTab === "aesthetics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {directors.map((dir, i) => (
            <div
              key={dir}
              className="bg-black/50 border border-white/10 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-[9px] uppercase tracking-wider text-purple-400 mb-2">
                  Visionary #{i + 1}
                </div>
                <h4 className="font-display font-bold text-base text-white mb-2">{dir}</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {dir === "Prashanth Neel"
                    ? "Atmospheric high-contrast black & coal aesthetics, relentless decibel design, towering hero elevation, and deep Khansaar lore."
                    : dir === "Christopher Nolan"
                    ? "Non-linear timelines, IMAX practical physics, Shepard tone auditory tension, and existential stakes."
                    : dir === "S.S. Rajamouli"
                    ? "Monumental emotional staging, larger-than-life mythological scale, unstoppable character arcs, and cinematic grandeur."
                    : dir === "Denis Villeneuve"
                    ? "Slow-burn contemplation, brutalist architecture framing, and immersive acoustic tension."
                    : dir === "David Fincher"
                    ? "Single-pixel tracking, dark desaturated green-blue palettes, obsession with procedural mastery."
                    : "Sharp rhythmic dialogue, chapter structures, and kinetic stylized energy."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
