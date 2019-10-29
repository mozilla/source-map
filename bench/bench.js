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

const now =
  typeof window === "object" && window.performance && window.performance.now
    ? () => window.performance.now()
    : () => now();

const yieldForTick =
  typeof setTimeout === "function" ? () => new Promise(resolve => setTimeout(resolve, 1)) : () => Promise.resolve();

// Benchmark running an action n times.
async function benchmark(setup, action, tearDown = () => {}) {
  __benchmarkResults = [];

  console.time("setup");
  await setup();
  console.timeEnd("setup");

  // Warm up the JIT.
  console.time("warmup");
  for (let i = 0; i < WARM_UP_ITERATIONS; i++) {
    await action();
    await yieldForTick();
  }
  console.timeEnd("warmup");

  const stats = new Stats("ms");

  for (let i = 0; i < BENCH_ITERATIONS; i++) {
    console.time("iteration");
    const thisIterationStart = now();
    await action();
    stats.take(now() - thisIterationStart);
    console.timeEnd("iteration");

    await yieldForTick();
  }

  await tearDown();
  return stats;
}

async function getTestMapping() {
  let smc = await new sourceMap.SourceMapConsumer(testSourceMap);

  let mappings = [];
  smc.eachMapping([].push, mappings, sourceMap.SourceMapConsumer.ORIGINAL_ORDER);

  let testMapping = mappings[Math.floor(mappings.length / 13)];
  smc.destroy();
  return testMapping;
}

var benchmarks = {
  "SourceMapGenerator#toString": () => {
    let smg;
    return benchmark(
      async function() {
        var smc = await new sourceMap.SourceMapConsumer(testSourceMap);
        smg = sourceMap.SourceMapGenerator.fromSourceMap(smc);
        smc.destroy();
      },
      () => {
        benchmarkBlackbox(smg.toString().length);
      }
    );
  },

  "set.first.breakpoint": () => {
    let testMapping;
    return benchmark(
      async function() {
        testMapping = await getTestMapping();
      },
      async function() {
        let smc = await new sourceMap.SourceMapConsumer(testSourceMap);

        benchmarkBlackbox(
          smc.allGeneratedPositionsFor({
            source: testMapping.source,
            line: testMapping.originalLine
          }).length
        );

        smc.destroy();
      }
    );
  },

  "first.pause.at.exception": () => {
    let testMapping;
    return benchmark(
      async function() {
        testMapping = await getTestMapping();
      },
      async function() {
        let smc = await new sourceMap.SourceMapConsumer(testSourceMap);

        benchmarkBlackbox(
          smc.originalPositionFor({
            line: testMapping.generatedLine,
            column: testMapping.generatedColumn
          })
        );

        smc.destroy();
      }
    );
  },

  "subsequent.setting.breakpoints": () => {
    let testMapping;
    let smc;
    return benchmark(
      async function() {
        testMapping = await getTestMapping();
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function() {
        benchmarkBlackbox(
          smc.allGeneratedPositionsFor({
            source: testMapping.source,
            line: testMapping.originalLine
          })
        );
      },
      function() {
        smc.destroy();
      }
    );
  },

  "subsequent.pausing.at.exceptions": () => {
    let testMapping;
    let smc;
    return benchmark(
      async function() {
        testMapping = await getTestMapping();
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function() {
        benchmarkBlackbox(
          smc.originalPositionFor({
            line: testMapping.generatedLine,
            column: testMapping.generatedColumn
          })
        );
      },
      function() {
        smc.destroy();
      }
    );
  },

  "parse.and.iterate": () => {
    return benchmark(noop, async function() {
      const smc = await new sourceMap.SourceMapConsumer(testSourceMap);

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
    });
  },

  "iterate.already.parsed": () => {
    let smc;
    return benchmark(
      async function() {
        smc = await new sourceMap.SourceMapConsumer(testSourceMap);
      },
      async function() {
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
      function() {
        smc.destroy();
      }
    );
  }
};
