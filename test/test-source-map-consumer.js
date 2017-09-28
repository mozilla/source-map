/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require("./util");
var SourceMapConsumer = require('../lib/source-map-consumer').SourceMapConsumer;
var IndexedSourceMapConsumer = require('../lib/source-map-consumer').IndexedSourceMapConsumer;
var BasicSourceMapConsumer = require('../lib/source-map-consumer').BasicSourceMapConsumer;
var SourceMapGenerator = require('../lib/source-map-generator').SourceMapGenerator;

exports['test that we can instantiate with a string or an object'] = function (assert) {
  assert.doesNotThrow(function () {
    var map = new SourceMapConsumer(util.testMap);
  });
  assert.doesNotThrow(function () {
    var map = new SourceMapConsumer(JSON.stringify(util.testMap));
  });
};

exports['test that the object returned from new SourceMapConsumer inherits from SourceMapConsumer'] = function (assert) {
  assert.ok(new SourceMapConsumer(util.testMap) instanceof SourceMapConsumer);
}

exports['test that a BasicSourceMapConsumer is returned for sourcemaps without sections'] = function(assert) {
  assert.ok(new SourceMapConsumer(util.testMap) instanceof BasicSourceMapConsumer);
};

exports['test that an IndexedSourceMapConsumer is returned for sourcemaps with sections'] = function(assert) {
  assert.ok(new SourceMapConsumer(util.indexedTestMap) instanceof IndexedSourceMapConsumer);
};

exports['test that the `sources` field has the original sources'] = function (assert) {
  var map;
  var sources;

  map = new SourceMapConsumer(util.testMap);
  sources = map.sources;
  assert.equal(sources[0], '/the/root/one.js');
  assert.equal(sources[1], '/the/root/two.js');
  assert.equal(sources.length, 2);

  map = new SourceMapConsumer(util.indexedTestMap);
  sources = map.sources;
  assert.equal(sources[0], '/the/root/one.js');
  assert.equal(sources[1], '/the/root/two.js');
  assert.equal(sources.length, 2);

  map = new SourceMapConsumer(util.indexedTestMapDifferentSourceRoots);
  sources = map.sources;
  assert.equal(sources[0], '/the/root/one.js');
  assert.equal(sources[1], '/different/root/two.js');
  assert.equal(sources.length, 2);

  map = new SourceMapConsumer(util.testMapNoSourceRoot);
  sources = map.sources;
  assert.equal(sources[0], 'one.js');
  assert.equal(sources[1], 'two.js');
  assert.equal(sources.length, 2);

  map = new SourceMapConsumer(util.testMapEmptySourceRoot);
  sources = map.sources;
  assert.equal(sources[0], 'one.js');
  assert.equal(sources[1], 'two.js');
  assert.equal(sources.length, 2);
};

exports['test that the source root is reflected in a mapping\'s source field'] = function (assert) {
  var map;
  var mapping;

  map = new SourceMapConsumer(util.testMap);

  mapping = map.originalPositionFor({
    line: 2,
    column: 1
  });
  assert.equal(mapping.source, '/the/root/two.js');

  mapping = map.originalPositionFor({
    line: 1,
    column: 1
  });
  assert.equal(mapping.source, '/the/root/one.js');


  map = new SourceMapConsumer(util.testMapNoSourceRoot);

  mapping = map.originalPositionFor({
    line: 2,
    column: 1
  });
  assert.equal(mapping.source, 'two.js');

  mapping = map.originalPositionFor({
    line: 1,
    column: 1
  });
  assert.equal(mapping.source, 'one.js');


  map = new SourceMapConsumer(util.testMapEmptySourceRoot);

  mapping = map.originalPositionFor({
    line: 2,
    column: 1
  });
  assert.equal(mapping.source, 'two.js');

  mapping = map.originalPositionFor({
    line: 1,
    column: 1
  });
  assert.equal(mapping.source, 'one.js');
};

exports['test mapping tokens back exactly'] = function (assert) {
  var map = new SourceMapConsumer(util.testMap);

  util.assertMapping(1, 1, '/the/root/one.js', 1, 1, null, null, map, assert);
  util.assertMapping(1, 5, '/the/root/one.js', 1, 5, null, null, map, assert);
  util.assertMapping(1, 9, '/the/root/one.js', 1, 11, null, null, map, assert);
  util.assertMapping(1, 18, '/the/root/one.js', 1, 21, 'bar', null, map, assert);
  util.assertMapping(1, 21, '/the/root/one.js', 2, 3, null, null, map, assert);
  util.assertMapping(1, 28, '/the/root/one.js', 2, 10, 'baz', null, map, assert);
  util.assertMapping(1, 32, '/the/root/one.js', 2, 14, 'bar', null, map, assert);

  util.assertMapping(2, 1, '/the/root/two.js', 1, 1, null, null, map, assert);
  util.assertMapping(2, 5, '/the/root/two.js', 1, 5, null, null, map, assert);
  util.assertMapping(2, 9, '/the/root/two.js', 1, 11, null, null, map, assert);
  util.assertMapping(2, 18, '/the/root/two.js', 1, 21, 'n', null, map, assert);
  util.assertMapping(2, 21, '/the/root/two.js', 2, 3, null, null, map, assert);
  util.assertMapping(2, 28, '/the/root/two.js', 2, 10, 'n', null, map, assert);
};

exports['test mapping tokens back exactly in indexed source map'] = function (assert) {
  var map = new SourceMapConsumer(util.indexedTestMap);

  util.assertMapping(1, 1, '/the/root/one.js', 1, 1, null, null, map, assert);
  util.assertMapping(1, 5, '/the/root/one.js', 1, 5, null, null, map, assert);
  util.assertMapping(1, 9, '/the/root/one.js', 1, 11, null, null, map, assert);
  util.assertMapping(1, 18, '/the/root/one.js', 1, 21, 'bar', null, map, assert);
  util.assertMapping(1, 21, '/the/root/one.js', 2, 3, null, null, map, assert);
  util.assertMapping(1, 28, '/the/root/one.js', 2, 10, 'baz', null, map, assert);
  util.assertMapping(1, 32, '/the/root/one.js', 2, 14, 'bar', null, map, assert);

  util.assertMapping(2, 1, '/the/root/two.js', 1, 1, null, null, map, assert);
  util.assertMapping(2, 5, '/the/root/two.js', 1, 5, null, null, map, assert);
  util.assertMapping(2, 9, '/the/root/two.js', 1, 11, null, null, map, assert);
  util.assertMapping(2, 18, '/the/root/two.js', 1, 21, 'n', null, map, assert);
  util.assertMapping(2, 21, '/the/root/two.js', 2, 3, null, null, map, assert);
  util.assertMapping(2, 28, '/the/root/two.js', 2, 10, 'n', null, map, assert);
};

exports['test mapping tokens fuzzy'] = function (assert) {
  var map = new SourceMapConsumer(util.testMap);

  // Finding original positions with default (glb) bias.
  util.assertMapping(1, 20, '/the/root/one.js', 1, 21, 'bar', null, map, assert, true);
  util.assertMapping(1, 30, '/the/root/one.js', 2, 10, 'baz', null, map, assert, true);
  util.assertMapping(2, 12, '/the/root/two.js', 1, 11, null, null, map, assert, true);

  // Finding original positions with lub bias.
  util.assertMapping(1, 16, '/the/root/one.js', 1, 21, 'bar', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(1, 26, '/the/root/one.js', 2, 10, 'baz', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(2, 6, '/the/root/two.js', 1, 11, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);

  // Finding generated positions with default (glb) bias.
  util.assertMapping(1, 18, '/the/root/one.js', 1, 22, 'bar', null, map, assert, null, true);
  util.assertMapping(1, 28, '/the/root/one.js', 2, 13, 'baz', null, map, assert, null, true);
  util.assertMapping(2, 9, '/the/root/two.js', 1, 16, null, null, map, assert, null, true);

  // Finding generated positions with lub bias.
  util.assertMapping(1, 18, '/the/root/one.js', 1, 20, 'bar', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(1, 28, '/the/root/one.js', 2, 7, 'baz', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(2, 9, '/the/root/two.js', 1, 6, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
};

exports['test mapping tokens fuzzy in indexed source map'] = function (assert) {
  var map = new SourceMapConsumer(util.indexedTestMap);

  // Finding original positions with default (glb) bias.
  util.assertMapping(1, 20, '/the/root/one.js', 1, 21, 'bar', null, map, assert, true);
  util.assertMapping(1, 30, '/the/root/one.js', 2, 10, 'baz', null, map, assert, true);
  util.assertMapping(2, 12, '/the/root/two.js', 1, 11, null, null, map, assert, true);

  // Finding original positions with lub bias.
  util.assertMapping(1, 16, '/the/root/one.js', 1, 21, 'bar', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(1, 26, '/the/root/one.js', 2, 10, 'baz', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);
  util.assertMapping(2, 6, '/the/root/two.js', 1, 11, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, true);

  // Finding generated positions with default (glb) bias.
  util.assertMapping(1, 18, '/the/root/one.js', 1, 22, 'bar', null, map, assert, null, true);
  util.assertMapping(1, 28, '/the/root/one.js', 2, 13, 'baz', null, map, assert, null, true);
  util.assertMapping(2, 9, '/the/root/two.js', 1, 16, null, null, map, assert, null, true);

  // Finding generated positions with lub bias.
  util.assertMapping(1, 18, '/the/root/one.js', 1, 20, 'bar', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(1, 28, '/the/root/one.js', 2, 7, 'baz', SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
  util.assertMapping(2, 9, '/the/root/two.js', 1, 6, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
};

exports['test mappings and end of lines'] = function (assert) {
  var smg = new SourceMapGenerator({
    file: 'foo.js'
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 1 },
    source: 'bar.js'
  });
  smg.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 2, column: 2 },
    source: 'bar.js'
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 1 },
    source: 'baz.js'
  });

  var map = SourceMapConsumer.fromSourceMap(smg);

  // When finding original positions, mappings end at the end of the line.
  util.assertMapping(2, 1, null, null, null, null, null, map, assert, true)

  // When finding generated positions, mappings do not end at the end of the line.
  util.assertMapping(1, 1, 'bar.js', 2, 1, null, null, map, assert, null, true);

  // When finding generated positions with, mappings end at the end of the source.
  util.assertMapping(null, null, 'bar.js', 3, 1, null, SourceMapConsumer.LEAST_UPPER_BOUND, map, assert, null, true);
};

exports['test creating source map consumers with )]}\' prefix'] = function (assert) {
  assert.doesNotThrow(function () {
    var map = new SourceMapConsumer(")]}'\n" + JSON.stringify(util.testMap));
  });
};

exports['test eachMapping'] = function (assert) {
  var map;

  map = new SourceMapConsumer(util.testMap);
  var previousLine = -Infinity;
  var previousColumn = -Infinity;
  map.eachMapping(function (mapping) {
    assert.ok(mapping.generatedLine >= previousLine);

    assert.ok(mapping.source === '/the/root/one.js' || mapping.source === '/the/root/two.js');

    if (mapping.generatedLine === previousLine) {
      assert.ok(mapping.generatedColumn >= previousColumn);
      previousColumn = mapping.generatedColumn;
    }
    else {
      previousLine = mapping.generatedLine;
      previousColumn = -Infinity;
    }
  });

  map = new SourceMapConsumer(util.testMapNoSourceRoot);
  map.eachMapping(function (mapping) {
    assert.ok(mapping.source === 'one.js' || mapping.source === 'two.js');
  });

  map = new SourceMapConsumer(util.testMapEmptySourceRoot);
  map.eachMapping(function (mapping) {
    assert.ok(mapping.source === 'one.js' || mapping.source === 'two.js');
  });
};

exports['test eachMapping for indexed source maps'] = function(assert) {
  var map = new SourceMapConsumer(util.indexedTestMap);
  var previousLine = -Infinity;
  var previousColumn = -Infinity;
  map.eachMapping(function (mapping) {
    assert.ok(mapping.generatedLine >= previousLine);

    if (mapping.source) {
      assert.equal(mapping.source.indexOf(util.testMap.sourceRoot), 0);
    }

    if (mapping.generatedLine === previousLine) {
      assert.ok(mapping.generatedColumn >= previousColumn);
      previousColumn = mapping.generatedColumn;
    }
    else {
      previousLine = mapping.generatedLine;
      previousColumn = -Infinity;
    }
  });
};


exports['test iterating over mappings in a different order'] = function (assert) {
  var map = new SourceMapConsumer(util.testMap);
  var previousLine = -Infinity;
  var previousColumn = -Infinity;
  var previousSource = "";
  map.eachMapping(function (mapping) {
    assert.ok(mapping.source >= previousSource);

    if (mapping.source === previousSource) {
      assert.ok(mapping.originalLine >= previousLine);

      if (mapping.originalLine === previousLine) {
        assert.ok(mapping.originalColumn >= previousColumn);
        previousColumn = mapping.originalColumn;
      }
      else {
        previousLine = mapping.originalLine;
        previousColumn = -Infinity;
      }
    }
    else {
      previousSource = mapping.source;
      previousLine = -Infinity;
      previousColumn = -Infinity;
    }
  }, null, SourceMapConsumer.ORIGINAL_ORDER);
};

exports['test iterating over mappings in a different order in indexed source maps'] = function (assert) {
  var map = new SourceMapConsumer(util.indexedTestMap);
  var previousLine = -Infinity;
  var previousColumn = -Infinity;
  var previousSource = "";
  map.eachMapping(function (mapping) {
    assert.ok(mapping.source >= previousSource);

    if (mapping.source === previousSource) {
      assert.ok(mapping.originalLine >= previousLine);

      if (mapping.originalLine === previousLine) {
        assert.ok(mapping.originalColumn >= previousColumn);
        previousColumn = mapping.originalColumn;
      }
      else {
        previousLine = mapping.originalLine;
        previousColumn = -Infinity;
      }
    }
    else {
      previousSource = mapping.source;
      previousLine = -Infinity;
      previousColumn = -Infinity;
    }
  }, null, SourceMapConsumer.ORIGINAL_ORDER);
};

exports['test that we can set the context for `this` in eachMapping'] = function (assert) {
  var map = new SourceMapConsumer(util.testMap);
  var context = {};
  map.eachMapping(function () {
    assert.equal(this, context);
  }, context);
};

exports['test that we can set the context for `this` in eachMapping in indexed source maps'] = function (assert) {
  var map = new SourceMapConsumer(util.indexedTestMap);
  var context = {};
  map.eachMapping(function () {
    assert.equal(this, context);
  }, context);
};

exports['test that the `sourcesContent` field has the original sources'] = function (assert) {
  var map = new SourceMapConsumer(util.testMapWithSourcesContent);
  var sourcesContent = map.sourcesContent;

  assert.equal(sourcesContent[0], ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(sourcesContent[1], ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.equal(sourcesContent.length, 2);
};

exports['test that we can get the original sources for the sources'] = function (assert) {
  var map = new SourceMapConsumer(util.testMapWithSourcesContent);
  var sources = map.sources;

  assert.equal(map.sourceContentFor(sources[0]), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(map.sourceContentFor(sources[1]), ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.equal(map.sourceContentFor("one.js"), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(map.sourceContentFor("two.js"), ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.throws(function () {
    map.sourceContentFor("");
  }, Error);
  assert.throws(function () {
    map.sourceContentFor("/the/root/three.js");
  }, Error);
  assert.throws(function () {
    map.sourceContentFor("three.js");
  }, Error);
};

exports['test that we can get the original source content with relative source paths'] = function (assert) {
  var map = new SourceMapConsumer(util.testMapRelativeSources);
  var sources = map.sources;

  assert.equal(map.sourceContentFor(sources[0]), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(map.sourceContentFor(sources[1]), ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.equal(map.sourceContentFor("one.js"), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(map.sourceContentFor("two.js"), ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.throws(function () {
    map.sourceContentFor("");
  }, Error);
  assert.throws(function () {
    map.sourceContentFor("/the/root/three.js");
  }, Error);
  assert.throws(function () {
    map.sourceContentFor("three.js");
  }, Error);
};

exports['test that we can get the original source content for the sources on an indexed source map'] = function (assert) {
  var map = new SourceMapConsumer(util.indexedTestMap);
  var sources = map.sources;

  assert.equal(map.sourceContentFor(sources[0]), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(map.sourceContentFor(sources[1]), ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.equal(map.sourceContentFor("one.js"), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
  assert.equal(map.sourceContentFor("two.js"), ' TWO.inc = function (n) {\n   return n + 1;\n };');
  assert.throws(function () {
    map.sourceContentFor("");
  }, Error);
  assert.throws(function () {
    map.sourceContentFor("/the/root/three.js");
  }, Error);
  assert.throws(function () {
    map.sourceContentFor("three.js");
  }, Error);
};

exports['test hasContentsOfAllSources, single source with contents'] = function (assert) {
  // Has one source: foo.js (with contents).
  var mapWithContents = new SourceMapGenerator();
  mapWithContents.addMapping({ source: 'foo.js',
                               original: { line: 1, column: 10 },
                               generated: { line: 1, column: 10 } });
  mapWithContents.setSourceContent('foo.js', 'content of foo.js');
  var consumer = new SourceMapConsumer(mapWithContents.toJSON());
  assert.ok(consumer.hasContentsOfAllSources());
};

exports['test hasContentsOfAllSources, single source without contents'] = function (assert) {
  // Has one source: foo.js (without contents).
  var mapWithoutContents = new SourceMapGenerator();
  mapWithoutContents.addMapping({ source: 'foo.js',
                                  original: { line: 1, column: 10 },
                                  generated: { line: 1, column: 10 } });
  var consumer = new SourceMapConsumer(mapWithoutContents.toJSON());
  assert.ok(!consumer.hasContentsOfAllSources());
};

exports['test hasContentsOfAllSources, two sources with contents'] = function (assert) {
  // Has two sources: foo.js (with contents) and bar.js (with contents).
  var mapWithBothContents = new SourceMapGenerator();
  mapWithBothContents.addMapping({ source: 'foo.js',
                                   original: { line: 1, column: 10 },
                                   generated: { line: 1, column: 10 } });
  mapWithBothContents.addMapping({ source: 'bar.js',
                                   original: { line: 1, column: 10 },
                                   generated: { line: 1, column: 10 } });
  mapWithBothContents.setSourceContent('foo.js', 'content of foo.js');
  mapWithBothContents.setSourceContent('bar.js', 'content of bar.js');
  var consumer = new SourceMapConsumer(mapWithBothContents.toJSON());
  assert.ok(consumer.hasContentsOfAllSources());
};

exports['test hasContentsOfAllSources, two sources one with and one without contents'] = function (assert) {
  // Has two sources: foo.js (with contents) and bar.js (without contents).
  var mapWithoutSomeContents = new SourceMapGenerator();
  mapWithoutSomeContents.addMapping({ source: 'foo.js',
                                      original: { line: 1, column: 10 },
                                      generated: { line: 1, column: 10 } });
  mapWithoutSomeContents.addMapping({ source: 'bar.js',
                                      original: { line: 1, column: 10 },
                                      generated: { line: 1, column: 10 } });
  mapWithoutSomeContents.setSourceContent('foo.js', 'content of foo.js');
  var consumer = new SourceMapConsumer(mapWithoutSomeContents.toJSON());
  assert.ok(!consumer.hasContentsOfAllSources());
};

exports['test sourceRoot + generatedPositionFor'] = function (assert) {
  var map = new SourceMapGenerator({
    sourceRoot: 'foo/bar',
    file: 'baz.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bang.coffee'
  });
  map.addMapping({
    original: { line: 5, column: 5 },
    generated: { line: 6, column: 6 },
    source: 'bang.coffee'
  });
  map = new SourceMapConsumer(map.toString(), 'http://example.com/');

  // Should handle without sourceRoot.
  var pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'bang.coffee'
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  // Should handle with sourceRoot.
  var pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'foo/bar/bang.coffee'
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  // Should handle absolute case.
  var pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'http://example.com/foo/bar/bang.coffee'
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);
};

exports['test sourceRoot + generatedPositionFor for path above the root'] = function (assert) {
  var map = new SourceMapGenerator({
    sourceRoot: 'foo/bar',
    file: 'baz.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: '../bang.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  // Should handle with sourceRoot.
  var pos = map.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'foo/bang.coffee'
  });

  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);
};

exports['test allGeneratedPositionsFor for line'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bar.coffee'
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 3, column: 2 },
    source: 'bar.coffee'
  });
  map.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 3, column: 3 },
    source: 'bar.coffee'
  });
  map.addMapping({
    original: { line: 3, column: 1 },
    generated: { line: 4, column: 2 },
    source: 'bar.coffee'
  });
  map = new SourceMapConsumer(map.toString(), 'http://example.com/');

  var mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: 'bar.coffee'
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 3);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 3);
  assert.equal(mappings[1].column, 3);

  mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: 'http://example.com/bar.coffee'
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 3);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 3);
  assert.equal(mappings[1].column, 3);
};

exports['test allGeneratedPositionsFor for line fuzzy'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bar.coffee'
  });
  map.addMapping({
    original: { line: 3, column: 1 },
    generated: { line: 4, column: 2 },
    source: 'bar.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  var mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: 'bar.coffee'
  });

  assert.equal(mappings.length, 1);
  assert.equal(mappings[0].line, 4);
  assert.equal(mappings[0].column, 2);
};

exports['test allGeneratedPositionsFor for empty source map'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map = new SourceMapConsumer(map.toString());

  var mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: 'bar.coffee'
  });

  assert.equal(mappings.length, 0);
};

exports['test allGeneratedPositionsFor for column'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 2 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 3 },
    source: 'foo.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  var mappings = map.allGeneratedPositionsFor({
    line: 1,
    column: 1,
    source: 'foo.coffee'
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 1);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 1);
  assert.equal(mappings[1].column, 3);
};

exports['test allGeneratedPositionsFor for column fuzzy'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 2 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 3 },
    source: 'foo.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  var mappings = map.allGeneratedPositionsFor({
    line: 1,
    column: 0,
    source: 'foo.coffee'
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].line, 1);
  assert.equal(mappings[0].column, 2);
  assert.equal(mappings[1].line, 1);
  assert.equal(mappings[1].column, 3);
};

exports['test allGeneratedPositionsFor for column on different line fuzzy'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 2, column: 3 },
    source: 'foo.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  var mappings = map.allGeneratedPositionsFor({
    line: 1,
    column: 0,
    source: 'foo.coffee'
  });

  assert.equal(mappings.length, 0);
};

exports['test computeColumnSpans'] = function (assert) {
  var map = new SourceMapGenerator({
    file: 'generated.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 1, column: 1 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 2, column: 1 },
    generated: { line: 2, column: 1 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 2, column: 10 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 2, column: 3 },
    generated: { line: 2, column: 20 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 3, column: 1 },
    generated: { line: 3, column: 1 },
    source: 'foo.coffee'
  });
  map.addMapping({
    original: { line: 3, column: 2 },
    generated: { line: 3, column: 2 },
    source: 'foo.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  map.computeColumnSpans();

  var mappings = map.allGeneratedPositionsFor({
    line: 1,
    source: 'foo.coffee'
  });

  assert.equal(mappings.length, 1);
  assert.equal(mappings[0].lastColumn, Infinity);

  var mappings = map.allGeneratedPositionsFor({
    line: 2,
    source: 'foo.coffee'
  });

  assert.equal(mappings.length, 3);
  assert.equal(mappings[0].lastColumn, 9);
  assert.equal(mappings[1].lastColumn, 19);
  assert.equal(mappings[2].lastColumn, Infinity);

  var mappings = map.allGeneratedPositionsFor({
    line: 3,
    source: 'foo.coffee'
  });

  assert.equal(mappings.length, 2);
  assert.equal(mappings[0].lastColumn, 1);
  assert.equal(mappings[1].lastColumn, Infinity);
};

exports['test sourceRoot + originalPositionFor'] = function (assert) {
  var map = new SourceMapGenerator({
    sourceRoot: 'foo/bar',
    file: 'baz.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bang.coffee'
  });
  map = new SourceMapConsumer(map.toString());

  var pos = map.originalPositionFor({
    line: 2,
    column: 2,
  });

  // Should always have the prepended source root
  assert.equal(pos.source, 'foo/bar/bang.coffee');
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);
};

exports['test github issue #56'] = function (assert) {
  var map = new SourceMapGenerator({
    sourceRoot: 'http://',
    file: 'www.example.com/foo.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'www.example.com/original.js'
  });
  map = new SourceMapConsumer(map.toString());

  var sources = map.sources;
  assert.equal(sources.length, 1);
  assert.equal(sources[0], 'http://www.example.com/original.js');
};

// Was github issue #43, but that's no longer valid.
exports['test source resolution with sourceMapURL'] = function (assert) {
  var map = new SourceMapGenerator({
    sourceRoot: '',
    file: 'foo.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'original.js',
  });
  map = new SourceMapConsumer(map.toString(), 'http://cdn.example.com');

  var sources = map.sources;
  assert.equal(sources.length, 1,
               'Should only be one source.');
  assert.equal(sources[0], 'http://cdn.example.com/original.js',
               'Should be joined with the source map URL.');
};

exports['test sourceRoot prepending'] = function (assert) {
  var map = new SourceMapGenerator({
    sourceRoot: 'http://example.com/foo/bar',
    file: 'foo.js'
  });
  map.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: '/original.js'
  });
  map = new SourceMapConsumer(map.toString());

  var sources = map.sources;
  assert.equal(sources.length, 1,
               'Should only be one source.');
  assert.equal(sources[0], 'http://example.com/foo/bar/original.js',
               'Source include the source root.');
};

exports['test indexed source map errors when sections are out of order by line'] = function(assert) {
  // Make a deep copy of the indexedTestMap
  var misorderedIndexedTestMap = JSON.parse(JSON.stringify(util.indexedTestMap));

  misorderedIndexedTestMap.sections[0].offset = {
    line: 2,
    column: 0
  };

  assert.throws(function() {
    new SourceMapConsumer(misorderedIndexedTestMap);
  }, Error);
};

exports['test github issue #64'] = function (assert) {
  var map = new SourceMapConsumer({
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
};

exports['test full source content with sourceMapURL'] = function (assert) {
  var map = new SourceMapConsumer({
    'version': 3,
    'file': 'foo.js',
    'sourceRoot': '',
    'sources': ['original.js'],
    'names': [],
    'mappings': 'AACA',
    'sourcesContent': ['yellow warbler']
  }, 'http://cdn.example.com');

  var sources = map.sources;
  assert.equal(map.sourceContentFor('http://cdn.example.com/original.js'), 'yellow warbler',
               'Source content should be found using full URL');
};

exports['test bug 885597'] = function (assert) {
  var map = new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sourceRoot": "file:///Users/AlGore/Invented/The/Internet/",
    "sources": ["/a"],
    "names": [],
    "mappings": "AACA",
    "sourcesContent": ["foo"]
  });

  var s = map.sources[0];
  assert.equal(map.sourceContentFor(s), "foo");
};

exports['test github issue #72, duplicate sources'] = function (assert) {
  var map = new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sources": ["source1.js", "source1.js", "source3.js"],
    "names": [],
    "mappings": ";EAAC;;IAEE;;MEEE",
    "sourceRoot": "http://example.com"
  });

  var pos = map.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.source, 'http://example.com/source1.js');
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);

  var pos = map.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.source, 'http://example.com/source1.js');
  assert.equal(pos.line, 3);
  assert.equal(pos.column, 3);

  var pos = map.originalPositionFor({
    line: 6,
    column: 6
  });
  assert.equal(pos.source, 'http://example.com/source3.js');
  assert.equal(pos.line, 5);
  assert.equal(pos.column, 5);
};

exports['test github issue #72, duplicate names'] = function (assert) {
  var map = new SourceMapConsumer({
    "version": 3,
    "file": "foo.js",
    "sources": ["source.js"],
    "names": ["name1", "name1", "name3"],
    "mappings": ";EAACA;;IAEEA;;MAEEE",
    "sourceRoot": "http://example.com"
  });

  var pos = map.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.name, 'name1');
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);

  var pos = map.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.name, 'name1');
  assert.equal(pos.line, 3);
  assert.equal(pos.column, 3);

  var pos = map.originalPositionFor({
    line: 6,
    column: 6
  });
  assert.equal(pos.name, 'name3');
  assert.equal(pos.line, 5);
  assert.equal(pos.column, 5);
};

exports['test SourceMapConsumer.fromSourceMap'] = function (assert) {
  var smg = new SourceMapGenerator({
    sourceRoot: 'http://example.com/',
    file: 'foo.js'
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bar.js'
  });
  smg.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 4, column: 4 },
    source: 'baz.js',
    name: 'dirtMcGirt'
  });
  smg.setSourceContent('baz.js', 'baz.js content');

  var smc = SourceMapConsumer.fromSourceMap(smg);
  assert.equal(smc.file, 'foo.js');
  assert.equal(smc.sourceRoot, 'http://example.com/');
  assert.equal(smc.sources.length, 2);
  assert.equal(smc.sources[0], 'http://example.com/bar.js');
  assert.equal(smc.sources[1], 'http://example.com/baz.js');
  assert.equal(smc.sourceContentFor('baz.js'), 'baz.js content');

  var pos = smc.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);
  assert.equal(pos.source, 'http://example.com/bar.js');
  assert.equal(pos.name, null);

  pos = smc.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'http://example.com/bar.js'
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  pos = smc.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);
  assert.equal(pos.source, 'http://example.com/baz.js');
  assert.equal(pos.name, 'dirtMcGirt');

  pos = smc.generatedPositionFor({
    line: 2,
    column: 2,
    source: 'http://example.com/baz.js'
  });
  assert.equal(pos.line, 4);
  assert.equal(pos.column, 4);
};

exports['test issue #191'] = function (assert) {
  var generator = new SourceMapGenerator({ file: 'a.css' });
  generator.addMapping({
    source:   'b.css',
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
  var consumer  = SourceMapConsumer.fromSourceMap(generator);
  // ... and then try and use the SourceMapGenerator again. This should not
  // throw.
  generator.toJSON();

  assert.ok(true, "Using a SourceMapGenerator again after creating a " +
                  "SourceMapConsumer from it should not throw");
};

exports['test sources where their prefix is the source root: issue #199'] = function (assert) {
  var testSourceMap = {
    "version": 3,
    "sources": ["/source/app/app/app.js"],
    "names": ["System"],
    "mappings": "AAAAA",
    "file": "app/app.js",
    "sourcesContent": ["'use strict';"],
    "sourceRoot":"/source/"
  };

  var consumer = new SourceMapConsumer(testSourceMap);

  function consumerHasSource(s) {
    assert.ok(consumer.sourceContentFor(s));
  }

  consumer.sources.forEach(consumerHasSource);
  testSourceMap.sources.forEach(consumerHasSource);
};

exports['test sources where their prefix is the source root and the source root is a url: issue #199'] = function (assert) {
  var testSourceMap = {
    "version": 3,
    "sources": ["http://example.com/source/app/app/app.js"],
    "names": ["System"],
    "mappings": "AAAAA",
    "sourcesContent": ["'use strict';"],
    "sourceRoot":"http://example.com/source/"
  };

  var consumer = new SourceMapConsumer(testSourceMap);

  function consumerHasSource(s) {
    assert.ok(consumer.sourceContentFor(s));
  }

  consumer.sources.forEach(consumerHasSource);
  testSourceMap.sources.forEach(consumerHasSource);
};

exports['test consuming names and sources that are numbers'] = function (assert) {
  var testSourceMap = {
    "version": 3,
    "sources": [0],
    "names": [1],
    "mappings": "AAAAA",
  };

  var consumer = new SourceMapConsumer(testSourceMap);

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "0");

  var i = 0;
  consumer.eachMapping(function (m) {
    i++;
    assert.equal(m.name, "1");
  });
  assert.equal(i, 1);
};

exports['test non-normalized sourceRoot (from issue #227)'] = function (assert) {
  var consumer = new SourceMapConsumer({
    version: 3,
    sources: [ 'index.js' ],
    names: [],
    mappings: ';;AAAA,IAAI,OAAO,MAAP',
    file: 'index.js',
    sourceRoot: './src/',
    sourcesContent: [ 'var name = "Mark"\n' ]
  });
  assert.equal(consumer.sourceRoot, 'src/', 'sourceRoot was normalized');
  // Before the fix, this threw an exception.
  consumer.sourceContentFor(consumer.sources[0]);
};

exports['test webpack URL resolution'] = function (assert) {
  var map = {
    version: 3,
    sources:  ["webpack:///webpack/bootstrap 67e184f9679733298d44"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: ""
  };
  var consumer = new SourceMapConsumer(map);

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap 67e184f9679733298d44");
};

exports['test webpack URL resolution with sourceMapURL'] = function (assert) {
  var map = {
    version: 3,
    sources:  ["webpack:///webpack/bootstrap 67e184f9679733298d44"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: ""
  };
  var consumer = new SourceMapConsumer(map, 'http://www.example.com/q.js.map');

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap 67e184f9679733298d44");
};

exports['test relative webpack URL resolution with sourceMapURL'] = function (assert) {
  var map = {
    version: 3,
    sources:  ["webpack/bootstrap.js"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: "webpack:///"
  };
  var consumer = new SourceMapConsumer(map, 'http://www.example.com/q.js.map');

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap.js");
};

exports['test basic URL resolution with sourceMapURL'] = function (assert) {
  var map = {
    version: 3,
    sources:  ["something.js"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: "src"
  };
  var consumer = new SourceMapConsumer(map, 'http://www.example.com/x/q.js.map');

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], 'http://www.example.com/x/src/something.js');
};

exports['test absolute sourceURL resolution with sourceMapURL'] = function (assert) {
  var map = {
    version: 3,
    sources:  ["something.js"],
    names: [],
    mappings: "CAAS",
    file: "static/js/manifest.b7cf97680f7a50fa150f.js",
    sourceRoot: "http://www.example.com/src"
  };
  var consumer = new SourceMapConsumer(map, 'http://www.example.com/x/q.js.map');

  assert.equal(consumer.sources.length, 1);
  assert.equal(consumer.sources[0], 'http://www.example.com/src/something.js');
};
