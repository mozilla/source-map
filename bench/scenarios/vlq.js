"use strict";

// Trying to trick benchmark's global detection.
(0, eval)("globalThis.window = globalThis");

const { Suite, formatNumber } = require("benchmark");

const { SourceMapConsumerJS } = require("../../lib/source-map-consumer-js");
const { SourceMapConsumer } = require("../../lib/source-map-consumer");
const { ANGULAR_MIN_SOURCE_MAP } = require("../angular-min-source-map");
const { SCALA_JS_RUNTIME_SOURCE_MAP } = require("../scalajs-runtime-sourcemap");

exports["vlq-angular"] = new Suite("vlq-angular")
  .add(
    "source-map (JS)",
    async deferred => {
      const result = await SourceMapConsumerJS.with(
        ANGULAR_MIN_SOURCE_MAP,
        "https://example.test",
        consumer => {
          let count = 0;
          consumer.eachMapping(() => {
            ++count;
          });
          return count;
        }
      );
      deferred.resolve(result);
    },
    { defer: true }
  )
  .add(
    "source-map (JS, ephemeral)",
    async deferred => {
      const result = await SourceMapConsumerJS.with(
        ANGULAR_MIN_SOURCE_MAP,
        "https://example.test",
        consumer => {
          let count = 0;
          consumer.eachEphemeralMapping(() => {
            ++count;
          });
          return count;
        }
      );
      deferred.resolve(result);
    },
    { defer: true }
  )
  .add(
    "source-map (rust/wasm)",
    async deferred => {
      const result = await SourceMapConsumer.with(
        ANGULAR_MIN_SOURCE_MAP,
        "https://example.test",
        consumer => {
          let count = 0;
          consumer.eachMapping(() => {
            ++count;
          });
          return count;
        }
      );
      deferred.resolve(result);
    },
    { defer: true }
  );

exports["vlq-scala"] = new Suite("vlq-scala")
  .add(
    "source-map (JS)",
    async deferred => {
      const result = await SourceMapConsumerJS.with(
        SCALA_JS_RUNTIME_SOURCE_MAP,
        "https://example.test",
        consumer => {
          let count = 0;
          consumer.eachMapping(() => {
            ++count;
          });
          return count;
        }
      );
      deferred.resolve(result);
    },
    { defer: true }
  )
  .add(
    "source-map (JS, ephemeral)",
    async deferred => {
      const result = await SourceMapConsumerJS.with(
        SCALA_JS_RUNTIME_SOURCE_MAP,
        "https://example.test",
        consumer => {
          let count = 0;
          consumer.eachEphemeralMapping(() => {
            ++count;
          });
          return count;
        }
      );
      deferred.resolve(result);
    },
    { defer: true }
  )
  .add(
    "source-map (rust/wasm)",
    async deferred => {
      const result = await SourceMapConsumer.with(
        SCALA_JS_RUNTIME_SOURCE_MAP,
        "https://example.test",
        consumer => {
          let count = 0;
          consumer.eachMapping(() => {
            ++count;
          });
          return count;
        }
      );
      deferred.resolve(result);
    },
    { defer: true }
  );

function autoRunScenario(m) {
  if (require.main === m) {
    (async () => {
      const wasmSource = require("../../lib/mappings.wasm");
      await SourceMapConsumer.initialize({ "lib/mappings.wasm": wasmSource });

      if (typeof print === 'undefined' && typeof console !== 'undefined') {
        globalThis.print = console.log.bind(console);
      }

      for (const suite of Object.values(m.exports)) {
        print(suite.name);
        const done = new Promise((resolve, reject) => {
          suite.on("complete", resolve);
          suite.on("error", reject);
        });
        suite.on("cycle", event => {
          const benchmark = event.target;
          const {
            name,
            hz,
            cycles,
            stats: { rme }
          } = benchmark;
          print(
            ` * #${name} x ${formatNumber(hz)} ops/sec ±${formatNumber(
              rme
            )}% (${cycles} runs sampled)`
          );
        });
        suite.run({ async: true });
        await done;
        print("Fastest is " + suite.filter("fastest").map("name"));
      }
    })();
  }
}

autoRunScenario(module);
