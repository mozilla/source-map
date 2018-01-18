var path = require("path");
var webpack = require("webpack");

var distDir = path.join(__dirname, "dist");

module.exports = [
  // Web build.
  {
    entry: "./source-map.js",
    output: {
      path: distDir,
      filename: "source-map.js",
      library: "sourceMap",
      libraryTarget: "umd",
    },
    externals: [
      "fs",
      "path",
    ]
  }
];
