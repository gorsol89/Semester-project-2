// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Base
        background: "#FFF8F0",     // ivory
        surface: "#F4EDE2",        // cream (cards)
        foreground: "#232323",     // ink (default text)
        border: "#E7DECF",         // warm subtle border

        // Brand & accents (your exact swatches)
        brand: {                   // primary actions
          DEFAULT: "#2F5D3A",     // green
          fg: "#FFFFFF",          // text on brand
        },
        accent: {                  // highlights/timers/CTAs
          DEFAULT: "#E3B34E",     // gold
          fg: "#232323",          // text on accent
        },
        danger: { DEFAULT: "#C83A3A", fg: "#FFF8F0" }, // error, destructive
        neutral: { DEFAULT: "#6E5E55", fg: "#FFF8F0" },// muted text/badges

        // Extra tokens (optional direct access)
        red: "#C83A3A",
        green: "#2F5D3A",
        brown: "#5A3A2C",
        warmgray: "#6E5E55",
        ivory: "#FFF8F0",
        cream: "#F4EDE2",
        ink: "#232323",
        gold: "#E3B34E",
      },
    },
  },
  plugins: [],
};
