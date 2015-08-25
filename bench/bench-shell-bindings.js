if (typeof load !== "function") {
  var fs = require("fs");
  var vm = require("vm");
  load = function(file) {
    var src = fs.readFileSync(file, "utf8");
    vm.runInThisContext(src);
  };
}

if (typeof print !== "function") {
  print = console.log.bind(console);
}

load("./scalajs-runtime-sourcemap.js");
load("./stats.js");
load("../dist/source-map.js");
load("./bench.js");

print("Parsing source map");
print(benchmarkParseSourceMap());
print();
print("Serializing source map");
print(benchmarkSerializeSourceMap());
