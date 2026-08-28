import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-outfit)", "var(--font-jakarta)", "sans-serif"],
        mono:    ["var(--font-space-mono)", "monospace"],
        display: ["var(--font-syne)", "var(--font-outfit)", "sans-serif"],
      },
      colors: {
        void:   "#050507",
        deep:   "#0a0a0f",
        gold:   "#d4a847",
        "gold-dim": "#a07830",
        amber:  "#f59e0b",
        "text-warm": "#f0ead6",
      },
      animation: {
        "pulse-gold": "pulseGold 2.4s ease-in-out infinite",
        "ticker":     "tickerScroll 40s linear infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "spin-slow":  "spinSlow 20s linear infinite",
        "fade-up":    "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.5", transform: "scale(1.5)" },
        },
        tickerScroll: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
