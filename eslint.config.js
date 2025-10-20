// eslint.config.mjs
import globals from "globals";
import js from "@eslint/js";

/** Minimal, SP2-only ESLint (browser app + Node for config files) */
export default [
  js.configs.recommended,
  {
    ignores: ["dist/**", ".vite/**", "node_modules/**", "build/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
    },
  },
  {
    files: ["vite.config.*", "tailwind.config.*", "postcss.config.*", "*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
