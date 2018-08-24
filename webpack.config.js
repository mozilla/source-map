const path = require("path");
const webpack = require("webpack");

const distDir = path.join(__dirname, "dist");

module.exports = [
  // Web build.
  {
    entry: "./source-map.js",
    mode: "production",
    output: {
      path: distDir,
      filename: "source-map.js",
      library: "sourceMap",
      libraryTarget: "umd",
      // Needed for the build to work in both browser and webworker
      // until webpack gains a "universal" target.
      globalObject: "this",
    },
    externals: [
      "fs",
      "path",
    ],
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: "javascript/auto",
          // arraybuffer-loader would be much more convenient, but it
          // pulls an unnecessary Node.js Buffer polyfill into the
          // bundle.
          use: "base64-loader",
        },
      ],
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /lib\/read-wasm\.js$/,
        "./read-wasm-browser.js",
      ),
    ],
  }
];
