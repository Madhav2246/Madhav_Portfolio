"use client";

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private isUnlocked = false;

  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Ensure AudioContext is unlocked by browser on user interaction
  unlock() {
    this.init();
    if (this.ctx && !this.isUnlocked) {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    }
  }

  // Crisp futuristic UI blip sound (audible and clear)
  playClick() {
    try {
      this.unlock();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio errors
    }
  }

  // Deep cinematic swish / swoop sound for section changes & reveals
  playSwish() {
    try {
      this.unlock();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore audio errors
    }
  }

  // Deep gold synth chord pulse for research sandbox & achievements
  playCinematicPulse() {
    try {
      this.unlock();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Root note (A2 = 110Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);

      // Harmonizing fifth (E3 = 164.8Hz) for rich cinematic tone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(164.81, now);
      osc2.frequency.exponentialRampToValueAtTime(329.63, now + 0.35);

      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.35);
    } catch {
      // Ignore audio errors
    }
  }
}

export const proceduralAudio = new ProceduralAudioEngine();
