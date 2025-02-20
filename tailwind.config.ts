import {heroui} from '@heroui/theme';
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const { fontFamily } = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "// Or if using `src` directory:\\n    \\\"./src/**/*.{js,ts,jsx,tsx}\\\"",
    "./node_modules/@heroui/theme/dist/components/(chip|table|checkbox|form|spacer).js"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        bronze: "#8C5726",
        bankGradient: "#0179FE",
        Tomato: "#FF6347",
        SteelBlue: "#4682B4",
        LimeGreen: "#32CD32",
        Gold: "#FFD700",
        MediumPurple: "#9370DB",
        Teal: "#008080",
        SaddleBrown: "#8B4513",
        RoyalBlue: "#4169E1",
        LightSalmon: "#FFA07A",
        DarkOliveGreen: "#556B2F",
        Purple: "#800080",
        LightSeaGreen: "#20B2AA",
        HotPink: "#FF69B4",
        Navy: "#000080",
        "celtic-green": "#006400",
        "red-dark": " #8B0000",
        "light-blue": "#8661a6",
        "deep-purple": "#6610f2",
        "contrast-text": "#FFD700",
        "warm-coral": "#ff6f61",
        "soothing-aqua": "#5f9ea0",
        primary: {
          500: "#FF7000",
          100: "#FFF1E6",
        },
        dark: {
          100: "#000000",
          200: "#0F1117",
          300: "#151821",
          400: "#212734",
          500: "#101012",
          600: "#76828D",
          700: "#ABB8C4",
        },
        "muted-foreground": "#adb5bd",
        light: {
          900: "#FFFFFF",
          800: "#F4F6F8",
          850: "#FDFDFD",
          700: "#DCE3F1",
          500: "#7B8EC8",
          400: "#858EAD",
        },
        "sky-blue": "#1DA1F2",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      boxShadow: {
        input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
        "light-100":
          "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
        "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
        "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
        "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
        "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
        chart:
          "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
      },

      screens: {
        xs: "420px",
        "2xl": "2000px",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"),require("@tailwindcss/typography"),addVariablesForColors,heroui()],
};
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
