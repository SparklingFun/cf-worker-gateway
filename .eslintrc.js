module.exports = {
  env: {
    browser: true,
    es2021: true,
    worker: true,
    serviceworker: true,
  },
  extends: [
    "airbnb-base",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended" // This is for warnings
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "func-names": "off",
    "consistent-return": "off",
    "no-param-reassign": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      // Ignore missing extension
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "operator-linebreak": "off",
    // Not adjustable config
    "import/prefer-default-export": "off",
    "no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],
  },
};
