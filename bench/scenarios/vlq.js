"use strict";

const b = require("benny");

const { SourceMapConsumerJS } = require("../../lib/source-map-consumer-js");
const { SourceMapConsumer } = require("../../lib/source-map-consumer");
const { ANGULAR_MIN_SOURCE_MAP } = require("../angular-min-source-map");
const { SCALA_JS_RUNTIME_SOURCE_MAP } = require("../scalajs-runtime-sourcemap");

exports["vlq-angular"] = () =>
  b.suite(
    "vlq-angular",
    b.add("parse VLQ angular string using source-map (JS)", async () => {
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
      return result;
    }),
    b.add(
      "parse VLQ angular string using source-map (JS, ephemeral)",
      async () => {
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
        return result;
      }
    ),
    b.add("parse VLQ angular string using source-map (rust/wasm)", async () => {
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
      return result;
    }),
    b.cycle(),
    b.complete()
  );

exports["vlq-scala"] = () =>
  b.suite(
    "vlq",
    b.add("parse VLQ scala string using source-map (JS)", async () => {
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
      return result;
    }),
    b.add(
      "parse VLQ scala string using source-map (JS, ephemeral)",
      async () => {
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
        return result;
      }
    ),
    b.add("parse VLQ scala string using source-map (rust/wasm)", async () => {
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
      return result;
    }),
    b.cycle(),
    b.complete()
  );

function autoRunScenario(m) {
  if (require.main === m) {
    (async () => {
      function formatSummary(summary) {
        return summary.results
          .map(result => {
            return `${summary.name}#${result.name} x ${result.ops} ops/sec ±${result.margin}% (${result.samples} runs sampled)`;
          })
          .join("\n");
      }

      for (const scenario of Object.values(m.exports)) {
        const outcome = await scenario();
        console.log(formatSummary(outcome));
      }
    })();
  }
}

autoRunScenario(module);
