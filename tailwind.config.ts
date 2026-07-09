import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: "#26282c",
          panel: "#303338",
          panel2: "#3a3d43",
          border: "#4c4f56",
          cyan: "#39f4ff",
          cyan2: "#0ff0fc",
          blue: "#2d8fff",
          amber: "#ffb020",
          red: "#ff5c78",
          green: "#28ffb0",
          dim: "#a3a6ac",
          ink: "#f2f3f5",
        },
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 8px rgba(57,244,255,0.55), 0 0 24px rgba(57,244,255,0.25)",
        "glow-sm": "0 0 4px rgba(57,244,255,0.5)",
        "glow-red": "0 0 8px rgba(255,92,120,0.55), 0 0 24px rgba(255,92,120,0.25)",
        "glow-amber": "0 0 8px rgba(255,176,32,0.5), 0 0 24px rgba(255,176,32,0.2)",
        "glow-green": "0 0 8px rgba(40,255,176,0.5), 0 0 24px rgba(40,255,176,0.2)",
        panel: "0 4px 30px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "hud-grid":
          "linear-gradient(rgba(57,244,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(57,244,255,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(57,244,255,0.12), transparent 60%)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        scan: "scan 4s linear infinite",
        flicker: "flicker 2.5s infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.6" },
          "94%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
