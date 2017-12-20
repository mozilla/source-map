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
async function benchmark(name, setup, action) {
  __benchmarkResults = [];
  await setup();

  // Warm up the JIT.
  var start = Date.now();
  while ((Date.now() - start) < 5000 /* 5 seconds */) {
    await action();
  }

  var stats = new Stats("ms");

  console.profile(name);

  while ((Date.now() - start) < 60000 /* 60 seconds */) {
    console.time("iteration");
    var thisIterationStart = Date.now();
    await action();
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
    async function () {
      if (!smg) {
        var smc = await new sourceMap.SourceMapConsumer(testSourceMap);
        smg = sourceMap.SourceMapGenerator.fromSourceMap(smc);
        smc.destroy();
      }
    },
    function () {
      benchmarkBlackbox(smg.toString().length);
    }
  );
}

function benchmarkParseSourceMap() {
  return benchmark("parse source map", noop, async function () {
    var smc = await new sourceMap.SourceMapConsumer(testSourceMap);
    let numMappings = 0;
    smc.eachMapping(_ => numMappings++);
    if (numMappings !== EXPECTED_NUMBER_OF_MAPPINGS) {
      throw new Error("Expected " + EXPECTED_NUMBER_OF_MAPPINGS + " mappings, found "
                      + smc._generatedMappings.length);
    }
    benchmarkBlackbox(numMappings);
    smc.destroy();
  });
}
