/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        volt: "#C8F400",
        ember: "#FF4D1C",
        carbon: "#0A0A0A",
        graphite: "#141414",
        steel: "#1E1E1E",
        mist: "#2A2A2A",
      },
      animation: {
        pulse2: "pulse2 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "slide-up": "slideUp 0.4s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      keyframes: {
        pulse2: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};