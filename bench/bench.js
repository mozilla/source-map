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
async function benchmark(setup, action, tearDown = () => {}) {
  __benchmarkResults = [];
  await setup();

  // Warm up the JIT.
  var start = Date.now();
  while ((Date.now() - start) < 5000 /* 5 seconds */) {
    await action();
  }

  var stats = new Stats("ms");

  while ((Date.now() - start) < 20000 /* 60 seconds */) {
    console.time("iteration");
    var thisIterationStart = Date.now();
    await action();
    stats.take(Date.now() - thisIterationStart);
    console.timeEnd("iteration");
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await tearDown();
  return stats;
}

var EXPECTED_NUMBER_OF_MAPPINGS = 1;

var smg = null;

var benchmarks = {
  "SourceMapGenerator#toString": () => benchmark(
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
  ),

  "set first breakpoint (parse + query-by-original-location)": () => benchmark(
    noop,
    async function () {
      var smc = await new sourceMap.SourceMapConsumer(testSourceMap);

      benchmarkBlackbox(smc.allGeneratedPositionsFor({
        source: smc.sources[0],
        line: 1,
      }));

      smc.destroy();
    }
  ),

  "first pause at exception (parse + query-by-generated-location)": () => benchmark(
    noop,
    async function () {
      var smc = await new sourceMap.SourceMapConsumer(testSourceMap);

      benchmarkBlackbox(smc.originalPositionFor({
        line: 1,
        column: 0,
      }));

      smc.destroy();
    }
  ),

  "subsequent setting breakpoints (already parsed; query-by-original-location)": () => {
    var smc
    return benchmark(
      async function () {
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function () {
        benchmarkBlackbox(smc.allGeneratedPositionsFor({
          source: smc.sources[0],
          line: 1,
        }));
      },
      function () {
        smc.destroy();
      }
    )
  },

  "subsequent pauses at exception (already parsed; query-by-generated-location)": () => {
    var smc;
    return benchmark(
      async function () {
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function () {
        benchmarkBlackbox(smc.originalPositionFor({
          line: 1,
          column: 0,
        }));
      },
      function () {
        smc.destroy();
      }
    );
  },

  "parse + iterating over all mappings": () => {
    return benchmark(
      noop,
      async function () {
        var smc = await new sourceMap.SourceMapConsumer(testSourceMap);

        let maxLine = 0;
        let maxCol = 0;
        smc.eachMapping(m => {
          maxLine = Math.max(maxLine, m.generatedLine);
          maxLine = Math.max(maxLine, m.originalLine);
          maxCol = Math.max(maxCol, m.generatedColumn);
          maxCol = Math.max(maxCol, m.originalColumn);
        });
        benchmarkBlackbox(maxLine);
        benchmarkBlackbox(maxCol);

        smc.destroy();
      }
    );
  },

  "already parsed; iterating over all mappings": () => {
    var smc;
    return benchmark(
      async function () {
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function () {
        let maxLine = 0;
        let maxCol = 0;
        smc.eachMapping(m => {
          maxLine = Math.max(maxLine, m.generatedLine);
          maxLine = Math.max(maxLine, m.originalLine);
          maxCol = Math.max(maxCol, m.generatedColumn);
          maxCol = Math.max(maxCol, m.originalColumn);
        });
        benchmarkBlackbox(maxLine);
        benchmarkBlackbox(maxCol);
      },
      function () {
        smc.destroy();
      }
    );
  }
};
