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
        // Backgrounds — se schimbă automat cu dark mode via CSS vars
        surface:  "var(--color-surface)",   // background pagină
        card:     "var(--color-card)",       // carduri, panouri
        navbar:   "var(--color-navbar)",     // navbar background
        modal:    "var(--color-modal)",      // modal background

        // Text
        content:  "var(--color-content)",   // text principal
        muted:    "var(--color-muted)",     // text secundar / subtitluri

        // Accent
        primary:  "var(--color-primary)",   // #FF5C00 — butoane, highlight-uri
        "primary-hover": "var(--color-primary-hover)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
