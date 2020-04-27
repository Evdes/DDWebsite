"use strict";

const path = require("path");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "main.js",
  },
  devtool: "source-map",
  devServer: {
    stats: {
      children: false,
      maxModules: 0,
    },
    port: 3001,

    contentBase: ["./dist", "./src"],
    hot: true,
  },
  externals: {
    vscode: "commonjs vscode",
  },
  resolve: {
    extensions: [".js"],
  },
 };
