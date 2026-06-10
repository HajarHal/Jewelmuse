import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Jewel Muse — échantillonnée sur le logo
        ivory: "#F7F1E9",
        cream: "#FBF6EF",
        ink: "#271819", // brun-bordeaux très foncé (texte)
        stone: "#7C6A62",
        burgundy: {
          DEFAULT: "#7A1E22",
          deep: "#5C1418",
          soft: "#A8474B",
        },
        // « champagne » : l'or rosé du mot « Jewel » du logo.
        // Conservé sous la clé `gold` pour rester compatible avec le code existant.
        gold: {
          DEFAULT: "#C9A47C",
          deep: "#AE8154",
          soft: "#E7D3BB",
        },
        champagne: {
          DEFAULT: "#C9A47C",
          deep: "#AE8154",
          soft: "#E7D3BB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Jost", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      maxWidth: {
        site: "1240px",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fade: "fade 1.2s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
