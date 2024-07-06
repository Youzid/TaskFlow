import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        main: "#5866DD",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideup: "slideup 0.8s ease-in-out",
        slidedown: "slidedown 0.8s ease-in-out ",
        slideright: "slideright 0.3s ease-in-out",
        slideleft: "slideleft 0.3s ease-in-out",
        slowfade: "slowfade 0.2s ease-in-out  ",
        slowfade2: "slowfade 1s  ease-in-out  ",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slowfade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slowfade2: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideup: {
          from: { opacity: "0", transform: "translateY(25%)" },
          to: { opacity: "1", transform: "translateY(0%)" },
        },
        slidedown: {
          from: { opacity: "0", transform: "translateY(-25%)" },
          to: { opacity: "1", transform: "translateY(0%)" },
        },
        slideright: {
          from: { opacity: "0", transform: "translateX(25%)" },
          to: { opacity: "1", transform: "translateX(0%)" },
        },
        slideleft: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(25%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
