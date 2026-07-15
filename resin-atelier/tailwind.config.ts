import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      opacity: {
        8: "0.08",
        12: "0.12",
        15: "0.15",
      },
      colors: {
        cream: {
          50: "#FFFDFB",
          100: "#FBF6EF",
          200: "#F7EEE1",
          300: "#F1E3CE",
          400: "#E8D3B4",
          500: "#DBBE93",
        },
        blush: {
          50: "#FDF3F5",
          100: "#F9E2E7",
          200: "#F3CBD5",
          300: "#EAAABB",
          400: "#DE84A0",
          500: "#C96585",
          600: "#A94A69",
        },
        lavender: {
          50: "#F7F4FC",
          100: "#ECE4F8",
          200: "#DBCBF0",
          300: "#C3ACE3",
          400: "#A886D1",
          500: "#8C67B8",
          600: "#6F4F97",
        },
        gold: {
          50: "#FBF6E9",
          100: "#F3E4B8",
          200: "#E8CD84",
          300: "#DBB758",
          400: "#C9A03D",
          500: "#AD8730",
          600: "#8A6A25",
        },
        ink: {
          50: "#F7F5F3",
          100: "#E9E3DE",
          400: "#7A6F68",
          600: "#4C433D",
          800: "#2E2722",
          900: "#1D1815",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(80, 56, 40, 0.12)",
        card: "0 8px 30px -10px rgba(80, 56, 40, 0.18)",
        gold: "0 0 0 1px rgba(201, 160, 61, 0.35)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;