"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Web Audio API procedural sound engine for zero-dependency realistic audio!
class CricketAudio {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Crisp willow bat hitting leather ball
  playBatCrack(power = 1) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320 * power, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio fallback
    }
  }

  // Crowd cheer on 4s and 6s
  playCheer() {
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Audio fallback
    }
  }

  // Stumps crashing
  playOut() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Audio fallback
    }
  }
}

const audio = new CricketAudio();

type ShotType = "cover-drive" | "pull-shot" | "straight-loft" | "helicopter" | "late-cut";

interface ShotOption {
  id: ShotType;
  name: string;
  desc: string;
  risk: "Low" | "Medium" | "High";
  bonus: string;
}

const SHOTS: ShotOption[] = [
  { id: "cover-drive", name: "Cover Drive 🏏", desc: "Classic timing & placement through the covers", risk: "Low", bonus: "High 4s chance" },
  { id: "straight-loft", name: "Straight Loft 🚀", desc: "Down the ground over the bowler's head", risk: "Medium", bonus: "Huge 6s potential" },
  { id: "pull-shot", name: "Aggressive Pull 💥", desc: "Powerful swivel towards mid-wicket boundary", risk: "Medium", bonus: "Balanced power" },
  { id: "helicopter", name: "MS Dhoni Helicopter 🚁", desc: "Signature wrist whip off the yorker", risk: "High", bonus: "Maximum 6s reward" },
  { id: "late-cut", name: "Steering Late Cut 🎯", desc: "Deft touch past the slips and third man", risk: "Low", bonus: "Consistent runs" },
];

export default function MiniCricketGame() {
  const [selectedShot, setSelectedShot] = useState<ShotType>("straight-loft");
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [fours, setFours] = useState(0);
  const [sixes, setSixes] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSuperOver, setIsSuperOver] = useState(true);
  const [target] = useState(19); // Super over target
  const [gameState, setGameState] = useState<"ready" | "bowling" | "hit" | "out" | "gameover">("ready");
  const [timing, setTiming] = useState(50);
  const [lastOutcome, setLastOutcome] = useState<{ runs: number; text: string; subText: string; isSix?: boolean; isFour?: boolean; isWicket?: boolean } | null>(null);
  const [commentary, setCommentary] = useState<string[]>([
    "🎙️ Welcome to Madhav's Super Over Challenge! 6 Balls, 19 Runs to win!",
    "🏏 Time your swing perfectly when the meter enters the green sweet spot.",
  ]);

  const timingRef = useRef<number>(50);
  const animFrameRef = useRef<number | null>(null);
  const directionRef = useRef<number>(1);
  const speedRef = useRef<number>(2.4);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("madhav_cricket_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Timing meter animation
  useEffect(() => {
    if (gameState === "bowling") {
      const loop = () => {
        timingRef.current += directionRef.current * speedRef.current;
        if (timingRef.current >= 100) {
          timingRef.current = 100;
          directionRef.current = -1;
        } else if (timingRef.current <= 0) {
          timingRef.current = 0;
          directionRef.current = 1;
        }
        setTiming(Math.round(timingRef.current));
        animFrameRef.current = requestAnimationFrame(loop);
      };
      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState]);

  // Start delivery
  const bowlDelivery = () => {
    if (gameState === "bowling") return;
    if (isSuperOver && (balls >= 6 || wickets >= 2)) {
      resetGame();
      return;
    }
    setLastOutcome(null);
    setGameState("bowling");
    timingRef.current = Math.random() * 20;
    speedRef.current = 2.2 + Math.random() * 1.6; // Variable bowler speeds (Pace / Spin)
  };

  // Play the shot
  const playShot = useCallback(() => {
    if (gameState !== "bowling") return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const hitTiming = timingRef.current; // 0 to 100, sweet spot is 45 to 65
    const sweetDistance = Math.abs(hitTiming - 55); // 0 is perfect

    let scored = 0;
    let isWicket = false;
    let comment = "";
    let sub = "";

    if (sweetDistance <= 8) {
      // Perfect timing
      audio.playBatCrack(1.4);
      audio.playCheer();
      if (selectedShot === "straight-loft" || selectedShot === "helicopter") {
        scored = 6;
        comment = "💥 MAXIMUM! MASSIVE SIX OVER THE ROOF!";
        sub = "Sweet middle of the bat! 108m monster hit!";
      } else {
        scored = 4;
        comment = "🏏 FOUR! Pierces the gap with surgical precision!";
        sub = "Pure textbook perfection and timing!";
      }
    } else if (sweetDistance <= 20) {
      // Good timing
      audio.playBatCrack(1.1);
      if (selectedShot === "helicopter" && sweetDistance > 14) {
        // High risk shot missed slightly
        scored = 1;
        comment = "⚡ Spliced shot! Falls safely in no-man's land.";
        sub = "1 Run taken quickly.";
      } else if (selectedShot === "cover-drive" || selectedShot === "late-cut") {
        scored = 4;
        audio.playCheer();
        comment = "🔥 FOUR! Glorious stroke racing past the boundary!";
        sub = "Superb wristwork!";
      } else {
        scored = 2;
        comment = "🏃 Two runs! Great running between the wickets.";
        sub = "Placed well into deep midwicket.";
      }
    } else if (sweetDistance <= 35) {
      // Edged / Early / Late
      audio.playBatCrack(0.8);
      scored = 1;
      comment = "🎯 Edged and steered down to third man for a single.";
      sub = "Good hustle to retain strike.";
    } else {
      // Mistimed completely - Wicket chance
      if (Math.random() > 0.3) {
        audio.playOut();
        isWicket = true;
        comment = "🔴 OUT! Bowled him / Caught at the boundary!";
        sub = "Misjudged the timing completely!";
      } else {
        scored = 0;
        comment = "⚪ Dot ball! Beaten by pace and swing.";
        sub = "Play and a miss.";
      }
    }

    const newBalls = balls + 1;
    const newRuns = runs + scored;
    const newWickets = wickets + (isWicket ? 1 : 0);
    const newFours = fours + (scored === 4 ? 1 : 0);
    const newSixes = sixes + (scored === 6 ? 1 : 0);

    setBalls(newBalls);
    setRuns(newRuns);
    setWickets(newWickets);
    if (scored === 4) setFours(newFours);
    if (scored === 6) setSixes(newSixes);

    if (newRuns > highScore) {
      setHighScore(newRuns);
      try {
        localStorage.setItem("madhav_cricket_highscore", String(newRuns));
      } catch {
        // Ignore
      }
    }

    setLastOutcome({
      runs: scored,
      text: comment,
      subText: sub,
      isSix: scored === 6,
      isFour: scored === 4,
      isWicket,
    });

    setCommentary(prev => [`[Ball ${newBalls}] ${comment}`, ...prev.slice(0, 4)]);

    if (isSuperOver && (newBalls >= 6 || newWickets >= 2)) {
      setGameState("gameover");
    } else if (isWicket) {
      setGameState("out");
    } else {
      setGameState("hit");
    }
  }, [balls, fours, gameState, highScore, isSuperOver, runs, selectedShot, sixes, wickets]);

  const resetGame = () => {
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setFours(0);
    setSixes(0);
    setGameState("ready");
    setLastOutcome(null);
    setCommentary([
      "🎙️ New Super Over Match! Target: 19 runs off 6 balls.",
      "🏏 Select your shot type and smash the bowler!",
    ]);
  };

  return (
    <div className="w-full rounded-2xl p-6 md:p-8 relative overflow-hidden"
         style={{
           background: "linear-gradient(135deg, rgba(16,36,25,0.92) 0%, rgba(10,18,14,0.95) 100%)",
           border: "1px solid rgba(52,211,153,0.25)",
           boxShadow: "0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(52,211,153,0.15)",
         }}>

      {/* Stadium ambient lights */}
      <div className="absolute -top-24 left-1/4 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute -bottom-24 right-1/4 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Header & Scoreboard HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-emerald-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Match · Madhav&apos;s Super Over 🏏
          </div>
          <h3 className="font-display font-black text-2xl text-white mt-1">
            Stadium Arcade <span className="text-emerald-400">T20</span>
          </h3>
        </div>

        {/* Live Scorecard Box */}
        <div className="flex items-center gap-4 bg-black/50 border border-emerald-500/30 rounded-xl px-5 py-3">
          <div className="text-center">
            <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-400/70">Score</div>
            <div className="font-display font-black text-2xl text-white">
              {runs}<span className="text-emerald-400">/{wickets}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-emerald-500/20" />
          <div className="text-center">
            <div className="font-mono text-[9px] uppercase tracking-wider text-white/50">Balls</div>
            <div className="font-display font-bold text-xl text-white">
              {balls}<span className="text-white/40">{isSuperOver ? "/6" : ""}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-emerald-500/20" />
          <div className="text-center">
            <div className="font-mono text-[9px] uppercase tracking-wider text-white/50">Need</div>
            <div className="font-display font-bold text-xl text-amber-400">
              {Math.max(0, target - runs)} <span className="text-[10px] text-white/40">runs</span>
            </div>
          </div>
          <div className="w-px h-8 bg-emerald-500/20" />
          <div className="text-center hidden sm:block">
            <div className="font-mono text-[9px] uppercase tracking-wider text-sky-400/70">High Score</div>
            <div className="font-display font-bold text-xl text-sky-300">
              {highScore}
            </div>
          </div>
        </div>
      </div>

      {/* Main Pitch & Batting Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-6">
        
        {/* Visual 2.5D Pitch Simulation */}
        <div className="lg:col-span-7 bg-black/60 rounded-xl p-5 border border-white/10 relative overflow-hidden flex flex-col items-center justify-between min-h-[260px]">
          
          {/* Pitch grass stripes & crease */}
          <div className="w-full max-w-[320px] h-44 rounded-lg relative my-auto flex flex-col items-center justify-between p-3"
               style={{
                 background: "linear-gradient(180deg, #1e3a1e 0%, #2d5a2d 50%, #d4a373 95%)",
                 boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
                 border: "1px solid rgba(255,255,255,0.15)",
               }}>
            
            {/* Stumps at bowler end */}
            <div className="flex gap-1 items-end">
              <span className="w-1 h-4 bg-amber-200 rounded-t" />
              <span className="w-1 h-4 bg-amber-200 rounded-t" />
              <span className="w-1 h-4 bg-amber-200 rounded-t" />
            </div>

            {/* Ball animation when bowling */}
            {gameState === "bowling" && (
              <motion.div
                initial={{ y: -60, scale: 0.5, opacity: 0.8 }}
                animate={{ y: 70, scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeIn" }}
                className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.9)] border border-white/40"
              />
            )}

            {/* Outcome Celebration Banner */}
            <AnimatePresence>
              {lastOutcome && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-lg p-4 text-center z-10"
                >
                  <div className={`font-display font-black text-3xl mb-1 ${
                    lastOutcome.isSix ? "text-amber-400 animate-bounce" :
                    lastOutcome.isFour ? "text-emerald-400" :
                    lastOutcome.isWicket ? "text-red-400" : "text-white"
                  }`}>
                    {lastOutcome.isSix ? "SIX! 💥" :
                     lastOutcome.isFour ? "FOUR! 🏏" :
                     lastOutcome.isWicket ? "WICKET! 🔴" :
                     `${lastOutcome.runs} RUNS`}
                  </div>
                  <p className="font-sans text-xs text-white/80 font-medium">{lastOutcome.text}</p>
                  <span className="font-mono text-[10px] text-white/50 mt-1">{lastOutcome.subText}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Batting Crease & Batsman Stance */}
            <div className="w-full flex items-center justify-between border-t-2 border-white/60 pt-2 px-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏏</span>
                <span className="font-mono text-[10px] text-white/80 uppercase font-semibold">Madhav (Striker)</span>
              </div>
              <div className="flex gap-1 items-end">
                <span className="w-1 h-5 bg-amber-200 rounded-t" />
                <span className="w-1 h-5 bg-amber-200 rounded-t" />
                <span className="w-1 h-5 bg-amber-200 rounded-t" />
              </div>
            </div>
          </div>

          {/* Interactive Timing Gauge */}
          <div className="w-full mt-3">
            <div className="flex justify-between font-mono text-[9px] text-white/60 mb-1">
              <span>EARLY ❌</span>
              <span className="text-emerald-400 font-bold">PERFECT SWEET SPOT 🎯</span>
              <span>LATE ❌</span>
            </div>
            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden relative border border-white/20">
              {/* Sweet spot marker */}
              <div className="absolute left-[45%] right-[45%] inset-y-0 bg-emerald-500/80 rounded shadow-[0_0_8px_#10b981]" />
              <div className="absolute left-[35%] right-[35%] inset-y-0 bg-emerald-500/30 rounded" />
              
              {/* Animated Needle */}
              <div
                className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_#fff] rounded transition-all duration-75"
                style={{ left: `calc(${timing}% - 4px)` }}
              />
            </div>
          </div>
        </div>

        {/* Shot Selection & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/50">
            Choose Your Signature Shot:
          </div>

          <div className="flex flex-col gap-2">
            {SHOTS.map(shot => (
              <button
                key={shot.id}
                onClick={() => setSelectedShot(shot.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150 ${
                  selectedShot === shot.id
                    ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_16px_rgba(52,211,153,0.25)]"
                    : "bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <div>
                  <div className="font-sans font-bold text-sm text-white">{shot.name}</div>
                  <div className="text-[11px] text-white/40">{shot.desc}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-emerald-300">
                    {shot.risk} Risk
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Action Button */}
          {gameState === "ready" || gameState === "hit" || gameState === "out" ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={bowlDelivery}
              className="mt-2 w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-widest font-black text-black transition-all"
              style={{
                background: "linear-gradient(135deg, #34d399, #38bdf8)",
                boxShadow: "0 4px 20px rgba(52,211,153,0.4)",
              }}
            >
              Bowl Next Ball ⚡
            </motion.button>
          ) : gameState === "bowling" ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={playShot}
              className="mt-2 w-full py-4 px-6 rounded-xl font-mono text-sm uppercase tracking-widest font-black text-white bg-red-600 animate-pulse transition-all shadow-[0_0_25px_rgba(239,68,68,0.7)]"
            >
              SWING BAT NOW! 🏏
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className="mt-2 w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-widest font-black text-black bg-amber-400 hover:bg-amber-300 transition-all"
            >
              Play Again / Rematch 🔁
            </motion.button>
          )}
        </div>
      </div>

      {/* Commentary & Game Over Banner */}
      <div className="bg-black/40 rounded-xl p-4 border border-white/10">
        <div className="font-mono text-[9px] tracking-widest uppercase text-emerald-400 mb-2">
          🎙️ Live Commentary & Audio Feed
        </div>
        <div className="space-y-1">
          {commentary.map((c, i) => (
            <div key={i} className={`font-mono text-xs ${i === 0 ? "text-white font-semibold" : "text-white/40"}`}>
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Game Over Modal / Result */}
      {gameState === "gameover" && (
        <div className="mt-4 p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-black text-xl text-white">
              {runs >= target ? "🏆 VICTORY! Super Over Won!" : "MATCH TIED / DEFEAT!"}
            </h4>
            <p className="text-xs text-white/70">
              {runs >= target
                ? `Incredible hitting! Chased down ${target} runs in just 6 deliveries with ${sixes} Sixes and ${fours} Fours!`
                : `Scored ${runs}/${wickets} in 6 balls. Needed ${target} runs.`}
            </p>
          </div>
          <button
            onClick={resetGame}
            className="px-5 py-2.5 rounded-lg bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-emerald-300"
          >
            Play New Match 🏏
          </button>
        </div>
      )}
    </div>
  );
}
