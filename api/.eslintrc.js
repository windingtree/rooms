module.exports = {
  // Specifies the ESLint parser
  parser: "@typescript-eslint/parser",

  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2020,

    // Allows for the use of imports
    sourceType: "module",

    project: "./tsconfig.json"
  },
  settings: {},
  extends: [
    // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "no-throw-literal": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "no-trailing-spaces": [
      "error", {
        "skipBlankLines": false,
        "ignoreComments": false
      }
    ],
    "no-tabs": [
      "error", {
        allowIndentationTabs: false
      }
    ],
    "eol-last": ["error", "always"]
  },
}
