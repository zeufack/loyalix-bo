import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  {
    ignores: [".next/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        module: "readonly",
      },
    },
    plugins: {
      typescript: tseslint.plugin,
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "typescript/explicit-module-boundary-types": "off",
      "no-undef": "off", // Temporarily disable no-undef
      "react/no-unknown-property": ["error", { "ignore": ["cmdk-input-wrapper"] }],
      "react/prop-types": "off", // Disable prop-types rule
      "@typescript-eslint/no-unused-vars": "off", // Disable no-unused-vars
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];