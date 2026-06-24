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
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      colors: {
        bg: "#000000",
        "bg-2": "#080808",
        // Monochrome scale
        "w-5":  "rgba(255,255,255,0.05)",
        "w-8":  "rgba(255,255,255,0.08)",
        "w-12": "rgba(255,255,255,0.12)",
        "w-20": "rgba(255,255,255,0.20)",
        "w-30": "rgba(255,255,255,0.30)",
        "w-50": "rgba(255,255,255,0.50)",
        "w-70": "rgba(255,255,255,0.70)",
        // Keep semantic names pointing to monochrome equivalents
        blue:    "rgba(255,255,255,0.8)",
        violet:  "rgba(255,255,255,0.65)",
        cyan:    "rgba(255,255,255,0.55)",
        emerald: "rgba(255,255,255,0.75)",
        amber:   "rgba(255,255,255,0.6)",
        rose:    "rgba(200,100,100,0.8)",
      },
      animation: {
        "pulse-dot":  "pulseDot 2s ease-in-out infinite",
        "ticker":     "tickerScroll 40s linear infinite",
        "float-blob": "floatBlob 25s linear infinite",
        "spin-slow":  "spinSlow 20s linear infinite",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.6" },
        },
        tickerScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floatBlob: {
          "0%":   { transform: "translate(0,0) scale(1)" },
          "25%":  { transform: "translate(40px,-30px) scale(1.05)" },
          "50%":  { transform: "translate(-20px,50px) scale(0.95)" },
          "75%":  { transform: "translate(30px,20px) scale(1.02)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
