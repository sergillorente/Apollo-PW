const parser = require("@typescript-eslint/parser");

module.exports = {
  files: ["**/*.ts", "**/*.tsx"], // Include TypeScript files
  languageOptions: {
    parser, // Use the imported parser object
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      project: "./tsconfig.json", // Ensure this points to your TypeScript config
    },
  },
  plugins: {
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
  },
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
