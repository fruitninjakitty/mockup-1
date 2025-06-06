
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
        background: "var(--background)",
        card: "var(--card)",
        cardAccent: "var(--card-accent)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: { 
          DEFAULT: "var(--muted)", 
          foreground: "#8E9196" 
        },
        accent: { 
          DEFAULT: "var(--accent)", 
          foreground: "#396078" 
        },
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--primary)",
        destructive: {
          DEFAULT: "#ff6363",
          foreground: "#fff",
        },
        popover: "var(--card)",
        "popover-foreground": "var(--foreground)",
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
