import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: { DEFAULT: "#183a5b", 900: "#0d2238", 800: "#132f4b", 700: "#183a5b", 600: "#24507a" },
        cream: { DEFAULT: "#f5f1e9", 50: "#fbf8f2" },
        sand: "#ece4d5",
        brass: { DEFAULT: "#bc9359", light: "#d4b383", dark: "#9a7642" },
        espresso: "#362014",
        line: "#d6ccbc",
        muted: "#5a6776",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(3rem, 8.5vw, 7.5rem)", { lineHeight: "0.92", letterSpacing: "-0.02em" }],
        "display": ["clamp(2.5rem, 5.5vw, 4.75rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
        "title": ["clamp(1.9rem, 3.4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
      },
      letterSpacing: { eyebrow: "0.28em" },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(18px)" }, "100%": { opacity: "1", transform: "none" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(.2,.7,.2,1) both",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
