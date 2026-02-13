import path from "path"
import { fileURLToPath } from "url"
import typescriptParser from "@typescript-eslint/parser"
import React from "eslint-plugin-react"
import globals from "globals"
import { defineConfig, globalIgnores } from "@eslint/config-helpers"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import nextVitals from 'eslint-config-next/core-web-vitals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compatWithRecommended = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})
export default defineConfig([
  ...nextVitals,
  {
    extends: compatWithRecommended.extends(
      "plugin:react/recommended",
    ),
    plugins: {
      React,
    },
    languageOptions: {
      globals: {
        fetch: true,
        navigator: true,
        __DEV__: true,
        XMLHttpRequest: true,
        React$Element: true,
        Generator: true,
        ...globals.es6,
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2017,
        ecmaFeatures: { jsx: true },
      },
      sourceType: "module",
      parser: typescriptParser,
    },
    rules: {
      semi: ["error", "never"],
      "no-case-declarations": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unused-prop-types": "warn",
      "react/no-unknown-property": [2, { ignore: ["jsx"] }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": ["off", { caughtErrors: "none" }],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'dist/**',
  ]),
])
