import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F2E8",
        porcelain: "#FFFDF8",
        ink: "#20251E",
        olive: "#253B2D",
        moss: "#557151",
        palm: "#78926A",
        champagne: "#C4A66A",
        sand: "#D8CBB8",
        stone: "#B8ADA0",
        clay: "#A5654D",
        dusk: "#30352E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(32, 37, 30, 0.12)",
        line: "inset 0 0 0 1px rgba(37, 59, 45, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
