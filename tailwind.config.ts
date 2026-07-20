import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fbf5ec",
        ivory: "#fffaf3",
        linen: "#efe1cf",
        taupe: "#b7936d",
        gold: "#b88a43",
        chocolate: "#3b2114",
        espresso: "#20120c",
        sage: "#7f8a6b",
        rose: "#b47b72",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Arial", "sans-serif"],
        script: ["Parisienne", "cursive"],
      },
      boxShadow: {
        premium: "0 24px 70px rgba(59, 33, 20, 0.12)",
      },
      borderRadius: {
        boutique: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
