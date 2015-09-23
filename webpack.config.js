var BannerPlugin = require("webpack/lib/BannerPlugin");
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");

var distDir = path.join(__dirname, "dist");

module.exports = [
  // Plain build.
  {
    entry: "./source-map.js",
    output: {
      path: distDir,
      filename: "source-map.js",
      library: "sourceMap",
      libraryTarget: "umd",
    },
  },

  // Debug build.
  {
    entry: "./source-map.js",
    output: {
      path: distDir,
      filename: "source-map.debug.js",
      library: "sourceMap",
      libraryTarget: "umd",
    },
    devtool: "#inline-source-map"
  },

  // Minified build.
  {
    entry: "./source-map.js",
    output: {
      path: distDir,
      filename: "source-map.min.js",
      library: "sourceMap",
      libraryTarget: "umd",
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ],
    devtool: "#source-map"
  }
];

/*** Build the tests for inclusion in mozilla-central. ************************/

var testFileRegex = /^test\-.*?\.js/;

function isTestFile(file) {
  return testFileRegex.test(file);
}

var testsDir = path.join(__dirname, "test");
var testFiles = fs.readdirSync(testsDir).filter(isTestFile);

// The xpcshell test harness expects a run_test function. Define this function
// and stringify it as banner at the top of each test file.
function run_test() {
  for (var k in SOURCE_MAP_TEST_MODULE) {
    if (/^test/.test(k)) {
      SOURCE_MAP_TEST_MODULE[k](assert);
    }
  }
}

testFiles.forEach(function (file) {
  module.exports.push({
    entry: path.join(testsDir, file),
    output: {
      path: path.join(distDir, "test"),
      filename: file.replace(/\-/g, "_"),
      library: "SOURCE_MAP_TEST_MODULE"
    },
    plugins: [
      new BannerPlugin(run_test.toString() + "\n\n", { raw: true })
    ],
    devtool: "#inline-source-map"
  });
});
