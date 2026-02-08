import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
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
        // Studio Zemya custom colours
        terracotta: {
          DEFAULT: "hsl(var(--terracotta))",
          dark: "hsl(var(--terracotta-dark))",
          light: "hsl(var(--terracotta-light))",
        },
        ochre: {
          DEFAULT: "hsl(var(--ochre))",
          dark: "hsl(var(--ochre-dark))",
        },
        sage: {
          DEFAULT: "hsl(var(--sage))",
          light: "hsl(var(--sage-light))",
        },
        cream: "hsl(var(--cream))",
        "warm-gray": "hsl(var(--warm-gray))",
        "clay-brown": "hsl(var(--clay-brown))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "warm-sm": "0 1px 2px 0 rgba(139, 90, 43, 0.05)",
        warm: "0 1px 3px 0 rgba(139, 90, 43, 0.1), 0 1px 2px -1px rgba(139, 90, 43, 0.1)",
        "warm-md": "0 4px 6px -1px rgba(139, 90, 43, 0.1), 0 2px 4px -2px rgba(139, 90, 43, 0.1)",
        "warm-lg": "0 10px 15px -3px rgba(139, 90, 43, 0.1), 0 4px 6px -4px rgba(139, 90, 43, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
