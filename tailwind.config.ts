import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/styles/**/*.{ts,tsx,css}", "./src/lib/**/*.{ts,tsx}", "./src/utils/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00629B",
          dark: "#147AAD",
          light: "#00AEEF",
          navy: "#180D43"
        },
        cyan: {
          DEFAULT: "#00AEEF",
          soft: "#00B5E2"
        },
        accent: "#FFC72A",
        warning: "#ED7522",
        surface: "#EBEBEB",
        "surface-strong": "#E6E7E7",
        border: "#E6E7E7"
      },
      fontFamily: {
        heading: ['"Open Sans"', "Arial", "Helvetica", "system-ui", "sans-serif"],
        body: ['"Open Sans"', "Arial", "Helvetica", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "1.5rem"
      },
      boxShadow: {
        glow: "0 20px 60px -25px rgba(15,118,255,0.6)",
        "inner-card": "inset 0 1px 0 0 rgba(255,255,255,0.08)"
      },
      backgroundImage: {
        aurora: "radial-gradient(120% 120% at 0% 0%, rgba(14,165,233,0.35) 0%, rgba(15,118,255,0.15) 45%, transparent 70%), radial-gradient(160% 140% at 100% 20%, rgba(147,51,234,0.25) 0%, transparent 60%)",
        grid: "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 0), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 0)"
      },
      animation: {
        "pulse-slow": "pulse 6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
