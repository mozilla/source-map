/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const util = require("./util");
const SourceMapConsumer = require("../lib/source-map-consumer").SourceMapConsumer;
const IndexedSourceMapConsumer = require("../lib/source-map-consumer").IndexedSourceMapConsumer;
const BasicSourceMapConsumer = require("../lib/source-map-consumer").BasicSourceMapConsumer;
const SourceMapGenerator = require("../lib/source-map-generator").SourceMapGenerator;

exports["test that we can instantiate with a string or an object"] = async function(assert) {
  let map = await new SourceMapConsumer(util.testMap);
  map = await new SourceMapConsumer(JSON.stringify(util.testMap));
  assert.ok(true);
  map.destroy();
};

exports["test that the object returned from await new SourceMapConsumer inherits from SourceMapConsumer"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMap);
  assert.ok(map instanceof SourceMapConsumer);
  map.destroy();
};

exports["test that a BasicSourceMapConsumer is returned for sourcemaps without sections"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMap);
  assert.ok(map instanceof BasicSourceMapConsumer);
  map.destroy();
};

exports["test that an IndexedSourceMapConsumer is returned for sourcemaps with sections"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);
  assert.ok(map instanceof IndexedSourceMapConsumer);
  map.destroy();
};

exports["test that the `sources` field has the original sources"] = async function(assert) {
  let map;
  let sources;

  map = await new SourceMapConsumer(util.testMap);
  sources = map.sources;
  assert.equal(sources[0], "/the/root/one.js");
  assert.equal(sources[1], "/the/root/two.js");
  assert.equal(sources.length, 2);
  map.destroy();

  map = await new SourceMapConsumer(util.indexedTestMap);
  sources = map.sources;
  assert.equal(sources[0], "/the/root/one.js");
  assert.equal(sources[1], "/the/root/two.js");
  assert.equal(sources.length, 2);
  map.destroy();

  map = await new SourceMapConsumer(util.indexedTestMapDifferentSourceRoots);
  sources = map.sources;
  assert.equal(sources[0], "/the/root/one.js");
  assert.equal(sources[1], "/different/root/two.js");
  assert.equal(sources.length, 2);
  map.destroy();

  map = await new SourceMapConsumer(util.testMapNoSourceRoot);
  sources = map.sources;
  assert.equal(sources[0], "one.js");
  assert.equal(sources[1], "two.js");
  assert.equal(sources.length, 2);
  map.destroy();

  map = await new SourceMapConsumer(util.testMapEmptySourceRoot);
  sources = map.sources;
  assert.equal(sources[0], "one.js");
  assert.equal(sources[1], "two.js");
  assert.equal(sources.length, 2);
  map.destroy();
};

exports["test that the source root is reflected in a mapping's source field"] = async function(assert) {
  let map;
  let mapping;

  map = await new SourceMapConsumer(util.testMap);

  mapping = map.originalPositionFor({
    line: 2,
    column: 1
  });
  assert.equal(mapping.source, "/the/root/two.js");

  mapping = map.originalPositionFor({
    line: 1,
    column: 1
  });
  assert.equal(mapping.source, "/the/root/one.js");
  map.destroy();


  map = await new SourceMapConsumer(util.testMapNoSourceRoot);

  mapping = map.originalPositionFor({
    line: 2,
    column: 1
  });
  assert.equal(mapping.source, "two.js");

  mapping = map.originalPositionFor({
    line: 1,
    column: 1
  });
  assert.equal(mapping.source, "one.js");
  map.destroy();


  map = await new SourceMapConsumer(util.testMapEmptySourceRoot);

  mapping = map.originalPositionFor({
    line: 2,
    column: 1
  });
  assert.equal(mapping.source, "two.js");

  mapping = map.originalPositionFor({
    line: 1,
    column: 1
  });
  assert.equal(mapping.source, "one.js");
  map.destroy();
};

exports["test mapping tokens back exactly"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMap);

  util.assertMapping(1, 1, "/the/root/one.js", 1, 1, null, null, map, assert);
  util.assertMapping(1, 5, "/the/root/one.js", 1, 5, null, null, map, assert);
  util.assertMapping(1, 9, "/the/root/one.js", 1, 11, null, null, map, assert);
  util.assertMapping(1, 18, "/the/root/one.js", 1, 21, "bar", null, map, assert);
  util.assertMapping(1, 21, "/the/root/one.js", 2, 3, null, null, map, assert);
  util.assertMapping(1, 28, "/the/root/one.js", 2, 10, "baz", null, map, assert);
  util.assertMapping(1, 32, "/the/root/one.js", 2, 14, "bar", null, map, assert);

  util.assertMapping(2, 1, "/the/root/two.js", 1, 1, null, null, map, assert);
  util.assertMapping(2, 5, "/the/root/two.js", 1, 5, null, null, map, assert);
  util.assertMapping(2, 9, "/the/root/two.js", 1, 11, null, null, map, assert);
  util.assertMapping(2, 18, "/the/root/two.js", 1, 21, "n", null, map, assert);
  util.assertMapping(2, 21, "/the/root/two.js", 2, 3, null, null, map, assert);
  util.assertMapping(2, 28, "/the/root/two.js", 2, 10, "n", null, map, assert);

  map.destroy();
};

exports["test mapping tokens back exactly in indexed source map"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);

  util.assertMapping(1, 1, "/the/root/one.js", 1, 1, null, null, map, assert);
  util.assertMapping(1, 5, "/the/root/one.js", 1, 5, null, null, map, assert);
  util.assertMapping(1, 9, "/the/root/one.js", 1, 11, null, null, map, assert);
  util.assertMapping(1, 18, "/the/root/one.js", 1, 21, "bar", null, map, assert);
  util.assertMapping(1, 21, "/the/root/one.js", 2, 3, null, null, map, assert);
  util.assertMapping(1, 28, "/the/root/one.js", 2, 10, "baz", null, map, assert);
  util.assertMapping(1, 32, "/the/root/one.js", 2, 14, "bar", null, map, assert);

  util.assertMapping(2, 1, "/the/root/two.js", 1, 1, null, null, map, assert);
  util.assertMapping(2, 5, "/the/root/two.js", 1, 5, null, null, map, assert);
  util.assertMapping(2, 9, "/the/root/two.js", 1, 11, null, null, map, assert);
  util.assertMapping(2, 18, "/the/root/two.js", 1, 21, "n", null, map, assert);
  util.assertMapping(2, 21, "/the/root/two.js", 2, 3, null, null, map, assert);
  util.assertMapping(2, 28, "/the/root/two.js", 2, 10, "n", null, map, assert);

  map.destroy();
};

exports["test mapping tokens fuzzy"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMap);

  // Finding original positions with default (glb) bias.
  util.assertMapping(1, 20, "/the/root/one.js", 1, 21, "bar", null, map, assert, true);
  util.assertMapping(1, 30, "/the/root/one.js", 2, 10, "baz", null, map, assert, true);
  util.assertMapping(2, 12, "/the/root/two.js", 1, 11, null, null, map, assert, true);

  // Finding original positions with lub bias.
  util.assertMapping(1, 16, "/the/root/one.js", 1, 21, "bar", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(1, 26, "/the/root/one.js", 2, 10, "baz", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(2, 6, "/the/root/two.js", 1, 11, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);

  // Finding generated positions with default (glb) bias.
  util.assertMapping(1, 18, "/the/root/one.js", 1, 22, "bar", null, map, assert, null, true);
  util.assertMapping(1, 28, "/the/root/one.js", 2, 13, "baz", null, map, assert, null, true);
  util.assertMapping(2, 9, "/the/root/two.js", 1, 16, null, null, map, assert, null, true);

  // Finding generated positions with lub bias.
  util.assertMapping(1, 18, "/the/root/one.js", 1, 20, "bar", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(1, 28, "/the/root/one.js", 2, 7, "baz", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(2, 9, "/the/root/two.js", 1, 6, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);

  map.destroy();
};

exports["test mapping tokens fuzzy in indexed source map"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);

  // Finding original positions with default (glb) bias.
  util.assertMapping(1, 20, "/the/root/one.js", 1, 21, "bar", null, map, assert, true);
  util.assertMapping(1, 30, "/the/root/one.js", 2, 10, "baz", null, map, assert, true);
  util.assertMapping(2, 12, "/the/root/two.js", 1, 11, null, null, map, assert, true);

  // Finding original positions with lub bias.
  util.assertMapping(1, 16, "/the/root/one.js", 1, 21, "bar", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(1, 26, "/the/root/one.js", 2, 10, "baz", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(2, 6, "/the/root/two.js", 1, 11, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);

  // Finding generated positions with default (glb) bias.
  util.assertMapping(1, 18, "/the/root/one.js", 1, 22, "bar", null, map, assert, null, true);
  util.assertMapping(1, 28, "/the/root/one.js", 2, 13, "baz", null, map, assert, null, true);
  util.assertMapping(2, 9, "/the/root/two.js", 1, 16, null, null, map, assert, null, true);

  // Finding generated positions with lub bias.
  util.assertMapping(1, 18, "/the/root/one.js", 1, 20, "bar", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(1, 28, "/the/root/one.js", 2, 7, "baz", SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(2, 9, "/the/root/two.js", 1, 6, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);

  map.destroy();
};

exports["test mappings and end of lines"] = async function(assert) {
  const smg = new SourceMapGenerator({
    file: "foo.js"
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 1 },
    source: "bar.js"
  });
  smg.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 2, column: 2 },
    source: "bar.js"
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 1 },
    source: "baz.js"
  });

  const map = await SourceMapConsumer.fromSourceMap(smg);

  // When finding original positions, mappings end at the end of the line.
  util.assertMapping(2, 1, null, null, null, null, null, map, assert, true);

  // When finding generated positions, mappings do not end at the end of the line.
  util.assertMapping(1, 1, "bar.js", 2, 1, null, null, map, assert, null, true);

  // When finding generated positions with, mappings end at the end of the source.
  util.assertMapping(null, null, "bar.js", 3, 1, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);

  map.destroy();
};

exports["test creating source map consumers with )]}' prefix"] = async function(assert) {
  const map = await new SourceMapConsumer(")]}'\n" + JSON.stringify(util.testMap));
  assert.ok(true);
  map.destroy();
};

exports["test eachMapping"] = async function(assert) {
  let map;

  map = await new SourceMapConsumer(util.testMap);
  let previousLine = -Infinity;
  let previousColumn = -Infinity;
  map.eachMapping(function(mapping) {
    assert.ok(mapping.generatedLine >= previousLine);

    assert.ok(mapping.source === "/the/root/one.js" || mapping.source === "/the/root/two.js");

    if (mapping.generatedLine === previousLine) {
      assert.ok(mapping.generatedColumn >= previousColumn);
      previousColumn = mapping.generatedColumn;
    } else {
      previousLine = mapping.generatedLine;
      previousColumn = -Infinity;
    }
  });
  map.destroy();

  map = await new SourceMapConsumer(util.testMapNoSourceRoot);
  map.eachMapping(function(mapping) {
    assert.ok(mapping.source === "one.js" || mapping.source === "two.js");
  });
  map.destroy();

  map = await new SourceMapConsumer(util.testMapEmptySourceRoot);
  map.eachMapping(function(mapping) {
    assert.ok(mapping.source === "one.js" || mapping.source === "two.js");
  });
  map.destroy();

  map = await new SourceMapConsumer(util.mapWithSourcelessMapping);
  map.eachMapping(function(mapping) {
    assert.ok(mapping.source === null || (typeof mapping.originalColumn === "number" && typeof mapping.originalLine === "number"));
  });
  map.destroy();
};

exports["test eachMapping for indexed source maps"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);
  let previousLine = -Infinity;
  let previousColumn = -Infinity;

  map.eachMapping(function(mapping) {
    assert.ok(mapping.generatedLine >= previousLine);

    if (mapping.source) {
      assert.equal(mapping.source.indexOf(util.testMap.sourceRoot), 0);
    }

    if (mapping.generatedLine === previousLine) {
      assert.ok(mapping.generatedColumn >= previousColumn);
      previousColumn = mapping.generatedColumn;
    } else {
      previousLine = mapping.generatedLine;
      previousColumn = -Infinity;
    }
  });

  map.destroy();
};

exports["test iterating over mappings in a different order"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMap);
  let previousLine = -Infinity;
  let previousColumn = -Infinity;
  let previousSource = "";

  map.eachMapping(function(mapping) {
    assert.ok(mapping.source >= previousSource);

    if (mapping.source === previousSource) {
      assert.ok(mapping.originalLine >= previousLine);

      if (mapping.originalLine === previousLine) {
        assert.ok(mapping.originalColumn >= previousColumn);
        previousColumn = mapping.originalColumn;
      } else {
        previousLine = mapping.originalLine;
        previousColumn = -Infinity;
      }
    } else {
      previousSource = mapping.source;
      previousLine = -Infinity;
      previousColumn = -Infinity;
    }
  }, null, SourceMapConsumer.ORIGINAL_ORDER);

  map.destroy();
};

exports["test iterating over mappings in a different order in indexed source maps"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);
  let previousLine = -Infinity;
  let previousColumn = -Infinity;
  let previousSource = "";
  map.eachMapping(function(mapping) {
    assert.ok(mapping.source >= previousSource);

    if (mapping.source === previousSource) {
      assert.ok(mapping.originalLine >= previousLine);

      if (mapping.originalLine === previousLine) {
        assert.ok(mapping.originalColumn >= previousColumn);
        previousColumn = mapping.originalColumn;
      } else {
        previousLine = mapping.originalLine;
        previousColumn = -Infinity;
      }
    } else {
      previousSource = mapping.source;
      previousLine = -Infinity;
      previousColumn = -Infinity;
    }
  }, null, SourceMapConsumer.ORIGINAL_ORDER);
  map.destroy();
};

exports["test that we can set the context for `this` in eachMapping"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMap);
  const context = {};
  map.eachMapping(function() {
    assert.equal(this, context);
  }, context);
  map.destroy();
};

exports["test that we can set the context for `this` in eachMapping in indexed source maps"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);
  const context = {};
  map.eachMapping(function() {
    assert.equal(this, context);
  }, context);
  map.destroy();
};

exports["test that the `sourcesContent` field has the original sources"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMapWithSourcesContent);
  const sourcesContent = map.sourcesContent;

  assert.equal(sourcesContent[0], " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(sourcesContent[1], " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.equal(sourcesContent.length, 2);

  map.destroy();
};

exports["test that we can get the original sources for the sources"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMapWithSourcesContent);
  const sources = map.sources;

  assert.equal(map.sourceContentFor(sources[0]), " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(map.sourceContentFor(sources[1]), " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.equal(map.sourceContentFor("one.js"), " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(map.sourceContentFor("two.js"), " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.throws(function() {
    map.sourceContentFor("");
  }, Error);
  assert.throws(function() {
    map.sourceContentFor("/the/root/three.js");
  }, Error);
  assert.throws(function() {
    map.sourceContentFor("three.js");
  }, Error);

  map.destroy();
};

exports["test that we can get the original source content with relative source paths"] = async function(assert) {
  const map = await new SourceMapConsumer(util.testMapRelativeSources);
  const sources = map.sources;

  assert.equal(map.sourceContentFor(sources[0]), " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(map.sourceContentFor(sources[1]), " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.equal(map.sourceContentFor("one.js"), " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(map.sourceContentFor("two.js"), " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.throws(function() {
    map.sourceContentFor("");
  }, Error);
  assert.throws(function() {
    map.sourceContentFor("/the/root/three.js");
  }, Error);
  assert.throws(function() {
    map.sourceContentFor("three.js");
  }, Error);

  map.destroy();
};

exports["test that we can get the original source content for the sources on an indexed source map"] = async function(assert) {
  const map = await new SourceMapConsumer(util.indexedTestMap);
  const sources = map.sources;

  assert.equal(map.sourceContentFor(sources[0]), " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(map.sourceContentFor(sources[1]), " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.equal(map.sourceContentFor("one.js"), " ONE.foo = function (bar) {\n   return baz(bar);\n };");
  assert.equal(map.sourceContentFor("two.js"), " TWO.inc = function (n) {\n   return n + 1;\n };");
  assert.throws(function() {
    map.sourceContentFor("");
  }, Error);
  assert.throws(function() {
    map.sourceContentFor("/the/root/three.js");
  }, Error);
  assert.throws(function() {
    map.sourceContentFor("three.js");
  }, Error);

  map.destroy();
};

exports["test hasContentsOfAllSources, single source with contents"] = async function(assert) {
  // Has one source: foo.js (with contents).
  const mapWithContents = new SourceMapGenerator();
  mapWithContents.addMapping({ source: "foo.js",
                               original: { line: 1, column: 10 },
                               generated: { line: 1, column: 10 } });
  mapWithContents.setSourceContent("foo.js", "content of foo.js");

  const consumer = await new SourceMapConsumer(mapWithContents.toJSON());
  assert.ok(consumer.hasContentsOfAllSources());
  consumer.destroy();
};

exports["test hasContentsOfAllSources, single source without contents"] = async function(assert) {
  // Has one source: foo.js (without contents).
  const mapWithoutContents = new SourceMapGenerator();
  mapWithoutContents.addMapping({ source: "foo.js",
                                  original: { line: 1, column: 10 },
                                  generated: { line: 1, column: 10 } });
  const consumer = await new SourceMapConsumer(mapWithoutContents.toJSON());
  assert.ok(!consumer.hasContentsOfAllSources());
  consumer.destroy();
};

exports["test hasContentsOfAllSources, two sources with contents"] = async function(assert) {
  // Has two sources: foo.js (with contents) and bar.js (with contents).
  const mapWithBothContents = new SourceMapGenerator();
  mapWithBothContents.addMapping({ source: "foo.js",
                                   original: { line: 1, column: 10 },
                                   generated: { line: 1, column: 10 } });
  mapWithBothContents.addMapping({ source: "bar.js",
                                   original: { line: 1, column: 10 },
                                   generated: { line: 1, column: 10 } });
  mapWithBothContents.setSourceContent("foo.js", "content of foo.js");
  mapWithBothContents.setSourceContent("bar.js", "content of bar.js");
  const consumer = await new SourceMapConsumer(mapWithBothContents.toJSON());
  assert.ok(consumer.hasContentsOfAllSources());
  consumer.destroy();
};

exports["test hasContentsOfAllSources, two sources one with and one without contents"] = async function(assert) {
  // Has two sources: foo.js (with contents) and bar.js (without contents).
  const mapWithoutSomeContents = new SourceMapGenerator();
  mapWithoutSomeContents.addMapping({ source: "foo.js",
                                      original: { line: 1, column: 10 },
                                      generated: { line: 1, column: 10 } });
  mapWithoutSomeContents.addMapping({ source: "bar.js",
                                      original: { line: 1, column: 10 },
                                      generated: { line: 1, column: 10 } });
  mapWithoutSomeContents.setSourceContent("foo.js", "content of foo.js");
  const consumer = await new SourceMapConsumer(mapWithoutSomeContents.toJSON());
  assert.ok(!consumer.hasContentsOfAllSources());
  consumer.destroy();
};

exports["test sourceRoot + generatedPositionFor"] = async function(assert) {
  let map = new SourceMapGenerator({
    sourceRoot: "foo/bar",
    file: "baz.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "bang.coffee"
  });
  map.addMapping({
    original: { line: 5, column: 5 },
    generated: { line: 6, column: 6 },
    source: "bang.coffee"
  });


  map = await new SourceMapConsumer(map.toString(), "http://example.com/");

  // Should handle without sourceRoot.
  let pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: "bang.coffee"
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  // Should handle with sourceRoot.
  pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: "foo/bar/bang.coffee"
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  // Should handle absolute case.
  pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: "http://example.com/foo/bar/bang.coffee"
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  map.destroy();
};

exports["test sourceRoot + generatedPositionFor for path above the root"] = async function(assert) {
  let map = new SourceMapGenerator({
    sourceRoot: "foo/bar",
    file: "baz.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "../bang.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  // Should handle with sourceRoot.
  const pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: "foo/bang.coffee"
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  map.destroy();
};

exports["test allGeneratedPositionsFor for line"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "bar.coffee"
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 3, column: 2 },
    source: "bar.coffee"
  });
  map.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 3, column: 3 },
    source: "bar.coffee"
  });
  map.addMapping({
    original: { line: 3, column: 1 },
    generated: { line: 4, column: 2 },
    source: "bar.coffee"
  });

  map = await new SourceMapConsumer(map.toString(), "http://example.com/");

  let mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: "bar.coffee"
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 3);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 3);
  assert.equal(mappings[1].column, 3);

  mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: "http://example.com/bar.coffee"
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 3);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 3);
  assert.equal(mappings[1].column, 3);

  map.destroy();
};

exports["test allGeneratedPositionsFor for line fuzzy"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "bar.coffee"
  });
  map.addMapping({
    original: { line: 3, column: 1 },
    generated: { line: 4, column: 2 },
    source: "bar.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  const mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: "bar.coffee"
  });

  assert.equal(mappings.length, 1);
  assert.equal(mappings[0].line, 4);
  assert.equal(mappings[0].column, 2);

  map.destroy();
};

exports["test allGeneratedPositionsFor for empty source map"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map = await new SourceMapConsumer(map.toString());

  const mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: "bar.coffee"
  });

  assert.equal(mappings.length, 0);

  map.destroy();
};

exports["test allGeneratedPositionsFor for column"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 2 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 3 },
    source: "foo.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  const mappings = map.allGeneratedPositionsFor({
    line: 1,
    column: 1,
    source: "foo.coffee"
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 1);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 1);
  assert.equal(mappings[1].column, 3);

  map.destroy();
};

exports["test allGeneratedPositionsFor for column fuzzy"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 2 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 3 },
    source: "foo.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  const mappings = map.allGeneratedPositionsFor({
    line: 1,
    column: 0,
    source: "foo.coffee"
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 1);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 1);
  assert.equal(mappings[1].column, 3);

  map.destroy();
};

exports["test allGeneratedPositionsFor for column on different line fuzzy"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 2, column: 2 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 2, column: 3 },
    source: "foo.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  const mappings = map.allGeneratedPositionsFor({
    line: 1,
    column: 0,
    source: "foo.coffee"
  });

  assert.equal(mappings.length, 0);

  map.destroy();
};

exports["test computeColumnSpans"] = async function(assert) {
  let map = new SourceMapGenerator({
    file: "generated.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 1 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 2, column: 1 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 2, column: 10 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 2, column: 3 },
    generated: { line: 2, column: 20 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 3, column: 1 },
    generated: { line: 3, column: 1 },
    source: "foo.coffee"
  });
  map.addMapping({
    original: { line: 3, column: 2 },
    generated: { line: 3, column: 2 },
    source: "foo.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  map.computeColumnSpans();

  let mappings = map.allGeneratedPositionsFor({
    line: 1,
    source: "foo.coffee"
  });

  assert.equal(mappings.length, 1);
  assert.equal(mappings[0].lastColumn, Infinity);

  mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: "foo.coffee"
  });

  assert.equal(mappings.length, 3);
  assert.equal(mappings[0].lastColumn, 9);
  assert.equal(mappings[1].lastColumn, 19);
  assert.equal(mappings[2].lastColumn, Infinity);

  mappings = map.allGeneratedPositionsFor({
    line: 3,
    source: "foo.coffee"
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].lastColumn, 1);
  assert.equal(mappings[1].lastColumn, Infinity);

  map.destroy();
};

exports["test sourceRoot + originalPositionFor"] = async function(assert) {
  let map = new SourceMapGenerator({
    sourceRoot: "foo/bar",
    file: "baz.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "bang.coffee"
  });

  map = await new SourceMapConsumer(map.toString());

  const pos = map.originalPositionFor({
    line: 2,
    column: 2,
  });

  // Should always have the prepended source root
  assert.equal(pos.source, "foo/bar/bang.coffee");
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);

  map.destroy();
};

exports["test github issue #56"] = async function(assert) {
  let map = new SourceMapGenerator({
    sourceRoot: "http://",
    file: "www.example.com/foo.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "www.example.com/original.js"
  });

  map = await new SourceMapConsumer(map.toString());

  const sources = map.sources;
  assert.equal(sources.length, 1);
  assert.equal(sources[0], "http://www.example.com/original.js");

  map.destroy();
};

// Was github issue #43, but that's no longer valid.
exports["test source resolution with sourceMapURL"] = async function(assert) {
  let map = new SourceMapGenerator({
    sourceRoot: "",
    file: "foo.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "original.js",
  });

  map = await new SourceMapConsumer(map.toString(), "http://cdn.example.com");

  const sources = map.sources;
  assert.equal(sources.length, 1,
               "Should only be one source.");
  assert.equal(sources[0], "http://cdn.example.com/original.js",
               "Should be joined with the source map URL.");

  map.destroy();
};

exports["test sourceRoot prepending"] = async function(assert) {
  let map = new SourceMapGenerator({
    sourceRoot: "http://example.com/foo/bar",
    file: "foo.js"
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "/original.js"
  });

  map = await new SourceMapConsumer(map.toString());

  const sources = map.sources;
  assert.equal(sources.length, 1,
               "Should only be one source.");
  assert.equal(sources[0], "http://example.com/foo/bar/original.js",
               "Source include the source root.");

  map.destroy();
};

exports["test indexed source map errors when sections are out of order by line"] = async function(assert) {
  // Make a deep copy of the indexedTestMap
  const misorderedIndexedTestMap = JSON.parse(JSON.stringify(util.indexedTestMap));

  misorderedIndexedTestMap.sections[0].offset = {
    line: 2,
    column: 0
  };

  let error;
  try {
    await new SourceMapConsumer(misorderedIndexedTestMap);
  } catch (e) {
    error = e;
  }
  assert.ok(error instanceof Error);
};

exports["test github issue #64"] = async function(assert) {
  const map = await new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sourceRoot": "http://example.com/",
    "sources": ["/a"],
    "names": [],
    "mappings": "AACA",
    "sourcesContent": ["foo"]
  });

  assert.equal(map.sourceContentFor("a"), "foo");
  assert.equal(map.sourceContentFor("/a"), "foo");

  map.destroy();
};

exports["test full source content with sourceMapURL"] = async function(assert) {
  const map = await new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sourceRoot": "",
    "sources": ["original.js"],
    "names": [],
    "mappings": "AACA",
    "sourcesContent": ["yellow warbler"]
  }, "http://cdn.example.com");

  assert.equal(map.sourceContentFor("http://cdn.example.com/original.js"), "yellow warbler",
               "Source content should be found using full URL");

  map.destroy();
};

exports["test bug 885597"] = async function(assert) {
  const map = await new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sourceRoot": "file:///Users/AlGore/Invented/The/Internet/",
    "sources": ["/a"],
    "names": [],
    "mappings": "AACA",
    "sourcesContent": ["foo"]
  });

  const s = map.sources[0];
  assert.equal(map.sourceContentFor(s), "foo");

  map.destroy();
};

exports["test github issue #72, duplicate sources"] = async function(assert) {
  const map = await new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sources": ["source1.js", "source1.js", "source3.js"],
    "names": [],
    "mappings": ";EAAC;;IAEE;;MEEE",
    "sourceRoot": "http://example.com"
  });

  let pos = map.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.source, "http://example.com/source1.js");
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);

  pos = map.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.source, "http://example.com/source1.js");
  assert.equal(pos.line, 3);
  assert.equal(pos.column, 3);

  pos = map.originalPositionFor({
    line: 6,
    column: 6
  });
  assert.equal(pos.source, "http://example.com/source3.js");
  assert.equal(pos.line, 5);
  assert.equal(pos.column, 5);

  map.destroy();
};

exports["test github issue #72, duplicate names"] = async function(assert) {
  const map = await new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sources": ["source.js"],
    "names": ["name1", "name1", "name3"],
    "mappings": ";EAACA;;IAEEA;;MAEEE",
    "sourceRoot": "http://example.com"
  });

  let pos = map.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.name, "name1");
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);

  pos = map.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.name, "name1");
  assert.equal(pos.line, 3);
  assert.equal(pos.column, 3);

  pos = map.originalPositionFor({
    line: 6,
    column: 6
  });
  assert.equal(pos.name, "name3");
  assert.equal(pos.line, 5);
  assert.equal(pos.column, 5);

  map.destroy();
};

exports["test SourceMapConsumer.fromSourceMap"] = async function(assert) {
  const smg = new SourceMapGenerator({
    sourceRoot: "http://example.com/",
    file: "foo.js"
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: "bar.js"
  });
  smg.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 4, column: 4 },
    source: "baz.js",
    name: "dirtMcGirt"
  });
  smg.setSourceContent("baz.js", "baz.js content");

  const smc = await SourceMapConsumer.fromSourceMap(smg);
  assert.equal(smc.file, "foo.js");
  assert.equal(smc.sourceRoot, "http://example.com/");
  assert.equal(smc.sources.length, 2);
  assert.equal(smc.sources[0], "http://example.com/bar.js");
  assert.equal(smc.sources[1], "http://example.com/baz.js");
  assert.equal(smc.sourceContentFor("baz.js"), "baz.js content");

  let pos = smc.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);
  assert.equal(pos.source, "http://example.com/bar.js");
  assert.equal(pos.name, null);

  pos = smc.generatedPositionFor({
    line: 1,
    column: 1,
    source: "http://example.com/bar.js"
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  pos = smc.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);
  assert.equal(pos.source, "http://example.com/baz.js");
  assert.equal(pos.name, "dirtMcGirt");

  pos = smc.generatedPositionFor({
    line: 2,
    column: 2,
    source: "http://example.com/baz.js"
  });
  assert.equal(pos.line, 4);
  assert.equal(pos.column, 4);

  smc.destroy();
};

exports["test issue #191"] = async function(assert) {
  const generator = new SourceMapGenerator({ file: "a.css" });
  generator.addMapping({
    source:   "b.css",
    original: {
      line:   1,
      column: 0
    },
    generated: {
      line:   1,
      column: 0
    }
  });

  // Create a SourceMapConsumer from the SourceMapGenerator, ...
  const consumer = await SourceMapConsumer.fromSourceMap(generator);
  // ... and then try and use the SourceMapGenerator again. This should not
  // throw.
  generator.toJSON();

  assert.ok(true, "Using a SourceMapGenerator again after creating a " +
                  "SourceMapConsumer from it should not throw");

  consumer.destroy();
};

exports["test sources where their prefix is the source root: issue #199"] = async function(assert) {
  const testSourceMap = {
    "version": 3,
    "sources": ["/source/app/app/app.js"],
    "names": ["System"],
    "mappings": "AAAAA",
    "file": "app/app.js",
    "sourcesContent": ["'use strict';"],
    "sourceRoot": "/source/"
  };

  const consumer = await new SourceMapConsumer(testSourceMap);

  function consumerHasSource(s) {
    assert.ok(consumer.sourceContentFor(s));
  }

  consumer.sources.forEach(consumerHasSource);
  testSourceMap.sources.forEach(consumerHasSource);

  consumer.destroy();
};

exports["test sources where their prefix is the source root and the source root is a url: issue #199"] = async function(assert) {
  const testSourceMap = {
    "version": 3,
    "sources": ["http://example.com/source/app/app/app.js"],
    "names": ["System"],
    "mappings": "AAAAA",
    "sourcesContent": ["'use strict';"],
    "sourceRoot": "http://example.com/source/"
  };

  const consumer = await new SourceMapConsumer(testSourceMap);

  function consumerHasSource(s) {
    assert.ok(consumer.sourceContentFor(s));
  }

  consumer.sources.forEach(consumerHasSource);
  testSourceMap.sources.forEach(consumerHasSource);

  consumer.destroy();
};

exports["test consuming names and sources that are numbers"] = async function(assert) {
  const testSourceMap = {
    "version": 3,
    "sources": [0],
    "names": [1],
    "mappings": "AAAAA",
  };

  const consumer = await new SourceMapConsumer(testSourceMap);

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "0");

  let i = 0;
  consumer.eachMapping(function(m) {
    i++;
    assert.equal(m.name, "1");
  });
  assert.equal(i, 1);

  consumer.destroy();
};

exports["test non-normalized sourceRoot (from issue #227)"] = async function(assert) {
  const consumer = await new SourceMapConsumer({
    version: 3,
    sources: [ "index.js" ],
    names: [],
    mappings: ";;AAAA,IAAI,OAAO,MAAP",
    file: "index.js",
    sourceRoot: "./src/",
    sourcesContent: [ 'var name = "Mark"\n' ]
  });
  assert.equal(consumer.sourceRoot, "src/", "sourceRoot was normalized");
  // Before the fix, this threw an exception.
  consumer.sourceContentFor(consumer.sources[0]);

  consumer.destroy();
};

exports["test webpack URL resolution"] = async function(assert) {
  const map = {
    version: 3,
    sources:  ["webpack:///webpack/bootstrap 67e184f9679733298d44"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: ""
  };
  const consumer = await new SourceMapConsumer(map);

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap 67e184f9679733298d44");

  consumer.destroy();
};

exports["test webpack URL resolution with sourceMapURL"] = async function(assert) {
  const map = {
    version: 3,
    sources:  ["webpack:///webpack/bootstrap 67e184f9679733298d44"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: ""
  };
  const consumer = await new SourceMapConsumer(map, "http://www.example.com/q.js.map");

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap 67e184f9679733298d44");

  consumer.destroy();
};

exports["test relative webpack URL resolution with sourceMapURL"] = async function(assert) {
  const map = {
    version: 3,
    sources:  ["webpack/bootstrap.js"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: "webpack:///"
  };
  const consumer = await new SourceMapConsumer(map, "http://www.example.com/q.js.map");

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap.js");

  consumer.destroy();
};

exports["test basic URL resolution with sourceMapURL"] = async function(assert) {
  const map = {
    version: 3,
    sources:  ["something.js"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: "src"
  };
  const consumer = await new SourceMapConsumer(map, "http://www.example.com/x/q.js.map");

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "http://www.example.com/x/src/something.js");

  consumer.destroy();
};

exports["test absolute sourceURL resolution with sourceMapURL"] = async function(assert) {
  const map = {
    version: 3,
    sources:  ["something.js"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: "http://www.example.com/src"
  };
  const consumer = await new SourceMapConsumer(map, "http://www.example.com/x/q.js.map");

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "http://www.example.com/src/something.js");

  consumer.destroy();
};

exports["test line numbers > 2**32"] = async function(assert) {
  const map = await new SourceMapConsumer({
    version: 3,
    sources:  ["something.js"],
    names: [],
    mappings: "C+/////DAS",
    file: "foo.js",
  });

  let error;
  try {
    // Triggers parse which fails on too big of a line number.
    map.eachMapping(m => console.log(m));
  } catch (e) {
    error = e;
  }

  assert.ok(error != null);
  map.destroy();
};

exports["test line numbers < 0"] = async function(assert) {
  const map = await new SourceMapConsumer({
    version: 3,
    sources:  ["something.js"],
    names: [],
    mappings: "CDAS",
    file: "foo.js",
  });

  let error;
  try {
    // Triggers parse which fails on too big of a line number.
    map.eachMapping(m => console.log(m));
  } catch (e) {
    error = e;
  }

  assert.ok(error != null);
  map.destroy();
};

exports["test SourceMapConsumer.with"] = async function(assert) {
  let consumer = null;
  const six = await SourceMapConsumer.with(util.testMap, null, async function(c) {
    // Don't keep references to the consumer around at home, kids.
    consumer = c;

    // We should properly treat the with callback as an async function.
    await new Promise(r => setTimeout(r, 1));

    // Should not have parsed and allocated mappings yet.
    assert.equal(c._mappingsPtr, 0);

    // Force the mappings to be parsed and assert that we allocated mappings.
    c.eachMapping(_ => {});
    assert.ok(c._mappingsPtr != 0);

    return 6;
  });

  // Yes, we can return values.
  assert.equal(six, 6);

  // At the end of `with`, we destroyed the mappings.
  assert.equal(consumer._mappingsPtr, 0);
};

exports["test SourceMapConsumer.with and exceptions"] = async function(assert) {
  let consumer = null;
  let error = null;

  try {
    await SourceMapConsumer.with(util.testMap, null, async function(c) {
      consumer = c;
      assert.equal(c._mappingsPtr, 0);

      c.eachMapping(_ => {});
      assert.ok(c._mappingsPtr != 0);

      throw 6;
    });
  } catch (e) {
    error = e;
  }

  assert.equal(error, 6);
  assert.equal(consumer._mappingsPtr, 0);
};
