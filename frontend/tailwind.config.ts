import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        card: "#131b2e",
        border: "#1e293b",
        primary: "#38bdf8",
        danger: "#ef4444",
        warning: "#f97316",
        success: "#22c55e",
      },
    },
  },
  plugins: [],
};
export default config;
