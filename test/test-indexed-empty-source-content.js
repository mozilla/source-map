/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const SourceMapConsumer =
  require("../lib/source-map-consumer").SourceMapConsumer;
const SourceMapGenerator =
  require("../lib/source-map-generator").SourceMapGenerator;

function issue420Map() {
  return {
    version: 3,
    sections: [
      {
        offset: { line: 0, column: 0 },
        map: {
          version: 3,
          sources: ["123", "456"],
          sourcesContent: ["a\nb\nc\n", ""],
          mappings: "AAAA;AACA;AACA;",
        },
      },
    ],
  };
}

exports["test indexed sourceContentFor retains an empty source"] = async function (assert) {
  const consumer = await new SourceMapConsumer(issue420Map());
  try {
    assert.strictEqual(consumer.sourceContentFor("456"), "");
  } finally {
    consumer.destroy();
  }
};

exports["test fromSourceMap retains empty indexed source content"] = async function (assert) {
  const consumer = await new SourceMapConsumer(issue420Map());
  try {
    // No artificial sourceRoot assignment: exercise the current public path.
    const result = SourceMapGenerator.fromSourceMap(consumer).toJSON();
    const nonemptyIndex = result.sources.indexOf("123");
    const emptyIndex = result.sources.indexOf("456");
    assert.ok(nonemptyIndex >= 0);
    assert.ok(emptyIndex >= 0);
    assert.strictEqual(result.sourcesContent[nonemptyIndex], "a\nb\nc\n");
    assert.strictEqual(result.sourcesContent[emptyIndex], "");
    assert.strictEqual(result.mappings, "AAAA;AACA;AACA");
  } finally {
    consumer.destroy();
  }
};

exports["test indexed lookup continues past a section without the source"] = async function (assert) {
  const map = issue420Map();
  map.sections.unshift({
    offset: { line: 0, column: 0 },
    map: {
      version: 3,
      names: [],
      sources: ["other.js"],
      sourcesContent: ["other content"],
      mappings: "AAAA",
    },
  });
  map.sections[1].offset = { line: 1, column: 0 };
  const consumer = await new SourceMapConsumer(map);
  try {
    assert.strictEqual(consumer.sourceContentFor("other.js"), "other content");
    assert.strictEqual(consumer.sourceContentFor("456"), "");
  } finally {
    consumer.destroy();
  }
};

exports["test nested indexed maps retain empty source content"] = async function (assert) {
  const consumer = await new SourceMapConsumer({
    version: 3,
    sections: [
      { offset: { line: 0, column: 0 }, map: issue420Map() },
    ],
  });
  try {
    assert.strictEqual(consumer.sourceContentFor("456"), "");
    const result = SourceMapGenerator.fromSourceMap(consumer).toJSON();
    const index = result.sources.indexOf("456");
    assert.ok(index >= 0);
    assert.strictEqual(result.sourcesContent[index], "");
  } finally {
    consumer.destroy();
  }
};

exports["test nullOnMissing does not discard present empty content"] = async function (assert) {
  const consumer = await new SourceMapConsumer(issue420Map());
  try {
    assert.strictEqual(consumer.sourceContentFor("456", true), "");
  } finally {
    consumer.destroy();
  }
};

exports["test basic consumer and generator retain empty source content"] = async function (assert) {
  const consumer = await new SourceMapConsumer(issue420Map().sections[0].map);
  try {
    assert.strictEqual(consumer.sourceContentFor("456"), "");
    const result = SourceMapGenerator.fromSourceMap(consumer).toJSON();
    const index = result.sources.indexOf("456");
    assert.ok(index >= 0);
    assert.strictEqual(result.sourcesContent[index], "");
  } finally {
    consumer.destroy();
  }
};

exports["test indexed nonempty source content conversion is unchanged"] = async function (assert) {
  const map = issue420Map();
  map.sections[0].map.sourcesContent[1] = "nonempty second source";
  const consumer = await new SourceMapConsumer(map);
  try {
    assert.strictEqual(consumer.sourceContentFor("456"), "nonempty second source");
    const result = SourceMapGenerator.fromSourceMap(consumer).toJSON();
    const index = result.sources.indexOf("456");
    assert.ok(index >= 0);
    assert.strictEqual(result.sourcesContent[index], "nonempty second source");
  } finally {
    consumer.destroy();
  }
};

exports["test genuinely missing indexed source retains nullOnMissing behavior"] = async function (assert) {
  const consumer = await new SourceMapConsumer(issue420Map());
  try {
    assert.strictEqual(consumer.sourceContentFor("missing.js", true), null);
    assert.throws(function () {
      consumer.sourceContentFor("missing.js");
    }, /not in the SourceMap/);
  } finally {
    consumer.destroy();
  }
};
