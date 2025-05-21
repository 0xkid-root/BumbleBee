import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import animatePlugin from "tailwindcss-animate"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          "light-foreground": "hsl(var(--primary-light-foreground))",
          dark: "hsl(var(--primary-dark))",
          "dark-foreground": "hsl(var(--primary-dark-foreground))",
        },

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
          "light-foreground": "hsl(var(--secondary-light-foreground))",
          dark: "hsl(var(--secondary-dark))",
          "dark-foreground": "hsl(var(--secondary-dark-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "hsl(var(--accent-light))",
          "light-foreground": "hsl(var(--accent-light-foreground))",
          dark: "hsl(var(--accent-dark))",
          "dark-foreground": "hsl(var(--accent-dark-foreground))",
        },

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },

        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },

        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Extended amber palette
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },

        // Extended honey palette
        honey: {
          50: "#FFF8E6",
          100: "#FFEFC4",
          200: "#FFE08A",
          300: "#FFD14D",
          400: "#FFC224",
          500: "#FFB300",
          600: "#E69F00",
          700: "#CC8C00",
          800: "#B37A00",
          900: "#996800",
          950: "#805700",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "var(--radius-xl)",
        xl: "var(--radius-lg)",
        "2xs": "var(--radius-sm)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
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
        shimmer: {
          from: { backgroundPosition: "0 0", transform: "translateX(-100%)" },
          to: { backgroundPosition: "-200% 0", transform: "translateX(100%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "hsl(var(--foreground))",
            h1: {
              color: "hsl(var(--foreground))",
            },
            h2: {
              color: "hsl(var(--foreground))",
            },
            h3: {
              color: "hsl(var(--foreground))",
            },
            h4: {
              color: "hsl(var(--foreground))",
            },
            a: {
              color: "hsl(var(--primary))",
              "&:hover": {
                color: "hsl(var(--primary-dark))",
              },
            },
            strong: {
              color: "hsl(var(--foreground))",
            },
            code: {
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.25rem",
              padding: "0.15rem 0.3rem",
            },
            blockquote: {
              borderLeftColor: "hsl(var(--primary) / 0.5)",
              color: "hsl(var(--muted-foreground))",
            },
          },
        },
      },
      backgroundImage: {
        "gradient-bumblebee":
          "linear-gradient(to right, hsl(var(--secondary)), hsl(var(--primary)), hsl(var(--secondary)))",
        "gradient-honey":
          "linear-gradient(to right, hsl(var(--accent-dark)), hsl(var(--accent)), hsl(var(--accent-light)))",
        "gradient-bee-stripes":
          "repeating-linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)) 10px, hsl(var(--secondary)) 10px, hsl(var(--secondary)) 20px)",
      },
    },
  },
  plugins: [animatePlugin, require("@tailwindcss/typography")],
} satisfies Config

export default config
