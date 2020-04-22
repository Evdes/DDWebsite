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
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: "style-loader",
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: "css-loader",
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: "postcss-loader",
            options: {
              plugins: function () {
                return [require("autoprefixer")];
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
