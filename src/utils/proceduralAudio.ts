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

  // Crisp futuristic UI blip sound
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

  // Soft crystalline falling / tumbling drop sound for scroll & 3D shapes
  playDropSound() {
    try {
      this.unlock();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio errors
    }
  }

  // Deep cinematic swish / swoop sound for section changes
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

  // 3-Second Epic "Ussshhh" Portal Warp Sound Synthesis
  playPortalWarpSound() {
    try {
      this.unlock();
      if (!this.ctx) return;

      const duration = 3.0;
      const now = this.ctx.currentTime;

      // White Noise Buffer for the "Ussshhh" wind / portal airflow
      const bufferSize = this.ctx.sampleRate * duration;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Filter for sweeping lowpass frequency
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(3500, now + 1.8);
      filter.frequency.exponentialRampToValueAtTime(150, now + duration);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.5, now + 1.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);

      // Sub-bass cinematic engine rumble
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(160, now + 1.5);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + duration);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.exponentialRampToValueAtTime(0.4, now + 1.0);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + duration);
    } catch {
      // Ignore audio errors
    }
  }

  // Deep gold synth chord pulse
  playCinematicPulse() {
    try {
      this.unlock();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

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
    } catch {
      // Ignore audio errors
    }
  }
}

export const proceduralAudio = new ProceduralAudioEngine();
