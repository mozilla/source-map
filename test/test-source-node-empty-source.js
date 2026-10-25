/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const { SourceNode, SourceMapGenerator, SourceMapConsumer } = require("../source-map");

function assertData(assert, actual, expected) {
  if (expected !== null && typeof expected === "object") {
    assert.strictEqual(Array.isArray(actual), Array.isArray(expected));
    assert.strictEqual(Object.keys(actual).length, Object.keys(expected).length);
    for (const key of Object.keys(expected)) {
      assertData(assert, actual[key], expected[key]);
    }
  } else {
    assert.strictEqual(actual, expected);
  }
}

function issueNode(source) {
  return new SourceNode(null, null, source, [
    "prefix",
    new SourceNode(1, 0, source, "code"),
    "suffix",
  ]);
}

exports["test empty source filename generates the issue444 mapping"] =
  async function (assert) {
    const result = issueNode("").toStringWithSourceMap();
    assert.equal(result.code, "prefixcodesuffix");
    const raw = result.map.toJSON();
    assertData(assert, raw.sources, [""]);
    assert.equal(raw.mappings, "MAAA,I");
    const consumer = await new SourceMapConsumer(raw);
    try {
      assert.equal(consumer.sources.length, 1);
      const expectedSource = consumer.sources[0];
      assert.ok(expectedSource !== null);
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 0 }),
        { source: null, line: null, column: null, name: null });
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 6 }),
        { source: expectedSource, line: 1, column: 0, name: null });
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 10 }),
        { source: null, line: null, column: null, name: null });
      consumer.computeColumnSpans();
      assertData(assert, consumer.generatedPositionFor({
        source: expectedSource, line: 1, column: 0,
      }), { line: 1, column: 6, lastColumn: 9 });
    } finally {
      consumer.destroy();
    }
  };

exports["test generator accepts an empty source with an original position"] =
  async function (assert) {
    const generator = new SourceMapGenerator();
    generator.addMapping({
      generated: { line: 1, column: 0 },
      original: { line: 3, column: 2 },
      source: "",
      name: "",
    });
    generator.setSourceContent("", "original content");
    const raw = generator.toJSON();
    assertData(assert, raw.sources, [""]);
    assertData(assert, raw.names, [""]);
    assertData(assert, raw.sourcesContent, ["original content"]);
    const consumer = await new SourceMapConsumer(generator.toString());
    try {
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 0 }),
        { source: consumer.sources[0], line: 3, column: 2, name: "" });
      assert.equal(consumer.sourceContentFor(consumer.sources[0]), "original content");
    } finally {
      consumer.destroy();
    }
  };

exports["test multiline empty source keeps positions and names"] =
  async function (assert) {
    const node = new SourceNode(7, 2, "", "a\nb", "token");
    node.setSourceContent("", "original text");
    const result = node.toStringWithSourceMap();
    assert.equal(result.code, "a\nb");
    const raw = result.map.toJSON();
    assertData(assert, raw.sources, [""]);
    assertData(assert, raw.sourcesContent, ["original text"]);
    const consumer = await new SourceMapConsumer(raw);
    try {
      for (const line of [1, 2]) {
        assertData(assert, consumer.originalPositionFor({ line, column: 0 }),
          { source: consumer.sources[0], line: 7, column: 2, name: "token" });
      }
    } finally {
      consumer.destroy();
    }
  };

exports["test mixed empty named and unmapped chunks remain distinct"] =
  async function (assert) {
    const node = new SourceNode(null, null, null, [
      new SourceNode(1, 0, "", "a"),
      new SourceNode(2, 4, "file.js", "b"),
      new SourceNode(1, 0, null, "c"),
      new SourceNode(3, 1, "", "d"),
    ]);
    const result = node.toStringWithSourceMap();
    assert.equal(result.code, "abcd");
    assertData(assert, result.map.toJSON().sources, ["", "file.js"]);
    const consumer = await new SourceMapConsumer(result.map.toJSON());
    try {
      const first = consumer.originalPositionFor({ line: 1, column: 0 });
      assert.equal(first.source, consumer.sources[0]);
      assert.equal(first.line, 1);
      assert.equal(consumer.originalPositionFor({ line: 1, column: 1 }).source,
        consumer.sources[1]);
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 2 }),
        { source: null, line: null, column: null, name: null });
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 3 }),
        { source: consumer.sources[0], line: 3, column: 1, name: null });
    } finally {
      consumer.destroy();
    }
  };

exports["test null and undefined sources keep their unmapped semantics"] =
  async function (assert) {
    for (const source of [null, undefined]) {
      const result = issueNode(source).toStringWithSourceMap();
      assert.equal(result.code, "prefixcodesuffix");
      assertData(assert, result.map.toJSON().sources, []);
      assert.equal(result.map.toJSON().mappings, "");
      const consumer = await new SourceMapConsumer(result.map.toJSON());
      try {
        assertData(assert, consumer.originalPositionFor({ line: 1, column: 6 }),
          { source: null, line: null, column: null, name: null });
      } finally {
        consumer.destroy();
      }
    }
  };

exports["test empty source does not bypass position validation"] = function (assert) {
  for (const original of [{ line: 0, column: 0 }, { line: 1, column: -1 }]) {
    assert.throws(() => new SourceMapGenerator().addMapping({
      source: "", generated: { line: 1, column: 0 }, original,
    }), /Invalid mapping/);
  }
  assert.throws(() => new SourceMapGenerator().addMapping({
    source: "", generated: { line: 0, column: 0 },
    original: { line: 1, column: 0 },
  }), /Invalid mapping/);
};

exports["test other falsy sources with original positions are still rejected"] =
  function (assert) {
    for (const source of [null, undefined, false, 0]) {
      assert.throws(() => new SourceMapGenerator().addMapping({
        source, generated: { line: 1, column: 0 },
        original: { line: 1, column: 0 },
      }), /Invalid mapping/);
    }
  };

exports["test generated-only mappings still accept missing sources"] =
  async function (assert) {
    for (const source of [null, undefined]) {
      const generator = new SourceMapGenerator();
      generator.addMapping({ generated: { line: 1, column: 0 }, source });
      assertData(assert, generator.toJSON().sources, []);
      assert.equal(generator.toJSON().mappings, "A");
      const consumer = await new SourceMapConsumer(generator.toJSON());
      try {
        assertData(assert, consumer.originalPositionFor({ line: 1, column: 0 }),
          { source: null, line: null, column: null, name: null });
      } finally {
        consumer.destroy();
      }
    }
  };

exports["test ordinary named source behavior is unchanged"] =
  async function (assert) {
    const result = issueNode("source").toStringWithSourceMap();
    assert.equal(result.code, "prefixcodesuffix");
    assertData(assert, result.map.toJSON().sources, ["source"]);
    assert.equal(result.map.toJSON().mappings, "MAAA,I");
    const consumer = await new SourceMapConsumer(result.map.toJSON());
    try {
      assertData(assert, consumer.originalPositionFor({ line: 1, column: 6 }),
        { source: "source", line: 1, column: 0, name: null });
    } finally {
      consumer.destroy();
    }
  };
