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
        sans: ["var(--font-outfit)", "var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        display: ["var(--font-syne)", "var(--font-outfit)", "sans-serif"],
      },
      colors: {
        bg: "#06080d",
        "bg-card": "rgba(13, 17, 26, 0.75)",
        "bg-glass": "rgba(255, 255, 255, 0.03)",
        border: "rgba(255, 255, 255, 0.08)",
      },
      animation: {
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "ticker": "tickerScroll 40s linear infinite",
        "float-blob": "floatBlob 25s linear infinite",
        "spin-slow": "spinSlow 20s linear infinite",
        "aurora": "auroraFlow 15s ease infinite alternate",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.5" },
        },
        tickerScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        floatBlob: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "25%": { transform: "translate(40px,-30px) scale(1.05)" },
          "50%": { transform: "translate(-20px,50px) scale(0.95)" },
          "75%": { transform: "translate(30px,20px) scale(1.02)" },
          "100%": { transform: "translate(0,0) scale(1)" },
        },
        spinSlow: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        auroraFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
