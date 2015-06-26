function noop() {}

if (typeof console === "undefined") {
  console = {};
}
if (!console.time) {
  console.time = console.timeEnd = noop;
}
if (!console.profile) {
  console.profile = console.profileEnd = noop;
}

// Ensure that benchmarks don't get optimized away by calling this blackbox
// function in your benchmark's action.
var __benchmarkResults = [];
var benchmarkBlackbox = [].push.bind(__benchmarkResults);

// Benchmark running an action n times.
function benchmark(name, setup, action) {
  __benchmarkResults = [];
  setup();

  // Warm up the JIT.
  var start = Date.now();
  while ((Date.now() - start) < 5000 /* 5 seconds */) {
    action();
  }

  var stats = new Stats("ms");

  console.profile(name);

  while ((Date.now() - start) < 30000 /* 30 seconds */) {
    console.time("iteration");
    var thisIterationStart = Date.now();
    action();
    stats.take(Date.now() - thisIterationStart);
    console.timeEnd("iteration");
  }

  console.profileEnd(name);

  return stats;
}

var EXPECTED_NUMBER_OF_MAPPINGS = 2350714;

var smg = null;

function benchmarkSerializeSourceMap() {
  return benchmark(
    "serialize source map",
    function () {
      if (!smg) {
        var smc = new sourceMap.SourceMapConsumer(testSourceMap);
        smg = sourceMap.SourceMapGenerator.fromSourceMap(smc);
      }
    },
    function () {
      benchmarkBlackbox(smg.toString());
    }
  );
}

function benchmarkParseSourceMap() {
  return benchmark("parse source map", noop, function () {
    var smc = new sourceMap.SourceMapConsumer(testSourceMap);
    if (smc._generatedMappings.length !== EXPECTED_NUMBER_OF_MAPPINGS) {
      throw new Error("Expected " + EXPECTED_NUMBER_OF_MAPPINGS + " mappings, found "
                      + smc._generatedMappings.length);
    }
    benchmarkBlackbox(smc._generatedMappings.length);
  });
}
