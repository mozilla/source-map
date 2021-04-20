"use strict";

const b = require("benny");

const { decodeMapping } = require("../../lib/decode");
const { SourceMapConsumer } = require("../../lib/source-map-consumer");
const { ANGULAR_MIN_SOURCE_MAP } = require("../angular-min-source-map");

function formatSummary(summary) {
  return summary.results
    .map(result => {
      return `${summary.name}#${result.name} x ${result.ops} ops/sec ±${result.margin}% (${result.samples} runs sampled)`;
    })
    .join("\n");
}

function copyToInt32(arr) {
  const result = new Int32Array(arr.length * 6);
  let offset = 0;
  for (const mapping of arr) {
    result.set(mapping, offset, 6);
    offset += 6;
  }
  return result;
}

class Mapping {
  constructor(
    generatedLine,
    generatedColumn,
    source,
    originalLine,
    originalColumn,
    name
  ) {
    this.generatedLine = generatedLine;
    this.generatedColumn = generatedColumn;

    this.source = source;
    this.originalLine = originalLine;
    this.originalColumn = originalColumn;

    this.name = name;
  }
}

class SourceMapConsumerJS {
  constructor(arr, sources, names) {
    this._arr = arr;
    this._byGeneratedOrder = null;
    this._byOriginalOrder = null;

    this._sources = sources;
    this._names = names;
  }

  _getByOrder() {
    if (this._byGeneratedOrder === null) {
      this._arr.sort((x, y) => x[0] - y[0]);
      this._byGeneratedOrder = copyToInt32(this._arr);
    }
    return this._byGeneratedOrder;
  }

  eachMapping(fn) {
    const byOrder = this._getByOrder();
    const len = byOrder.length;
    for (let idx = 0; idx < len; idx += 6) {
      fn(
        new Mapping(
          /* generatedLine=*/ byOrder[idx],
          /* generatedColumn=*/ byOrder[idx + 1],
          /* source=*/ byOrder[idx + 2] === -1
            ? null
            : this._sources[byOrder[idx + 2]],
          /* sourceLine=*/ byOrder[idx + 3],
          /* sourceColumn=*/ byOrder[idx + 4],
          /* name=*/ byOrder[idx + 5] === -1
            ? null
            : this._names[byOrder[idx + 5]]
        )
      );
    }
  }

  static async with(rawMap, mapURL, fn) {
    const map = new SourceMapConsumerJS(
      decodeMapping(rawMap.mappings),
      rawMap.sources,
      rawMap.names
    );
    fn(map);
  }
}

module.exports = async () => {
  return b.suite(
    "vlq",
    b.add("parse VLQ string using source-map (JS)", async () => {
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
    b.add("parse VLQ string using source-map (rust/wasm)", async () => {
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
};

if (require.main === module) {
  module
    .exports()
    .then(formatSummary)
    .then(console.log);
}
