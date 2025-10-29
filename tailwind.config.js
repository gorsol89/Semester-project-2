// tailwind.config.js
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./*.html",              // include all root html pages (profile.html, login.html, etc.)
    "./js/**/*.{js,ts}",     // include your JS files outside src
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        background: "#FFF8F0", // ivory
        surface: "#F4EDE2",    // cream (cards)
        foreground: "#232323", // ink (default text)
        border: "#E7DECF",     // warm subtle border

        // Brand & accents
        brand: { DEFAULT: "#2F5D3A", fg: "#FFFFFF" },
        accent: { DEFAULT: "#E3B34E", fg: "#232323" },
        danger: { DEFAULT: "#C83A3A", fg: "#FFF8F0" },
        neutral: { DEFAULT: "#6E5E55", fg: "#FFF8F0" },

        // Extra tokens (direct access)
        red: "#C83A3A",
        green: "#2F5D3A",
        brown: "#5A3A2C",
        warmgray: "#6E5E55",
        ivory: "#FFF8F0",
        cream: "#F4EDE2",
        ink: "#232323",
        gold: "#E3B34E",

        // ✅ Minimal aliases for existing classes you already use
        mushroom: {
          200: "#E7DECF", // matches "border"
          700: "#5A3A2C", // warm brown for headings/text
        },
      },
    },
  },
  plugins: [],
};
