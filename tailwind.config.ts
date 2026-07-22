import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/styles/**/*.{ts,tsx,css}", "./src/lib/**/*.{ts,tsx}", "./src/utils/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00629B",
          dark: "#004f7d",
          light: "#00AEEF",
          navy: "#0d1b3e"
        },
        cyan: {
          DEFAULT: "#00AEEF",
          soft: "#00B5E2"
        },
        accent: "#FFC72A",
        warning: "#ED7522",
        surface: "#F8FAFC",
        "surface-alt": "#F1F5F9",
        "surface-strong": "#E2E8F0",
        border: "#E2E8F0"
      },
      fontFamily: {
        heading: ["Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(0,98,155,0.4)",
        card: "0 4px 24px -4px rgba(15,23,42,0.08), 0 1px 4px -1px rgba(15,23,42,0.06)",
        "card-hover": "0 20px 48px -12px rgba(15,23,42,0.16), 0 4px 8px -2px rgba(15,23,42,0.08)",
        "inner-card": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
        "glow-blue": "0 0 60px -15px rgba(0,174,239,0.5)"
      },
      backgroundImage: {
        "grid-slate": "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 0), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 0)"
      },
      animation: {
        "pulse-slow": "pulse 6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" }
        },
        shimmer: {
          from: { backgroundPosition: "-200% center" },
          to: { backgroundPosition: "200% center" }
        }
      }
    }
  },
  plugins: []
};

export default config;
