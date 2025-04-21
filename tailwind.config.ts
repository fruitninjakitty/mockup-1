
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Minimalist/classy grays and accents
        background: "#F8F7FA",
        card: "#FFFFFF",
        cardAccent: "#EEEEF7",
        foreground: "#403E43",
        primary: {
          DEFAULT: "#9b87f5", // purple
          light: "#E5DEFF",
          dark: "#6E59A5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#43BC88", // green accent
          light: "#F2FCE2",
          dark: "#307A5B",
          foreground: "#FFFFFF",
        },
        muted: { DEFAULT: "#F1F0FB", foreground: "#8E9196" },
        accent: { DEFAULT: "#E5DEFF", foreground: "#6E59A5" },
        softgray: "#F4F4F6",
        border: "#E7E6EB",
        destructive: {
          DEFAULT: "#ff6363",
          foreground: "#fff",
        },
        popover: "#fff",
      },
      borderRadius: {
        lg: "1.25rem",
        md: "1rem",
        sm: "0.5rem"
      },
      boxShadow: {
        'classy': '0 4px 24px 0 rgba(38, 50, 56, 0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: "0", transform: "translateY(16px)" },
          '100%': { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) both'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

