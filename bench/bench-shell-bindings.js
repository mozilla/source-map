if (typeof load !== "function") {
  var fs = require("fs");
  var vm = require("vm");
  load = function(file) {
    var src = fs.readFileSync(file, "utf8");
    vm.runInThisContext(src, { filename: file });
  };
}

if (typeof print !== "function") {
  print = function (x = "") {
    console.log(`${x}`);
  };
}

sourceMap = require("../source-map.js");
load("./scalajs-runtime-sourcemap.js");
load("./stats.js");
load("./bench.js");

(async function () {
  print("Parsing source map");
  print(await benchmarkParseSourceMap());
  print();
  print("Serializing source map");
  print(await benchmarkSerializeSourceMap());
}());
