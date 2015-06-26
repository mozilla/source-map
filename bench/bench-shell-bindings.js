load("./scalajs-runtime-sourcemap.js");
load("./stats.js");
load("../dist/source-map.js");
load("./bench.js");

print("Parsing source map");
print(benchmarkParseSourceMap());
print();
print("Serializing source map");
print(benchmarkSerializeSourceMap());
