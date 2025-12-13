import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      
      // React rules
      "react-hooks/exhaustive-deps": "off",
      "react/no-unescaped-entities": "off",
      
      // General rules
      "prefer-const": "off",
      "no-unused-vars": "off",
      "no-console": "off",
    },
  },
];

export default eslintConfig;