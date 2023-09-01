const { resolve } = require('path');

module.exports = {
  presets: ["@babel/preset-typescript"],
  plugins: [resolve(__dirname, '../babel-plugin-jsx-uimo')]
}