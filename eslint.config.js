const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended")

module.exports = {
  rules: {
    "no-console": "error",
  },
  // Any other config imports go at the top
  ...eslintPluginPrettierRecommended,
}
