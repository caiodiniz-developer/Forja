import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Molten palette — the mandated brand colors, named by heat.
        ember: {
          900: "#d24e01",
          800: "#dc6601",
          700: "#e27602",
          600: "#e88504",
          500: "#ec9006",
          400: "#ee9f27",
          300: "#f1b04c",
          200: "#f5c77e",
        },
        // Foreground: a warm near-white. Beige text on brown read as sepia/muddy
        // and killed contrast — this keeps the warmth but lets copy stay crisp.
        cream: "#f5f3f1",
        // Sand: the original brand beige, kept for warm accents only (not text).
        sand: "#f9ddbc",
        // Surfaces: near-neutral charcoal with only a whisper of warmth, so the
        // ember accents actually pop instead of drowning in brown.
        iron: {
          950: "#0b0a09",
          900: "#131211",
          850: "#181716",
          800: "#211f1d",
          700: "#2d2a27",
        },
      },
      fontFamily: {
        display: ['"Clash Display"', "system-ui", "sans-serif"],
        sans: ['"Satoshi"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(232, 133, 4, 0.55)",
        "glow-lg": "0 0 120px -20px rgba(220, 102, 1, 0.6)",
        ember: "0 20px 60px -24px rgba(210, 78, 1, 0.5)",
      },
      backgroundImage: {
        "molten":
          "linear-gradient(135deg, #d24e01 0%, #e27602 40%, #ec9006 70%, #f1b04c 100%)",
        "molten-soft":
          "linear-gradient(120deg, #e88504 0%, #ee9f27 50%, #f5c77e 100%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        shimmer: "shimmer 2.5s infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
