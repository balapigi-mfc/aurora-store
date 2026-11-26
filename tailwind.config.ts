import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12100E",
        paper: "#FAF7F2",
        clay: "#C4552F",
        sand: "#E7DFD3",
        moss: "#3F4A3C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 40px -24px rgba(18, 16, 14, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
