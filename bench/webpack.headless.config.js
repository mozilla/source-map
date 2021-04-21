"use strict";

const path = require("path");
const distDir = path.join(__dirname, "dist");

module.exports = {
  entry: "./scenarios/vlq.js",
  mode: "production",
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.wasm$/i,
        type: "javascript/auto",
        loaders: ["arraybuffer-loader"]
      }
    ]
  },
  output: {
    path: distDir,
    filename: "bench.js"
  }
};
