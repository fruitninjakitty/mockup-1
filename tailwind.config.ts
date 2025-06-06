
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
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      colors: {
        // Minimalist/classy grays and accents with consistent color scheme
        background: "#F8F7FA",
        card: "#FFFFFF",
        cardAccent: "#EEEEF7",
        foreground: "#403E43",
        primary: {
          DEFAULT: "#518CCA", // blue
          light: "#E2F0FA",
          dark: "#396078",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#43BC88", // green accent
          light: "#E6FAF0",
          dark: "#328A64",
          foreground: "#FFFFFF",
        },
        muted: { DEFAULT: "#F1F0FB", foreground: "#8E9196" },
        accent: { DEFAULT: "#E2F0FA", foreground: "#396078" },
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
