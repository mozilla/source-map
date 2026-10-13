/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const { SourceMapConsumer } = require("../lib/source-map-consumer");
const { SourceMapGenerator } = require("../lib/source-map-generator");

function section(offset, source, positions) {
  const generator = new SourceMapGenerator();
  for (const [column, generated] of positions.entries()) {
    generator.addMapping({
      source,
      original: { line: 1, column },
      generated,
    });
  }
  return { offset, map: generator.toJSON() };
}

async function withSections(firstLine, nextLine, positions, callback) {
  const consumer = await new SourceMapConsumer({
    version: 3,
    sections: [
      section({ line: 4, column: 3 }, "first.js", positions),
      section({ line: nextLine, column: 10 }, "second.js", [
        { line: 1, column: 0 },
      ]),
    ],
  });
  try {
    await callback(consumer, firstLine);
  } finally {
    consumer.destroy();
  }
}

const readers = {
  generatedPositionFor(consumer) {
    return [
      consumer.generatedPositionFor({
        source: "first.js",
        line: 1,
        column: 0,
      }),
    ];
  },
  allGeneratedPositionsFor(consumer) {
    return consumer.allGeneratedPositionsFor({
      source: "first.js",
      line: 1,
      column: 0,
    });
  },
  eachMapping(consumer) {
    const mappings = [];
    consumer.eachMapping(mapping => {
      if (mapping.source === "first.js") {
        mappings.push({
          line: mapping.generatedLine,
          column: mapping.generatedColumn,
          lastColumn: mapping.lastGeneratedColumn,
        });
      }
    });
    return mappings;
  },
};

for (const [name, read] of Object.entries(readers)) {
  exports["test " + name + " clips spans after applying section line offsets"] =
    async function (assert) {
      // Cover both the section's first line (which has a column offset) and
      // a later line (which only has a line offset).
      for (const localLine of [1, 2]) {
        await withSections(
          4 + localLine,
          3 + localLine,
          [{ line: localLine, column: 2 }],
          async (consumer, globalLine) => {
            consumer.computeColumnSpans();
            const positions = read(consumer);
            assert.equal(positions.length, 1);
            assert.equal(positions[0].line, globalLine);
            assert.equal(positions[0].column, localLine === 1 ? 5 : 2);
            assert.equal(positions[0].lastColumn, 9);
          }
        );
      }
    };

  exports["test " + name + " preserves spans before a later section line"] =
    async function (assert) {
      await withSections(5, 5, [{ line: 1, column: 2 }], async consumer => {
        consumer.computeColumnSpans();
        assert.equal(read(consumer)[0].lastColumn, Infinity);
      });
    };

  exports["test " + name + " preserves finite spans"] = async function (
    assert
  ) {
    await withSections(
      5,
      4,
      [
        { line: 1, column: 2 },
        { line: 1, column: 6 },
      ],
      async consumer => {
        consumer.computeColumnSpans();
        assert.equal(read(consumer)[0].lastColumn, 8);
      }
    );
  };
  exports["test " + name + " preserves uncomputed terminal spans"] =
    async function (assert) {
      await withSections(5, 4, [{ line: 1, column: 2 }], async consumer => {
        assert.equal(read(consumer)[0].lastColumn, null);
      });
    };
}
