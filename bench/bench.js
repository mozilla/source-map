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

const now = typeof window === "object" && window.performance && window.performance.now
      ? () => window.performance.now()
      : () => now();

// Benchmark running an action n times.
async function benchmark(setup, action, tearDown = () => {}) {
  __benchmarkResults = [];
  await setup();

  // Warm up the JIT.
  for (let i = 0; i < WARM_UP_ITERATIONS; i++) {
    await action();
  }

  var stats = new Stats("ms");

  for (let i = 0; i < BENCH_ITERATIONS; i++) {
    console.time("iteration");
    var thisIterationStart = now();
    await action();
    stats.take(now() - thisIterationStart);
    console.timeEnd("iteration");
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await tearDown();
  return stats;
}

const TEST_MAPPING = {
  generatedLine: 32994,
  generatedColumn: 23,
  source: "file:///Users/kraman/workspace/scala-js/scalalib/source/src/library/scala/Tuple2.scala",
  originalLine: 19,
  originalColumn: 11,
  name: "$ScalaJSEnvironment"
};

var benchmarks = {
  "SourceMapGenerator#toString": () => {
    var smg = null;
    benchmark(
      async function () {
        var smc = await new sourceMap.SourceMapConsumer(testSourceMap);
        smg = sourceMap.SourceMapGenerator.fromSourceMap(smc);
        smc.destroy();
      },
      () => {
        benchmarkBlackbox(smg.toString().length);
      }
    );
  },

  "set first breakpoint (parse + query-by-original-location)": () => benchmark(
    noop,
    async function () {
      var smc = await new sourceMap.SourceMapConsumer(testSourceMap);

      benchmarkBlackbox(smc.allGeneratedPositionsFor({
        source: TEST_MAPPING.source,
        line: TEST_MAPPING.originalLine,
      }).length);

      smc.destroy();
    }
  ),

  "first pause at exception (parse + query-by-generated-location)": () => benchmark(
    noop,
    async function () {
      var smc = await new sourceMap.SourceMapConsumer(testSourceMap);

      benchmarkBlackbox(smc.originalPositionFor({
        line: TEST_MAPPING.generatedLine,
        column: TEST_MAPPING.generatedColumn,
      }));

      smc.destroy();
    }
  ),

  "subsequent setting breakpoints (already parsed; query-by-original-location)": () => {
    var smc;
    return benchmark(
      async function () {
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function () {
        benchmarkBlackbox(smc.allGeneratedPositionsFor({
          source: TEST_MAPPING.source,
          line: TEST_MAPPING.originalLine,
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
          line: TEST_MAPPING.generatedLine,
          column: TEST_MAPPING.generatedColumn,
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
