function run_test() {
  for (var k in SOURCE_MAP_TEST_MODULE) {
    if (/^test/.test(k)) {
      SOURCE_MAP_TEST_MODULE[k](assert);
    }
  }
}


var SOURCE_MAP_TEST_MODULE =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(1);
	var SourceMapConsumer = __webpack_require__(3).SourceMapConsumer;
	var IndexedSourceMapConsumer = __webpack_require__(3).IndexedSourceMapConsumer;
	var BasicSourceMapConsumer = __webpack_require__(3).BasicSourceMapConsumer;
	var SourceMapGenerator = __webpack_require__(9).SourceMapGenerator;
	
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
	    var map = new SourceMapConsumer(")]}'" + JSON.stringify(util.testMap));
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
	  map = new SourceMapConsumer(map.toString());
	
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
	  map = new SourceMapConsumer(map.toString());
	
	  var mappings = map.allGeneratedPositionsFor({
	    line: 2,
	    source: 'bar.coffee'
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
	
	exports['test github issue #43'] = function (assert) {
	  var map = new SourceMapGenerator({
	    sourceRoot: 'http://example.com',
	    file: 'foo.js'
	  });
	  map.addMapping({
	    original: { line: 1, column: 1 },
	    generated: { line: 2, column: 2 },
	    source: 'http://cdn.example.com/original.js'
	  });
	  map = new SourceMapConsumer(map.toString());
	
	  var sources = map.sources;
	  assert.equal(sources.length, 1,
	               'Should only be one source.');
	  assert.equal(sources[0], 'http://cdn.example.com/original.js',
	               'Should not be joined with the sourceRoot.');
	};
	
	exports['test absolute path, but same host sources'] = function (assert) {
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
	  assert.equal(sources[0], 'http://example.com/original.js',
	               'Source should be relative the host of the source root.');
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
	    "version":3,
	    "sources": ["webpack:///webpack/bootstrap 67e184f9679733298d44"],
	    "names":[],
	    "mappings":"CAAS",
	    "file":"static/js/manifest.b7cf97680f7a50fa150f.js",
	    "sourceRoot":""
	  };
	  var consumer = new SourceMapConsumer(map);
	
	  assert.equal(consumer.sources.length, 1);
	  assert.equal(consumer.sources[0], "webpack:///webpack/bootstrap 67e184f9679733298d44");
	};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(2);
	
	// This is a test mapping which maps functions from two different files
	// (one.js and two.js) to a minified generated source.
	//
	// Here is one.js:
	//
	//   ONE.foo = function (bar) {
	//     return baz(bar);
	//   };
	//
	// Here is two.js:
	//
	//   TWO.inc = function (n) {
	//     return n + 1;
	//   };
	//
	// And here is the generated code (min.js):
	//
	//   ONE.foo=function(a){return baz(a);};
	//   TWO.inc=function(a){return a+1;};
	exports.testGeneratedCode = " ONE.foo=function(a){return baz(a);};\n"+
	                            " TWO.inc=function(a){return a+1;};";
	exports.testMap = {
	  version: 3,
	  file: 'min.js',
	  names: ['bar', 'baz', 'n'],
	  sources: ['one.js', 'two.js'],
	  sourceRoot: '/the/root',
	  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
	};
	exports.testMapNoSourceRoot = {
	  version: 3,
	  file: 'min.js',
	  names: ['bar', 'baz', 'n'],
	  sources: ['one.js', 'two.js'],
	  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
	};
	exports.testMapEmptySourceRoot = {
	  version: 3,
	  file: 'min.js',
	  names: ['bar', 'baz', 'n'],
	  sources: ['one.js', 'two.js'],
	  sourceRoot: '',
	  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
	};
	exports.testMapSingleSource = {
	  version: 3,
	  file: 'min.js',
	  names: ['bar', 'baz'],
	  sources: ['one.js'],
	  sourceRoot: '',
	  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID'
	};
	exports.testMapEmptyMappings = {
	  version: 3,
	  file: 'min.js',
	  names: [],
	  sources: ['one.js', 'two.js'],
	  sourcesContent: [
	    ' ONE.foo = 1;',
	    ' TWO.inc = 2;'
	  ],
	  sourceRoot: '',
	  mappings: ''
	};
	exports.testMapEmptyMappingsRelativeSources = {
	  version: 3,
	  file: 'min.js',
	  names: [],
	  sources: ['./one.js', './two.js'],
	  sourcesContent: [
	    ' ONE.foo = 1;',
	    ' TWO.inc = 2;'
	  ],
	  sourceRoot: '/the/root',
	  mappings: ''
	};
	exports.testMapEmptyMappingsRelativeSources_generatedExpected = {
	  version: 3,
	  file: 'min.js',
	  names: [],
	  sources: ['one.js', 'two.js'],
	  sourcesContent: [
	    ' ONE.foo = 1;',
	    ' TWO.inc = 2;'
	  ],
	  sourceRoot: '/the/root',
	  mappings: ''
	};
	exports.testMapMultiSourcesMappingRefersSingleSourceOnly = {
	    version: 3,
	    file: 'min.js',
	    names: ['bar', 'baz'],
	    sources: ['one.js', 'withoutMappings.js'],
	    sourceRoot: '',
	    mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID'
	};
	// This mapping is identical to above, but uses the indexed format instead.
	exports.indexedTestMap = {
	  version: 3,
	  file: 'min.js',
	  sections: [
	    {
	      offset: {
	        line: 0,
	        column: 0
	      },
	      map: {
	        version: 3,
	        sources: [
	          "one.js"
	        ],
	        sourcesContent: [
	          ' ONE.foo = function (bar) {\n' +
	          '   return baz(bar);\n' +
	          ' };',
	        ],
	        names: [
	          "bar",
	          "baz"
	        ],
	        mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID",
	        file: "min.js",
	        sourceRoot: "/the/root"
	      }
	    },
	    {
	      offset: {
	        line: 1,
	        column: 0
	      },
	      map: {
	        version: 3,
	        sources: [
	          "two.js"
	        ],
	        sourcesContent: [
	          ' TWO.inc = function (n) {\n' +
	          '   return n + 1;\n' +
	          ' };'
	        ],
	        names: [
	          "n"
	        ],
	        mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOA",
	        file: "min.js",
	        sourceRoot: "/the/root"
	      }
	    }
	  ]
	};
	exports.indexedTestMapDifferentSourceRoots = {
	  version: 3,
	  file: 'min.js',
	  sections: [
	    {
	      offset: {
	        line: 0,
	        column: 0
	      },
	      map: {
	        version: 3,
	        sources: [
	          "one.js"
	        ],
	        sourcesContent: [
	          ' ONE.foo = function (bar) {\n' +
	          '   return baz(bar);\n' +
	          ' };',
	        ],
	        names: [
	          "bar",
	          "baz"
	        ],
	        mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID",
	        file: "min.js",
	        sourceRoot: "/the/root"
	      }
	    },
	    {
	      offset: {
	        line: 1,
	        column: 0
	      },
	      map: {
	        version: 3,
	        sources: [
	          "two.js"
	        ],
	        sourcesContent: [
	          ' TWO.inc = function (n) {\n' +
	          '   return n + 1;\n' +
	          ' };'
	        ],
	        names: [
	          "n"
	        ],
	        mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOA",
	        file: "min.js",
	        sourceRoot: "/different/root"
	      }
	    }
	  ]
	};
	exports.testMapWithSourcesContent = {
	  version: 3,
	  file: 'min.js',
	  names: ['bar', 'baz', 'n'],
	  sources: ['one.js', 'two.js'],
	  sourcesContent: [
	    ' ONE.foo = function (bar) {\n' +
	    '   return baz(bar);\n' +
	    ' };',
	    ' TWO.inc = function (n) {\n' +
	    '   return n + 1;\n' +
	    ' };'
	  ],
	  sourceRoot: '/the/root',
	  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
	};
	exports.testMapRelativeSources = {
	  version: 3,
	  file: 'min.js',
	  names: ['bar', 'baz', 'n'],
	  sources: ['./one.js', './two.js'],
	  sourcesContent: [
	    ' ONE.foo = function (bar) {\n' +
	    '   return baz(bar);\n' +
	    ' };',
	    ' TWO.inc = function (n) {\n' +
	    '   return n + 1;\n' +
	    ' };'
	  ],
	  sourceRoot: '/the/root',
	  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
	};
	exports.emptyMap = {
	  version: 3,
	  file: 'min.js',
	  names: [],
	  sources: [],
	  mappings: ''
	};
	
	
	function assertMapping(generatedLine, generatedColumn, originalSource,
	                       originalLine, originalColumn, name, bias, map, assert,
	                       dontTestGenerated, dontTestOriginal) {
	  if (!dontTestOriginal) {
	    var origMapping = map.originalPositionFor({
	      line: generatedLine,
	      column: generatedColumn,
	      bias: bias
	    });
	    assert.equal(origMapping.name, name,
	                 'Incorrect name, expected ' + JSON.stringify(name)
	                 + ', got ' + JSON.stringify(origMapping.name));
	    assert.equal(origMapping.line, originalLine,
	                 'Incorrect line, expected ' + JSON.stringify(originalLine)
	                 + ', got ' + JSON.stringify(origMapping.line));
	    assert.equal(origMapping.column, originalColumn,
	                 'Incorrect column, expected ' + JSON.stringify(originalColumn)
	                 + ', got ' + JSON.stringify(origMapping.column));
	
	    var expectedSource;
	
	    if (originalSource && map.sourceRoot && originalSource.indexOf(map.sourceRoot) === 0) {
	      expectedSource = originalSource;
	    } else if (originalSource) {
	      expectedSource = map.sourceRoot
	        ? util.join(map.sourceRoot, originalSource)
	        : originalSource;
	    } else {
	      expectedSource = null;
	    }
	
	    assert.equal(origMapping.source, expectedSource,
	                 'Incorrect source, expected ' + JSON.stringify(expectedSource)
	                 + ', got ' + JSON.stringify(origMapping.source));
	  }
	
	  if (!dontTestGenerated) {
	    var genMapping = map.generatedPositionFor({
	      source: originalSource,
	      line: originalLine,
	      column: originalColumn,
	      bias: bias
	    });
	    assert.equal(genMapping.line, generatedLine,
	                 'Incorrect line, expected ' + JSON.stringify(generatedLine)
	                 + ', got ' + JSON.stringify(genMapping.line));
	    assert.equal(genMapping.column, generatedColumn,
	                 'Incorrect column, expected ' + JSON.stringify(generatedColumn)
	                 + ', got ' + JSON.stringify(genMapping.column));
	  }
	}
	exports.assertMapping = assertMapping;
	
	function assertEqualMaps(assert, actualMap, expectedMap) {
	  assert.equal(actualMap.version, expectedMap.version, "version mismatch");
	  assert.equal(actualMap.file, expectedMap.file, "file mismatch");
	  assert.equal(actualMap.names.length,
	               expectedMap.names.length,
	               "names length mismatch: " +
	                 actualMap.names.join(", ") + " != " + expectedMap.names.join(", "));
	  for (var i = 0; i < actualMap.names.length; i++) {
	    assert.equal(actualMap.names[i],
	                 expectedMap.names[i],
	                 "names[" + i + "] mismatch: " +
	                   actualMap.names.join(", ") + " != " + expectedMap.names.join(", "));
	  }
	  assert.equal(actualMap.sources.length,
	               expectedMap.sources.length,
	               "sources length mismatch: " +
	                 actualMap.sources.join(", ") + " != " + expectedMap.sources.join(", "));
	  for (var i = 0; i < actualMap.sources.length; i++) {
	    assert.equal(actualMap.sources[i],
	                 expectedMap.sources[i],
	                 "sources[" + i + "] length mismatch: " +
	                 actualMap.sources.join(", ") + " != " + expectedMap.sources.join(", "));
	  }
	  assert.equal(actualMap.sourceRoot,
	               expectedMap.sourceRoot,
	               "sourceRoot mismatch: " +
	                 actualMap.sourceRoot + " != " + expectedMap.sourceRoot);
	  assert.equal(actualMap.mappings, expectedMap.mappings,
	               "mappings mismatch:\nActual:   " + actualMap.mappings + "\nExpected: " + expectedMap.mappings);
	  if (actualMap.sourcesContent) {
	    assert.equal(actualMap.sourcesContent.length,
	                 expectedMap.sourcesContent.length,
	                 "sourcesContent length mismatch");
	    for (var i = 0; i < actualMap.sourcesContent.length; i++) {
	      assert.equal(actualMap.sourcesContent[i],
	                   expectedMap.sourcesContent[i],
	                   "sourcesContent[" + i + "] mismatch");
	    }
	  }
	}
	exports.assertEqualMaps = assertEqualMaps;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	/**
	 * This is a helper function for getting values from parameter/options
	 * objects.
	 *
	 * @param args The object we are extracting values from
	 * @param name The name of the property we are getting.
	 * @param defaultValue An optional value to return if the property is missing
	 * from the object. If this is not specified and the property is missing, an
	 * error will be thrown.
	 */
	function getArg(aArgs, aName, aDefaultValue) {
	  if (aName in aArgs) {
	    return aArgs[aName];
	  } else if (arguments.length === 3) {
	    return aDefaultValue;
	  } else {
	    throw new Error('"' + aName + '" is a required argument.');
	  }
	}
	exports.getArg = getArg;
	
	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;
	
	function urlParse(aUrl) {
	  var match = aUrl.match(urlRegexp);
	  if (!match) {
	    return null;
	  }
	  return {
	    scheme: match[1],
	    auth: match[2],
	    host: match[3],
	    port: match[4],
	    path: match[5]
	  };
	}
	exports.urlParse = urlParse;
	
	function urlGenerate(aParsedUrl) {
	  var url = '';
	  if (aParsedUrl.scheme) {
	    url += aParsedUrl.scheme + ':';
	  }
	  url += '//';
	  if (aParsedUrl.auth) {
	    url += aParsedUrl.auth + '@';
	  }
	  if (aParsedUrl.host) {
	    url += aParsedUrl.host;
	  }
	  if (aParsedUrl.port) {
	    url += ":" + aParsedUrl.port
	  }
	  if (aParsedUrl.path) {
	    url += aParsedUrl.path;
	  }
	  return url;
	}
	exports.urlGenerate = urlGenerate;
	
	/**
	 * Normalizes a path, or the path portion of a URL:
	 *
	 * - Replaces consecutive slashes with one slash.
	 * - Removes unnecessary '.' parts.
	 * - Removes unnecessary '<dir>/..' parts.
	 *
	 * Based on code in the Node.js 'path' core module.
	 *
	 * @param aPath The path or url to normalize.
	 */
	function normalize(aPath) {
	  var path = aPath;
	  var url = urlParse(aPath);
	  if (url) {
	    if (!url.path) {
	      return aPath;
	    }
	    path = url.path;
	  }
	  var isAbsolute = exports.isAbsolute(path);
	
	  var parts = path.split(/\/+/);
	  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	    part = parts[i];
	    if (part === '.') {
	      parts.splice(i, 1);
	    } else if (part === '..') {
	      up++;
	    } else if (up > 0) {
	      if (part === '') {
	        // The first part is blank if the path is absolute. Trying to go
	        // above the root is a no-op. Therefore we can remove all '..' parts
	        // directly after the root.
	        parts.splice(i + 1, up);
	        up = 0;
	      } else {
	        parts.splice(i, 2);
	        up--;
	      }
	    }
	  }
	  path = parts.join('/');
	
	  if (path === '') {
	    path = isAbsolute ? '/' : '.';
	  }
	
	  if (url) {
	    url.path = path;
	    return urlGenerate(url);
	  }
	  return path;
	}
	exports.normalize = normalize;
	
	/**
	 * Joins two paths/URLs.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be joined with the root.
	 *
	 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	 *   first.
	 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	 *   is updated with the result and aRoot is returned. Otherwise the result
	 *   is returned.
	 *   - If aPath is absolute, the result is aPath.
	 *   - Otherwise the two paths are joined with a slash.
	 * - Joining for example 'http://' and 'www.example.com' is also supported.
	 */
	function join(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	  if (aPath === "") {
	    aPath = ".";
	  }
	  var aPathUrl = urlParse(aPath);
	  var aRootUrl = urlParse(aRoot);
	  if (aRootUrl) {
	    aRoot = aRootUrl.path || '/';
	  }
	
	  // `join(foo, '//www.example.org')`
	  if (aPathUrl && !aPathUrl.scheme) {
	    if (aRootUrl) {
	      aPathUrl.scheme = aRootUrl.scheme;
	    }
	    return urlGenerate(aPathUrl);
	  }
	
	  if (aPathUrl || aPath.match(dataUrlRegexp)) {
	    return aPath;
	  }
	
	  // `join('http://', 'www.example.com')`
	  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	    aRootUrl.host = aPath;
	    return urlGenerate(aRootUrl);
	  }
	
	  var joined = aPath.charAt(0) === '/'
	    ? aPath
	    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
	
	  if (aRootUrl) {
	    aRootUrl.path = joined;
	    return urlGenerate(aRootUrl);
	  }
	  return joined;
	}
	exports.join = join;
	
	exports.isAbsolute = function (aPath) {
	  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
	};
	
	/**
	 * Make a path relative to a URL or another path.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be made relative to aRoot.
	 */
	function relative(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	
	  aRoot = aRoot.replace(/\/$/, '');
	
	  // It is possible for the path to be above the root. In this case, simply
	  // checking whether the root is a prefix of the path won't work. Instead, we
	  // need to remove components from the root one by one, until either we find
	  // a prefix that fits, or we run out of components to remove.
	  var level = 0;
	  while (aPath.indexOf(aRoot + '/') !== 0) {
	    var index = aRoot.lastIndexOf("/");
	    if (index < 0) {
	      return aPath;
	    }
	
	    // If the only part of the root that is left is the scheme (i.e. http://,
	    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
	    // have exhausted all components, so the path is not relative to the root.
	    aRoot = aRoot.slice(0, index);
	    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
	      return aPath;
	    }
	
	    ++level;
	  }
	
	  // Make sure we add a "../" for each component we removed from the root.
	  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;
	
	var supportsNullProto = (function () {
	  var obj = Object.create(null);
	  return !('__proto__' in obj);
	}());
	
	function identity (s) {
	  return s;
	}
	
	/**
	 * Because behavior goes wacky when you set `__proto__` on objects, we
	 * have to prefix all the strings in our set with an arbitrary character.
	 *
	 * See https://github.com/mozilla/source-map/pull/31 and
	 * https://github.com/mozilla/source-map/issues/30
	 *
	 * @param String aStr
	 */
	function toSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return '$' + aStr;
	  }
	
	  return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;
	
	function fromSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return aStr.slice(1);
	  }
	
	  return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;
	
	function isProtoString(s) {
	  if (!s) {
	    return false;
	  }
	
	  var length = s.length;
	
	  if (length < 9 /* "__proto__".length */) {
	    return false;
	  }
	
	  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
	      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
	      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
	      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 9) !== 95  /* '_' */) {
	    return false;
	  }
	
	  for (var i = length - 10; i >= 0; i--) {
	    if (s.charCodeAt(i) !== 36 /* '$' */) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	/**
	 * Comparator between two mappings where the original positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same original source/line/column, but different generated
	 * line and column the same. Useful when searching for a mapping with a
	 * stubbed out mapping.
	 */
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	  var cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0 || onlyCompareOriginal) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;
	
	/**
	 * Comparator between two mappings with deflated source and name indices where
	 * the generated positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same generated line and column, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
	
	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }
	
	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }
	
	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }
	
	  if (aStr1 > aStr2) {
	    return 1;
	  }
	
	  return -1;
	}
	
	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }
	
	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(2);
	var binarySearch = __webpack_require__(4);
	var ArraySet = __webpack_require__(5).ArraySet;
	var base64VLQ = __webpack_require__(6);
	var quickSort = __webpack_require__(8).quickSort;
	
	function SourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap)
	    : new BasicSourceMapConsumer(sourceMap);
	}
	
	SourceMapConsumer.fromSourceMap = function(aSourceMap) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
	}
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;
	
	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.
	
	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__generatedMappings;
	  }
	});
	
	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }
	
	    return this.__originalMappings;
	  }
	});
	
	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };
	
	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;
	
	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
	
	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }
	
	    var sourceRoot = this.sourceRoot;
	    mappings.map(function (mapping) {
	      var source = mapping.source === null ? null : this._sources.at(mapping.source);
	      if (source != null && sourceRoot != null) {
	        source = util.join(sourceRoot, source);
	      }
	      return {
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : this._names.at(mapping.name)
	      };
	    }, this).forEach(aCallback, context);
	  };
	
	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is provided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');
	
	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };
	
	    if (this.sourceRoot != null) {
	      needle.source = util.relative(this.sourceRoot, needle.source);
	    }
	    if (!this._sources.has(needle.source)) {
	      return [];
	    }
	    needle.source = this._sources.indexOf(needle.source);
	
	    var mappings = [];
	
	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;
	
	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });
	
	          mapping = this._originalMappings[++index];
	        }
	      }
	    }
	
	    return mappings;
	  };
	
	exports.SourceMapConsumer = SourceMapConsumer;
	
	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The only parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);
	
	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }
	
	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });
	
	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);
	
	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this.file = file;
	}
	
	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
	
	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);
	
	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	
	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.
	
	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];
	
	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;
	
	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;
	
	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }
	
	        destOriginalMappings.push(destMapping);
	      }
	
	      destGeneratedMappings.push(destMapping);
	    }
	
	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
	
	    return smc;
	  };
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._sources.toArray().map(function (s) {
	      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	    }, this);
	  }
	});
	
	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var cachedSegments = {};
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, str, segment, end, value;
	
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;
	
	        // Because each offset is encoded relative to the previous one,
	        // many segments often have the same encoding. We can exploit this
	        // fact by caching the parsed variable length fields of each segment,
	        // allowing us to avoid a second parse if we encounter the same
	        // segment again.
	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        str = aStr.slice(index, end);
	
	        segment = cachedSegments[str];
	        if (segment) {
	          index += str.length;
	        } else {
	          segment = [];
	          while (index < end) {
	            base64VLQ.decode(aStr, index, temp);
	            value = temp.value;
	            index = temp.rest;
	            segment.push(value);
	          }
	
	          if (segment.length === 2) {
	            throw new Error('Found a source, but no line and column');
	          }
	
	          if (segment.length === 3) {
	            throw new Error('Found a source and line, but no column');
	          }
	
	          cachedSegments[str] = segment;
	        }
	
	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;
	
	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];
	
	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;
	
	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;
	
	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }
	
	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          originalMappings.push(mapping);
	        }
	      }
	    }
	
	    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
	    this.__generatedMappings = generatedMappings;
	
	    quickSort(originalMappings, util.compareByOriginalPositions);
	    this.__originalMappings = originalMappings;
	  };
	
	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.
	
	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }
	
	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };
	
	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (var index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];
	
	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];
	
	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }
	
	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];
	
	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          if (this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }
	
	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }
	
	    if (this.sourceRoot != null) {
	      aSource = util.relative(this.sourceRoot, aSource);
	    }
	
	    if (this._sources.has(aSource)) {
	      return this.sourcesContent[this._sources.indexOf(aSource)];
	    }
	
	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }
	
	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + aSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	      }
	    }
	
	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    if (this.sourceRoot != null) {
	      source = util.relative(this.sourceRoot, source);
	    }
	    if (!this._sources.has(source)) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }
	    source = this._sources.indexOf(source);
	
	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };
	
	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );
	
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];
	
	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }
	
	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };
	
	exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
	
	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The only parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	  }
	
	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');
	
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }
	
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	
	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');
	
	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;
	
	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
	    }
	  });
	}
	
	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
	
	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;
	
	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});
	
	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };
	
	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }
	
	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];
	
	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }
	
	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };
	
	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };
	
	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content) {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };
	
	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	
	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }
	
	    return {
	      line: null,
	      column: null
	    };
	  };
	
	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];
	
	        var source = section.consumer._sources.at(mapping.source);
	        if (section.consumer.sourceRoot !== null) {
	          source = util.join(section.consumer.sourceRoot, source);
	        }
	        this._sources.add(source);
	        source = this._sources.indexOf(source);
	
	        var name = section.consumer._names.at(mapping.name);
	        this._names.add(name);
	        name = this._names.indexOf(name);
	
	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };
	
	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }
	
	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };
	
	exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;
	
	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }
	
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}
	
	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }
	
	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }
	
	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }
	
	  return index;
	};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(2);
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";
	
	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}
	
	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};
	
	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};
	
	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};
	
	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};
	
	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }
	
	  throw new Error('"' + aStr + '" is not in the set.');
	};
	
	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};
	
	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};
	
	exports.ArraySet = ArraySet;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	
	var base64 = __webpack_require__(7);
	
	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011
	
	var VLQ_BASE_SHIFT = 5;
	
	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
	
	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;
	
	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;
	
	/**
	 * Converts from a two-complement value to a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	 */
	function toVLQSigned(aValue) {
	  return aValue < 0
	    ? ((-aValue) << 1) + 1
	    : (aValue << 1) + 0;
	}
	
	/**
	 * Converts to a two-complement value from a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	 */
	function fromVLQSigned(aValue) {
	  var isNegative = (aValue & 1) === 1;
	  var shifted = aValue >> 1;
	  return isNegative
	    ? -shifted
	    : shifted;
	}
	
	/**
	 * Returns the base 64 VLQ encoded value.
	 */
	exports.encode = function base64VLQ_encode(aValue) {
	  var encoded = "";
	  var digit;
	
	  var vlq = toVLQSigned(aValue);
	
	  do {
	    digit = vlq & VLQ_BASE_MASK;
	    vlq >>>= VLQ_BASE_SHIFT;
	    if (vlq > 0) {
	      // There are still more digits in this value, so we must make sure the
	      // continuation bit is marked.
	      digit |= VLQ_CONTINUATION_BIT;
	    }
	    encoded += base64.encode(digit);
	  } while (vlq > 0);
	
	  return encoded;
	};
	
	/**
	 * Decodes the next base 64 VLQ value from the given string and returns the
	 * value and the rest of the string via the out parameter.
	 */
	exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
	  var strLen = aStr.length;
	  var result = 0;
	  var shift = 0;
	  var continuation, digit;
	
	  do {
	    if (aIndex >= strLen) {
	      throw new Error("Expected more digits in base 64 VLQ value.");
	    }
	
	    digit = base64.decode(aStr.charCodeAt(aIndex++));
	    if (digit === -1) {
	      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
	    }
	
	    continuation = !!(digit & VLQ_CONTINUATION_BIT);
	    digit &= VLQ_BASE_MASK;
	    result = result + (digit << shift);
	    shift += VLQ_BASE_SHIFT;
	  } while (continuation);
	
	  aOutParam.value = fromVLQSigned(result);
	  aOutParam.rest = aIndex;
	};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
	
	/**
	 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	 */
	exports.encode = function (number) {
	  if (0 <= number && number < intToCharMap.length) {
	    return intToCharMap[number];
	  }
	  throw new TypeError("Must be between 0 and 63: " + number);
	};
	
	/**
	 * Decode a single base 64 character code digit to an integer. Returns -1 on
	 * failure.
	 */
	exports.decode = function (charCode) {
	  var bigA = 65;     // 'A'
	  var bigZ = 90;     // 'Z'
	
	  var littleA = 97;  // 'a'
	  var littleZ = 122; // 'z'
	
	  var zero = 48;     // '0'
	  var nine = 57;     // '9'
	
	  var plus = 43;     // '+'
	  var slash = 47;    // '/'
	
	  var littleOffset = 26;
	  var numberOffset = 52;
	
	  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	  if (bigA <= charCode && charCode <= bigZ) {
	    return (charCode - bigA);
	  }
	
	  // 26 - 51: abcdefghijklmnopqrstuvwxyz
	  if (littleA <= charCode && charCode <= littleZ) {
	    return (charCode - littleA + littleOffset);
	  }
	
	  // 52 - 61: 0123456789
	  if (zero <= charCode && charCode <= nine) {
	    return (charCode - zero + numberOffset);
	  }
	
	  // 62: +
	  if (charCode == plus) {
	    return 62;
	  }
	
	  // 63: /
	  if (charCode == slash) {
	    return 63;
	  }
	
	  // Invalid base64 digit.
	  return -1;
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.
	
	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}
	
	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}
	
	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.
	
	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.
	
	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;
	
	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];
	
	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }
	
	    swap(ary, i + 1, j);
	    var q = i + 1;
	
	    // (2) Recurse on each half.
	
	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}
	
	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */
	exports.quickSort = function (ary, comparator) {
	  doQuickSort(ary, comparator, 0, ary.length - 1);
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var base64VLQ = __webpack_require__(6);
	var util = __webpack_require__(2);
	var ArraySet = __webpack_require__(5).ArraySet;
	var MappingList = __webpack_require__(10).MappingList;
	
	/**
	 * An instance of the SourceMapGenerator represents a source map which is
	 * being built incrementally. You may pass an object with the following
	 * properties:
	 *
	 *   - file: The filename of the generated source.
	 *   - sourceRoot: A root for all relative URLs in this source map.
	 */
	function SourceMapGenerator(aArgs) {
	  if (!aArgs) {
	    aArgs = {};
	  }
	  this._file = util.getArg(aArgs, 'file', null);
	  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	  this._mappings = new MappingList();
	  this._sourcesContents = null;
	}
	
	SourceMapGenerator.prototype._version = 3;
	
	/**
	 * Creates a new SourceMapGenerator based on a SourceMapConsumer
	 *
	 * @param aSourceMapConsumer The SourceMap.
	 */
	SourceMapGenerator.fromSourceMap =
	  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	    var sourceRoot = aSourceMapConsumer.sourceRoot;
	    var generator = new SourceMapGenerator({
	      file: aSourceMapConsumer.file,
	      sourceRoot: sourceRoot
	    });
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      var newMapping = {
	        generated: {
	          line: mapping.generatedLine,
	          column: mapping.generatedColumn
	        }
	      };
	
	      if (mapping.source != null) {
	        newMapping.source = mapping.source;
	        if (sourceRoot != null) {
	          newMapping.source = util.relative(sourceRoot, newMapping.source);
	        }
	
	        newMapping.original = {
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        };
	
	        if (mapping.name != null) {
	          newMapping.name = mapping.name;
	        }
	      }
	
	      generator.addMapping(newMapping);
	    });
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var sourceRelative = sourceFile;
	      if (sourceRoot !== null) {
	        sourceRelative = util.relative(sourceRoot, sourceFile);
	      }
	
	      if (!generator._sources.has(sourceRelative)) {
	        generator._sources.add(sourceRelative);
	      }
	
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        generator.setSourceContent(sourceFile, content);
	      }
	    });
	    return generator;
	  };
	
	/**
	 * Add a single mapping from original source line and column to the generated
	 * source's line and column for this source map being created. The mapping
	 * object should have the following properties:
	 *
	 *   - generated: An object with the generated line and column positions.
	 *   - original: An object with the original line and column positions.
	 *   - source: The original source file (relative to the sourceRoot).
	 *   - name: An optional original token name for this mapping.
	 */
	SourceMapGenerator.prototype.addMapping =
	  function SourceMapGenerator_addMapping(aArgs) {
	    var generated = util.getArg(aArgs, 'generated');
	    var original = util.getArg(aArgs, 'original', null);
	    var source = util.getArg(aArgs, 'source', null);
	    var name = util.getArg(aArgs, 'name', null);
	
	    if (!this._skipValidation) {
	      this._validateMapping(generated, original, source, name);
	    }
	
	    if (source != null) {
	      source = String(source);
	      if (!this._sources.has(source)) {
	        this._sources.add(source);
	      }
	    }
	
	    if (name != null) {
	      name = String(name);
	      if (!this._names.has(name)) {
	        this._names.add(name);
	      }
	    }
	
	    this._mappings.add({
	      generatedLine: generated.line,
	      generatedColumn: generated.column,
	      originalLine: original != null && original.line,
	      originalColumn: original != null && original.column,
	      source: source,
	      name: name
	    });
	  };
	
	/**
	 * Set the source content for a source file.
	 */
	SourceMapGenerator.prototype.setSourceContent =
	  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	    var source = aSourceFile;
	    if (this._sourceRoot != null) {
	      source = util.relative(this._sourceRoot, source);
	    }
	
	    if (aSourceContent != null) {
	      // Add the source content to the _sourcesContents map.
	      // Create a new _sourcesContents map if the property is null.
	      if (!this._sourcesContents) {
	        this._sourcesContents = Object.create(null);
	      }
	      this._sourcesContents[util.toSetString(source)] = aSourceContent;
	    } else if (this._sourcesContents) {
	      // Remove the source file from the _sourcesContents map.
	      // If the _sourcesContents map is empty, set the property to null.
	      delete this._sourcesContents[util.toSetString(source)];
	      if (Object.keys(this._sourcesContents).length === 0) {
	        this._sourcesContents = null;
	      }
	    }
	  };
	
	/**
	 * Applies the mappings of a sub-source-map for a specific source file to the
	 * source map being generated. Each mapping to the supplied source file is
	 * rewritten using the supplied source map. Note: The resolution for the
	 * resulting mappings is the minimium of this map and the supplied map.
	 *
	 * @param aSourceMapConsumer The source map to be applied.
	 * @param aSourceFile Optional. The filename of the source file.
	 *        If omitted, SourceMapConsumer's file property will be used.
	 * @param aSourceMapPath Optional. The dirname of the path to the source map
	 *        to be applied. If relative, it is relative to the SourceMapConsumer.
	 *        This parameter is needed when the two source maps aren't in the same
	 *        directory, and the source map to be applied contains relative source
	 *        paths. If so, those relative source paths need to be rewritten
	 *        relative to the SourceMapGenerator.
	 */
	SourceMapGenerator.prototype.applySourceMap =
	  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	    var sourceFile = aSourceFile;
	    // If aSourceFile is omitted, we will use the file property of the SourceMap
	    if (aSourceFile == null) {
	      if (aSourceMapConsumer.file == null) {
	        throw new Error(
	          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	          'or the source map\'s "file" property. Both were omitted.'
	        );
	      }
	      sourceFile = aSourceMapConsumer.file;
	    }
	    var sourceRoot = this._sourceRoot;
	    // Make "sourceFile" relative if an absolute Url is passed.
	    if (sourceRoot != null) {
	      sourceFile = util.relative(sourceRoot, sourceFile);
	    }
	    // Applying the SourceMap can add and remove items from the sources and
	    // the names array.
	    var newSources = new ArraySet();
	    var newNames = new ArraySet();
	
	    // Find mappings for the "sourceFile"
	    this._mappings.unsortedForEach(function (mapping) {
	      if (mapping.source === sourceFile && mapping.originalLine != null) {
	        // Check if it can be mapped by the source map, then update the mapping.
	        var original = aSourceMapConsumer.originalPositionFor({
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        });
	        if (original.source != null) {
	          // Copy mapping
	          mapping.source = original.source;
	          if (aSourceMapPath != null) {
	            mapping.source = util.join(aSourceMapPath, mapping.source)
	          }
	          if (sourceRoot != null) {
	            mapping.source = util.relative(sourceRoot, mapping.source);
	          }
	          mapping.originalLine = original.line;
	          mapping.originalColumn = original.column;
	          if (original.name != null) {
	            mapping.name = original.name;
	          }
	        }
	      }
	
	      var source = mapping.source;
	      if (source != null && !newSources.has(source)) {
	        newSources.add(source);
	      }
	
	      var name = mapping.name;
	      if (name != null && !newNames.has(name)) {
	        newNames.add(name);
	      }
	
	    }, this);
	    this._sources = newSources;
	    this._names = newNames;
	
	    // Copy sourcesContents of applied map.
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aSourceMapPath != null) {
	          sourceFile = util.join(aSourceMapPath, sourceFile);
	        }
	        if (sourceRoot != null) {
	          sourceFile = util.relative(sourceRoot, sourceFile);
	        }
	        this.setSourceContent(sourceFile, content);
	      }
	    }, this);
	  };
	
	/**
	 * A mapping can have one of the three levels of data:
	 *
	 *   1. Just the generated position.
	 *   2. The Generated position, original position, and original source.
	 *   3. Generated and original position, original source, as well as a name
	 *      token.
	 *
	 * To maintain consistency, we validate that any new mapping being added falls
	 * in to one of these categories.
	 */
	SourceMapGenerator.prototype._validateMapping =
	  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                              aName) {
	    // When aOriginal is truthy but has empty values for .line and .column,
	    // it is most likely a programmer error. In this case we throw a very
	    // specific error message to try to guide them the right way.
	    // For example: https://github.com/Polymer/polymer-bundler/pull/519
	    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
	        throw new Error(
	            'original.line and original.column are not numbers -- you probably meant to omit ' +
	            'the original mapping entirely and only map the generated position. If so, pass ' +
	            'null for the original mapping instead of an object with empty or null values.'
	        );
	    }
	
	    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	        && aGenerated.line > 0 && aGenerated.column >= 0
	        && !aOriginal && !aSource && !aName) {
	      // Case 1.
	      return;
	    }
	    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	             && aGenerated.line > 0 && aGenerated.column >= 0
	             && aOriginal.line > 0 && aOriginal.column >= 0
	             && aSource) {
	      // Cases 2 and 3.
	      return;
	    }
	    else {
	      throw new Error('Invalid mapping: ' + JSON.stringify({
	        generated: aGenerated,
	        source: aSource,
	        original: aOriginal,
	        name: aName
	      }));
	    }
	  };
	
	/**
	 * Serialize the accumulated mappings in to the stream of base 64 VLQs
	 * specified by the source map format.
	 */
	SourceMapGenerator.prototype._serializeMappings =
	  function SourceMapGenerator_serializeMappings() {
	    var previousGeneratedColumn = 0;
	    var previousGeneratedLine = 1;
	    var previousOriginalColumn = 0;
	    var previousOriginalLine = 0;
	    var previousName = 0;
	    var previousSource = 0;
	    var result = '';
	    var next;
	    var mapping;
	    var nameIdx;
	    var sourceIdx;
	
	    var mappings = this._mappings.toArray();
	    for (var i = 0, len = mappings.length; i < len; i++) {
	      mapping = mappings[i];
	      next = ''
	
	      if (mapping.generatedLine !== previousGeneratedLine) {
	        previousGeneratedColumn = 0;
	        while (mapping.generatedLine !== previousGeneratedLine) {
	          next += ';';
	          previousGeneratedLine++;
	        }
	      }
	      else {
	        if (i > 0) {
	          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
	            continue;
	          }
	          next += ',';
	        }
	      }
	
	      next += base64VLQ.encode(mapping.generatedColumn
	                                 - previousGeneratedColumn);
	      previousGeneratedColumn = mapping.generatedColumn;
	
	      if (mapping.source != null) {
	        sourceIdx = this._sources.indexOf(mapping.source);
	        next += base64VLQ.encode(sourceIdx - previousSource);
	        previousSource = sourceIdx;
	
	        // lines are stored 0-based in SourceMap spec version 3
	        next += base64VLQ.encode(mapping.originalLine - 1
	                                   - previousOriginalLine);
	        previousOriginalLine = mapping.originalLine - 1;
	
	        next += base64VLQ.encode(mapping.originalColumn
	                                   - previousOriginalColumn);
	        previousOriginalColumn = mapping.originalColumn;
	
	        if (mapping.name != null) {
	          nameIdx = this._names.indexOf(mapping.name);
	          next += base64VLQ.encode(nameIdx - previousName);
	          previousName = nameIdx;
	        }
	      }
	
	      result += next;
	    }
	
	    return result;
	  };
	
	SourceMapGenerator.prototype._generateSourcesContent =
	  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	    return aSources.map(function (source) {
	      if (!this._sourcesContents) {
	        return null;
	      }
	      if (aSourceRoot != null) {
	        source = util.relative(aSourceRoot, source);
	      }
	      var key = util.toSetString(source);
	      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
	        ? this._sourcesContents[key]
	        : null;
	    }, this);
	  };
	
	/**
	 * Externalize the source map.
	 */
	SourceMapGenerator.prototype.toJSON =
	  function SourceMapGenerator_toJSON() {
	    var map = {
	      version: this._version,
	      sources: this._sources.toArray(),
	      names: this._names.toArray(),
	      mappings: this._serializeMappings()
	    };
	    if (this._file != null) {
	      map.file = this._file;
	    }
	    if (this._sourceRoot != null) {
	      map.sourceRoot = this._sourceRoot;
	    }
	    if (this._sourcesContents) {
	      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	    }
	
	    return map;
	  };
	
	/**
	 * Render the source map being generated to a string.
	 */
	SourceMapGenerator.prototype.toString =
	  function SourceMapGenerator_toString() {
	    return JSON.stringify(this.toJSON());
	  };
	
	exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	
	var util = __webpack_require__(2);
	
	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}
	
	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}
	
	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };
	
	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};
	
	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};
	
	exports.MappingList = MappingList;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjY0YTU0ZTA5YThhOWQ4MWIxMzQiLCJ3ZWJwYWNrOi8vLy4vdGVzdC90ZXN0LXNvdXJjZS1tYXAtY29uc3VtZXIuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi91dGlsLmpzIiwid2VicGFjazovLy8uL2xpYi9zb3VyY2UtbWFwLWNvbnN1bWVyLmpzIiwid2VicGFjazovLy8uL2xpYi9iaW5hcnktc2VhcmNoLmpzIiwid2VicGFjazovLy8uL2xpYi9hcnJheS1zZXQuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Jhc2U2NC12bHEuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2Jhc2U2NC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvcXVpY2stc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvc291cmNlLW1hcC1nZW5lcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL21hcHBpbmctbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0EsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixxQ0FBcUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUMxVkEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0NBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0EsZUFBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4YUEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdURBQXNEO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxvQkFBbUI7QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVc7O0FBRVg7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLE1BQU07QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1REFBc0QsWUFBWTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCLGNBQWM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF1Qix3Q0FBd0M7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQStDLG1CQUFtQixFQUFFO0FBQ3BFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCLE1BQU07QUFDbkM7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0EsSUFBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLDJCQUEyQjtBQUM5QyxzQkFBcUIsK0NBQStDO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQiwyQkFBMkI7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsMkJBQTJCO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBLHNCQUFxQiw0QkFBNEI7QUFDakQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDcGxDQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzlHQSxpQkFBZ0Isb0JBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBc0MsU0FBUztBQUMvQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDeEhBLGlCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUEyRDtBQUMzRCxxQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQ0FBMEMsU0FBUztBQUNuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN4YUEsaUJBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoidGVzdF9zb3VyY2VfbWFwX2NvbnN1bWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjY0YTU0ZTA5YThhOWQ4MWIxMzQiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcbnZhciBTb3VyY2VNYXBDb25zdW1lciA9IHJlcXVpcmUoJy4uL2xpYi9zb3VyY2UtbWFwLWNvbnN1bWVyJykuU291cmNlTWFwQ29uc3VtZXI7XG52YXIgSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyID0gcmVxdWlyZSgnLi4vbGliL3NvdXJjZS1tYXAtY29uc3VtZXInKS5JbmRleGVkU291cmNlTWFwQ29uc3VtZXI7XG52YXIgQmFzaWNTb3VyY2VNYXBDb25zdW1lciA9IHJlcXVpcmUoJy4uL2xpYi9zb3VyY2UtbWFwLWNvbnN1bWVyJykuQmFzaWNTb3VyY2VNYXBDb25zdW1lcjtcbnZhciBTb3VyY2VNYXBHZW5lcmF0b3IgPSByZXF1aXJlKCcuLi9saWIvc291cmNlLW1hcC1nZW5lcmF0b3InKS5Tb3VyY2VNYXBHZW5lcmF0b3I7XG5cbmV4cG9ydHNbJ3Rlc3QgdGhhdCB3ZSBjYW4gaW5zdGFudGlhdGUgd2l0aCBhIHN0cmluZyBvciBhbiBvYmplY3QnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgYXNzZXJ0LmRvZXNOb3RUaHJvdyhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLnRlc3RNYXApO1xuICB9KTtcbiAgYXNzZXJ0LmRvZXNOb3RUaHJvdyhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihKU09OLnN0cmluZ2lmeSh1dGlsLnRlc3RNYXApKTtcbiAgfSk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IHRoYXQgdGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIG5ldyBTb3VyY2VNYXBDb25zdW1lciBpbmhlcml0cyBmcm9tIFNvdXJjZU1hcENvbnN1bWVyJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIGFzc2VydC5vayhuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC50ZXN0TWFwKSBpbnN0YW5jZW9mIFNvdXJjZU1hcENvbnN1bWVyKTtcbn1cblxuZXhwb3J0c1sndGVzdCB0aGF0IGEgQmFzaWNTb3VyY2VNYXBDb25zdW1lciBpcyByZXR1cm5lZCBmb3Igc291cmNlbWFwcyB3aXRob3V0IHNlY3Rpb25zJ10gPSBmdW5jdGlvbihhc3NlcnQpIHtcbiAgYXNzZXJ0Lm9rKG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLnRlc3RNYXApIGluc3RhbmNlb2YgQmFzaWNTb3VyY2VNYXBDb25zdW1lcik7XG59O1xuXG5leHBvcnRzWyd0ZXN0IHRoYXQgYW4gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyIGlzIHJldHVybmVkIGZvciBzb3VyY2VtYXBzIHdpdGggc2VjdGlvbnMnXSA9IGZ1bmN0aW9uKGFzc2VydCkge1xuICBhc3NlcnQub2sobmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwuaW5kZXhlZFRlc3RNYXApIGluc3RhbmNlb2YgSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgdGhhdCB0aGUgYHNvdXJjZXNgIGZpZWxkIGhhcyB0aGUgb3JpZ2luYWwgc291cmNlcyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwO1xuICB2YXIgc291cmNlcztcblxuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC50ZXN0TWFwKTtcbiAgc291cmNlcyA9IG1hcC5zb3VyY2VzO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1swXSwgJy90aGUvcm9vdC9vbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXNbMV0sICcvdGhlL3Jvb3QvdHdvLmpzJyk7XG4gIGFzc2VydC5lcXVhbChzb3VyY2VzLmxlbmd0aCwgMik7XG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwuaW5kZXhlZFRlc3RNYXApO1xuICBzb3VyY2VzID0gbWFwLnNvdXJjZXM7XG4gIGFzc2VydC5lcXVhbChzb3VyY2VzWzBdLCAnL3RoZS9yb290L29uZS5qcycpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1sxXSwgJy90aGUvcm9vdC90d28uanMnKTtcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXMubGVuZ3RoLCAyKTtcblxuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5pbmRleGVkVGVzdE1hcERpZmZlcmVudFNvdXJjZVJvb3RzKTtcbiAgc291cmNlcyA9IG1hcC5zb3VyY2VzO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1swXSwgJy90aGUvcm9vdC9vbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXNbMV0sICcvZGlmZmVyZW50L3Jvb3QvdHdvLmpzJyk7XG4gIGFzc2VydC5lcXVhbChzb3VyY2VzLmxlbmd0aCwgMik7XG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcE5vU291cmNlUm9vdCk7XG4gIHNvdXJjZXMgPSBtYXAuc291cmNlcztcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXNbMF0sICdvbmUuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXNbMV0sICd0d28uanMnKTtcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXMubGVuZ3RoLCAyKTtcblxuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC50ZXN0TWFwRW1wdHlTb3VyY2VSb290KTtcbiAgc291cmNlcyA9IG1hcC5zb3VyY2VzO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1swXSwgJ29uZS5qcycpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1sxXSwgJ3R3by5qcycpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlcy5sZW5ndGgsIDIpO1xufTtcblxuZXhwb3J0c1sndGVzdCB0aGF0IHRoZSBzb3VyY2Ugcm9vdCBpcyByZWZsZWN0ZWQgaW4gYSBtYXBwaW5nXFwncyBzb3VyY2UgZmllbGQnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcDtcbiAgdmFyIG1hcHBpbmc7XG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcCk7XG5cbiAgbWFwcGluZyA9IG1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICBsaW5lOiAyLFxuICAgIGNvbHVtbjogMVxuICB9KTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmcuc291cmNlLCAnL3RoZS9yb290L3R3by5qcycpO1xuXG4gIG1hcHBpbmcgPSBtYXAub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDFcbiAgfSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nLnNvdXJjZSwgJy90aGUvcm9vdC9vbmUuanMnKTtcblxuXG4gIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLnRlc3RNYXBOb1NvdXJjZVJvb3QpO1xuXG4gIG1hcHBpbmcgPSBtYXAub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgbGluZTogMixcbiAgICBjb2x1bW46IDFcbiAgfSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nLnNvdXJjZSwgJ3R3by5qcycpO1xuXG4gIG1hcHBpbmcgPSBtYXAub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDFcbiAgfSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nLnNvdXJjZSwgJ29uZS5qcycpO1xuXG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcEVtcHR5U291cmNlUm9vdCk7XG5cbiAgbWFwcGluZyA9IG1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICBsaW5lOiAyLFxuICAgIGNvbHVtbjogMVxuICB9KTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmcuc291cmNlLCAndHdvLmpzJyk7XG5cbiAgbWFwcGluZyA9IG1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICBsaW5lOiAxLFxuICAgIGNvbHVtbjogMVxuICB9KTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmcuc291cmNlLCAnb25lLmpzJyk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IG1hcHBpbmcgdG9rZW5zIGJhY2sgZXhhY3RseSddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcCk7XG5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDEsICcvdGhlL3Jvb3Qvb25lLmpzJywgMSwgMSwgbnVsbCwgbnVsbCwgbWFwLCBhc3NlcnQpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgNSwgJy90aGUvcm9vdC9vbmUuanMnLCAxLCA1LCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCA5LCAnL3RoZS9yb290L29uZS5qcycsIDEsIDExLCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAxOCwgJy90aGUvcm9vdC9vbmUuanMnLCAxLCAyMSwgJ2JhcicsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDIxLCAnL3RoZS9yb290L29uZS5qcycsIDIsIDMsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDI4LCAnL3RoZS9yb290L29uZS5qcycsIDIsIDEwLCAnYmF6JywgbnVsbCwgbWFwLCBhc3NlcnQpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMzIsICcvdGhlL3Jvb3Qvb25lLmpzJywgMiwgMTQsICdiYXInLCBudWxsLCBtYXAsIGFzc2VydCk7XG5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDEsICcvdGhlL3Jvb3QvdHdvLmpzJywgMSwgMSwgbnVsbCwgbnVsbCwgbWFwLCBhc3NlcnQpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMiwgNSwgJy90aGUvcm9vdC90d28uanMnLCAxLCA1LCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCA5LCAnL3RoZS9yb290L3R3by5qcycsIDEsIDExLCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCAxOCwgJy90aGUvcm9vdC90d28uanMnLCAxLCAyMSwgJ24nLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCAyMSwgJy90aGUvcm9vdC90d28uanMnLCAyLCAzLCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCAyOCwgJy90aGUvcm9vdC90d28uanMnLCAyLCAxMCwgJ24nLCBudWxsLCBtYXAsIGFzc2VydCk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IG1hcHBpbmcgdG9rZW5zIGJhY2sgZXhhY3RseSBpbiBpbmRleGVkIHNvdXJjZSBtYXAnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLmluZGV4ZWRUZXN0TWFwKTtcblxuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMSwgJy90aGUvcm9vdC9vbmUuanMnLCAxLCAxLCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCA1LCAnL3RoZS9yb290L29uZS5qcycsIDEsIDUsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDksICcvdGhlL3Jvb3Qvb25lLmpzJywgMSwgMTEsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDE4LCAnL3RoZS9yb290L29uZS5qcycsIDEsIDIxLCAnYmFyJywgbnVsbCwgbWFwLCBhc3NlcnQpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMjEsICcvdGhlL3Jvb3Qvb25lLmpzJywgMiwgMywgbnVsbCwgbnVsbCwgbWFwLCBhc3NlcnQpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMjgsICcvdGhlL3Jvb3Qvb25lLmpzJywgMiwgMTAsICdiYXonLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAzMiwgJy90aGUvcm9vdC9vbmUuanMnLCAyLCAxNCwgJ2JhcicsIG51bGwsIG1hcCwgYXNzZXJ0KTtcblxuICB1dGlsLmFzc2VydE1hcHBpbmcoMiwgMSwgJy90aGUvcm9vdC90d28uanMnLCAxLCAxLCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCA1LCAnL3RoZS9yb290L3R3by5qcycsIDEsIDUsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDksICcvdGhlL3Jvb3QvdHdvLmpzJywgMSwgMTEsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDE4LCAnL3RoZS9yb290L3R3by5qcycsIDEsIDIxLCAnbicsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDIxLCAnL3RoZS9yb290L3R3by5qcycsIDIsIDMsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDI4LCAnL3RoZS9yb290L3R3by5qcycsIDIsIDEwLCAnbicsIG51bGwsIG1hcCwgYXNzZXJ0KTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgbWFwcGluZyB0b2tlbnMgZnV6enknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLnRlc3RNYXApO1xuXG4gIC8vIEZpbmRpbmcgb3JpZ2luYWwgcG9zaXRpb25zIHdpdGggZGVmYXVsdCAoZ2xiKSBiaWFzLlxuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMjAsICcvdGhlL3Jvb3Qvb25lLmpzJywgMSwgMjEsICdiYXInLCBudWxsLCBtYXAsIGFzc2VydCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAzMCwgJy90aGUvcm9vdC9vbmUuanMnLCAyLCAxMCwgJ2JheicsIG51bGwsIG1hcCwgYXNzZXJ0LCB0cnVlKTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDEyLCAnL3RoZS9yb290L3R3by5qcycsIDEsIDExLCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCwgdHJ1ZSk7XG5cbiAgLy8gRmluZGluZyBvcmlnaW5hbCBwb3NpdGlvbnMgd2l0aCBsdWIgYmlhcy5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDE2LCAnL3RoZS9yb290L29uZS5qcycsIDEsIDIxLCAnYmFyJywgU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQsIG1hcCwgYXNzZXJ0LCB0cnVlKTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDI2LCAnL3RoZS9yb290L29uZS5qcycsIDIsIDEwLCAnYmF6JywgU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQsIG1hcCwgYXNzZXJ0LCB0cnVlKTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDYsICcvdGhlL3Jvb3QvdHdvLmpzJywgMSwgMTEsIG51bGwsIFNvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5ELCBtYXAsIGFzc2VydCwgdHJ1ZSk7XG5cbiAgLy8gRmluZGluZyBnZW5lcmF0ZWQgcG9zaXRpb25zIHdpdGggZGVmYXVsdCAoZ2xiKSBiaWFzLlxuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMTgsICcvdGhlL3Jvb3Qvb25lLmpzJywgMSwgMjIsICdiYXInLCBudWxsLCBtYXAsIGFzc2VydCwgbnVsbCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAyOCwgJy90aGUvcm9vdC9vbmUuanMnLCAyLCAxMywgJ2JheicsIG51bGwsIG1hcCwgYXNzZXJ0LCBudWxsLCB0cnVlKTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDksICcvdGhlL3Jvb3QvdHdvLmpzJywgMSwgMTYsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0LCBudWxsLCB0cnVlKTtcblxuICAvLyBGaW5kaW5nIGdlbmVyYXRlZCBwb3NpdGlvbnMgd2l0aCBsdWIgYmlhcy5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDE4LCAnL3RoZS9yb290L29uZS5qcycsIDEsIDIwLCAnYmFyJywgU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQsIG1hcCwgYXNzZXJ0LCBudWxsLCB0cnVlKTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDI4LCAnL3RoZS9yb290L29uZS5qcycsIDIsIDcsICdiYXonLCBTb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCwgbWFwLCBhc3NlcnQsIG51bGwsIHRydWUpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMiwgOSwgJy90aGUvcm9vdC90d28uanMnLCAxLCA2LCBudWxsLCBTb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCwgbWFwLCBhc3NlcnQsIG51bGwsIHRydWUpO1xufTtcblxuZXhwb3J0c1sndGVzdCBtYXBwaW5nIHRva2VucyBmdXp6eSBpbiBpbmRleGVkIHNvdXJjZSBtYXAnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLmluZGV4ZWRUZXN0TWFwKTtcblxuICAvLyBGaW5kaW5nIG9yaWdpbmFsIHBvc2l0aW9ucyB3aXRoIGRlZmF1bHQgKGdsYikgYmlhcy5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDIwLCAnL3RoZS9yb290L29uZS5qcycsIDEsIDIxLCAnYmFyJywgbnVsbCwgbWFwLCBhc3NlcnQsIHRydWUpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMzAsICcvdGhlL3Jvb3Qvb25lLmpzJywgMiwgMTAsICdiYXonLCBudWxsLCBtYXAsIGFzc2VydCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCAxMiwgJy90aGUvcm9vdC90d28uanMnLCAxLCAxMSwgbnVsbCwgbnVsbCwgbWFwLCBhc3NlcnQsIHRydWUpO1xuXG4gIC8vIEZpbmRpbmcgb3JpZ2luYWwgcG9zaXRpb25zIHdpdGggbHViIGJpYXMuXG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAxNiwgJy90aGUvcm9vdC9vbmUuanMnLCAxLCAyMSwgJ2JhcicsIFNvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5ELCBtYXAsIGFzc2VydCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAyNiwgJy90aGUvcm9vdC9vbmUuanMnLCAyLCAxMCwgJ2JheicsIFNvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5ELCBtYXAsIGFzc2VydCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCA2LCAnL3RoZS9yb290L3R3by5qcycsIDEsIDExLCBudWxsLCBTb3VyY2VNYXBDb25zdW1lci5MRUFTVF9VUFBFUl9CT1VORCwgbWFwLCBhc3NlcnQsIHRydWUpO1xuXG4gIC8vIEZpbmRpbmcgZ2VuZXJhdGVkIHBvc2l0aW9ucyB3aXRoIGRlZmF1bHQgKGdsYikgYmlhcy5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDEsIDE4LCAnL3RoZS9yb290L29uZS5qcycsIDEsIDIyLCAnYmFyJywgbnVsbCwgbWFwLCBhc3NlcnQsIG51bGwsIHRydWUpO1xuICB1dGlsLmFzc2VydE1hcHBpbmcoMSwgMjgsICcvdGhlL3Jvb3Qvb25lLmpzJywgMiwgMTMsICdiYXonLCBudWxsLCBtYXAsIGFzc2VydCwgbnVsbCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygyLCA5LCAnL3RoZS9yb290L3R3by5qcycsIDEsIDE2LCBudWxsLCBudWxsLCBtYXAsIGFzc2VydCwgbnVsbCwgdHJ1ZSk7XG5cbiAgLy8gRmluZGluZyBnZW5lcmF0ZWQgcG9zaXRpb25zIHdpdGggbHViIGJpYXMuXG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAxOCwgJy90aGUvcm9vdC9vbmUuanMnLCAxLCAyMCwgJ2JhcicsIFNvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5ELCBtYXAsIGFzc2VydCwgbnVsbCwgdHJ1ZSk7XG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAyOCwgJy90aGUvcm9vdC9vbmUuanMnLCAyLCA3LCAnYmF6JywgU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQsIG1hcCwgYXNzZXJ0LCBudWxsLCB0cnVlKTtcbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDksICcvdGhlL3Jvb3QvdHdvLmpzJywgMSwgNiwgbnVsbCwgU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQsIG1hcCwgYXNzZXJ0LCBudWxsLCB0cnVlKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgbWFwcGluZ3MgYW5kIGVuZCBvZiBsaW5lcyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgc21nID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgZmlsZTogJ2Zvby5qcydcbiAgfSk7XG4gIHNtZy5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAxLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgc291cmNlOiAnYmFyLmpzJ1xuICB9KTtcbiAgc21nLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDIsIGNvbHVtbjogMiB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdiYXIuanMnXG4gIH0pO1xuICBzbWcuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIHNvdXJjZTogJ2Jhei5qcydcbiAgfSk7XG5cbiAgdmFyIG1hcCA9IFNvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAoc21nKTtcblxuICAvLyBXaGVuIGZpbmRpbmcgb3JpZ2luYWwgcG9zaXRpb25zLCBtYXBwaW5ncyBlbmQgYXQgdGhlIGVuZCBvZiB0aGUgbGluZS5cbiAgdXRpbC5hc3NlcnRNYXBwaW5nKDIsIDEsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG1hcCwgYXNzZXJ0LCB0cnVlKVxuXG4gIC8vIFdoZW4gZmluZGluZyBnZW5lcmF0ZWQgcG9zaXRpb25zLCBtYXBwaW5ncyBkbyBub3QgZW5kIGF0IHRoZSBlbmQgb2YgdGhlIGxpbmUuXG4gIHV0aWwuYXNzZXJ0TWFwcGluZygxLCAxLCAnYmFyLmpzJywgMiwgMSwgbnVsbCwgbnVsbCwgbWFwLCBhc3NlcnQsIG51bGwsIHRydWUpO1xuXG4gIC8vIFdoZW4gZmluZGluZyBnZW5lcmF0ZWQgcG9zaXRpb25zIHdpdGgsIG1hcHBpbmdzIGVuZCBhdCB0aGUgZW5kIG9mIHRoZSBzb3VyY2UuXG4gIHV0aWwuYXNzZXJ0TWFwcGluZyhudWxsLCBudWxsLCAnYmFyLmpzJywgMywgMSwgbnVsbCwgU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQsIG1hcCwgYXNzZXJ0LCBudWxsLCB0cnVlKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgY3JlYXRpbmcgc291cmNlIG1hcCBjb25zdW1lcnMgd2l0aCApXX1cXCcgcHJlZml4J10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIGFzc2VydC5kb2VzTm90VGhyb3coZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoXCIpXX0nXCIgKyBKU09OLnN0cmluZ2lmeSh1dGlsLnRlc3RNYXApKTtcbiAgfSk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGVhY2hNYXBwaW5nJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXA7XG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcCk7XG4gIHZhciBwcmV2aW91c0xpbmUgPSAtSW5maW5pdHk7XG4gIHZhciBwcmV2aW91c0NvbHVtbiA9IC1JbmZpbml0eTtcbiAgbWFwLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgYXNzZXJ0Lm9rKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSA+PSBwcmV2aW91c0xpbmUpO1xuXG4gICAgYXNzZXJ0Lm9rKG1hcHBpbmcuc291cmNlID09PSAnL3RoZS9yb290L29uZS5qcycgfHwgbWFwcGluZy5zb3VyY2UgPT09ICcvdGhlL3Jvb3QvdHdvLmpzJyk7XG5cbiAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lID09PSBwcmV2aW91c0xpbmUpIHtcbiAgICAgIGFzc2VydC5vayhtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA+PSBwcmV2aW91c0NvbHVtbik7XG4gICAgICBwcmV2aW91c0NvbHVtbiA9IG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHByZXZpb3VzTGluZSA9IG1hcHBpbmcuZ2VuZXJhdGVkTGluZTtcbiAgICAgIHByZXZpb3VzQ29sdW1uID0gLUluZmluaXR5O1xuICAgIH1cbiAgfSk7XG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcE5vU291cmNlUm9vdCk7XG4gIG1hcC5lYWNoTWFwcGluZyhmdW5jdGlvbiAobWFwcGluZykge1xuICAgIGFzc2VydC5vayhtYXBwaW5nLnNvdXJjZSA9PT0gJ29uZS5qcycgfHwgbWFwcGluZy5zb3VyY2UgPT09ICd0d28uanMnKTtcbiAgfSk7XG5cbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcEVtcHR5U291cmNlUm9vdCk7XG4gIG1hcC5lYWNoTWFwcGluZyhmdW5jdGlvbiAobWFwcGluZykge1xuICAgIGFzc2VydC5vayhtYXBwaW5nLnNvdXJjZSA9PT0gJ29uZS5qcycgfHwgbWFwcGluZy5zb3VyY2UgPT09ICd0d28uanMnKTtcbiAgfSk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGVhY2hNYXBwaW5nIGZvciBpbmRleGVkIHNvdXJjZSBtYXBzJ10gPSBmdW5jdGlvbihhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLmluZGV4ZWRUZXN0TWFwKTtcbiAgdmFyIHByZXZpb3VzTGluZSA9IC1JbmZpbml0eTtcbiAgdmFyIHByZXZpb3VzQ29sdW1uID0gLUluZmluaXR5O1xuICBtYXAuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICBhc3NlcnQub2sobWFwcGluZy5nZW5lcmF0ZWRMaW5lID49IHByZXZpb3VzTGluZSk7XG5cbiAgICBpZiAobWFwcGluZy5zb3VyY2UpIHtcbiAgICAgIGFzc2VydC5lcXVhbChtYXBwaW5nLnNvdXJjZS5pbmRleE9mKHV0aWwudGVzdE1hcC5zb3VyY2VSb290KSwgMCk7XG4gICAgfVxuXG4gICAgaWYgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9PT0gcHJldmlvdXNMaW5lKSB7XG4gICAgICBhc3NlcnQub2sobWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gPj0gcHJldmlvdXNDb2x1bW4pO1xuICAgICAgcHJldmlvdXNDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwcmV2aW91c0xpbmUgPSBtYXBwaW5nLmdlbmVyYXRlZExpbmU7XG4gICAgICBwcmV2aW91c0NvbHVtbiA9IC1JbmZpbml0eTtcbiAgICB9XG4gIH0pO1xufTtcblxuXG5leHBvcnRzWyd0ZXN0IGl0ZXJhdGluZyBvdmVyIG1hcHBpbmdzIGluIGEgZGlmZmVyZW50IG9yZGVyJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC50ZXN0TWFwKTtcbiAgdmFyIHByZXZpb3VzTGluZSA9IC1JbmZpbml0eTtcbiAgdmFyIHByZXZpb3VzQ29sdW1uID0gLUluZmluaXR5O1xuICB2YXIgcHJldmlvdXNTb3VyY2UgPSBcIlwiO1xuICBtYXAuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICBhc3NlcnQub2sobWFwcGluZy5zb3VyY2UgPj0gcHJldmlvdXNTb3VyY2UpO1xuXG4gICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBwcmV2aW91c1NvdXJjZSkge1xuICAgICAgYXNzZXJ0Lm9rKG1hcHBpbmcub3JpZ2luYWxMaW5lID49IHByZXZpb3VzTGluZSk7XG5cbiAgICAgIGlmIChtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gcHJldmlvdXNMaW5lKSB7XG4gICAgICAgIGFzc2VydC5vayhtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID49IHByZXZpb3VzQ29sdW1uKTtcbiAgICAgICAgcHJldmlvdXNDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHByZXZpb3VzTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lO1xuICAgICAgICBwcmV2aW91c0NvbHVtbiA9IC1JbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwcmV2aW91c1NvdXJjZSA9IG1hcHBpbmcuc291cmNlO1xuICAgICAgcHJldmlvdXNMaW5lID0gLUluZmluaXR5O1xuICAgICAgcHJldmlvdXNDb2x1bW4gPSAtSW5maW5pdHk7XG4gICAgfVxuICB9LCBudWxsLCBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUik7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGl0ZXJhdGluZyBvdmVyIG1hcHBpbmdzIGluIGEgZGlmZmVyZW50IG9yZGVyIGluIGluZGV4ZWQgc291cmNlIG1hcHMnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLmluZGV4ZWRUZXN0TWFwKTtcbiAgdmFyIHByZXZpb3VzTGluZSA9IC1JbmZpbml0eTtcbiAgdmFyIHByZXZpb3VzQ29sdW1uID0gLUluZmluaXR5O1xuICB2YXIgcHJldmlvdXNTb3VyY2UgPSBcIlwiO1xuICBtYXAuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG1hcHBpbmcpIHtcbiAgICBhc3NlcnQub2sobWFwcGluZy5zb3VyY2UgPj0gcHJldmlvdXNTb3VyY2UpO1xuXG4gICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBwcmV2aW91c1NvdXJjZSkge1xuICAgICAgYXNzZXJ0Lm9rKG1hcHBpbmcub3JpZ2luYWxMaW5lID49IHByZXZpb3VzTGluZSk7XG5cbiAgICAgIGlmIChtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gcHJldmlvdXNMaW5lKSB7XG4gICAgICAgIGFzc2VydC5vayhtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID49IHByZXZpb3VzQ29sdW1uKTtcbiAgICAgICAgcHJldmlvdXNDb2x1bW4gPSBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHByZXZpb3VzTGluZSA9IG1hcHBpbmcub3JpZ2luYWxMaW5lO1xuICAgICAgICBwcmV2aW91c0NvbHVtbiA9IC1JbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwcmV2aW91c1NvdXJjZSA9IG1hcHBpbmcuc291cmNlO1xuICAgICAgcHJldmlvdXNMaW5lID0gLUluZmluaXR5O1xuICAgICAgcHJldmlvdXNDb2x1bW4gPSAtSW5maW5pdHk7XG4gICAgfVxuICB9LCBudWxsLCBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUik7XG59O1xuXG5leHBvcnRzWyd0ZXN0IHRoYXQgd2UgY2FuIHNldCB0aGUgY29udGV4dCBmb3IgYHRoaXNgIGluIGVhY2hNYXBwaW5nJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC50ZXN0TWFwKTtcbiAgdmFyIGNvbnRleHQgPSB7fTtcbiAgbWFwLmVhY2hNYXBwaW5nKGZ1bmN0aW9uICgpIHtcbiAgICBhc3NlcnQuZXF1YWwodGhpcywgY29udGV4dCk7XG4gIH0sIGNvbnRleHQpO1xufTtcblxuZXhwb3J0c1sndGVzdCB0aGF0IHdlIGNhbiBzZXQgdGhlIGNvbnRleHQgZm9yIGB0aGlzYCBpbiBlYWNoTWFwcGluZyBpbiBpbmRleGVkIHNvdXJjZSBtYXBzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5pbmRleGVkVGVzdE1hcCk7XG4gIHZhciBjb250ZXh0ID0ge307XG4gIG1hcC5lYWNoTWFwcGluZyhmdW5jdGlvbiAoKSB7XG4gICAgYXNzZXJ0LmVxdWFsKHRoaXMsIGNvbnRleHQpO1xuICB9LCBjb250ZXh0KTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgdGhhdCB0aGUgYHNvdXJjZXNDb250ZW50YCBmaWVsZCBoYXMgdGhlIG9yaWdpbmFsIHNvdXJjZXMnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih1dGlsLnRlc3RNYXBXaXRoU291cmNlc0NvbnRlbnQpO1xuICB2YXIgc291cmNlc0NvbnRlbnQgPSBtYXAuc291cmNlc0NvbnRlbnQ7XG5cbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXNDb250ZW50WzBdLCAnIE9ORS5mb28gPSBmdW5jdGlvbiAoYmFyKSB7XFxuICAgcmV0dXJuIGJheihiYXIpO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc0NvbnRlbnRbMV0sICcgVFdPLmluYyA9IGZ1bmN0aW9uIChuKSB7XFxuICAgcmV0dXJuIG4gKyAxO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc0NvbnRlbnQubGVuZ3RoLCAyKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgdGhhdCB3ZSBjYW4gZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2VzIGZvciB0aGUgc291cmNlcyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcFdpdGhTb3VyY2VzQ29udGVudCk7XG4gIHZhciBzb3VyY2VzID0gbWFwLnNvdXJjZXM7XG5cbiAgYXNzZXJ0LmVxdWFsKG1hcC5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZXNbMF0pLCAnIE9ORS5mb28gPSBmdW5jdGlvbiAoYmFyKSB7XFxuICAgcmV0dXJuIGJheihiYXIpO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlc1sxXSksICcgVFdPLmluYyA9IGZ1bmN0aW9uIChuKSB7XFxuICAgcmV0dXJuIG4gKyAxO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3IoXCJvbmUuanNcIiksICcgT05FLmZvbyA9IGZ1bmN0aW9uIChiYXIpIHtcXG4gICByZXR1cm4gYmF6KGJhcik7XFxuIH07Jyk7XG4gIGFzc2VydC5lcXVhbChtYXAuc291cmNlQ29udGVudEZvcihcInR3by5qc1wiKSwgJyBUV08uaW5jID0gZnVuY3Rpb24gKG4pIHtcXG4gICByZXR1cm4gbiArIDE7XFxuIH07Jyk7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiXCIpO1xuICB9LCBFcnJvcik7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiL3RoZS9yb290L3RocmVlLmpzXCIpO1xuICB9LCBFcnJvcik7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwidGhyZWUuanNcIik7XG4gIH0sIEVycm9yKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgdGhhdCB3ZSBjYW4gZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudCB3aXRoIHJlbGF0aXZlIHNvdXJjZSBwYXRocyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwudGVzdE1hcFJlbGF0aXZlU291cmNlcyk7XG4gIHZhciBzb3VyY2VzID0gbWFwLnNvdXJjZXM7XG5cbiAgYXNzZXJ0LmVxdWFsKG1hcC5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZXNbMF0pLCAnIE9ORS5mb28gPSBmdW5jdGlvbiAoYmFyKSB7XFxuICAgcmV0dXJuIGJheihiYXIpO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlc1sxXSksICcgVFdPLmluYyA9IGZ1bmN0aW9uIChuKSB7XFxuICAgcmV0dXJuIG4gKyAxO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3IoXCJvbmUuanNcIiksICcgT05FLmZvbyA9IGZ1bmN0aW9uIChiYXIpIHtcXG4gICByZXR1cm4gYmF6KGJhcik7XFxuIH07Jyk7XG4gIGFzc2VydC5lcXVhbChtYXAuc291cmNlQ29udGVudEZvcihcInR3by5qc1wiKSwgJyBUV08uaW5jID0gZnVuY3Rpb24gKG4pIHtcXG4gICByZXR1cm4gbiArIDE7XFxuIH07Jyk7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiXCIpO1xuICB9LCBFcnJvcik7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiL3RoZS9yb290L3RocmVlLmpzXCIpO1xuICB9LCBFcnJvcik7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwidGhyZWUuanNcIik7XG4gIH0sIEVycm9yKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgdGhhdCB3ZSBjYW4gZ2V0IHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudCBmb3IgdGhlIHNvdXJjZXMgb24gYW4gaW5kZXhlZCBzb3VyY2UgbWFwJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodXRpbC5pbmRleGVkVGVzdE1hcCk7XG4gIHZhciBzb3VyY2VzID0gbWFwLnNvdXJjZXM7XG5cbiAgYXNzZXJ0LmVxdWFsKG1hcC5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZXNbMF0pLCAnIE9ORS5mb28gPSBmdW5jdGlvbiAoYmFyKSB7XFxuICAgcmV0dXJuIGJheihiYXIpO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3Ioc291cmNlc1sxXSksICcgVFdPLmluYyA9IGZ1bmN0aW9uIChuKSB7XFxuICAgcmV0dXJuIG4gKyAxO1xcbiB9OycpO1xuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3IoXCJvbmUuanNcIiksICcgT05FLmZvbyA9IGZ1bmN0aW9uIChiYXIpIHtcXG4gICByZXR1cm4gYmF6KGJhcik7XFxuIH07Jyk7XG4gIGFzc2VydC5lcXVhbChtYXAuc291cmNlQ29udGVudEZvcihcInR3by5qc1wiKSwgJyBUV08uaW5jID0gZnVuY3Rpb24gKG4pIHtcXG4gICByZXR1cm4gbiArIDE7XFxuIH07Jyk7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiXCIpO1xuICB9LCBFcnJvcik7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiL3RoZS9yb290L3RocmVlLmpzXCIpO1xuICB9LCBFcnJvcik7XG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zb3VyY2VDb250ZW50Rm9yKFwidGhyZWUuanNcIik7XG4gIH0sIEVycm9yKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgaGFzQ29udGVudHNPZkFsbFNvdXJjZXMsIHNpbmdsZSBzb3VyY2Ugd2l0aCBjb250ZW50cyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICAvLyBIYXMgb25lIHNvdXJjZTogZm9vLmpzICh3aXRoIGNvbnRlbnRzKS5cbiAgdmFyIG1hcFdpdGhDb250ZW50cyA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoKTtcbiAgbWFwV2l0aENvbnRlbnRzLmFkZE1hcHBpbmcoeyBzb3VyY2U6ICdmb28uanMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMTAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMSwgY29sdW1uOiAxMCB9IH0pO1xuICBtYXBXaXRoQ29udGVudHMuc2V0U291cmNlQ29udGVudCgnZm9vLmpzJywgJ2NvbnRlbnQgb2YgZm9vLmpzJyk7XG4gIHZhciBjb25zdW1lciA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihtYXBXaXRoQ29udGVudHMudG9KU09OKCkpO1xuICBhc3NlcnQub2soY29uc3VtZXIuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzLCBzaW5nbGUgc291cmNlIHdpdGhvdXQgY29udGVudHMnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgLy8gSGFzIG9uZSBzb3VyY2U6IGZvby5qcyAod2l0aG91dCBjb250ZW50cykuXG4gIHZhciBtYXBXaXRob3V0Q29udGVudHMgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKCk7XG4gIG1hcFdpdGhvdXRDb250ZW50cy5hZGRNYXBwaW5nKHsgc291cmNlOiAnZm9vLmpzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiAxLCBjb2x1bW46IDEwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDEsIGNvbHVtbjogMTAgfSB9KTtcbiAgdmFyIGNvbnN1bWVyID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcFdpdGhvdXRDb250ZW50cy50b0pTT04oKSk7XG4gIGFzc2VydC5vayghY29uc3VtZXIuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzLCB0d28gc291cmNlcyB3aXRoIGNvbnRlbnRzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIC8vIEhhcyB0d28gc291cmNlczogZm9vLmpzICh3aXRoIGNvbnRlbnRzKSBhbmQgYmFyLmpzICh3aXRoIGNvbnRlbnRzKS5cbiAgdmFyIG1hcFdpdGhCb3RoQ29udGVudHMgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKCk7XG4gIG1hcFdpdGhCb3RoQ29udGVudHMuYWRkTWFwcGluZyh7IHNvdXJjZTogJ2Zvby5qcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMTAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDEsIGNvbHVtbjogMTAgfSB9KTtcbiAgbWFwV2l0aEJvdGhDb250ZW50cy5hZGRNYXBwaW5nKHsgc291cmNlOiAnYmFyLmpzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMSwgY29sdW1uOiAxMCB9IH0pO1xuICBtYXBXaXRoQm90aENvbnRlbnRzLnNldFNvdXJjZUNvbnRlbnQoJ2Zvby5qcycsICdjb250ZW50IG9mIGZvby5qcycpO1xuICBtYXBXaXRoQm90aENvbnRlbnRzLnNldFNvdXJjZUNvbnRlbnQoJ2Jhci5qcycsICdjb250ZW50IG9mIGJhci5qcycpO1xuICB2YXIgY29uc3VtZXIgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwV2l0aEJvdGhDb250ZW50cy50b0pTT04oKSk7XG4gIGFzc2VydC5vayhjb25zdW1lci5oYXNDb250ZW50c09mQWxsU291cmNlcygpKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgaGFzQ29udGVudHNPZkFsbFNvdXJjZXMsIHR3byBzb3VyY2VzIG9uZSB3aXRoIGFuZCBvbmUgd2l0aG91dCBjb250ZW50cyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICAvLyBIYXMgdHdvIHNvdXJjZXM6IGZvby5qcyAod2l0aCBjb250ZW50cykgYW5kIGJhci5qcyAod2l0aG91dCBjb250ZW50cykuXG4gIHZhciBtYXBXaXRob3V0U29tZUNvbnRlbnRzID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcigpO1xuICBtYXBXaXRob3V0U29tZUNvbnRlbnRzLmFkZE1hcHBpbmcoeyBzb3VyY2U6ICdmb28uanMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbDogeyBsaW5lOiAxLCBjb2x1bW46IDEwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiAxLCBjb2x1bW46IDEwIH0gfSk7XG4gIG1hcFdpdGhvdXRTb21lQ29udGVudHMuYWRkTWFwcGluZyh7IHNvdXJjZTogJ2Jhci5qcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMTAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDEsIGNvbHVtbjogMTAgfSB9KTtcbiAgbWFwV2l0aG91dFNvbWVDb250ZW50cy5zZXRTb3VyY2VDb250ZW50KCdmb28uanMnLCAnY29udGVudCBvZiBmb28uanMnKTtcbiAgdmFyIGNvbnN1bWVyID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcFdpdGhvdXRTb21lQ29udGVudHMudG9KU09OKCkpO1xuICBhc3NlcnQub2soIWNvbnN1bWVyLmhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkpO1xufTtcblxuZXhwb3J0c1sndGVzdCBzb3VyY2VSb290ICsgZ2VuZXJhdGVkUG9zaXRpb25Gb3InXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgIHNvdXJjZVJvb3Q6ICdmb28vYmFyJyxcbiAgICBmaWxlOiAnYmF6LmpzJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdiYW5nLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiA1LCBjb2x1bW46IDUgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogNiwgY29sdW1uOiA2IH0sXG4gICAgc291cmNlOiAnYmFuZy5jb2ZmZWUnXG4gIH0pO1xuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwLnRvU3RyaW5nKCkpO1xuXG4gIC8vIFNob3VsZCBoYW5kbGUgd2l0aG91dCBzb3VyY2VSb290LlxuICB2YXIgcG9zID0gbWFwLmdlbmVyYXRlZFBvc2l0aW9uRm9yKHtcbiAgICBsaW5lOiAxLFxuICAgIGNvbHVtbjogMSxcbiAgICBzb3VyY2U6ICdiYW5nLmNvZmZlZSdcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKHBvcy5saW5lLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5jb2x1bW4sIDIpO1xuXG4gIC8vIFNob3VsZCBoYW5kbGUgd2l0aCBzb3VyY2VSb290LlxuICB2YXIgcG9zID0gbWFwLmdlbmVyYXRlZFBvc2l0aW9uRm9yKHtcbiAgICBsaW5lOiAxLFxuICAgIGNvbHVtbjogMSxcbiAgICBzb3VyY2U6ICdmb28vYmFyL2JhbmcuY29mZmVlJ1xuICB9KTtcblxuICBhc3NlcnQuZXF1YWwocG9zLmxpbmUsIDIpO1xuICBhc3NlcnQuZXF1YWwocG9zLmNvbHVtbiwgMik7XG59O1xuXG5leHBvcnRzWyd0ZXN0IHNvdXJjZVJvb3QgKyBnZW5lcmF0ZWRQb3NpdGlvbkZvciBmb3IgcGF0aCBhYm92ZSB0aGUgcm9vdCddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgc291cmNlUm9vdDogJ2Zvby9iYXInLFxuICAgIGZpbGU6ICdiYXouanMnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDIsIGNvbHVtbjogMiB9LFxuICAgIHNvdXJjZTogJy4uL2JhbmcuY29mZmVlJ1xuICB9KTtcbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcC50b1N0cmluZygpKTtcblxuICAvLyBTaG91bGQgaGFuZGxlIHdpdGggc291cmNlUm9vdC5cbiAgdmFyIHBvcyA9IG1hcC5nZW5lcmF0ZWRQb3NpdGlvbkZvcih7XG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDEsXG4gICAgc291cmNlOiAnZm9vL2JhbmcuY29mZmVlJ1xuICB9KTtcblxuICBhc3NlcnQuZXF1YWwocG9zLmxpbmUsIDIpO1xuICBhc3NlcnQuZXF1YWwocG9zLmNvbHVtbiwgMik7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGFsbEdlbmVyYXRlZFBvc2l0aW9uc0ZvciBmb3IgbGluZSddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgZmlsZTogJ2dlbmVyYXRlZC5qcydcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAxLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMiwgY29sdW1uOiAyIH0sXG4gICAgc291cmNlOiAnZm9vLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAxLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMiwgY29sdW1uOiAyIH0sXG4gICAgc291cmNlOiAnYmFyLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAyLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMywgY29sdW1uOiAyIH0sXG4gICAgc291cmNlOiAnYmFyLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMywgY29sdW1uOiAzIH0sXG4gICAgc291cmNlOiAnYmFyLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAzLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogNCwgY29sdW1uOiAyIH0sXG4gICAgc291cmNlOiAnYmFyLmNvZmZlZSdcbiAgfSk7XG4gIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihtYXAudG9TdHJpbmcoKSk7XG5cbiAgdmFyIG1hcHBpbmdzID0gbWFwLmFsbEdlbmVyYXRlZFBvc2l0aW9uc0Zvcih7XG4gICAgbGluZTogMixcbiAgICBzb3VyY2U6ICdiYXIuY29mZmVlJ1xuICB9KTtcblxuICBhc3NlcnQuZXF1YWwobWFwcGluZ3MubGVuZ3RoLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzWzBdLmxpbmUsIDMpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMF0uY29sdW1uLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzWzFdLmxpbmUsIDMpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMV0uY29sdW1uLCAzKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yIGZvciBsaW5lIGZ1enp5J10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICBmaWxlOiAnZ2VuZXJhdGVkLmpzJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdiYXIuY29mZmVlJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDMsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiA0LCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdiYXIuY29mZmVlJ1xuICB9KTtcbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcC50b1N0cmluZygpKTtcblxuICB2YXIgbWFwcGluZ3MgPSBtYXAuYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yKHtcbiAgICBsaW5lOiAyLFxuICAgIHNvdXJjZTogJ2Jhci5jb2ZmZWUnXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChtYXBwaW5ncy5sZW5ndGgsIDEpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMF0ubGluZSwgNCk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nc1swXS5jb2x1bW4sIDIpO1xufTtcblxuZXhwb3J0c1sndGVzdCBhbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IgZm9yIGVtcHR5IHNvdXJjZSBtYXAnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgIGZpbGU6ICdnZW5lcmF0ZWQuanMnXG4gIH0pO1xuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwLnRvU3RyaW5nKCkpO1xuXG4gIHZhciBtYXBwaW5ncyA9IG1hcC5hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3Ioe1xuICAgIGxpbmU6IDIsXG4gICAgc291cmNlOiAnYmFyLmNvZmZlZSdcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzLmxlbmd0aCwgMCk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGFsbEdlbmVyYXRlZFBvc2l0aW9uc0ZvciBmb3IgY29sdW1uJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICBmaWxlOiAnZ2VuZXJhdGVkLmpzJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAxLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAxLCBjb2x1bW46IDMgfSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcC50b1N0cmluZygpKTtcblxuICB2YXIgbWFwcGluZ3MgPSBtYXAuYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yKHtcbiAgICBsaW5lOiAxLFxuICAgIGNvbHVtbjogMSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcblxuICBhc3NlcnQuZXF1YWwobWFwcGluZ3MubGVuZ3RoLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzWzBdLmxpbmUsIDEpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMF0uY29sdW1uLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzWzFdLmxpbmUsIDEpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMV0uY29sdW1uLCAzKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yIGZvciBjb2x1bW4gZnV6enknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgIGZpbGU6ICdnZW5lcmF0ZWQuanMnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDEsIGNvbHVtbjogMiB9LFxuICAgIHNvdXJjZTogJ2Zvby5jb2ZmZWUnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDEsIGNvbHVtbjogMyB9LFxuICAgIHNvdXJjZTogJ2Zvby5jb2ZmZWUnXG4gIH0pO1xuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwLnRvU3RyaW5nKCkpO1xuXG4gIHZhciBtYXBwaW5ncyA9IG1hcC5hbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3Ioe1xuICAgIGxpbmU6IDEsXG4gICAgY29sdW1uOiAwLFxuICAgIHNvdXJjZTogJ2Zvby5jb2ZmZWUnXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChtYXBwaW5ncy5sZW5ndGgsIDIpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMF0ubGluZSwgMSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nc1swXS5jb2x1bW4sIDIpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMV0ubGluZSwgMSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nc1sxXS5jb2x1bW4sIDMpO1xufTtcblxuZXhwb3J0c1sndGVzdCBhbGxHZW5lcmF0ZWRQb3NpdGlvbnNGb3IgZm9yIGNvbHVtbiBvbiBkaWZmZXJlbnQgbGluZSBmdXp6eSddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgZmlsZTogJ2dlbmVyYXRlZC5qcydcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAyLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMiwgY29sdW1uOiAyIH0sXG4gICAgc291cmNlOiAnZm9vLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAyLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMiwgY29sdW1uOiAzIH0sXG4gICAgc291cmNlOiAnZm9vLmNvZmZlZSdcbiAgfSk7XG4gIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihtYXAudG9TdHJpbmcoKSk7XG5cbiAgdmFyIG1hcHBpbmdzID0gbWFwLmFsbEdlbmVyYXRlZFBvc2l0aW9uc0Zvcih7XG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDAsXG4gICAgc291cmNlOiAnZm9vLmNvZmZlZSdcbiAgfSk7XG5cbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzLmxlbmd0aCwgMCk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGNvbXB1dGVDb2x1bW5TcGFucyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgZmlsZTogJ2dlbmVyYXRlZC5qcydcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAxLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgc291cmNlOiAnZm9vLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAyLCBjb2x1bW46IDEgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMiwgY29sdW1uOiAxIH0sXG4gICAgc291cmNlOiAnZm9vLmNvZmZlZSdcbiAgfSk7XG4gIG1hcC5hZGRNYXBwaW5nKHtcbiAgICBvcmlnaW5hbDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMiwgY29sdW1uOiAxMCB9LFxuICAgIHNvdXJjZTogJ2Zvby5jb2ZmZWUnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMiwgY29sdW1uOiAzIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDIsIGNvbHVtbjogMjAgfSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDMsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAzLCBjb2x1bW46IDEgfSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDMsIGNvbHVtbjogMiB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAzLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcC50b1N0cmluZygpKTtcblxuICBtYXAuY29tcHV0ZUNvbHVtblNwYW5zKCk7XG5cbiAgdmFyIG1hcHBpbmdzID0gbWFwLmFsbEdlbmVyYXRlZFBvc2l0aW9uc0Zvcih7XG4gICAgbGluZTogMSxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcblxuICBhc3NlcnQuZXF1YWwobWFwcGluZ3MubGVuZ3RoLCAxKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzWzBdLmxhc3RDb2x1bW4sIEluZmluaXR5KTtcblxuICB2YXIgbWFwcGluZ3MgPSBtYXAuYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yKHtcbiAgICBsaW5lOiAyLFxuICAgIHNvdXJjZTogJ2Zvby5jb2ZmZWUnXG4gIH0pO1xuXG4gIGFzc2VydC5lcXVhbChtYXBwaW5ncy5sZW5ndGgsIDMpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMF0ubGFzdENvbHVtbiwgOSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nc1sxXS5sYXN0Q29sdW1uLCAxOSk7XG4gIGFzc2VydC5lcXVhbChtYXBwaW5nc1syXS5sYXN0Q29sdW1uLCBJbmZpbml0eSk7XG5cbiAgdmFyIG1hcHBpbmdzID0gbWFwLmFsbEdlbmVyYXRlZFBvc2l0aW9uc0Zvcih7XG4gICAgbGluZTogMyxcbiAgICBzb3VyY2U6ICdmb28uY29mZmVlJ1xuICB9KTtcblxuICBhc3NlcnQuZXF1YWwobWFwcGluZ3MubGVuZ3RoLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcHBpbmdzWzBdLmxhc3RDb2x1bW4sIDEpO1xuICBhc3NlcnQuZXF1YWwobWFwcGluZ3NbMV0ubGFzdENvbHVtbiwgSW5maW5pdHkpO1xufTtcblxuZXhwb3J0c1sndGVzdCBzb3VyY2VSb290ICsgb3JpZ2luYWxQb3NpdGlvbkZvciddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgc291cmNlUm9vdDogJ2Zvby9iYXInLFxuICAgIGZpbGU6ICdiYXouanMnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDIsIGNvbHVtbjogMiB9LFxuICAgIHNvdXJjZTogJ2JhbmcuY29mZmVlJ1xuICB9KTtcbiAgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcC50b1N0cmluZygpKTtcblxuICB2YXIgcG9zID0gbWFwLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDIsXG4gICAgY29sdW1uOiAyLFxuICB9KTtcblxuICAvLyBTaG91bGQgYWx3YXlzIGhhdmUgdGhlIHByZXBlbmRlZCBzb3VyY2Ugcm9vdFxuICBhc3NlcnQuZXF1YWwocG9zLnNvdXJjZSwgJ2Zvby9iYXIvYmFuZy5jb2ZmZWUnKTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5saW5lLCAxKTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5jb2x1bW4sIDEpO1xufTtcblxuZXhwb3J0c1sndGVzdCBnaXRodWIgaXNzdWUgIzU2J10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHtcbiAgICBzb3VyY2VSb290OiAnaHR0cDovLycsXG4gICAgZmlsZTogJ3d3dy5leGFtcGxlLmNvbS9mb28uanMnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDIsIGNvbHVtbjogMiB9LFxuICAgIHNvdXJjZTogJ3d3dy5leGFtcGxlLmNvbS9vcmlnaW5hbC5qcydcbiAgfSk7XG4gIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihtYXAudG9TdHJpbmcoKSk7XG5cbiAgdmFyIHNvdXJjZXMgPSBtYXAuc291cmNlcztcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXMubGVuZ3RoLCAxKTtcbiAgYXNzZXJ0LmVxdWFsKHNvdXJjZXNbMF0sICdodHRwOi8vd3d3LmV4YW1wbGUuY29tL29yaWdpbmFsLmpzJyk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGdpdGh1YiBpc3N1ZSAjNDMnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIG1hcCA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgIHNvdXJjZVJvb3Q6ICdodHRwOi8vZXhhbXBsZS5jb20nLFxuICAgIGZpbGU6ICdmb28uanMnXG4gIH0pO1xuICBtYXAuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMSwgY29sdW1uOiAxIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDIsIGNvbHVtbjogMiB9LFxuICAgIHNvdXJjZTogJ2h0dHA6Ly9jZG4uZXhhbXBsZS5jb20vb3JpZ2luYWwuanMnXG4gIH0pO1xuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwLnRvU3RyaW5nKCkpO1xuXG4gIHZhciBzb3VyY2VzID0gbWFwLnNvdXJjZXM7XG4gIGFzc2VydC5lcXVhbChzb3VyY2VzLmxlbmd0aCwgMSxcbiAgICAgICAgICAgICAgICdTaG91bGQgb25seSBiZSBvbmUgc291cmNlLicpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1swXSwgJ2h0dHA6Ly9jZG4uZXhhbXBsZS5jb20vb3JpZ2luYWwuanMnLFxuICAgICAgICAgICAgICAgJ1Nob3VsZCBub3QgYmUgam9pbmVkIHdpdGggdGhlIHNvdXJjZVJvb3QuJyk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGFic29sdXRlIHBhdGgsIGJ1dCBzYW1lIGhvc3Qgc291cmNlcyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7XG4gICAgc291cmNlUm9vdDogJ2h0dHA6Ly9leGFtcGxlLmNvbS9mb28vYmFyJyxcbiAgICBmaWxlOiAnZm9vLmpzJ1xuICB9KTtcbiAgbWFwLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICcvb3JpZ2luYWwuanMnXG4gIH0pO1xuICBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIobWFwLnRvU3RyaW5nKCkpO1xuXG4gIHZhciBzb3VyY2VzID0gbWFwLnNvdXJjZXM7XG4gIGFzc2VydC5lcXVhbChzb3VyY2VzLmxlbmd0aCwgMSxcbiAgICAgICAgICAgICAgICdTaG91bGQgb25seSBiZSBvbmUgc291cmNlLicpO1xuICBhc3NlcnQuZXF1YWwoc291cmNlc1swXSwgJ2h0dHA6Ly9leGFtcGxlLmNvbS9vcmlnaW5hbC5qcycsXG4gICAgICAgICAgICAgICAnU291cmNlIHNob3VsZCBiZSByZWxhdGl2ZSB0aGUgaG9zdCBvZiB0aGUgc291cmNlIHJvb3QuJyk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGluZGV4ZWQgc291cmNlIG1hcCBlcnJvcnMgd2hlbiBzZWN0aW9ucyBhcmUgb3V0IG9mIG9yZGVyIGJ5IGxpbmUnXSA9IGZ1bmN0aW9uKGFzc2VydCkge1xuICAvLyBNYWtlIGEgZGVlcCBjb3B5IG9mIHRoZSBpbmRleGVkVGVzdE1hcFxuICB2YXIgbWlzb3JkZXJlZEluZGV4ZWRUZXN0TWFwID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh1dGlsLmluZGV4ZWRUZXN0TWFwKSk7XG5cbiAgbWlzb3JkZXJlZEluZGV4ZWRUZXN0TWFwLnNlY3Rpb25zWzBdLm9mZnNldCA9IHtcbiAgICBsaW5lOiAyLFxuICAgIGNvbHVtbjogMFxuICB9O1xuXG4gIGFzc2VydC50aHJvd3MoZnVuY3Rpb24oKSB7XG4gICAgbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1pc29yZGVyZWRJbmRleGVkVGVzdE1hcCk7XG4gIH0sIEVycm9yKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgZ2l0aHViIGlzc3VlICM2NCddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHtcbiAgICBcInZlcnNpb25cIjogMyxcbiAgICBcImZpbGVcIjogXCJmb28uanNcIixcbiAgICBcInNvdXJjZVJvb3RcIjogXCJodHRwOi8vZXhhbXBsZS5jb20vXCIsXG4gICAgXCJzb3VyY2VzXCI6IFtcIi9hXCJdLFxuICAgIFwibmFtZXNcIjogW10sXG4gICAgXCJtYXBwaW5nc1wiOiBcIkFBQ0FcIixcbiAgICBcInNvdXJjZXNDb250ZW50XCI6IFtcImZvb1wiXVxuICB9KTtcblxuICBhc3NlcnQuZXF1YWwobWFwLnNvdXJjZUNvbnRlbnRGb3IoXCJhXCIpLCBcImZvb1wiKTtcbiAgYXNzZXJ0LmVxdWFsKG1hcC5zb3VyY2VDb250ZW50Rm9yKFwiL2FcIiksIFwiZm9vXCIpO1xufTtcblxuZXhwb3J0c1sndGVzdCBidWcgODg1NTk3J10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoe1xuICAgIFwidmVyc2lvblwiOiAzLFxuICAgIFwiZmlsZVwiOiBcImZvby5qc1wiLFxuICAgIFwic291cmNlUm9vdFwiOiBcImZpbGU6Ly8vVXNlcnMvQWxHb3JlL0ludmVudGVkL1RoZS9JbnRlcm5ldC9cIixcbiAgICBcInNvdXJjZXNcIjogW1wiL2FcIl0sXG4gICAgXCJuYW1lc1wiOiBbXSxcbiAgICBcIm1hcHBpbmdzXCI6IFwiQUFDQVwiLFxuICAgIFwic291cmNlc0NvbnRlbnRcIjogW1wiZm9vXCJdXG4gIH0pO1xuXG4gIHZhciBzID0gbWFwLnNvdXJjZXNbMF07XG4gIGFzc2VydC5lcXVhbChtYXAuc291cmNlQ29udGVudEZvcihzKSwgXCJmb29cIik7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGdpdGh1YiBpc3N1ZSAjNzIsIGR1cGxpY2F0ZSBzb3VyY2VzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoe1xuICAgIFwidmVyc2lvblwiOiAzLFxuICAgIFwiZmlsZVwiOiBcImZvby5qc1wiLFxuICAgIFwic291cmNlc1wiOiBbXCJzb3VyY2UxLmpzXCIsIFwic291cmNlMS5qc1wiLCBcInNvdXJjZTMuanNcIl0sXG4gICAgXCJuYW1lc1wiOiBbXSxcbiAgICBcIm1hcHBpbmdzXCI6IFwiO0VBQUM7O0lBRUU7O01FRUVcIixcbiAgICBcInNvdXJjZVJvb3RcIjogXCJodHRwOi8vZXhhbXBsZS5jb21cIlxuICB9KTtcblxuICB2YXIgcG9zID0gbWFwLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDIsXG4gICAgY29sdW1uOiAyXG4gIH0pO1xuICBhc3NlcnQuZXF1YWwocG9zLnNvdXJjZSwgJ2h0dHA6Ly9leGFtcGxlLmNvbS9zb3VyY2UxLmpzJyk7XG4gIGFzc2VydC5lcXVhbChwb3MubGluZSwgMSk7XG4gIGFzc2VydC5lcXVhbChwb3MuY29sdW1uLCAxKTtcblxuICB2YXIgcG9zID0gbWFwLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDQsXG4gICAgY29sdW1uOiA0XG4gIH0pO1xuICBhc3NlcnQuZXF1YWwocG9zLnNvdXJjZSwgJ2h0dHA6Ly9leGFtcGxlLmNvbS9zb3VyY2UxLmpzJyk7XG4gIGFzc2VydC5lcXVhbChwb3MubGluZSwgMyk7XG4gIGFzc2VydC5lcXVhbChwb3MuY29sdW1uLCAzKTtcblxuICB2YXIgcG9zID0gbWFwLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDYsXG4gICAgY29sdW1uOiA2XG4gIH0pO1xuICBhc3NlcnQuZXF1YWwocG9zLnNvdXJjZSwgJ2h0dHA6Ly9leGFtcGxlLmNvbS9zb3VyY2UzLmpzJyk7XG4gIGFzc2VydC5lcXVhbChwb3MubGluZSwgNSk7XG4gIGFzc2VydC5lcXVhbChwb3MuY29sdW1uLCA1KTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3QgZ2l0aHViIGlzc3VlICM3MiwgZHVwbGljYXRlIG5hbWVzJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBtYXAgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIoe1xuICAgIFwidmVyc2lvblwiOiAzLFxuICAgIFwiZmlsZVwiOiBcImZvby5qc1wiLFxuICAgIFwic291cmNlc1wiOiBbXCJzb3VyY2UuanNcIl0sXG4gICAgXCJuYW1lc1wiOiBbXCJuYW1lMVwiLCBcIm5hbWUxXCIsIFwibmFtZTNcIl0sXG4gICAgXCJtYXBwaW5nc1wiOiBcIjtFQUFDQTs7SUFFRUE7O01BRUVFXCIsXG4gICAgXCJzb3VyY2VSb290XCI6IFwiaHR0cDovL2V4YW1wbGUuY29tXCJcbiAgfSk7XG5cbiAgdmFyIHBvcyA9IG1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICBsaW5lOiAyLFxuICAgIGNvbHVtbjogMlxuICB9KTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5uYW1lLCAnbmFtZTEnKTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5saW5lLCAxKTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5jb2x1bW4sIDEpO1xuXG4gIHZhciBwb3MgPSBtYXAub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgbGluZTogNCxcbiAgICBjb2x1bW46IDRcbiAgfSk7XG4gIGFzc2VydC5lcXVhbChwb3MubmFtZSwgJ25hbWUxJyk7XG4gIGFzc2VydC5lcXVhbChwb3MubGluZSwgMyk7XG4gIGFzc2VydC5lcXVhbChwb3MuY29sdW1uLCAzKTtcblxuICB2YXIgcG9zID0gbWFwLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDYsXG4gICAgY29sdW1uOiA2XG4gIH0pO1xuICBhc3NlcnQuZXF1YWwocG9zLm5hbWUsICduYW1lMycpO1xuICBhc3NlcnQuZXF1YWwocG9zLmxpbmUsIDUpO1xuICBhc3NlcnQuZXF1YWwocG9zLmNvbHVtbiwgNSk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IFNvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIHNtZyA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgIHNvdXJjZVJvb3Q6ICdodHRwOi8vZXhhbXBsZS5jb20vJyxcbiAgICBmaWxlOiAnZm9vLmpzJ1xuICB9KTtcbiAgc21nLmFkZE1hcHBpbmcoe1xuICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMSB9LFxuICAgIGdlbmVyYXRlZDogeyBsaW5lOiAyLCBjb2x1bW46IDIgfSxcbiAgICBzb3VyY2U6ICdiYXIuanMnXG4gIH0pO1xuICBzbWcuYWRkTWFwcGluZyh7XG4gICAgb3JpZ2luYWw6IHsgbGluZTogMiwgY29sdW1uOiAyIH0sXG4gICAgZ2VuZXJhdGVkOiB7IGxpbmU6IDQsIGNvbHVtbjogNCB9LFxuICAgIHNvdXJjZTogJ2Jhei5qcycsXG4gICAgbmFtZTogJ2RpcnRNY0dpcnQnXG4gIH0pO1xuICBzbWcuc2V0U291cmNlQ29udGVudCgnYmF6LmpzJywgJ2Jhei5qcyBjb250ZW50Jyk7XG5cbiAgdmFyIHNtYyA9IFNvdXJjZU1hcENvbnN1bWVyLmZyb21Tb3VyY2VNYXAoc21nKTtcbiAgYXNzZXJ0LmVxdWFsKHNtYy5maWxlLCAnZm9vLmpzJyk7XG4gIGFzc2VydC5lcXVhbChzbWMuc291cmNlUm9vdCwgJ2h0dHA6Ly9leGFtcGxlLmNvbS8nKTtcbiAgYXNzZXJ0LmVxdWFsKHNtYy5zb3VyY2VzLmxlbmd0aCwgMik7XG4gIGFzc2VydC5lcXVhbChzbWMuc291cmNlc1swXSwgJ2h0dHA6Ly9leGFtcGxlLmNvbS9iYXIuanMnKTtcbiAgYXNzZXJ0LmVxdWFsKHNtYy5zb3VyY2VzWzFdLCAnaHR0cDovL2V4YW1wbGUuY29tL2Jhei5qcycpO1xuICBhc3NlcnQuZXF1YWwoc21jLnNvdXJjZUNvbnRlbnRGb3IoJ2Jhei5qcycpLCAnYmF6LmpzIGNvbnRlbnQnKTtcblxuICB2YXIgcG9zID0gc21jLm9yaWdpbmFsUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDIsXG4gICAgY29sdW1uOiAyXG4gIH0pO1xuICBhc3NlcnQuZXF1YWwocG9zLmxpbmUsIDEpO1xuICBhc3NlcnQuZXF1YWwocG9zLmNvbHVtbiwgMSk7XG4gIGFzc2VydC5lcXVhbChwb3Muc291cmNlLCAnaHR0cDovL2V4YW1wbGUuY29tL2Jhci5qcycpO1xuICBhc3NlcnQuZXF1YWwocG9zLm5hbWUsIG51bGwpO1xuXG4gIHBvcyA9IHNtYy5nZW5lcmF0ZWRQb3NpdGlvbkZvcih7XG4gICAgbGluZTogMSxcbiAgICBjb2x1bW46IDEsXG4gICAgc291cmNlOiAnaHR0cDovL2V4YW1wbGUuY29tL2Jhci5qcydcbiAgfSk7XG4gIGFzc2VydC5lcXVhbChwb3MubGluZSwgMik7XG4gIGFzc2VydC5lcXVhbChwb3MuY29sdW1uLCAyKTtcblxuICBwb3MgPSBzbWMub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgbGluZTogNCxcbiAgICBjb2x1bW46IDRcbiAgfSk7XG4gIGFzc2VydC5lcXVhbChwb3MubGluZSwgMik7XG4gIGFzc2VydC5lcXVhbChwb3MuY29sdW1uLCAyKTtcbiAgYXNzZXJ0LmVxdWFsKHBvcy5zb3VyY2UsICdodHRwOi8vZXhhbXBsZS5jb20vYmF6LmpzJyk7XG4gIGFzc2VydC5lcXVhbChwb3MubmFtZSwgJ2RpcnRNY0dpcnQnKTtcblxuICBwb3MgPSBzbWMuZ2VuZXJhdGVkUG9zaXRpb25Gb3Ioe1xuICAgIGxpbmU6IDIsXG4gICAgY29sdW1uOiAyLFxuICAgIHNvdXJjZTogJ2h0dHA6Ly9leGFtcGxlLmNvbS9iYXouanMnXG4gIH0pO1xuICBhc3NlcnQuZXF1YWwocG9zLmxpbmUsIDQpO1xuICBhc3NlcnQuZXF1YWwocG9zLmNvbHVtbiwgNCk7XG59O1xuXG5leHBvcnRzWyd0ZXN0IGlzc3VlICMxOTEnXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIGdlbmVyYXRvciA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3IoeyBmaWxlOiAnYS5jc3MnIH0pO1xuICBnZW5lcmF0b3IuYWRkTWFwcGluZyh7XG4gICAgc291cmNlOiAgICdiLmNzcycsXG4gICAgb3JpZ2luYWw6IHtcbiAgICAgIGxpbmU6ICAgMSxcbiAgICAgIGNvbHVtbjogMFxuICAgIH0sXG4gICAgZ2VuZXJhdGVkOiB7XG4gICAgICBsaW5lOiAgIDEsXG4gICAgICBjb2x1bW46IDBcbiAgICB9XG4gIH0pO1xuXG4gIC8vIENyZWF0ZSBhIFNvdXJjZU1hcENvbnN1bWVyIGZyb20gdGhlIFNvdXJjZU1hcEdlbmVyYXRvciwgLi4uXG4gIHZhciBjb25zdW1lciAgPSBTb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwKGdlbmVyYXRvcik7XG4gIC8vIC4uLiBhbmQgdGhlbiB0cnkgYW5kIHVzZSB0aGUgU291cmNlTWFwR2VuZXJhdG9yIGFnYWluLiBUaGlzIHNob3VsZCBub3RcbiAgLy8gdGhyb3cuXG4gIGdlbmVyYXRvci50b0pTT04oKTtcblxuICBhc3NlcnQub2sodHJ1ZSwgXCJVc2luZyBhIFNvdXJjZU1hcEdlbmVyYXRvciBhZ2FpbiBhZnRlciBjcmVhdGluZyBhIFwiICtcbiAgICAgICAgICAgICAgICAgIFwiU291cmNlTWFwQ29uc3VtZXIgZnJvbSBpdCBzaG91bGQgbm90IHRocm93XCIpO1xufTtcblxuZXhwb3J0c1sndGVzdCBzb3VyY2VzIHdoZXJlIHRoZWlyIHByZWZpeCBpcyB0aGUgc291cmNlIHJvb3Q6IGlzc3VlICMxOTknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIHRlc3RTb3VyY2VNYXAgPSB7XG4gICAgXCJ2ZXJzaW9uXCI6IDMsXG4gICAgXCJzb3VyY2VzXCI6IFtcIi9zb3VyY2UvYXBwL2FwcC9hcHAuanNcIl0sXG4gICAgXCJuYW1lc1wiOiBbXCJTeXN0ZW1cIl0sXG4gICAgXCJtYXBwaW5nc1wiOiBcIkFBQUFBXCIsXG4gICAgXCJmaWxlXCI6IFwiYXBwL2FwcC5qc1wiLFxuICAgIFwic291cmNlc0NvbnRlbnRcIjogW1wiJ3VzZSBzdHJpY3QnO1wiXSxcbiAgICBcInNvdXJjZVJvb3RcIjpcIi9zb3VyY2UvXCJcbiAgfTtcblxuICB2YXIgY29uc3VtZXIgPSBuZXcgU291cmNlTWFwQ29uc3VtZXIodGVzdFNvdXJjZU1hcCk7XG5cbiAgZnVuY3Rpb24gY29uc3VtZXJIYXNTb3VyY2Uocykge1xuICAgIGFzc2VydC5vayhjb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKHMpKTtcbiAgfVxuXG4gIGNvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChjb25zdW1lckhhc1NvdXJjZSk7XG4gIHRlc3RTb3VyY2VNYXAuc291cmNlcy5mb3JFYWNoKGNvbnN1bWVySGFzU291cmNlKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3Qgc291cmNlcyB3aGVyZSB0aGVpciBwcmVmaXggaXMgdGhlIHNvdXJjZSByb290IGFuZCB0aGUgc291cmNlIHJvb3QgaXMgYSB1cmw6IGlzc3VlICMxOTknXSA9IGZ1bmN0aW9uIChhc3NlcnQpIHtcbiAgdmFyIHRlc3RTb3VyY2VNYXAgPSB7XG4gICAgXCJ2ZXJzaW9uXCI6IDMsXG4gICAgXCJzb3VyY2VzXCI6IFtcImh0dHA6Ly9leGFtcGxlLmNvbS9zb3VyY2UvYXBwL2FwcC9hcHAuanNcIl0sXG4gICAgXCJuYW1lc1wiOiBbXCJTeXN0ZW1cIl0sXG4gICAgXCJtYXBwaW5nc1wiOiBcIkFBQUFBXCIsXG4gICAgXCJzb3VyY2VzQ29udGVudFwiOiBbXCIndXNlIHN0cmljdCc7XCJdLFxuICAgIFwic291cmNlUm9vdFwiOlwiaHR0cDovL2V4YW1wbGUuY29tL3NvdXJjZS9cIlxuICB9O1xuXG4gIHZhciBjb25zdW1lciA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih0ZXN0U291cmNlTWFwKTtcblxuICBmdW5jdGlvbiBjb25zdW1lckhhc1NvdXJjZShzKSB7XG4gICAgYXNzZXJ0Lm9rKGNvbnN1bWVyLnNvdXJjZUNvbnRlbnRGb3IocykpO1xuICB9XG5cbiAgY29uc3VtZXIuc291cmNlcy5mb3JFYWNoKGNvbnN1bWVySGFzU291cmNlKTtcbiAgdGVzdFNvdXJjZU1hcC5zb3VyY2VzLmZvckVhY2goY29uc3VtZXJIYXNTb3VyY2UpO1xufTtcblxuZXhwb3J0c1sndGVzdCBjb25zdW1pbmcgbmFtZXMgYW5kIHNvdXJjZXMgdGhhdCBhcmUgbnVtYmVycyddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgdGVzdFNvdXJjZU1hcCA9IHtcbiAgICBcInZlcnNpb25cIjogMyxcbiAgICBcInNvdXJjZXNcIjogWzBdLFxuICAgIFwibmFtZXNcIjogWzFdLFxuICAgIFwibWFwcGluZ3NcIjogXCJBQUFBQVwiLFxuICB9O1xuXG4gIHZhciBjb25zdW1lciA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih0ZXN0U291cmNlTWFwKTtcblxuICBhc3NlcnQuZXF1YWwoY29uc3VtZXIuc291cmNlcy5sZW5ndGgsIDEpO1xuICBhc3NlcnQuZXF1YWwoY29uc3VtZXIuc291cmNlc1swXSwgXCIwXCIpO1xuXG4gIHZhciBpID0gMDtcbiAgY29uc3VtZXIuZWFjaE1hcHBpbmcoZnVuY3Rpb24gKG0pIHtcbiAgICBpKys7XG4gICAgYXNzZXJ0LmVxdWFsKG0ubmFtZSwgXCIxXCIpO1xuICB9KTtcbiAgYXNzZXJ0LmVxdWFsKGksIDEpO1xufTtcblxuZXhwb3J0c1sndGVzdCBub24tbm9ybWFsaXplZCBzb3VyY2VSb290IChmcm9tIGlzc3VlICMyMjcpJ10gPSBmdW5jdGlvbiAoYXNzZXJ0KSB7XG4gIHZhciBjb25zdW1lciA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih7XG4gICAgdmVyc2lvbjogMyxcbiAgICBzb3VyY2VzOiBbICdpbmRleC5qcycgXSxcbiAgICBuYW1lczogW10sXG4gICAgbWFwcGluZ3M6ICc7O0FBQUEsSUFBSSxPQUFPLE1BQVAnLFxuICAgIGZpbGU6ICdpbmRleC5qcycsXG4gICAgc291cmNlUm9vdDogJy4vc3JjLycsXG4gICAgc291cmNlc0NvbnRlbnQ6IFsgJ3ZhciBuYW1lID0gXCJNYXJrXCJcXG4nIF1cbiAgfSk7XG4gIGFzc2VydC5lcXVhbChjb25zdW1lci5zb3VyY2VSb290LCAnc3JjLycsICdzb3VyY2VSb290IHdhcyBub3JtYWxpemVkJyk7XG4gIC8vIEJlZm9yZSB0aGUgZml4LCB0aGlzIHRocmV3IGFuIGV4Y2VwdGlvbi5cbiAgY29uc3VtZXIuc291cmNlQ29udGVudEZvcihjb25zdW1lci5zb3VyY2VzWzBdKTtcbn07XG5cbmV4cG9ydHNbJ3Rlc3Qgd2VicGFjayBVUkwgcmVzb2x1dGlvbiddID0gZnVuY3Rpb24gKGFzc2VydCkge1xuICB2YXIgbWFwID0ge1xuICAgIFwidmVyc2lvblwiOjMsXG4gICAgXCJzb3VyY2VzXCI6IFtcIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjdlMTg0Zjk2Nzk3MzMyOThkNDRcIl0sXG4gICAgXCJuYW1lc1wiOltdLFxuICAgIFwibWFwcGluZ3NcIjpcIkNBQVNcIixcbiAgICBcImZpbGVcIjpcInN0YXRpYy9qcy9tYW5pZmVzdC5iN2NmOTc2ODBmN2E1MGZhMTUwZi5qc1wiLFxuICAgIFwic291cmNlUm9vdFwiOlwiXCJcbiAgfTtcbiAgdmFyIGNvbnN1bWVyID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKG1hcCk7XG5cbiAgYXNzZXJ0LmVxdWFsKGNvbnN1bWVyLnNvdXJjZXMubGVuZ3RoLCAxKTtcbiAgYXNzZXJ0LmVxdWFsKGNvbnN1bWVyLnNvdXJjZXNbMF0sIFwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2N2UxODRmOTY3OTczMzI5OGQ0NFwiKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3Rlc3QvdGVzdC1zb3VyY2UtbWFwLWNvbnN1bWVyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi9saWIvdXRpbCcpO1xuXG4vLyBUaGlzIGlzIGEgdGVzdCBtYXBwaW5nIHdoaWNoIG1hcHMgZnVuY3Rpb25zIGZyb20gdHdvIGRpZmZlcmVudCBmaWxlc1xuLy8gKG9uZS5qcyBhbmQgdHdvLmpzKSB0byBhIG1pbmlmaWVkIGdlbmVyYXRlZCBzb3VyY2UuXG4vL1xuLy8gSGVyZSBpcyBvbmUuanM6XG4vL1xuLy8gICBPTkUuZm9vID0gZnVuY3Rpb24gKGJhcikge1xuLy8gICAgIHJldHVybiBiYXooYmFyKTtcbi8vICAgfTtcbi8vXG4vLyBIZXJlIGlzIHR3by5qczpcbi8vXG4vLyAgIFRXTy5pbmMgPSBmdW5jdGlvbiAobikge1xuLy8gICAgIHJldHVybiBuICsgMTtcbi8vICAgfTtcbi8vXG4vLyBBbmQgaGVyZSBpcyB0aGUgZ2VuZXJhdGVkIGNvZGUgKG1pbi5qcyk6XG4vL1xuLy8gICBPTkUuZm9vPWZ1bmN0aW9uKGEpe3JldHVybiBiYXooYSk7fTtcbi8vICAgVFdPLmluYz1mdW5jdGlvbihhKXtyZXR1cm4gYSsxO307XG5leHBvcnRzLnRlc3RHZW5lcmF0ZWRDb2RlID0gXCIgT05FLmZvbz1mdW5jdGlvbihhKXtyZXR1cm4gYmF6KGEpO307XFxuXCIrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgVFdPLmluYz1mdW5jdGlvbihhKXtyZXR1cm4gYSsxO307XCI7XG5leHBvcnRzLnRlc3RNYXAgPSB7XG4gIHZlcnNpb246IDMsXG4gIGZpbGU6ICdtaW4uanMnLFxuICBuYW1lczogWydiYXInLCAnYmF6JywgJ24nXSxcbiAgc291cmNlczogWydvbmUuanMnLCAndHdvLmpzJ10sXG4gIHNvdXJjZVJvb3Q6ICcvdGhlL3Jvb3QnLFxuICBtYXBwaW5nczogJ0NBQUMsSUFBSSxJQUFNLFNBQVVBLEdBQ2xCLE9BQU9DLElBQUlEO0NDRGIsSUFBSSxJQUFNLFNBQVVFLEdBQ2xCLE9BQU9BJ1xufTtcbmV4cG9ydHMudGVzdE1hcE5vU291cmNlUm9vdCA9IHtcbiAgdmVyc2lvbjogMyxcbiAgZmlsZTogJ21pbi5qcycsXG4gIG5hbWVzOiBbJ2JhcicsICdiYXonLCAnbiddLFxuICBzb3VyY2VzOiBbJ29uZS5qcycsICd0d28uanMnXSxcbiAgbWFwcGluZ3M6ICdDQUFDLElBQUksSUFBTSxTQUFVQSxHQUNsQixPQUFPQyxJQUFJRDtDQ0RiLElBQUksSUFBTSxTQUFVRSxHQUNsQixPQUFPQSdcbn07XG5leHBvcnRzLnRlc3RNYXBFbXB0eVNvdXJjZVJvb3QgPSB7XG4gIHZlcnNpb246IDMsXG4gIGZpbGU6ICdtaW4uanMnLFxuICBuYW1lczogWydiYXInLCAnYmF6JywgJ24nXSxcbiAgc291cmNlczogWydvbmUuanMnLCAndHdvLmpzJ10sXG4gIHNvdXJjZVJvb3Q6ICcnLFxuICBtYXBwaW5nczogJ0NBQUMsSUFBSSxJQUFNLFNBQVVBLEdBQ2xCLE9BQU9DLElBQUlEO0NDRGIsSUFBSSxJQUFNLFNBQVVFLEdBQ2xCLE9BQU9BJ1xufTtcbmV4cG9ydHMudGVzdE1hcFNpbmdsZVNvdXJjZSA9IHtcbiAgdmVyc2lvbjogMyxcbiAgZmlsZTogJ21pbi5qcycsXG4gIG5hbWVzOiBbJ2JhcicsICdiYXonXSxcbiAgc291cmNlczogWydvbmUuanMnXSxcbiAgc291cmNlUm9vdDogJycsXG4gIG1hcHBpbmdzOiAnQ0FBQyxJQUFJLElBQU0sU0FBVUEsR0FDbEIsT0FBT0MsSUFBSUQnXG59O1xuZXhwb3J0cy50ZXN0TWFwRW1wdHlNYXBwaW5ncyA9IHtcbiAgdmVyc2lvbjogMyxcbiAgZmlsZTogJ21pbi5qcycsXG4gIG5hbWVzOiBbXSxcbiAgc291cmNlczogWydvbmUuanMnLCAndHdvLmpzJ10sXG4gIHNvdXJjZXNDb250ZW50OiBbXG4gICAgJyBPTkUuZm9vID0gMTsnLFxuICAgICcgVFdPLmluYyA9IDI7J1xuICBdLFxuICBzb3VyY2VSb290OiAnJyxcbiAgbWFwcGluZ3M6ICcnXG59O1xuZXhwb3J0cy50ZXN0TWFwRW1wdHlNYXBwaW5nc1JlbGF0aXZlU291cmNlcyA9IHtcbiAgdmVyc2lvbjogMyxcbiAgZmlsZTogJ21pbi5qcycsXG4gIG5hbWVzOiBbXSxcbiAgc291cmNlczogWycuL29uZS5qcycsICcuL3R3by5qcyddLFxuICBzb3VyY2VzQ29udGVudDogW1xuICAgICcgT05FLmZvbyA9IDE7JyxcbiAgICAnIFRXTy5pbmMgPSAyOydcbiAgXSxcbiAgc291cmNlUm9vdDogJy90aGUvcm9vdCcsXG4gIG1hcHBpbmdzOiAnJ1xufTtcbmV4cG9ydHMudGVzdE1hcEVtcHR5TWFwcGluZ3NSZWxhdGl2ZVNvdXJjZXNfZ2VuZXJhdGVkRXhwZWN0ZWQgPSB7XG4gIHZlcnNpb246IDMsXG4gIGZpbGU6ICdtaW4uanMnLFxuICBuYW1lczogW10sXG4gIHNvdXJjZXM6IFsnb25lLmpzJywgJ3R3by5qcyddLFxuICBzb3VyY2VzQ29udGVudDogW1xuICAgICcgT05FLmZvbyA9IDE7JyxcbiAgICAnIFRXTy5pbmMgPSAyOydcbiAgXSxcbiAgc291cmNlUm9vdDogJy90aGUvcm9vdCcsXG4gIG1hcHBpbmdzOiAnJ1xufTtcbmV4cG9ydHMudGVzdE1hcE11bHRpU291cmNlc01hcHBpbmdSZWZlcnNTaW5nbGVTb3VyY2VPbmx5ID0ge1xuICAgIHZlcnNpb246IDMsXG4gICAgZmlsZTogJ21pbi5qcycsXG4gICAgbmFtZXM6IFsnYmFyJywgJ2JheiddLFxuICAgIHNvdXJjZXM6IFsnb25lLmpzJywgJ3dpdGhvdXRNYXBwaW5ncy5qcyddLFxuICAgIHNvdXJjZVJvb3Q6ICcnLFxuICAgIG1hcHBpbmdzOiAnQ0FBQyxJQUFJLElBQU0sU0FBVUEsR0FDbEIsT0FBT0MsSUFBSUQnXG59O1xuLy8gVGhpcyBtYXBwaW5nIGlzIGlkZW50aWNhbCB0byBhYm92ZSwgYnV0IHVzZXMgdGhlIGluZGV4ZWQgZm9ybWF0IGluc3RlYWQuXG5leHBvcnRzLmluZGV4ZWRUZXN0TWFwID0ge1xuICB2ZXJzaW9uOiAzLFxuICBmaWxlOiAnbWluLmpzJyxcbiAgc2VjdGlvbnM6IFtcbiAgICB7XG4gICAgICBvZmZzZXQ6IHtcbiAgICAgICAgbGluZTogMCxcbiAgICAgICAgY29sdW1uOiAwXG4gICAgICB9LFxuICAgICAgbWFwOiB7XG4gICAgICAgIHZlcnNpb246IDMsXG4gICAgICAgIHNvdXJjZXM6IFtcbiAgICAgICAgICBcIm9uZS5qc1wiXG4gICAgICAgIF0sXG4gICAgICAgIHNvdXJjZXNDb250ZW50OiBbXG4gICAgICAgICAgJyBPTkUuZm9vID0gZnVuY3Rpb24gKGJhcikge1xcbicgK1xuICAgICAgICAgICcgICByZXR1cm4gYmF6KGJhcik7XFxuJyArXG4gICAgICAgICAgJyB9OycsXG4gICAgICAgIF0sXG4gICAgICAgIG5hbWVzOiBbXG4gICAgICAgICAgXCJiYXJcIixcbiAgICAgICAgICBcImJhelwiXG4gICAgICAgIF0sXG4gICAgICAgIG1hcHBpbmdzOiBcIkNBQUMsSUFBSSxJQUFNLFNBQVVBLEdBQ2xCLE9BQU9DLElBQUlEXCIsXG4gICAgICAgIGZpbGU6IFwibWluLmpzXCIsXG4gICAgICAgIHNvdXJjZVJvb3Q6IFwiL3RoZS9yb290XCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG9mZnNldDoge1xuICAgICAgICBsaW5lOiAxLFxuICAgICAgICBjb2x1bW46IDBcbiAgICAgIH0sXG4gICAgICBtYXA6IHtcbiAgICAgICAgdmVyc2lvbjogMyxcbiAgICAgICAgc291cmNlczogW1xuICAgICAgICAgIFwidHdvLmpzXCJcbiAgICAgICAgXSxcbiAgICAgICAgc291cmNlc0NvbnRlbnQ6IFtcbiAgICAgICAgICAnIFRXTy5pbmMgPSBmdW5jdGlvbiAobikge1xcbicgK1xuICAgICAgICAgICcgICByZXR1cm4gbiArIDE7XFxuJyArXG4gICAgICAgICAgJyB9OydcbiAgICAgICAgXSxcbiAgICAgICAgbmFtZXM6IFtcbiAgICAgICAgICBcIm5cIlxuICAgICAgICBdLFxuICAgICAgICBtYXBwaW5nczogXCJDQUFDLElBQUksSUFBTSxTQUFVQSxHQUNsQixPQUFPQVwiLFxuICAgICAgICBmaWxlOiBcIm1pbi5qc1wiLFxuICAgICAgICBzb3VyY2VSb290OiBcIi90aGUvcm9vdFwiXG4gICAgICB9XG4gICAgfVxuICBdXG59O1xuZXhwb3J0cy5pbmRleGVkVGVzdE1hcERpZmZlcmVudFNvdXJjZVJvb3RzID0ge1xuICB2ZXJzaW9uOiAzLFxuICBmaWxlOiAnbWluLmpzJyxcbiAgc2VjdGlvbnM6IFtcbiAgICB7XG4gICAgICBvZmZzZXQ6IHtcbiAgICAgICAgbGluZTogMCxcbiAgICAgICAgY29sdW1uOiAwXG4gICAgICB9LFxuICAgICAgbWFwOiB7XG4gICAgICAgIHZlcnNpb246IDMsXG4gICAgICAgIHNvdXJjZXM6IFtcbiAgICAgICAgICBcIm9uZS5qc1wiXG4gICAgICAgIF0sXG4gICAgICAgIHNvdXJjZXNDb250ZW50OiBbXG4gICAgICAgICAgJyBPTkUuZm9vID0gZnVuY3Rpb24gKGJhcikge1xcbicgK1xuICAgICAgICAgICcgICByZXR1cm4gYmF6KGJhcik7XFxuJyArXG4gICAgICAgICAgJyB9OycsXG4gICAgICAgIF0sXG4gICAgICAgIG5hbWVzOiBbXG4gICAgICAgICAgXCJiYXJcIixcbiAgICAgICAgICBcImJhelwiXG4gICAgICAgIF0sXG4gICAgICAgIG1hcHBpbmdzOiBcIkNBQUMsSUFBSSxJQUFNLFNBQVVBLEdBQ2xCLE9BQU9DLElBQUlEXCIsXG4gICAgICAgIGZpbGU6IFwibWluLmpzXCIsXG4gICAgICAgIHNvdXJjZVJvb3Q6IFwiL3RoZS9yb290XCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG9mZnNldDoge1xuICAgICAgICBsaW5lOiAxLFxuICAgICAgICBjb2x1bW46IDBcbiAgICAgIH0sXG4gICAgICBtYXA6IHtcbiAgICAgICAgdmVyc2lvbjogMyxcbiAgICAgICAgc291cmNlczogW1xuICAgICAgICAgIFwidHdvLmpzXCJcbiAgICAgICAgXSxcbiAgICAgICAgc291cmNlc0NvbnRlbnQ6IFtcbiAgICAgICAgICAnIFRXTy5pbmMgPSBmdW5jdGlvbiAobikge1xcbicgK1xuICAgICAgICAgICcgICByZXR1cm4gbiArIDE7XFxuJyArXG4gICAgICAgICAgJyB9OydcbiAgICAgICAgXSxcbiAgICAgICAgbmFtZXM6IFtcbiAgICAgICAgICBcIm5cIlxuICAgICAgICBdLFxuICAgICAgICBtYXBwaW5nczogXCJDQUFDLElBQUksSUFBTSxTQUFVQSxHQUNsQixPQUFPQVwiLFxuICAgICAgICBmaWxlOiBcIm1pbi5qc1wiLFxuICAgICAgICBzb3VyY2VSb290OiBcIi9kaWZmZXJlbnQvcm9vdFwiXG4gICAgICB9XG4gICAgfVxuICBdXG59O1xuZXhwb3J0cy50ZXN0TWFwV2l0aFNvdXJjZXNDb250ZW50ID0ge1xuICB2ZXJzaW9uOiAzLFxuICBmaWxlOiAnbWluLmpzJyxcbiAgbmFtZXM6IFsnYmFyJywgJ2JheicsICduJ10sXG4gIHNvdXJjZXM6IFsnb25lLmpzJywgJ3R3by5qcyddLFxuICBzb3VyY2VzQ29udGVudDogW1xuICAgICcgT05FLmZvbyA9IGZ1bmN0aW9uIChiYXIpIHtcXG4nICtcbiAgICAnICAgcmV0dXJuIGJheihiYXIpO1xcbicgK1xuICAgICcgfTsnLFxuICAgICcgVFdPLmluYyA9IGZ1bmN0aW9uIChuKSB7XFxuJyArXG4gICAgJyAgIHJldHVybiBuICsgMTtcXG4nICtcbiAgICAnIH07J1xuICBdLFxuICBzb3VyY2VSb290OiAnL3RoZS9yb290JyxcbiAgbWFwcGluZ3M6ICdDQUFDLElBQUksSUFBTSxTQUFVQSxHQUNsQixPQUFPQyxJQUFJRDtDQ0RiLElBQUksSUFBTSxTQUFVRSxHQUNsQixPQUFPQSdcbn07XG5leHBvcnRzLnRlc3RNYXBSZWxhdGl2ZVNvdXJjZXMgPSB7XG4gIHZlcnNpb246IDMsXG4gIGZpbGU6ICdtaW4uanMnLFxuICBuYW1lczogWydiYXInLCAnYmF6JywgJ24nXSxcbiAgc291cmNlczogWycuL29uZS5qcycsICcuL3R3by5qcyddLFxuICBzb3VyY2VzQ29udGVudDogW1xuICAgICcgT05FLmZvbyA9IGZ1bmN0aW9uIChiYXIpIHtcXG4nICtcbiAgICAnICAgcmV0dXJuIGJheihiYXIpO1xcbicgK1xuICAgICcgfTsnLFxuICAgICcgVFdPLmluYyA9IGZ1bmN0aW9uIChuKSB7XFxuJyArXG4gICAgJyAgIHJldHVybiBuICsgMTtcXG4nICtcbiAgICAnIH07J1xuICBdLFxuICBzb3VyY2VSb290OiAnL3RoZS9yb290JyxcbiAgbWFwcGluZ3M6ICdDQUFDLElBQUksSUFBTSxTQUFVQSxHQUNsQixPQUFPQyxJQUFJRDtDQ0RiLElBQUksSUFBTSxTQUFVRSxHQUNsQixPQUFPQSdcbn07XG5leHBvcnRzLmVtcHR5TWFwID0ge1xuICB2ZXJzaW9uOiAzLFxuICBmaWxlOiAnbWluLmpzJyxcbiAgbmFtZXM6IFtdLFxuICBzb3VyY2VzOiBbXSxcbiAgbWFwcGluZ3M6ICcnXG59O1xuXG5cbmZ1bmN0aW9uIGFzc2VydE1hcHBpbmcoZ2VuZXJhdGVkTGluZSwgZ2VuZXJhdGVkQ29sdW1uLCBvcmlnaW5hbFNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxMaW5lLCBvcmlnaW5hbENvbHVtbiwgbmFtZSwgYmlhcywgbWFwLCBhc3NlcnQsXG4gICAgICAgICAgICAgICAgICAgICAgIGRvbnRUZXN0R2VuZXJhdGVkLCBkb250VGVzdE9yaWdpbmFsKSB7XG4gIGlmICghZG9udFRlc3RPcmlnaW5hbCkge1xuICAgIHZhciBvcmlnTWFwcGluZyA9IG1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgIGxpbmU6IGdlbmVyYXRlZExpbmUsXG4gICAgICBjb2x1bW46IGdlbmVyYXRlZENvbHVtbixcbiAgICAgIGJpYXM6IGJpYXNcbiAgICB9KTtcbiAgICBhc3NlcnQuZXF1YWwob3JpZ01hcHBpbmcubmFtZSwgbmFtZSxcbiAgICAgICAgICAgICAgICAgJ0luY29ycmVjdCBuYW1lLCBleHBlY3RlZCAnICsgSlNPTi5zdHJpbmdpZnkobmFtZSlcbiAgICAgICAgICAgICAgICAgKyAnLCBnb3QgJyArIEpTT04uc3RyaW5naWZ5KG9yaWdNYXBwaW5nLm5hbWUpKTtcbiAgICBhc3NlcnQuZXF1YWwob3JpZ01hcHBpbmcubGluZSwgb3JpZ2luYWxMaW5lLFxuICAgICAgICAgICAgICAgICAnSW5jb3JyZWN0IGxpbmUsIGV4cGVjdGVkICcgKyBKU09OLnN0cmluZ2lmeShvcmlnaW5hbExpbmUpXG4gICAgICAgICAgICAgICAgICsgJywgZ290ICcgKyBKU09OLnN0cmluZ2lmeShvcmlnTWFwcGluZy5saW5lKSk7XG4gICAgYXNzZXJ0LmVxdWFsKG9yaWdNYXBwaW5nLmNvbHVtbiwgb3JpZ2luYWxDb2x1bW4sXG4gICAgICAgICAgICAgICAgICdJbmNvcnJlY3QgY29sdW1uLCBleHBlY3RlZCAnICsgSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxDb2x1bW4pXG4gICAgICAgICAgICAgICAgICsgJywgZ290ICcgKyBKU09OLnN0cmluZ2lmeShvcmlnTWFwcGluZy5jb2x1bW4pKTtcblxuICAgIHZhciBleHBlY3RlZFNvdXJjZTtcblxuICAgIGlmIChvcmlnaW5hbFNvdXJjZSAmJiBtYXAuc291cmNlUm9vdCAmJiBvcmlnaW5hbFNvdXJjZS5pbmRleE9mKG1hcC5zb3VyY2VSb290KSA9PT0gMCkge1xuICAgICAgZXhwZWN0ZWRTb3VyY2UgPSBvcmlnaW5hbFNvdXJjZTtcbiAgICB9IGVsc2UgaWYgKG9yaWdpbmFsU291cmNlKSB7XG4gICAgICBleHBlY3RlZFNvdXJjZSA9IG1hcC5zb3VyY2VSb290XG4gICAgICAgID8gdXRpbC5qb2luKG1hcC5zb3VyY2VSb290LCBvcmlnaW5hbFNvdXJjZSlcbiAgICAgICAgOiBvcmlnaW5hbFNvdXJjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwZWN0ZWRTb3VyY2UgPSBudWxsO1xuICAgIH1cblxuICAgIGFzc2VydC5lcXVhbChvcmlnTWFwcGluZy5zb3VyY2UsIGV4cGVjdGVkU291cmNlLFxuICAgICAgICAgICAgICAgICAnSW5jb3JyZWN0IHNvdXJjZSwgZXhwZWN0ZWQgJyArIEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkU291cmNlKVxuICAgICAgICAgICAgICAgICArICcsIGdvdCAnICsgSlNPTi5zdHJpbmdpZnkob3JpZ01hcHBpbmcuc291cmNlKSk7XG4gIH1cblxuICBpZiAoIWRvbnRUZXN0R2VuZXJhdGVkKSB7XG4gICAgdmFyIGdlbk1hcHBpbmcgPSBtYXAuZ2VuZXJhdGVkUG9zaXRpb25Gb3Ioe1xuICAgICAgc291cmNlOiBvcmlnaW5hbFNvdXJjZSxcbiAgICAgIGxpbmU6IG9yaWdpbmFsTGluZSxcbiAgICAgIGNvbHVtbjogb3JpZ2luYWxDb2x1bW4sXG4gICAgICBiaWFzOiBiaWFzXG4gICAgfSk7XG4gICAgYXNzZXJ0LmVxdWFsKGdlbk1hcHBpbmcubGluZSwgZ2VuZXJhdGVkTGluZSxcbiAgICAgICAgICAgICAgICAgJ0luY29ycmVjdCBsaW5lLCBleHBlY3RlZCAnICsgSlNPTi5zdHJpbmdpZnkoZ2VuZXJhdGVkTGluZSlcbiAgICAgICAgICAgICAgICAgKyAnLCBnb3QgJyArIEpTT04uc3RyaW5naWZ5KGdlbk1hcHBpbmcubGluZSkpO1xuICAgIGFzc2VydC5lcXVhbChnZW5NYXBwaW5nLmNvbHVtbiwgZ2VuZXJhdGVkQ29sdW1uLFxuICAgICAgICAgICAgICAgICAnSW5jb3JyZWN0IGNvbHVtbiwgZXhwZWN0ZWQgJyArIEpTT04uc3RyaW5naWZ5KGdlbmVyYXRlZENvbHVtbilcbiAgICAgICAgICAgICAgICAgKyAnLCBnb3QgJyArIEpTT04uc3RyaW5naWZ5KGdlbk1hcHBpbmcuY29sdW1uKSk7XG4gIH1cbn1cbmV4cG9ydHMuYXNzZXJ0TWFwcGluZyA9IGFzc2VydE1hcHBpbmc7XG5cbmZ1bmN0aW9uIGFzc2VydEVxdWFsTWFwcyhhc3NlcnQsIGFjdHVhbE1hcCwgZXhwZWN0ZWRNYXApIHtcbiAgYXNzZXJ0LmVxdWFsKGFjdHVhbE1hcC52ZXJzaW9uLCBleHBlY3RlZE1hcC52ZXJzaW9uLCBcInZlcnNpb24gbWlzbWF0Y2hcIik7XG4gIGFzc2VydC5lcXVhbChhY3R1YWxNYXAuZmlsZSwgZXhwZWN0ZWRNYXAuZmlsZSwgXCJmaWxlIG1pc21hdGNoXCIpO1xuICBhc3NlcnQuZXF1YWwoYWN0dWFsTWFwLm5hbWVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgIGV4cGVjdGVkTWFwLm5hbWVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgIFwibmFtZXMgbGVuZ3RoIG1pc21hdGNoOiBcIiArXG4gICAgICAgICAgICAgICAgIGFjdHVhbE1hcC5uYW1lcy5qb2luKFwiLCBcIikgKyBcIiAhPSBcIiArIGV4cGVjdGVkTWFwLm5hbWVzLmpvaW4oXCIsIFwiKSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0dWFsTWFwLm5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgYXNzZXJ0LmVxdWFsKGFjdHVhbE1hcC5uYW1lc1tpXSxcbiAgICAgICAgICAgICAgICAgZXhwZWN0ZWRNYXAubmFtZXNbaV0sXG4gICAgICAgICAgICAgICAgIFwibmFtZXNbXCIgKyBpICsgXCJdIG1pc21hdGNoOiBcIiArXG4gICAgICAgICAgICAgICAgICAgYWN0dWFsTWFwLm5hbWVzLmpvaW4oXCIsIFwiKSArIFwiICE9IFwiICsgZXhwZWN0ZWRNYXAubmFtZXMuam9pbihcIiwgXCIpKTtcbiAgfVxuICBhc3NlcnQuZXF1YWwoYWN0dWFsTWFwLnNvdXJjZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgZXhwZWN0ZWRNYXAuc291cmNlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICBcInNvdXJjZXMgbGVuZ3RoIG1pc21hdGNoOiBcIiArXG4gICAgICAgICAgICAgICAgIGFjdHVhbE1hcC5zb3VyY2VzLmpvaW4oXCIsIFwiKSArIFwiICE9IFwiICsgZXhwZWN0ZWRNYXAuc291cmNlcy5qb2luKFwiLCBcIikpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdHVhbE1hcC5zb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgYXNzZXJ0LmVxdWFsKGFjdHVhbE1hcC5zb3VyY2VzW2ldLFxuICAgICAgICAgICAgICAgICBleHBlY3RlZE1hcC5zb3VyY2VzW2ldLFxuICAgICAgICAgICAgICAgICBcInNvdXJjZXNbXCIgKyBpICsgXCJdIGxlbmd0aCBtaXNtYXRjaDogXCIgK1xuICAgICAgICAgICAgICAgICBhY3R1YWxNYXAuc291cmNlcy5qb2luKFwiLCBcIikgKyBcIiAhPSBcIiArIGV4cGVjdGVkTWFwLnNvdXJjZXMuam9pbihcIiwgXCIpKTtcbiAgfVxuICBhc3NlcnQuZXF1YWwoYWN0dWFsTWFwLnNvdXJjZVJvb3QsXG4gICAgICAgICAgICAgICBleHBlY3RlZE1hcC5zb3VyY2VSb290LFxuICAgICAgICAgICAgICAgXCJzb3VyY2VSb290IG1pc21hdGNoOiBcIiArXG4gICAgICAgICAgICAgICAgIGFjdHVhbE1hcC5zb3VyY2VSb290ICsgXCIgIT0gXCIgKyBleHBlY3RlZE1hcC5zb3VyY2VSb290KTtcbiAgYXNzZXJ0LmVxdWFsKGFjdHVhbE1hcC5tYXBwaW5ncywgZXhwZWN0ZWRNYXAubWFwcGluZ3MsXG4gICAgICAgICAgICAgICBcIm1hcHBpbmdzIG1pc21hdGNoOlxcbkFjdHVhbDogICBcIiArIGFjdHVhbE1hcC5tYXBwaW5ncyArIFwiXFxuRXhwZWN0ZWQ6IFwiICsgZXhwZWN0ZWRNYXAubWFwcGluZ3MpO1xuICBpZiAoYWN0dWFsTWFwLnNvdXJjZXNDb250ZW50KSB7XG4gICAgYXNzZXJ0LmVxdWFsKGFjdHVhbE1hcC5zb3VyY2VzQ29udGVudC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgIGV4cGVjdGVkTWFwLnNvdXJjZXNDb250ZW50Lmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgXCJzb3VyY2VzQ29udGVudCBsZW5ndGggbWlzbWF0Y2hcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3R1YWxNYXAuc291cmNlc0NvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFzc2VydC5lcXVhbChhY3R1YWxNYXAuc291cmNlc0NvbnRlbnRbaV0sXG4gICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRNYXAuc291cmNlc0NvbnRlbnRbaV0sXG4gICAgICAgICAgICAgICAgICAgXCJzb3VyY2VzQ29udGVudFtcIiArIGkgKyBcIl0gbWlzbWF0Y2hcIik7XG4gICAgfVxuICB9XG59XG5leHBvcnRzLmFzc2VydEVxdWFsTWFwcyA9IGFzc2VydEVxdWFsTWFwcztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vdGVzdC91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIC0qLSBNb2RlOiBqczsganMtaW5kZW50LWxldmVsOiAyOyAtKi0gKi9cbi8qXG4gKiBDb3B5cmlnaHQgMjAxMSBNb3ppbGxhIEZvdW5kYXRpb24gYW5kIGNvbnRyaWJ1dG9yc1xuICogTGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgbGljZW5zZS4gU2VlIExJQ0VOU0Ugb3I6XG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvQlNELTMtQ2xhdXNlXG4gKi9cblxuLyoqXG4gKiBUaGlzIGlzIGEgaGVscGVyIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHZhbHVlcyBmcm9tIHBhcmFtZXRlci9vcHRpb25zXG4gKiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSBhcmdzIFRoZSBvYmplY3Qgd2UgYXJlIGV4dHJhY3RpbmcgdmFsdWVzIGZyb21cbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB3ZSBhcmUgZ2V0dGluZy5cbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgQW4gb3B0aW9uYWwgdmFsdWUgdG8gcmV0dXJuIGlmIHRoZSBwcm9wZXJ0eSBpcyBtaXNzaW5nXG4gKiBmcm9tIHRoZSBvYmplY3QuIElmIHRoaXMgaXMgbm90IHNwZWNpZmllZCBhbmQgdGhlIHByb3BlcnR5IGlzIG1pc3NpbmcsIGFuXG4gKiBlcnJvciB3aWxsIGJlIHRocm93bi5cbiAqL1xuZnVuY3Rpb24gZ2V0QXJnKGFBcmdzLCBhTmFtZSwgYURlZmF1bHRWYWx1ZSkge1xuICBpZiAoYU5hbWUgaW4gYUFyZ3MpIHtcbiAgICByZXR1cm4gYUFyZ3NbYU5hbWVdO1xuICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICByZXR1cm4gYURlZmF1bHRWYWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFOYW1lICsgJ1wiIGlzIGEgcmVxdWlyZWQgYXJndW1lbnQuJyk7XG4gIH1cbn1cbmV4cG9ydHMuZ2V0QXJnID0gZ2V0QXJnO1xuXG52YXIgdXJsUmVnZXhwID0gL14oPzooW1xcdytcXC0uXSspOik/XFwvXFwvKD86KFxcdys6XFx3KylAKT8oW1xcdy4tXSopKD86OihcXGQrKSk/KC4qKSQvO1xudmFyIGRhdGFVcmxSZWdleHAgPSAvXmRhdGE6LitcXCwuKyQvO1xuXG5mdW5jdGlvbiB1cmxQYXJzZShhVXJsKSB7XG4gIHZhciBtYXRjaCA9IGFVcmwubWF0Y2godXJsUmVnZXhwKTtcbiAgaWYgKCFtYXRjaCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB7XG4gICAgc2NoZW1lOiBtYXRjaFsxXSxcbiAgICBhdXRoOiBtYXRjaFsyXSxcbiAgICBob3N0OiBtYXRjaFszXSxcbiAgICBwb3J0OiBtYXRjaFs0XSxcbiAgICBwYXRoOiBtYXRjaFs1XVxuICB9O1xufVxuZXhwb3J0cy51cmxQYXJzZSA9IHVybFBhcnNlO1xuXG5mdW5jdGlvbiB1cmxHZW5lcmF0ZShhUGFyc2VkVXJsKSB7XG4gIHZhciB1cmwgPSAnJztcbiAgaWYgKGFQYXJzZWRVcmwuc2NoZW1lKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuc2NoZW1lICsgJzonO1xuICB9XG4gIHVybCArPSAnLy8nO1xuICBpZiAoYVBhcnNlZFVybC5hdXRoKSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuYXV0aCArICdAJztcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5ob3N0KSB7XG4gICAgdXJsICs9IGFQYXJzZWRVcmwuaG9zdDtcbiAgfVxuICBpZiAoYVBhcnNlZFVybC5wb3J0KSB7XG4gICAgdXJsICs9IFwiOlwiICsgYVBhcnNlZFVybC5wb3J0XG4gIH1cbiAgaWYgKGFQYXJzZWRVcmwucGF0aCkge1xuICAgIHVybCArPSBhUGFyc2VkVXJsLnBhdGg7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn1cbmV4cG9ydHMudXJsR2VuZXJhdGUgPSB1cmxHZW5lcmF0ZTtcblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgcGF0aCwgb3IgdGhlIHBhdGggcG9ydGlvbiBvZiBhIFVSTDpcbiAqXG4gKiAtIFJlcGxhY2VzIGNvbnNlY3V0aXZlIHNsYXNoZXMgd2l0aCBvbmUgc2xhc2guXG4gKiAtIFJlbW92ZXMgdW5uZWNlc3NhcnkgJy4nIHBhcnRzLlxuICogLSBSZW1vdmVzIHVubmVjZXNzYXJ5ICc8ZGlyPi8uLicgcGFydHMuXG4gKlxuICogQmFzZWQgb24gY29kZSBpbiB0aGUgTm9kZS5qcyAncGF0aCcgY29yZSBtb2R1bGUuXG4gKlxuICogQHBhcmFtIGFQYXRoIFRoZSBwYXRoIG9yIHVybCB0byBub3JtYWxpemUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZShhUGF0aCkge1xuICB2YXIgcGF0aCA9IGFQYXRoO1xuICB2YXIgdXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICBpZiAodXJsKSB7XG4gICAgaWYgKCF1cmwucGF0aCkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cbiAgICBwYXRoID0gdXJsLnBhdGg7XG4gIH1cbiAgdmFyIGlzQWJzb2x1dGUgPSBleHBvcnRzLmlzQWJzb2x1dGUocGF0aCk7XG5cbiAgdmFyIHBhcnRzID0gcGF0aC5zcGxpdCgvXFwvKy8pO1xuICBmb3IgKHZhciBwYXJ0LCB1cCA9IDAsIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBpZiAocGFydCA9PT0gJy4nKSB7XG4gICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgfSBlbHNlIGlmIChwYXJ0ID09PSAnLi4nKSB7XG4gICAgICB1cCsrO1xuICAgIH0gZWxzZSBpZiAodXAgPiAwKSB7XG4gICAgICBpZiAocGFydCA9PT0gJycpIHtcbiAgICAgICAgLy8gVGhlIGZpcnN0IHBhcnQgaXMgYmxhbmsgaWYgdGhlIHBhdGggaXMgYWJzb2x1dGUuIFRyeWluZyB0byBnb1xuICAgICAgICAvLyBhYm92ZSB0aGUgcm9vdCBpcyBhIG5vLW9wLiBUaGVyZWZvcmUgd2UgY2FuIHJlbW92ZSBhbGwgJy4uJyBwYXJ0c1xuICAgICAgICAvLyBkaXJlY3RseSBhZnRlciB0aGUgcm9vdC5cbiAgICAgICAgcGFydHMuc3BsaWNlKGkgKyAxLCB1cCk7XG4gICAgICAgIHVwID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRzLnNwbGljZShpLCAyKTtcbiAgICAgICAgdXAtLTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcGF0aCA9IHBhcnRzLmpvaW4oJy8nKTtcblxuICBpZiAocGF0aCA9PT0gJycpIHtcbiAgICBwYXRoID0gaXNBYnNvbHV0ZSA/ICcvJyA6ICcuJztcbiAgfVxuXG4gIGlmICh1cmwpIHtcbiAgICB1cmwucGF0aCA9IHBhdGg7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKHVybCk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5leHBvcnRzLm5vcm1hbGl6ZSA9IG5vcm1hbGl6ZTtcblxuLyoqXG4gKiBKb2lucyB0d28gcGF0aHMvVVJMcy5cbiAqXG4gKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIGpvaW5lZCB3aXRoIHRoZSByb290LlxuICpcbiAqIC0gSWYgYVBhdGggaXMgYSBVUkwgb3IgYSBkYXRhIFVSSSwgYVBhdGggaXMgcmV0dXJuZWQsIHVubGVzcyBhUGF0aCBpcyBhXG4gKiAgIHNjaGVtZS1yZWxhdGl2ZSBVUkw6IFRoZW4gdGhlIHNjaGVtZSBvZiBhUm9vdCwgaWYgYW55LCBpcyBwcmVwZW5kZWRcbiAqICAgZmlyc3QuXG4gKiAtIE90aGVyd2lzZSBhUGF0aCBpcyBhIHBhdGguIElmIGFSb290IGlzIGEgVVJMLCB0aGVuIGl0cyBwYXRoIHBvcnRpb25cbiAqICAgaXMgdXBkYXRlZCB3aXRoIHRoZSByZXN1bHQgYW5kIGFSb290IGlzIHJldHVybmVkLiBPdGhlcndpc2UgdGhlIHJlc3VsdFxuICogICBpcyByZXR1cm5lZC5cbiAqICAgLSBJZiBhUGF0aCBpcyBhYnNvbHV0ZSwgdGhlIHJlc3VsdCBpcyBhUGF0aC5cbiAqICAgLSBPdGhlcndpc2UgdGhlIHR3byBwYXRocyBhcmUgam9pbmVkIHdpdGggYSBzbGFzaC5cbiAqIC0gSm9pbmluZyBmb3IgZXhhbXBsZSAnaHR0cDovLycgYW5kICd3d3cuZXhhbXBsZS5jb20nIGlzIGFsc28gc3VwcG9ydGVkLlxuICovXG5mdW5jdGlvbiBqb2luKGFSb290LCBhUGF0aCkge1xuICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICBhUm9vdCA9IFwiLlwiO1xuICB9XG4gIGlmIChhUGF0aCA9PT0gXCJcIikge1xuICAgIGFQYXRoID0gXCIuXCI7XG4gIH1cbiAgdmFyIGFQYXRoVXJsID0gdXJsUGFyc2UoYVBhdGgpO1xuICB2YXIgYVJvb3RVcmwgPSB1cmxQYXJzZShhUm9vdCk7XG4gIGlmIChhUm9vdFVybCkge1xuICAgIGFSb290ID0gYVJvb3RVcmwucGF0aCB8fCAnLyc7XG4gIH1cblxuICAvLyBgam9pbihmb28sICcvL3d3dy5leGFtcGxlLm9yZycpYFxuICBpZiAoYVBhdGhVcmwgJiYgIWFQYXRoVXJsLnNjaGVtZSkge1xuICAgIGlmIChhUm9vdFVybCkge1xuICAgICAgYVBhdGhVcmwuc2NoZW1lID0gYVJvb3RVcmwuc2NoZW1lO1xuICAgIH1cbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVBhdGhVcmwpO1xuICB9XG5cbiAgaWYgKGFQYXRoVXJsIHx8IGFQYXRoLm1hdGNoKGRhdGFVcmxSZWdleHApKSB7XG4gICAgcmV0dXJuIGFQYXRoO1xuICB9XG5cbiAgLy8gYGpvaW4oJ2h0dHA6Ly8nLCAnd3d3LmV4YW1wbGUuY29tJylgXG4gIGlmIChhUm9vdFVybCAmJiAhYVJvb3RVcmwuaG9zdCAmJiAhYVJvb3RVcmwucGF0aCkge1xuICAgIGFSb290VXJsLmhvc3QgPSBhUGF0aDtcbiAgICByZXR1cm4gdXJsR2VuZXJhdGUoYVJvb3RVcmwpO1xuICB9XG5cbiAgdmFyIGpvaW5lZCA9IGFQYXRoLmNoYXJBdCgwKSA9PT0gJy8nXG4gICAgPyBhUGF0aFxuICAgIDogbm9ybWFsaXplKGFSb290LnJlcGxhY2UoL1xcLyskLywgJycpICsgJy8nICsgYVBhdGgpO1xuXG4gIGlmIChhUm9vdFVybCkge1xuICAgIGFSb290VXJsLnBhdGggPSBqb2luZWQ7XG4gICAgcmV0dXJuIHVybEdlbmVyYXRlKGFSb290VXJsKTtcbiAgfVxuICByZXR1cm4gam9pbmVkO1xufVxuZXhwb3J0cy5qb2luID0gam9pbjtcblxuZXhwb3J0cy5pc0Fic29sdXRlID0gZnVuY3Rpb24gKGFQYXRoKSB7XG4gIHJldHVybiBhUGF0aC5jaGFyQXQoMCkgPT09ICcvJyB8fCAhIWFQYXRoLm1hdGNoKHVybFJlZ2V4cCk7XG59O1xuXG4vKipcbiAqIE1ha2UgYSBwYXRoIHJlbGF0aXZlIHRvIGEgVVJMIG9yIGFub3RoZXIgcGF0aC5cbiAqXG4gKiBAcGFyYW0gYVJvb3QgVGhlIHJvb3QgcGF0aCBvciBVUkwuXG4gKiBAcGFyYW0gYVBhdGggVGhlIHBhdGggb3IgVVJMIHRvIGJlIG1hZGUgcmVsYXRpdmUgdG8gYVJvb3QuXG4gKi9cbmZ1bmN0aW9uIHJlbGF0aXZlKGFSb290LCBhUGF0aCkge1xuICBpZiAoYVJvb3QgPT09IFwiXCIpIHtcbiAgICBhUm9vdCA9IFwiLlwiO1xuICB9XG5cbiAgYVJvb3QgPSBhUm9vdC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gIC8vIEl0IGlzIHBvc3NpYmxlIGZvciB0aGUgcGF0aCB0byBiZSBhYm92ZSB0aGUgcm9vdC4gSW4gdGhpcyBjYXNlLCBzaW1wbHlcbiAgLy8gY2hlY2tpbmcgd2hldGhlciB0aGUgcm9vdCBpcyBhIHByZWZpeCBvZiB0aGUgcGF0aCB3b24ndCB3b3JrLiBJbnN0ZWFkLCB3ZVxuICAvLyBuZWVkIHRvIHJlbW92ZSBjb21wb25lbnRzIGZyb20gdGhlIHJvb3Qgb25lIGJ5IG9uZSwgdW50aWwgZWl0aGVyIHdlIGZpbmRcbiAgLy8gYSBwcmVmaXggdGhhdCBmaXRzLCBvciB3ZSBydW4gb3V0IG9mIGNvbXBvbmVudHMgdG8gcmVtb3ZlLlxuICB2YXIgbGV2ZWwgPSAwO1xuICB3aGlsZSAoYVBhdGguaW5kZXhPZihhUm9vdCArICcvJykgIT09IDApIHtcbiAgICB2YXIgaW5kZXggPSBhUm9vdC5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgcmV0dXJuIGFQYXRoO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBvbmx5IHBhcnQgb2YgdGhlIHJvb3QgdGhhdCBpcyBsZWZ0IGlzIHRoZSBzY2hlbWUgKGkuZS4gaHR0cDovLyxcbiAgICAvLyBmaWxlOi8vLywgZXRjLiksIG9uZSBvciBtb3JlIHNsYXNoZXMgKC8pLCBvciBzaW1wbHkgbm90aGluZyBhdCBhbGwsIHdlXG4gICAgLy8gaGF2ZSBleGhhdXN0ZWQgYWxsIGNvbXBvbmVudHMsIHNvIHRoZSBwYXRoIGlzIG5vdCByZWxhdGl2ZSB0byB0aGUgcm9vdC5cbiAgICBhUm9vdCA9IGFSb290LnNsaWNlKDAsIGluZGV4KTtcbiAgICBpZiAoYVJvb3QubWF0Y2goL14oW15cXC9dKzpcXC8pP1xcLyokLykpIHtcbiAgICAgIHJldHVybiBhUGF0aDtcbiAgICB9XG5cbiAgICArK2xldmVsO1xuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHdlIGFkZCBhIFwiLi4vXCIgZm9yIGVhY2ggY29tcG9uZW50IHdlIHJlbW92ZWQgZnJvbSB0aGUgcm9vdC5cbiAgcmV0dXJuIEFycmF5KGxldmVsICsgMSkuam9pbihcIi4uL1wiKSArIGFQYXRoLnN1YnN0cihhUm9vdC5sZW5ndGggKyAxKTtcbn1cbmV4cG9ydHMucmVsYXRpdmUgPSByZWxhdGl2ZTtcblxudmFyIHN1cHBvcnRzTnVsbFByb3RvID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAhKCdfX3Byb3RvX18nIGluIG9iaik7XG59KCkpO1xuXG5mdW5jdGlvbiBpZGVudGl0eSAocykge1xuICByZXR1cm4gcztcbn1cblxuLyoqXG4gKiBCZWNhdXNlIGJlaGF2aW9yIGdvZXMgd2Fja3kgd2hlbiB5b3Ugc2V0IGBfX3Byb3RvX19gIG9uIG9iamVjdHMsIHdlXG4gKiBoYXZlIHRvIHByZWZpeCBhbGwgdGhlIHN0cmluZ3MgaW4gb3VyIHNldCB3aXRoIGFuIGFyYml0cmFyeSBjaGFyYWN0ZXIuXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvcHVsbC8zMSBhbmRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3NvdXJjZS1tYXAvaXNzdWVzLzMwXG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbmZ1bmN0aW9uIHRvU2V0U3RyaW5nKGFTdHIpIHtcbiAgaWYgKGlzUHJvdG9TdHJpbmcoYVN0cikpIHtcbiAgICByZXR1cm4gJyQnICsgYVN0cjtcbiAgfVxuXG4gIHJldHVybiBhU3RyO1xufVxuZXhwb3J0cy50b1NldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvID8gaWRlbnRpdHkgOiB0b1NldFN0cmluZztcblxuZnVuY3Rpb24gZnJvbVNldFN0cmluZyhhU3RyKSB7XG4gIGlmIChpc1Byb3RvU3RyaW5nKGFTdHIpKSB7XG4gICAgcmV0dXJuIGFTdHIuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4gYVN0cjtcbn1cbmV4cG9ydHMuZnJvbVNldFN0cmluZyA9IHN1cHBvcnRzTnVsbFByb3RvID8gaWRlbnRpdHkgOiBmcm9tU2V0U3RyaW5nO1xuXG5mdW5jdGlvbiBpc1Byb3RvU3RyaW5nKHMpIHtcbiAgaWYgKCFzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGxlbmd0aCA9IHMubGVuZ3RoO1xuXG4gIGlmIChsZW5ndGggPCA5IC8qIFwiX19wcm90b19fXCIubGVuZ3RoICovKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHMuY2hhckNvZGVBdChsZW5ndGggLSAxKSAhPT0gOTUgIC8qICdfJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDIpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gMykgIT09IDExMSAvKiAnbycgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA0KSAhPT0gMTE2IC8qICd0JyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDUpICE9PSAxMTEgLyogJ28nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gNikgIT09IDExNCAvKiAncicgKi8gfHxcbiAgICAgIHMuY2hhckNvZGVBdChsZW5ndGggLSA3KSAhPT0gMTEyIC8qICdwJyAqLyB8fFxuICAgICAgcy5jaGFyQ29kZUF0KGxlbmd0aCAtIDgpICE9PSA5NSAgLyogJ18nICovIHx8XG4gICAgICBzLmNoYXJDb2RlQXQobGVuZ3RoIC0gOSkgIT09IDk1ICAvKiAnXycgKi8pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKHZhciBpID0gbGVuZ3RoIC0gMTA7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKHMuY2hhckNvZGVBdChpKSAhPT0gMzYgLyogJyQnICovKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ29tcGFyYXRvciBiZXR3ZWVuIHR3byBtYXBwaW5ncyB3aGVyZSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIG9yaWdpbmFsIHNvdXJjZS9saW5lL2NvbHVtbiwgYnV0IGRpZmZlcmVudCBnZW5lcmF0ZWRcbiAqIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhIG1hcHBpbmcgd2l0aCBhXG4gKiBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucyhtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlT3JpZ2luYWwpIHtcbiAgdmFyIGNtcCA9IHN0cmNtcChtYXBwaW5nQS5zb3VyY2UsIG1hcHBpbmdCLnNvdXJjZSk7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxMaW5lIC0gbWFwcGluZ0Iub3JpZ2luYWxMaW5lO1xuICBpZiAoY21wICE9PSAwKSB7XG4gICAgcmV0dXJuIGNtcDtcbiAgfVxuXG4gIGNtcCA9IG1hcHBpbmdBLm9yaWdpbmFsQ29sdW1uIC0gbWFwcGluZ0Iub3JpZ2luYWxDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVPcmlnaW5hbCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZSAtIG1hcHBpbmdCLmdlbmVyYXRlZExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgcmV0dXJuIHN0cmNtcChtYXBwaW5nQS5uYW1lLCBtYXBwaW5nQi5uYW1lKTtcbn1cbmV4cG9ydHMuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMgPSBjb21wYXJlQnlPcmlnaW5hbFBvc2l0aW9ucztcblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggZGVmbGF0ZWQgc291cmNlIGFuZCBuYW1lIGluZGljZXMgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IHBhc3MgaW4gYHRydWVgIGFzIGBvbmx5Q29tcGFyZUdlbmVyYXRlZGAgdG8gY29uc2lkZXIgdHdvXG4gKiBtYXBwaW5ncyB3aXRoIHRoZSBzYW1lIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4sIGJ1dCBkaWZmZXJlbnRcbiAqIHNvdXJjZS9uYW1lL29yaWdpbmFsIGxpbmUgYW5kIGNvbHVtbiB0aGUgc2FtZS4gVXNlZnVsIHdoZW4gc2VhcmNoaW5nIGZvciBhXG4gKiBtYXBwaW5nIHdpdGggYSBzdHViYmVkIG91dCBtYXBwaW5nLlxuICovXG5mdW5jdGlvbiBjb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZChtYXBwaW5nQSwgbWFwcGluZ0IsIG9ubHlDb21wYXJlR2VuZXJhdGVkKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDAgfHwgb25seUNvbXBhcmVHZW5lcmF0ZWQpIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNEZWZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkO1xuXG5mdW5jdGlvbiBzdHJjbXAoYVN0cjEsIGFTdHIyKSB7XG4gIGlmIChhU3RyMSA9PT0gYVN0cjIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhU3RyMSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAxOyAvLyBhU3RyMiAhPT0gbnVsbFxuICB9XG5cbiAgaWYgKGFTdHIyID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xOyAvLyBhU3RyMSAhPT0gbnVsbFxuICB9XG5cbiAgaWYgKGFTdHIxID4gYVN0cjIpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBDb21wYXJhdG9yIGJldHdlZW4gdHdvIG1hcHBpbmdzIHdpdGggaW5mbGF0ZWQgc291cmNlIGFuZCBuYW1lIHN0cmluZ3Mgd2hlcmVcbiAqIHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zIGFyZSBjb21wYXJlZC5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCKSB7XG4gIHZhciBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRMaW5lIC0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW4gLSBtYXBwaW5nQi5nZW5lcmF0ZWRDb2x1bW47XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gc3RyY21wKG1hcHBpbmdBLnNvdXJjZSwgbWFwcGluZ0Iuc291cmNlKTtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICBjbXAgPSBtYXBwaW5nQS5vcmlnaW5hbExpbmUgLSBtYXBwaW5nQi5vcmlnaW5hbExpbmU7XG4gIGlmIChjbXAgIT09IDApIHtcbiAgICByZXR1cm4gY21wO1xuICB9XG5cbiAgY21wID0gbWFwcGluZ0Eub3JpZ2luYWxDb2x1bW4gLSBtYXBwaW5nQi5vcmlnaW5hbENvbHVtbjtcbiAgaWYgKGNtcCAhPT0gMCkge1xuICAgIHJldHVybiBjbXA7XG4gIH1cblxuICByZXR1cm4gc3RyY21wKG1hcHBpbmdBLm5hbWUsIG1hcHBpbmdCLm5hbWUpO1xufVxuZXhwb3J0cy5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZCA9IGNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0luZmxhdGVkO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgYmluYXJ5U2VhcmNoID0gcmVxdWlyZSgnLi9iaW5hcnktc2VhcmNoJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIGJhc2U2NFZMUSA9IHJlcXVpcmUoJy4vYmFzZTY0LXZscScpO1xudmFyIHF1aWNrU29ydCA9IHJlcXVpcmUoJy4vcXVpY2stc29ydCcpLnF1aWNrU29ydDtcblxuZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICByZXR1cm4gc291cmNlTWFwLnNlY3Rpb25zICE9IG51bGxcbiAgICA/IG5ldyBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKVxuICAgIDogbmV3IEJhc2ljU291cmNlTWFwQ29uc3VtZXIoc291cmNlTWFwKTtcbn1cblxuU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcCA9IGZ1bmN0aW9uKGFTb3VyY2VNYXApIHtcbiAgcmV0dXJuIEJhc2ljU291cmNlTWFwQ29uc3VtZXIuZnJvbVNvdXJjZU1hcChhU291cmNlTWFwKTtcbn1cblxuLyoqXG4gKiBUaGUgdmVyc2lvbiBvZiB0aGUgc291cmNlIG1hcHBpbmcgc3BlYyB0aGF0IHdlIGFyZSBjb25zdW1pbmcuXG4gKi9cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8vIGBfX2dlbmVyYXRlZE1hcHBpbmdzYCBhbmQgYF9fb3JpZ2luYWxNYXBwaW5nc2AgYXJlIGFycmF5cyB0aGF0IGhvbGQgdGhlXG4vLyBwYXJzZWQgbWFwcGluZyBjb29yZGluYXRlcyBmcm9tIHRoZSBzb3VyY2UgbWFwJ3MgXCJtYXBwaW5nc1wiIGF0dHJpYnV0ZS4gVGhleVxuLy8gYXJlIGxhemlseSBpbnN0YW50aWF0ZWQsIGFjY2Vzc2VkIHZpYSB0aGUgYF9nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4vLyBgX29yaWdpbmFsTWFwcGluZ3NgIGdldHRlcnMgcmVzcGVjdGl2ZWx5LCBhbmQgd2Ugb25seSBwYXJzZSB0aGUgbWFwcGluZ3Ncbi8vIGFuZCBjcmVhdGUgdGhlc2UgYXJyYXlzIG9uY2UgcXVlcmllZCBmb3IgYSBzb3VyY2UgbG9jYXRpb24uIFdlIGp1bXAgdGhyb3VnaFxuLy8gdGhlc2UgaG9vcHMgYmVjYXVzZSB0aGVyZSBjYW4gYmUgbWFueSB0aG91c2FuZHMgb2YgbWFwcGluZ3MsIGFuZCBwYXJzaW5nXG4vLyB0aGVtIGlzIGV4cGVuc2l2ZSwgc28gd2Ugb25seSB3YW50IHRvIGRvIGl0IGlmIHdlIG11c3QuXG4vL1xuLy8gRWFjaCBvYmplY3QgaW4gdGhlIGFycmF5cyBpcyBvZiB0aGUgZm9ybTpcbi8vXG4vLyAgICAge1xuLy8gICAgICAgZ2VuZXJhdGVkTGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIGdlbmVyYXRlZENvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBjb2RlLFxuLy8gICAgICAgc291cmNlOiBUaGUgcGF0aCB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGUgdGhhdCBnZW5lcmF0ZWQgdGhpc1xuLy8gICAgICAgICAgICAgICBjaHVuayBvZiBjb2RlLFxuLy8gICAgICAgb3JpZ2luYWxMaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSB0aGF0XG4vLyAgICAgICAgICAgICAgICAgICAgIGNvcnJlc3BvbmRzIHRvIHRoaXMgY2h1bmsgb2YgZ2VuZXJhdGVkIGNvZGUsXG4vLyAgICAgICBvcmlnaW5hbENvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSB0aGF0XG4vLyAgICAgICAgICAgICAgICAgICAgICAgY29ycmVzcG9uZHMgdG8gdGhpcyBjaHVuayBvZiBnZW5lcmF0ZWQgY29kZSxcbi8vICAgICAgIG5hbWU6IFRoZSBuYW1lIG9mIHRoZSBvcmlnaW5hbCBzeW1ib2wgd2hpY2ggZ2VuZXJhdGVkIHRoaXMgY2h1bmsgb2Zcbi8vICAgICAgICAgICAgIGNvZGUuXG4vLyAgICAgfVxuLy9cbi8vIEFsbCBwcm9wZXJ0aWVzIGV4Y2VwdCBmb3IgYGdlbmVyYXRlZExpbmVgIGFuZCBgZ2VuZXJhdGVkQ29sdW1uYCBjYW4gYmVcbi8vIGBudWxsYC5cbi8vXG4vLyBgX2dlbmVyYXRlZE1hcHBpbmdzYCBpcyBvcmRlcmVkIGJ5IHRoZSBnZW5lcmF0ZWQgcG9zaXRpb25zLlxuLy9cbi8vIGBfb3JpZ2luYWxNYXBwaW5nc2AgaXMgb3JkZXJlZCBieSB0aGUgb3JpZ2luYWwgcG9zaXRpb25zLlxuXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX19nZW5lcmF0ZWRNYXBwaW5ncyA9IG51bGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnX2dlbmVyYXRlZE1hcHBpbmdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzKSB7XG4gICAgICB0aGlzLl9wYXJzZU1hcHBpbmdzKHRoaXMuX21hcHBpbmdzLCB0aGlzLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3M7XG4gIH1cbn0pO1xuXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX19vcmlnaW5hbE1hcHBpbmdzID0gbnVsbDtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdfb3JpZ2luYWxNYXBwaW5ncycsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX19vcmlnaW5hbE1hcHBpbmdzKSB7XG4gICAgICB0aGlzLl9wYXJzZU1hcHBpbmdzKHRoaXMuX21hcHBpbmdzLCB0aGlzLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncztcbiAgfVxufSk7XG5cblNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fY2hhcklzTWFwcGluZ1NlcGFyYXRvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2NoYXJJc01hcHBpbmdTZXBhcmF0b3IoYVN0ciwgaW5kZXgpIHtcbiAgICB2YXIgYyA9IGFTdHIuY2hhckF0KGluZGV4KTtcbiAgICByZXR1cm4gYyA9PT0gXCI7XCIgfHwgYyA9PT0gXCIsXCI7XG4gIH07XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU3ViY2xhc3NlcyBtdXN0IGltcGxlbWVudCBfcGFyc2VNYXBwaW5nc1wiKTtcbiAgfTtcblxuU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSID0gMTtcblNvdXJjZU1hcENvbnN1bWVyLk9SSUdJTkFMX09SREVSID0gMjtcblxuU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQgPSAxO1xuU291cmNlTWFwQ29uc3VtZXIuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBlYWNoIG1hcHBpbmcgYmV0d2VlbiBhbiBvcmlnaW5hbCBzb3VyY2UvbGluZS9jb2x1bW4gYW5kIGFcbiAqIGdlbmVyYXRlZCBsaW5lL2NvbHVtbiBpbiB0aGlzIHNvdXJjZSBtYXAuXG4gKlxuICogQHBhcmFtIEZ1bmN0aW9uIGFDYWxsYmFja1xuICogICAgICAgIFRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aXRoIGVhY2ggbWFwcGluZy5cbiAqIEBwYXJhbSBPYmplY3QgYUNvbnRleHRcbiAqICAgICAgICBPcHRpb25hbC4gSWYgc3BlY2lmaWVkLCB0aGlzIG9iamVjdCB3aWxsIGJlIHRoZSB2YWx1ZSBvZiBgdGhpc2AgZXZlcnlcbiAqICAgICAgICB0aW1lIHRoYXQgYGFDYWxsYmFja2AgaXMgY2FsbGVkLlxuICogQHBhcmFtIGFPcmRlclxuICogICAgICAgIEVpdGhlciBgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSYCBvclxuICogICAgICAgIGBTb3VyY2VNYXBDb25zdW1lci5PUklHSU5BTF9PUkRFUmAuIFNwZWNpZmllcyB3aGV0aGVyIHlvdSB3YW50IHRvXG4gKiAgICAgICAgaXRlcmF0ZSBvdmVyIHRoZSBtYXBwaW5ncyBzb3J0ZWQgYnkgdGhlIGdlbmVyYXRlZCBmaWxlJ3MgbGluZS9jb2x1bW5cbiAqICAgICAgICBvcmRlciBvciB0aGUgb3JpZ2luYWwncyBzb3VyY2UvbGluZS9jb2x1bW4gb3JkZXIsIHJlc3BlY3RpdmVseS4gRGVmYXVsdHMgdG9cbiAqICAgICAgICBgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSYC5cbiAqL1xuU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmVhY2hNYXBwaW5nID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZWFjaE1hcHBpbmcoYUNhbGxiYWNrLCBhQ29udGV4dCwgYU9yZGVyKSB7XG4gICAgdmFyIGNvbnRleHQgPSBhQ29udGV4dCB8fCBudWxsO1xuICAgIHZhciBvcmRlciA9IGFPcmRlciB8fCBTb3VyY2VNYXBDb25zdW1lci5HRU5FUkFURURfT1JERVI7XG5cbiAgICB2YXIgbWFwcGluZ3M7XG4gICAgc3dpdGNoIChvcmRlcikge1xuICAgIGNhc2UgU291cmNlTWFwQ29uc3VtZXIuR0VORVJBVEVEX09SREVSOlxuICAgICAgbWFwcGluZ3MgPSB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU291cmNlTWFwQ29uc3VtZXIuT1JJR0lOQUxfT1JERVI6XG4gICAgICBtYXBwaW5ncyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3M7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBvcmRlciBvZiBpdGVyYXRpb24uXCIpO1xuICAgIH1cblxuICAgIHZhciBzb3VyY2VSb290ID0gdGhpcy5zb3VyY2VSb290O1xuICAgIG1hcHBpbmdzLm1hcChmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgdmFyIHNvdXJjZSA9IG1hcHBpbmcuc291cmNlID09PSBudWxsID8gbnVsbCA6IHRoaXMuX3NvdXJjZXMuYXQobWFwcGluZy5zb3VyY2UpO1xuICAgICAgaWYgKHNvdXJjZSAhPSBudWxsICYmIHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICBzb3VyY2UgPSB1dGlsLmpvaW4oc291cmNlUm9vdCwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICBnZW5lcmF0ZWRMaW5lOiBtYXBwaW5nLmdlbmVyYXRlZExpbmUsXG4gICAgICAgIGdlbmVyYXRlZENvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4sXG4gICAgICAgIG9yaWdpbmFsTGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgIG9yaWdpbmFsQ29sdW1uOiBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uLFxuICAgICAgICBuYW1lOiBtYXBwaW5nLm5hbWUgPT09IG51bGwgPyBudWxsIDogdGhpcy5fbmFtZXMuYXQobWFwcGluZy5uYW1lKVxuICAgICAgfTtcbiAgICB9LCB0aGlzKS5mb3JFYWNoKGFDYWxsYmFjaywgY29udGV4dCk7XG4gIH07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIG9yaWdpbmFsIHNvdXJjZSxcbiAqIGxpbmUsIGFuZCBjb2x1bW4gcHJvdmlkZWQuIElmIG5vIGNvbHVtbiBpcyBwcm92aWRlZCwgcmV0dXJucyBhbGwgbWFwcGluZ3NcbiAqIGNvcnJlc3BvbmRpbmcgdG8gYSBlaXRoZXIgdGhlIGxpbmUgd2UgYXJlIHNlYXJjaGluZyBmb3Igb3IgdGhlIG5leHRcbiAqIGNsb3Nlc3QgbGluZSB0aGF0IGhhcyBhbnkgbWFwcGluZ3MuIE90aGVyd2lzZSwgcmV0dXJucyBhbGwgbWFwcGluZ3NcbiAqIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIGxpbmUgYW5kIGVpdGhlciB0aGUgY29sdW1uIHdlIGFyZSBzZWFyY2hpbmcgZm9yXG4gKiBvciB0aGUgbmV4dCBjbG9zZXN0IGNvbHVtbiB0aGF0IGhhcyBhbnkgb2Zmc2V0cy5cbiAqXG4gKiBUaGUgb25seSBhcmd1bWVudCBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBvcmlnaW5hbCBzb3VyY2UuXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UuICBUaGUgbGluZSBudW1iZXIgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IE9wdGlvbmFsLiB0aGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLlxuICogICAgVGhlIGNvbHVtbiBudW1iZXIgaXMgMC1iYXNlZC5cbiAqXG4gKiBhbmQgYW4gYXJyYXkgb2Ygb2JqZWN0cyBpcyByZXR1cm5lZCwgZWFjaCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICBsaW5lIG51bWJlciBpcyAxLWJhc2VkLlxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgICBUaGUgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICovXG5Tb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfYWxsR2VuZXJhdGVkUG9zaXRpb25zRm9yKGFBcmdzKSB7XG4gICAgdmFyIGxpbmUgPSB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKTtcblxuICAgIC8vIFdoZW4gdGhlcmUgaXMgbm8gZXhhY3QgbWF0Y2gsIEJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9maW5kTWFwcGluZ1xuICAgIC8vIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBjbG9zZXN0IG1hcHBpbmcgbGVzcyB0aGFuIHRoZSBuZWVkbGUuIEJ5XG4gICAgLy8gc2V0dGluZyBuZWVkbGUub3JpZ2luYWxDb2x1bW4gdG8gMCwgd2UgdGh1cyBmaW5kIHRoZSBsYXN0IG1hcHBpbmcgZm9yXG4gICAgLy8gdGhlIGdpdmVuIGxpbmUsIHByb3ZpZGVkIHN1Y2ggYSBtYXBwaW5nIGV4aXN0cy5cbiAgICB2YXIgbmVlZGxlID0ge1xuICAgICAgc291cmNlOiB1dGlsLmdldEFyZyhhQXJncywgJ3NvdXJjZScpLFxuICAgICAgb3JpZ2luYWxMaW5lOiBsaW5lLFxuICAgICAgb3JpZ2luYWxDb2x1bW46IHV0aWwuZ2V0QXJnKGFBcmdzLCAnY29sdW1uJywgMClcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBuZWVkbGUuc291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLnNvdXJjZVJvb3QsIG5lZWRsZS5zb3VyY2UpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX3NvdXJjZXMuaGFzKG5lZWRsZS5zb3VyY2UpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIG5lZWRsZS5zb3VyY2UgPSB0aGlzLl9zb3VyY2VzLmluZGV4T2YobmVlZGxlLnNvdXJjZSk7XG5cbiAgICB2YXIgbWFwcGluZ3MgPSBbXTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKG5lZWRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3JpZ2luYWxMaW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJvcmlnaW5hbENvbHVtblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluYXJ5U2VhcmNoLkxFQVNUX1VQUEVSX0JPVU5EKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIG1hcHBpbmcgPSB0aGlzLl9vcmlnaW5hbE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgaWYgKGFBcmdzLmNvbHVtbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBvcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZTtcblxuICAgICAgICAvLyBJdGVyYXRlIHVudGlsIGVpdGhlciB3ZSBydW4gb3V0IG9mIG1hcHBpbmdzLCBvciB3ZSBydW4gaW50b1xuICAgICAgICAvLyBhIG1hcHBpbmcgZm9yIGEgZGlmZmVyZW50IGxpbmUgdGhhbiB0aGUgb25lIHdlIGZvdW5kLiBTaW5jZVxuICAgICAgICAvLyBtYXBwaW5ncyBhcmUgc29ydGVkLCB0aGlzIGlzIGd1YXJhbnRlZWQgdG8gZmluZCBhbGwgbWFwcGluZ3MgZm9yXG4gICAgICAgIC8vIHRoZSBsaW5lIHdlIGZvdW5kLlxuICAgICAgICB3aGlsZSAobWFwcGluZyAmJiBtYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gb3JpZ2luYWxMaW5lKSB7XG4gICAgICAgICAgbWFwcGluZ3MucHVzaCh7XG4gICAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkTGluZScsIG51bGwpLFxuICAgICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgICBsYXN0Q29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnbGFzdEdlbmVyYXRlZENvbHVtbicsIG51bGwpXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBtYXBwaW5nID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5nc1srK2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsQ29sdW1uID0gbWFwcGluZy5vcmlnaW5hbENvbHVtbjtcblxuICAgICAgICAvLyBJdGVyYXRlIHVudGlsIGVpdGhlciB3ZSBydW4gb3V0IG9mIG1hcHBpbmdzLCBvciB3ZSBydW4gaW50b1xuICAgICAgICAvLyBhIG1hcHBpbmcgZm9yIGEgZGlmZmVyZW50IGxpbmUgdGhhbiB0aGUgb25lIHdlIHdlcmUgc2VhcmNoaW5nIGZvci5cbiAgICAgICAgLy8gU2luY2UgbWFwcGluZ3MgYXJlIHNvcnRlZCwgdGhpcyBpcyBndWFyYW50ZWVkIHRvIGZpbmQgYWxsIG1hcHBpbmdzIGZvclxuICAgICAgICAvLyB0aGUgbGluZSB3ZSBhcmUgc2VhcmNoaW5nIGZvci5cbiAgICAgICAgd2hpbGUgKG1hcHBpbmcgJiZcbiAgICAgICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID09PSBsaW5lICYmXG4gICAgICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID09IG9yaWdpbmFsQ29sdW1uKSB7XG4gICAgICAgICAgbWFwcGluZ3MucHVzaCh7XG4gICAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkTGluZScsIG51bGwpLFxuICAgICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkQ29sdW1uJywgbnVsbCksXG4gICAgICAgICAgICBsYXN0Q29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnbGFzdEdlbmVyYXRlZENvbHVtbicsIG51bGwpXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBtYXBwaW5nID0gdGhpcy5fb3JpZ2luYWxNYXBwaW5nc1srK2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXBwaW5ncztcbiAgfTtcblxuZXhwb3J0cy5Tb3VyY2VNYXBDb25zdW1lciA9IFNvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIEEgQmFzaWNTb3VyY2VNYXBDb25zdW1lciBpbnN0YW5jZSByZXByZXNlbnRzIGEgcGFyc2VkIHNvdXJjZSBtYXAgd2hpY2ggd2UgY2FuXG4gKiBxdWVyeSBmb3IgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG9yaWdpbmFsIGZpbGUgcG9zaXRpb25zIGJ5IGdpdmluZyBpdCBhIGZpbGVcbiAqIHBvc2l0aW9uIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICpcbiAqIFRoZSBvbmx5IHBhcmFtZXRlciBpcyB0aGUgcmF3IHNvdXJjZSBtYXAgKGVpdGhlciBhcyBhIEpTT04gc3RyaW5nLCBvclxuICogYWxyZWFkeSBwYXJzZWQgdG8gYW4gb2JqZWN0KS4gQWNjb3JkaW5nIHRvIHRoZSBzcGVjLCBzb3VyY2UgbWFwcyBoYXZlIHRoZVxuICogZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKlxuICogICAtIHZlcnNpb246IFdoaWNoIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXAgc3BlYyB0aGlzIG1hcCBpcyBmb2xsb3dpbmcuXG4gKiAgIC0gc291cmNlczogQW4gYXJyYXkgb2YgVVJMcyB0byB0aGUgb3JpZ2luYWwgc291cmNlIGZpbGVzLlxuICogICAtIG5hbWVzOiBBbiBhcnJheSBvZiBpZGVudGlmaWVycyB3aGljaCBjYW4gYmUgcmVmZXJyZW5jZWQgYnkgaW5kaXZpZHVhbCBtYXBwaW5ncy5cbiAqICAgLSBzb3VyY2VSb290OiBPcHRpb25hbC4gVGhlIFVSTCByb290IGZyb20gd2hpY2ggYWxsIHNvdXJjZXMgYXJlIHJlbGF0aXZlLlxuICogICAtIHNvdXJjZXNDb250ZW50OiBPcHRpb25hbC4gQW4gYXJyYXkgb2YgY29udGVudHMgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlcy5cbiAqICAgLSBtYXBwaW5nczogQSBzdHJpbmcgb2YgYmFzZTY0IFZMUXMgd2hpY2ggY29udGFpbiB0aGUgYWN0dWFsIG1hcHBpbmdzLlxuICogICAtIGZpbGU6IE9wdGlvbmFsLiBUaGUgZ2VuZXJhdGVkIGZpbGUgdGhpcyBzb3VyY2UgbWFwIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBIZXJlIGlzIGFuIGV4YW1wbGUgc291cmNlIG1hcCwgdGFrZW4gZnJvbSB0aGUgc291cmNlIG1hcCBzcGVjWzBdOlxuICpcbiAqICAgICB7XG4gKiAgICAgICB2ZXJzaW9uIDogMyxcbiAqICAgICAgIGZpbGU6IFwib3V0LmpzXCIsXG4gKiAgICAgICBzb3VyY2VSb290IDogXCJcIixcbiAqICAgICAgIHNvdXJjZXM6IFtcImZvby5qc1wiLCBcImJhci5qc1wiXSxcbiAqICAgICAgIG5hbWVzOiBbXCJzcmNcIiwgXCJtYXBzXCIsIFwiYXJlXCIsIFwiZnVuXCJdLFxuICogICAgICAgbWFwcGluZ3M6IFwiQUEsQUI7O0FCQ0RFO1wiXG4gKiAgICAgfVxuICpcbiAqIFswXTogaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vZG9jdW1lbnQvZC8xVTFSR0FlaFF3UnlwVVRvdkYxS1JscGlPRnplMGItXzJnYzZmQUgwS1kway9lZGl0P3BsaT0xI1xuICovXG5mdW5jdGlvbiBCYXNpY1NvdXJjZU1hcENvbnN1bWVyKGFTb3VyY2VNYXApIHtcbiAgdmFyIHNvdXJjZU1hcCA9IGFTb3VyY2VNYXA7XG4gIGlmICh0eXBlb2YgYVNvdXJjZU1hcCA9PT0gJ3N0cmluZycpIHtcbiAgICBzb3VyY2VNYXAgPSBKU09OLnBhcnNlKGFTb3VyY2VNYXAucmVwbGFjZSgvXlxcKVxcXVxcfScvLCAnJykpO1xuICB9XG5cbiAgdmFyIHZlcnNpb24gPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICd2ZXJzaW9uJyk7XG4gIHZhciBzb3VyY2VzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlcycpO1xuICAvLyBTYXNzIDMuMyBsZWF2ZXMgb3V0IHRoZSAnbmFtZXMnIGFycmF5LCBzbyB3ZSBkZXZpYXRlIGZyb20gdGhlIHNwZWMgKHdoaWNoXG4gIC8vIHJlcXVpcmVzIHRoZSBhcnJheSkgdG8gcGxheSBuaWNlIGhlcmUuXG4gIHZhciBuYW1lcyA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ25hbWVzJywgW10pO1xuICB2YXIgc291cmNlUm9vdCA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3NvdXJjZVJvb3QnLCBudWxsKTtcbiAgdmFyIHNvdXJjZXNDb250ZW50ID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc291cmNlc0NvbnRlbnQnLCBudWxsKTtcbiAgdmFyIG1hcHBpbmdzID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnbWFwcGluZ3MnKTtcbiAgdmFyIGZpbGUgPSB1dGlsLmdldEFyZyhzb3VyY2VNYXAsICdmaWxlJywgbnVsbCk7XG5cbiAgLy8gT25jZSBhZ2FpbiwgU2FzcyBkZXZpYXRlcyBmcm9tIHRoZSBzcGVjIGFuZCBzdXBwbGllcyB0aGUgdmVyc2lvbiBhcyBhXG4gIC8vIHN0cmluZyByYXRoZXIgdGhhbiBhIG51bWJlciwgc28gd2UgdXNlIGxvb3NlIGVxdWFsaXR5IGNoZWNraW5nIGhlcmUuXG4gIGlmICh2ZXJzaW9uICE9IHRoaXMuX3ZlcnNpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHZlcnNpb246ICcgKyB2ZXJzaW9uKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VSb290KSB7XG4gICAgc291cmNlUm9vdCA9IHV0aWwubm9ybWFsaXplKHNvdXJjZVJvb3QpO1xuICB9XG5cbiAgc291cmNlcyA9IHNvdXJjZXNcbiAgICAubWFwKFN0cmluZylcbiAgICAvLyBTb21lIHNvdXJjZSBtYXBzIHByb2R1Y2UgcmVsYXRpdmUgc291cmNlIHBhdGhzIGxpa2UgXCIuL2Zvby5qc1wiIGluc3RlYWQgb2ZcbiAgICAvLyBcImZvby5qc1wiLiAgTm9ybWFsaXplIHRoZXNlIGZpcnN0IHNvIHRoYXQgZnV0dXJlIGNvbXBhcmlzb25zIHdpbGwgc3VjY2VlZC5cbiAgICAvLyBTZWUgYnVnemlsLmxhLzEwOTA3NjguXG4gICAgLm1hcCh1dGlsLm5vcm1hbGl6ZSlcbiAgICAvLyBBbHdheXMgZW5zdXJlIHRoYXQgYWJzb2x1dGUgc291cmNlcyBhcmUgaW50ZXJuYWxseSBzdG9yZWQgcmVsYXRpdmUgdG9cbiAgICAvLyB0aGUgc291cmNlIHJvb3QsIGlmIHRoZSBzb3VyY2Ugcm9vdCBpcyBhYnNvbHV0ZS4gTm90IGRvaW5nIHRoaXMgd291bGRcbiAgICAvLyBiZSBwYXJ0aWN1bGFybHkgcHJvYmxlbWF0aWMgd2hlbiB0aGUgc291cmNlIHJvb3QgaXMgYSBwcmVmaXggb2YgdGhlXG4gICAgLy8gc291cmNlICh2YWxpZCwgYnV0IHdoeT8/KS4gU2VlIGdpdGh1YiBpc3N1ZSAjMTk5IGFuZCBidWd6aWwubGEvMTE4ODk4Mi5cbiAgICAubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBzb3VyY2VSb290ICYmIHV0aWwuaXNBYnNvbHV0ZShzb3VyY2VSb290KSAmJiB1dGlsLmlzQWJzb2x1dGUoc291cmNlKVxuICAgICAgICA/IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlKVxuICAgICAgICA6IHNvdXJjZTtcbiAgICB9KTtcblxuICAvLyBQYXNzIGB0cnVlYCBiZWxvdyB0byBhbGxvdyBkdXBsaWNhdGUgbmFtZXMgYW5kIHNvdXJjZXMuIFdoaWxlIHNvdXJjZSBtYXBzXG4gIC8vIGFyZSBpbnRlbmRlZCB0byBiZSBjb21wcmVzc2VkIGFuZCBkZWR1cGxpY2F0ZWQsIHRoZSBUeXBlU2NyaXB0IGNvbXBpbGVyXG4gIC8vIHNvbWV0aW1lcyBnZW5lcmF0ZXMgc291cmNlIG1hcHMgd2l0aCBkdXBsaWNhdGVzIGluIHRoZW0uIFNlZSBHaXRodWIgaXNzdWVcbiAgLy8gIzcyIGFuZCBidWd6aWwubGEvODg5NDkyLlxuICB0aGlzLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShuYW1lcy5tYXAoU3RyaW5nKSwgdHJ1ZSk7XG4gIHRoaXMuX3NvdXJjZXMgPSBBcnJheVNldC5mcm9tQXJyYXkoc291cmNlcywgdHJ1ZSk7XG5cbiAgdGhpcy5zb3VyY2VSb290ID0gc291cmNlUm9vdDtcbiAgdGhpcy5zb3VyY2VzQ29udGVudCA9IHNvdXJjZXNDb250ZW50O1xuICB0aGlzLl9tYXBwaW5ncyA9IG1hcHBpbmdzO1xuICB0aGlzLmZpbGUgPSBmaWxlO1xufVxuXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlKTtcbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbnN1bWVyID0gU291cmNlTWFwQ29uc3VtZXI7XG5cbi8qKlxuICogQ3JlYXRlIGEgQmFzaWNTb3VyY2VNYXBDb25zdW1lciBmcm9tIGEgU291cmNlTWFwR2VuZXJhdG9yLlxuICpcbiAqIEBwYXJhbSBTb3VyY2VNYXBHZW5lcmF0b3IgYVNvdXJjZU1hcFxuICogICAgICAgIFRoZSBzb3VyY2UgbWFwIHRoYXQgd2lsbCBiZSBjb25zdW1lZC5cbiAqIEByZXR1cm5zIEJhc2ljU291cmNlTWFwQ29uc3VtZXJcbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5mcm9tU291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfZnJvbVNvdXJjZU1hcChhU291cmNlTWFwKSB7XG4gICAgdmFyIHNtYyA9IE9iamVjdC5jcmVhdGUoQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuXG4gICAgdmFyIG5hbWVzID0gc21jLl9uYW1lcyA9IEFycmF5U2V0LmZyb21BcnJheShhU291cmNlTWFwLl9uYW1lcy50b0FycmF5KCksIHRydWUpO1xuICAgIHZhciBzb3VyY2VzID0gc21jLl9zb3VyY2VzID0gQXJyYXlTZXQuZnJvbUFycmF5KGFTb3VyY2VNYXAuX3NvdXJjZXMudG9BcnJheSgpLCB0cnVlKTtcbiAgICBzbWMuc291cmNlUm9vdCA9IGFTb3VyY2VNYXAuX3NvdXJjZVJvb3Q7XG4gICAgc21jLnNvdXJjZXNDb250ZW50ID0gYVNvdXJjZU1hcC5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudChzbWMuX3NvdXJjZXMudG9BcnJheSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc21jLnNvdXJjZVJvb3QpO1xuICAgIHNtYy5maWxlID0gYVNvdXJjZU1hcC5fZmlsZTtcblxuICAgIC8vIEJlY2F1c2Ugd2UgYXJlIG1vZGlmeWluZyB0aGUgZW50cmllcyAoYnkgY29udmVydGluZyBzdHJpbmcgc291cmNlcyBhbmRcbiAgICAvLyBuYW1lcyB0byBpbmRpY2VzIGludG8gdGhlIHNvdXJjZXMgYW5kIG5hbWVzIEFycmF5U2V0cyksIHdlIGhhdmUgdG8gbWFrZVxuICAgIC8vIGEgY29weSBvZiB0aGUgZW50cnkgb3IgZWxzZSBiYWQgdGhpbmdzIGhhcHBlbi4gU2hhcmVkIG11dGFibGUgc3RhdGVcbiAgICAvLyBzdHJpa2VzIGFnYWluISBTZWUgZ2l0aHViIGlzc3VlICMxOTEuXG5cbiAgICB2YXIgZ2VuZXJhdGVkTWFwcGluZ3MgPSBhU291cmNlTWFwLl9tYXBwaW5ncy50b0FycmF5KCkuc2xpY2UoKTtcbiAgICB2YXIgZGVzdEdlbmVyYXRlZE1hcHBpbmdzID0gc21jLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB2YXIgZGVzdE9yaWdpbmFsTWFwcGluZ3MgPSBzbWMuX19vcmlnaW5hbE1hcHBpbmdzID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2VuZXJhdGVkTWFwcGluZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzcmNNYXBwaW5nID0gZ2VuZXJhdGVkTWFwcGluZ3NbaV07XG4gICAgICB2YXIgZGVzdE1hcHBpbmcgPSBuZXcgTWFwcGluZztcbiAgICAgIGRlc3RNYXBwaW5nLmdlbmVyYXRlZExpbmUgPSBzcmNNYXBwaW5nLmdlbmVyYXRlZExpbmU7XG4gICAgICBkZXN0TWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gPSBzcmNNYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgaWYgKHNyY01hcHBpbmcuc291cmNlKSB7XG4gICAgICAgIGRlc3RNYXBwaW5nLnNvdXJjZSA9IHNvdXJjZXMuaW5kZXhPZihzcmNNYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIGRlc3RNYXBwaW5nLm9yaWdpbmFsTGluZSA9IHNyY01hcHBpbmcub3JpZ2luYWxMaW5lO1xuICAgICAgICBkZXN0TWFwcGluZy5vcmlnaW5hbENvbHVtbiA9IHNyY01hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgaWYgKHNyY01hcHBpbmcubmFtZSkge1xuICAgICAgICAgIGRlc3RNYXBwaW5nLm5hbWUgPSBuYW1lcy5pbmRleE9mKHNyY01hcHBpbmcubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXN0T3JpZ2luYWxNYXBwaW5ncy5wdXNoKGRlc3RNYXBwaW5nKTtcbiAgICAgIH1cblxuICAgICAgZGVzdEdlbmVyYXRlZE1hcHBpbmdzLnB1c2goZGVzdE1hcHBpbmcpO1xuICAgIH1cblxuICAgIHF1aWNrU29ydChzbWMuX19vcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcblxuICAgIHJldHVybiBzbWM7XG4gIH07XG5cbi8qKlxuICogVGhlIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXBwaW5nIHNwZWMgdGhhdCB3ZSBhcmUgY29uc3VtaW5nLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogVGhlIGxpc3Qgb2Ygb3JpZ2luYWwgc291cmNlcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLCAnc291cmNlcycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvdXJjZXMudG9BcnJheSgpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlUm9vdCAhPSBudWxsID8gdXRpbC5qb2luKHRoaXMuc291cmNlUm9vdCwgcykgOiBzO1xuICAgIH0sIHRoaXMpO1xuICB9XG59KTtcblxuLyoqXG4gKiBQcm92aWRlIHRoZSBKSVQgd2l0aCBhIG5pY2Ugc2hhcGUgLyBoaWRkZW4gY2xhc3MuXG4gKi9cbmZ1bmN0aW9uIE1hcHBpbmcoKSB7XG4gIHRoaXMuZ2VuZXJhdGVkTGluZSA9IDA7XG4gIHRoaXMuZ2VuZXJhdGVkQ29sdW1uID0gMDtcbiAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICB0aGlzLm9yaWdpbmFsTGluZSA9IG51bGw7XG4gIHRoaXMub3JpZ2luYWxDb2x1bW4gPSBudWxsO1xuICB0aGlzLm5hbWUgPSBudWxsO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBtYXBwaW5ncyBpbiBhIHN0cmluZyBpbiB0byBhIGRhdGEgc3RydWN0dXJlIHdoaWNoIHdlIGNhbiBlYXNpbHlcbiAqIHF1ZXJ5ICh0aGUgb3JkZXJlZCBhcnJheXMgaW4gdGhlIGB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3NgIGFuZFxuICogYHRoaXMuX19vcmlnaW5hbE1hcHBpbmdzYCBwcm9wZXJ0aWVzKS5cbiAqL1xuQmFzaWNTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUuX3BhcnNlTWFwcGluZ3MgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9wYXJzZU1hcHBpbmdzKGFTdHIsIGFTb3VyY2VSb290KSB7XG4gICAgdmFyIGdlbmVyYXRlZExpbmUgPSAxO1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gMDtcbiAgICB2YXIgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzU291cmNlID0gMDtcbiAgICB2YXIgcHJldmlvdXNOYW1lID0gMDtcbiAgICB2YXIgbGVuZ3RoID0gYVN0ci5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY2FjaGVkU2VnbWVudHMgPSB7fTtcbiAgICB2YXIgdGVtcCA9IHt9O1xuICAgIHZhciBvcmlnaW5hbE1hcHBpbmdzID0gW107XG4gICAgdmFyIGdlbmVyYXRlZE1hcHBpbmdzID0gW107XG4gICAgdmFyIG1hcHBpbmcsIHN0ciwgc2VnbWVudCwgZW5kLCB2YWx1ZTtcblxuICAgIHdoaWxlIChpbmRleCA8IGxlbmd0aCkge1xuICAgICAgaWYgKGFTdHIuY2hhckF0KGluZGV4KSA9PT0gJzsnKSB7XG4gICAgICAgIGdlbmVyYXRlZExpbmUrKztcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoYVN0ci5jaGFyQXQoaW5kZXgpID09PSAnLCcpIHtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBtYXBwaW5nID0gbmV3IE1hcHBpbmcoKTtcbiAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWRMaW5lID0gZ2VuZXJhdGVkTGluZTtcblxuICAgICAgICAvLyBCZWNhdXNlIGVhY2ggb2Zmc2V0IGlzIGVuY29kZWQgcmVsYXRpdmUgdG8gdGhlIHByZXZpb3VzIG9uZSxcbiAgICAgICAgLy8gbWFueSBzZWdtZW50cyBvZnRlbiBoYXZlIHRoZSBzYW1lIGVuY29kaW5nLiBXZSBjYW4gZXhwbG9pdCB0aGlzXG4gICAgICAgIC8vIGZhY3QgYnkgY2FjaGluZyB0aGUgcGFyc2VkIHZhcmlhYmxlIGxlbmd0aCBmaWVsZHMgb2YgZWFjaCBzZWdtZW50LFxuICAgICAgICAvLyBhbGxvd2luZyB1cyB0byBhdm9pZCBhIHNlY29uZCBwYXJzZSBpZiB3ZSBlbmNvdW50ZXIgdGhlIHNhbWVcbiAgICAgICAgLy8gc2VnbWVudCBhZ2Fpbi5cbiAgICAgICAgZm9yIChlbmQgPSBpbmRleDsgZW5kIDwgbGVuZ3RoOyBlbmQrKykge1xuICAgICAgICAgIGlmICh0aGlzLl9jaGFySXNNYXBwaW5nU2VwYXJhdG9yKGFTdHIsIGVuZCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdHIgPSBhU3RyLnNsaWNlKGluZGV4LCBlbmQpO1xuXG4gICAgICAgIHNlZ21lbnQgPSBjYWNoZWRTZWdtZW50c1tzdHJdO1xuICAgICAgICBpZiAoc2VnbWVudCkge1xuICAgICAgICAgIGluZGV4ICs9IHN0ci5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VnbWVudCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChpbmRleCA8IGVuZCkge1xuICAgICAgICAgICAgYmFzZTY0VkxRLmRlY29kZShhU3RyLCBpbmRleCwgdGVtcCk7XG4gICAgICAgICAgICB2YWx1ZSA9IHRlbXAudmFsdWU7XG4gICAgICAgICAgICBpbmRleCA9IHRlbXAucmVzdDtcbiAgICAgICAgICAgIHNlZ21lbnQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIGEgc291cmNlLCBidXQgbm8gbGluZSBhbmQgY29sdW1uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZvdW5kIGEgc291cmNlIGFuZCBsaW5lLCBidXQgbm8gY29sdW1uJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FjaGVkU2VnbWVudHNbc3RyXSA9IHNlZ21lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZW5lcmF0ZWQgY29sdW1uLlxuICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbiA9IHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uICsgc2VnbWVudFswXTtcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSBtYXBwaW5nLmdlbmVyYXRlZENvbHVtbjtcblxuICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgLy8gT3JpZ2luYWwgc291cmNlLlxuICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gcHJldmlvdXNTb3VyY2UgKyBzZWdtZW50WzFdO1xuICAgICAgICAgIHByZXZpb3VzU291cmNlICs9IHNlZ21lbnRbMV07XG5cbiAgICAgICAgICAvLyBPcmlnaW5hbCBsaW5lLlxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID0gcHJldmlvdXNPcmlnaW5hbExpbmUgKyBzZWdtZW50WzJdO1xuICAgICAgICAgIHByZXZpb3VzT3JpZ2luYWxMaW5lID0gbWFwcGluZy5vcmlnaW5hbExpbmU7XG4gICAgICAgICAgLy8gTGluZXMgYXJlIHN0b3JlZCAwLWJhc2VkXG4gICAgICAgICAgbWFwcGluZy5vcmlnaW5hbExpbmUgKz0gMTtcblxuICAgICAgICAgIC8vIE9yaWdpbmFsIGNvbHVtbi5cbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gcHJldmlvdXNPcmlnaW5hbENvbHVtbiArIHNlZ21lbnRbM107XG4gICAgICAgICAgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgICBpZiAoc2VnbWVudC5sZW5ndGggPiA0KSB7XG4gICAgICAgICAgICAvLyBPcmlnaW5hbCBuYW1lLlxuICAgICAgICAgICAgbWFwcGluZy5uYW1lID0gcHJldmlvdXNOYW1lICsgc2VnbWVudFs0XTtcbiAgICAgICAgICAgIHByZXZpb3VzTmFtZSArPSBzZWdtZW50WzRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGdlbmVyYXRlZE1hcHBpbmdzLnB1c2gobWFwcGluZyk7XG4gICAgICAgIGlmICh0eXBlb2YgbWFwcGluZy5vcmlnaW5hbExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgb3JpZ2luYWxNYXBwaW5ncy5wdXNoKG1hcHBpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcXVpY2tTb3J0KGdlbmVyYXRlZE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKTtcbiAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBnZW5lcmF0ZWRNYXBwaW5ncztcblxuICAgIHF1aWNrU29ydChvcmlnaW5hbE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zKTtcbiAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncyA9IG9yaWdpbmFsTWFwcGluZ3M7XG4gIH07XG5cbi8qKlxuICogRmluZCB0aGUgbWFwcGluZyB0aGF0IGJlc3QgbWF0Y2hlcyB0aGUgaHlwb3RoZXRpY2FsIFwibmVlZGxlXCIgbWFwcGluZyB0aGF0XG4gKiB3ZSBhcmUgc2VhcmNoaW5nIGZvciBpbiB0aGUgZ2l2ZW4gXCJoYXlzdGFja1wiIG9mIG1hcHBpbmdzLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fZmluZE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9maW5kTWFwcGluZyhhTmVlZGxlLCBhTWFwcGluZ3MsIGFMaW5lTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYUNvbHVtbk5hbWUsIGFDb21wYXJhdG9yLCBhQmlhcykge1xuICAgIC8vIFRvIHJldHVybiB0aGUgcG9zaXRpb24gd2UgYXJlIHNlYXJjaGluZyBmb3IsIHdlIG11c3QgZmlyc3QgZmluZCB0aGVcbiAgICAvLyBtYXBwaW5nIGZvciB0aGUgZ2l2ZW4gcG9zaXRpb24gYW5kIHRoZW4gcmV0dXJuIHRoZSBvcHBvc2l0ZSBwb3NpdGlvbiBpdFxuICAgIC8vIHBvaW50cyB0by4gQmVjYXVzZSB0aGUgbWFwcGluZ3MgYXJlIHNvcnRlZCwgd2UgY2FuIHVzZSBiaW5hcnkgc2VhcmNoIHRvXG4gICAgLy8gZmluZCB0aGUgYmVzdCBtYXBwaW5nLlxuXG4gICAgaWYgKGFOZWVkbGVbYUxpbmVOYW1lXSA8PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdMaW5lIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDEsIGdvdCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYU5lZWRsZVthTGluZU5hbWVdKTtcbiAgICB9XG4gICAgaWYgKGFOZWVkbGVbYUNvbHVtbk5hbWVdIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ29sdW1uIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAsIGdvdCAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgYU5lZWRsZVthQ29sdW1uTmFtZV0pO1xuICAgIH1cblxuICAgIHJldHVybiBiaW5hcnlTZWFyY2guc2VhcmNoKGFOZWVkbGUsIGFNYXBwaW5ncywgYUNvbXBhcmF0b3IsIGFCaWFzKTtcbiAgfTtcblxuLyoqXG4gKiBDb21wdXRlIHRoZSBsYXN0IGNvbHVtbiBmb3IgZWFjaCBnZW5lcmF0ZWQgbWFwcGluZy4gVGhlIGxhc3QgY29sdW1uIGlzXG4gKiBpbmNsdXNpdmUuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmNvbXB1dGVDb2x1bW5TcGFucyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2NvbXB1dGVDb2x1bW5TcGFucygpIHtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3MubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgLy8gTWFwcGluZ3MgZG8gbm90IGNvbnRhaW4gYSBmaWVsZCBmb3IgdGhlIGxhc3QgZ2VuZXJhdGVkIGNvbHVtbnQuIFdlXG4gICAgICAvLyBjYW4gY29tZSB1cCB3aXRoIGFuIG9wdGltaXN0aWMgZXN0aW1hdGUsIGhvd2V2ZXIsIGJ5IGFzc3VtaW5nIHRoYXRcbiAgICAgIC8vIG1hcHBpbmdzIGFyZSBjb250aWd1b3VzIChpLmUuIGdpdmVuIHR3byBjb25zZWN1dGl2ZSBtYXBwaW5ncywgdGhlXG4gICAgICAvLyBmaXJzdCBtYXBwaW5nIGVuZHMgd2hlcmUgdGhlIHNlY29uZCBvbmUgc3RhcnRzKS5cbiAgICAgIGlmIChpbmRleCArIDEgPCB0aGlzLl9nZW5lcmF0ZWRNYXBwaW5ncy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG5leHRNYXBwaW5nID0gdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3NbaW5kZXggKyAxXTtcblxuICAgICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lID09PSBuZXh0TWFwcGluZy5nZW5lcmF0ZWRMaW5lKSB7XG4gICAgICAgICAgbWFwcGluZy5sYXN0R2VuZXJhdGVkQ29sdW1uID0gbmV4dE1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uIC0gMTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgbGFzdCBtYXBwaW5nIGZvciBlYWNoIGxpbmUgc3BhbnMgdGhlIGVudGlyZSBsaW5lLlxuICAgICAgbWFwcGluZy5sYXN0R2VuZXJhdGVkQ29sdW1uID0gSW5maW5pdHk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSwgbGluZSwgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdlbmVyYXRlZFxuICogc291cmNlJ3MgbGluZSBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0XG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gbGluZTogVGhlIGxpbmUgbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLiAgVGhlIGxpbmUgbnVtYmVyXG4gKiAgICAgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBnZW5lcmF0ZWQgc291cmNlLiAgVGhlIGNvbHVtblxuICogICAgIG51bWJlciBpcyAwLWJhc2VkLlxuICogICAtIGJpYXM6IEVpdGhlciAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ1NvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqICAgICBEZWZhdWx0cyB0byAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlLCBvciBudWxsLlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgbGluZSBudW1iZXIgaXMgMS1iYXNlZC5cbiAqICAgLSBjb2x1bW46IFRoZSBjb2x1bW4gbnVtYmVyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2UsIG9yIG51bGwuICBUaGVcbiAqICAgICBjb2x1bW4gbnVtYmVyIGlzIDAtYmFzZWQuXG4gKiAgIC0gbmFtZTogVGhlIG9yaWdpbmFsIGlkZW50aWZpZXIsIG9yIG51bGwuXG4gKi9cbkJhc2ljU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLm9yaWdpbmFsUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBDb25zdW1lcl9vcmlnaW5hbFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbGluZScpLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKFxuICAgICAgbmVlZGxlLFxuICAgICAgdGhpcy5fZ2VuZXJhdGVkTWFwcGluZ3MsXG4gICAgICBcImdlbmVyYXRlZExpbmVcIixcbiAgICAgIFwiZ2VuZXJhdGVkQ29sdW1uXCIsXG4gICAgICB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkLFxuICAgICAgdXRpbC5nZXRBcmcoYUFyZ3MsICdiaWFzJywgU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQpXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX2dlbmVyYXRlZE1hcHBpbmdzW2luZGV4XTtcblxuICAgICAgaWYgKG1hcHBpbmcuZ2VuZXJhdGVkTGluZSA9PT0gbmVlZGxlLmdlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdzb3VyY2UnLCBudWxsKTtcbiAgICAgICAgaWYgKHNvdXJjZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuYXQoc291cmNlKTtcbiAgICAgICAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHV0aWwuam9pbih0aGlzLnNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBuYW1lID0gdXRpbC5nZXRBcmcobWFwcGluZywgJ25hbWUnLCBudWxsKTtcbiAgICAgICAgaWYgKG5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICBuYW1lID0gdGhpcy5fbmFtZXMuYXQobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnb3JpZ2luYWxMaW5lJywgbnVsbCksXG4gICAgICAgICAgY29sdW1uOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnb3JpZ2luYWxDb2x1bW4nLCBudWxsKSxcbiAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgIGxpbmU6IG51bGwsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBuYW1lOiBudWxsXG4gICAgfTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB3ZSBoYXZlIHRoZSBzb3VyY2UgY29udGVudCBmb3IgZXZlcnkgc291cmNlIGluIHRoZSBzb3VyY2VcbiAqIG1hcCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5oYXNDb250ZW50c09mQWxsU291cmNlcyA9XG4gIGZ1bmN0aW9uIEJhc2ljU291cmNlTWFwQ29uc3VtZXJfaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXNDb250ZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50Lmxlbmd0aCA+PSB0aGlzLl9zb3VyY2VzLnNpemUoKSAmJlxuICAgICAgIXRoaXMuc291cmNlc0NvbnRlbnQuc29tZShmdW5jdGlvbiAoc2MpIHsgcmV0dXJuIHNjID09IG51bGw7IH0pO1xuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG9yaWdpbmFsIHNvdXJjZSBjb250ZW50LiBUaGUgb25seSBhcmd1bWVudCBpcyB0aGUgdXJsIG9mIHRoZVxuICogb3JpZ2luYWwgc291cmNlIGZpbGUuIFJldHVybnMgbnVsbCBpZiBubyBvcmlnaW5hbCBzb3VyY2UgY29udGVudCBpc1xuICogYXZhaWxhYmxlLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yID1cbiAgZnVuY3Rpb24gU291cmNlTWFwQ29uc3VtZXJfc291cmNlQ29udGVudEZvcihhU291cmNlLCBudWxsT25NaXNzaW5nKSB7XG4gICAgaWYgKCF0aGlzLnNvdXJjZXNDb250ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIGFTb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgYVNvdXJjZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NvdXJjZXMuaGFzKGFTb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VzQ29udGVudFt0aGlzLl9zb3VyY2VzLmluZGV4T2YoYVNvdXJjZSldO1xuICAgIH1cblxuICAgIHZhciB1cmw7XG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsXG4gICAgICAgICYmICh1cmwgPSB1dGlsLnVybFBhcnNlKHRoaXMuc291cmNlUm9vdCkpKSB7XG4gICAgICAvLyBYWFg6IGZpbGU6Ly8gVVJJcyBhbmQgYWJzb2x1dGUgcGF0aHMgbGVhZCB0byB1bmV4cGVjdGVkIGJlaGF2aW9yIGZvclxuICAgICAgLy8gbWFueSB1c2Vycy4gV2UgY2FuIGhlbHAgdGhlbSBvdXQgd2hlbiB0aGV5IGV4cGVjdCBmaWxlOi8vIFVSSXMgdG9cbiAgICAgIC8vIGJlaGF2ZSBsaWtlIGl0IHdvdWxkIGlmIHRoZXkgd2VyZSBydW5uaW5nIGEgbG9jYWwgSFRUUCBzZXJ2ZXIuIFNlZVxuICAgICAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODg1NTk3LlxuICAgICAgdmFyIGZpbGVVcmlBYnNQYXRoID0gYVNvdXJjZS5yZXBsYWNlKC9eZmlsZTpcXC9cXC8vLCBcIlwiKTtcbiAgICAgIGlmICh1cmwuc2NoZW1lID09IFwiZmlsZVwiXG4gICAgICAgICAgJiYgdGhpcy5fc291cmNlcy5oYXMoZmlsZVVyaUFic1BhdGgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZXNDb250ZW50W3RoaXMuX3NvdXJjZXMuaW5kZXhPZihmaWxlVXJpQWJzUGF0aCldXG4gICAgICB9XG5cbiAgICAgIGlmICgoIXVybC5wYXRoIHx8IHVybC5wYXRoID09IFwiL1wiKVxuICAgICAgICAgICYmIHRoaXMuX3NvdXJjZXMuaGFzKFwiL1wiICsgYVNvdXJjZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlc0NvbnRlbnRbdGhpcy5fc291cmNlcy5pbmRleE9mKFwiL1wiICsgYVNvdXJjZSldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCByZWN1cnNpdmVseSBmcm9tXG4gICAgLy8gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yLiBJbiB0aGF0IGNhc2UsIHdlXG4gICAgLy8gZG9uJ3Qgd2FudCB0byB0aHJvdyBpZiB3ZSBjYW4ndCBmaW5kIHRoZSBzb3VyY2UgLSB3ZSBqdXN0IHdhbnQgdG9cbiAgICAvLyByZXR1cm4gbnVsbCwgc28gd2UgcHJvdmlkZSBhIGZsYWcgdG8gZXhpdCBncmFjZWZ1bGx5LlxuICAgIGlmIChudWxsT25NaXNzaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTb3VyY2UgKyAnXCIgaXMgbm90IGluIHRoZSBTb3VyY2VNYXAuJyk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBvcmlnaW5hbCBzb3VyY2UsXG4gKiBsaW5lLCBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0IHdpdGhcbiAqIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS4gIFRoZSBsaW5lIG51bWJlclxuICogICAgIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLiAgVGhlIGNvbHVtblxuICogICAgIG51bWJlciBpcyAwLWJhc2VkLlxuICogICAtIGJpYXM6IEVpdGhlciAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ1NvdXJjZU1hcENvbnN1bWVyLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqICAgICBEZWZhdWx0cyB0byAnU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQnLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC4gIFRoZVxuICogICAgIGxpbmUgbnVtYmVyIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC5cbiAqICAgICBUaGUgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICovXG5CYXNpY1NvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5nZW5lcmF0ZWRQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcENvbnN1bWVyX2dlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKSB7XG4gICAgdmFyIHNvdXJjZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnc291cmNlJyk7XG4gICAgaWYgKHRoaXMuc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBzb3VyY2UgPSB1dGlsLnJlbGF0aXZlKHRoaXMuc291cmNlUm9vdCwgc291cmNlKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9zb3VyY2VzLmhhcyhzb3VyY2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICBjb2x1bW46IG51bGwsXG4gICAgICAgIGxhc3RDb2x1bW46IG51bGxcbiAgICAgIH07XG4gICAgfVxuICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihzb3VyY2UpO1xuXG4gICAgdmFyIG5lZWRsZSA9IHtcbiAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgb3JpZ2luYWxMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIG9yaWdpbmFsQ29sdW1uOiB1dGlsLmdldEFyZyhhQXJncywgJ2NvbHVtbicpXG4gICAgfTtcblxuICAgIHZhciBpbmRleCA9IHRoaXMuX2ZpbmRNYXBwaW5nKFxuICAgICAgbmVlZGxlLFxuICAgICAgdGhpcy5fb3JpZ2luYWxNYXBwaW5ncyxcbiAgICAgIFwib3JpZ2luYWxMaW5lXCIsXG4gICAgICBcIm9yaWdpbmFsQ29sdW1uXCIsXG4gICAgICB1dGlsLmNvbXBhcmVCeU9yaWdpbmFsUG9zaXRpb25zLFxuICAgICAgdXRpbC5nZXRBcmcoYUFyZ3MsICdiaWFzJywgU291cmNlTWFwQ29uc3VtZXIuR1JFQVRFU1RfTE9XRVJfQk9VTkQpXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgbWFwcGluZyA9IHRoaXMuX29yaWdpbmFsTWFwcGluZ3NbaW5kZXhdO1xuXG4gICAgICBpZiAobWFwcGluZy5zb3VyY2UgPT09IG5lZWRsZS5zb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsaW5lOiB1dGlsLmdldEFyZyhtYXBwaW5nLCAnZ2VuZXJhdGVkTGluZScsIG51bGwpLFxuICAgICAgICAgIGNvbHVtbjogdXRpbC5nZXRBcmcobWFwcGluZywgJ2dlbmVyYXRlZENvbHVtbicsIG51bGwpLFxuICAgICAgICAgIGxhc3RDb2x1bW46IHV0aWwuZ2V0QXJnKG1hcHBpbmcsICdsYXN0R2VuZXJhdGVkQ29sdW1uJywgbnVsbClcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbnVsbCxcbiAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgIGxhc3RDb2x1bW46IG51bGxcbiAgICB9O1xuICB9O1xuXG5leHBvcnRzLkJhc2ljU291cmNlTWFwQ29uc3VtZXIgPSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIEFuIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lciBpbnN0YW5jZSByZXByZXNlbnRzIGEgcGFyc2VkIHNvdXJjZSBtYXAgd2hpY2hcbiAqIHdlIGNhbiBxdWVyeSBmb3IgaW5mb3JtYXRpb24uIEl0IGRpZmZlcnMgZnJvbSBCYXNpY1NvdXJjZU1hcENvbnN1bWVyIGluXG4gKiB0aGF0IGl0IHRha2VzIFwiaW5kZXhlZFwiIHNvdXJjZSBtYXBzIChpLmUuIG9uZXMgd2l0aCBhIFwic2VjdGlvbnNcIiBmaWVsZCkgYXNcbiAqIGlucHV0LlxuICpcbiAqIFRoZSBvbmx5IHBhcmFtZXRlciBpcyBhIHJhdyBzb3VyY2UgbWFwIChlaXRoZXIgYXMgYSBKU09OIHN0cmluZywgb3IgYWxyZWFkeVxuICogcGFyc2VkIHRvIGFuIG9iamVjdCkuIEFjY29yZGluZyB0byB0aGUgc3BlYyBmb3IgaW5kZXhlZCBzb3VyY2UgbWFwcywgdGhleVxuICogaGF2ZSB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXM6XG4gKlxuICogICAtIHZlcnNpb246IFdoaWNoIHZlcnNpb24gb2YgdGhlIHNvdXJjZSBtYXAgc3BlYyB0aGlzIG1hcCBpcyBmb2xsb3dpbmcuXG4gKiAgIC0gZmlsZTogT3B0aW9uYWwuIFRoZSBnZW5lcmF0ZWQgZmlsZSB0aGlzIHNvdXJjZSBtYXAgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICogICAtIHNlY3Rpb25zOiBBIGxpc3Qgb2Ygc2VjdGlvbiBkZWZpbml0aW9ucy5cbiAqXG4gKiBFYWNoIHZhbHVlIHVuZGVyIHRoZSBcInNlY3Rpb25zXCIgZmllbGQgaGFzIHR3byBmaWVsZHM6XG4gKiAgIC0gb2Zmc2V0OiBUaGUgb2Zmc2V0IGludG8gdGhlIG9yaWdpbmFsIHNwZWNpZmllZCBhdCB3aGljaCB0aGlzIHNlY3Rpb25cbiAqICAgICAgIGJlZ2lucyB0byBhcHBseSwgZGVmaW5lZCBhcyBhbiBvYmplY3Qgd2l0aCBhIFwibGluZVwiIGFuZCBcImNvbHVtblwiXG4gKiAgICAgICBmaWVsZC5cbiAqICAgLSBtYXA6IEEgc291cmNlIG1hcCBkZWZpbml0aW9uLiBUaGlzIHNvdXJjZSBtYXAgY291bGQgYWxzbyBiZSBpbmRleGVkLFxuICogICAgICAgYnV0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbiAqXG4gKiBJbnN0ZWFkIG9mIHRoZSBcIm1hcFwiIGZpZWxkLCBpdCdzIGFsc28gcG9zc2libGUgdG8gaGF2ZSBhIFwidXJsXCIgZmllbGRcbiAqIHNwZWNpZnlpbmcgYSBVUkwgdG8gcmV0cmlldmUgYSBzb3VyY2UgbWFwIGZyb20sIGJ1dCB0aGF0J3MgY3VycmVudGx5XG4gKiB1bnN1cHBvcnRlZC5cbiAqXG4gKiBIZXJlJ3MgYW4gZXhhbXBsZSBzb3VyY2UgbWFwLCB0YWtlbiBmcm9tIHRoZSBzb3VyY2UgbWFwIHNwZWNbMF0sIGJ1dFxuICogbW9kaWZpZWQgdG8gb21pdCBhIHNlY3Rpb24gd2hpY2ggdXNlcyB0aGUgXCJ1cmxcIiBmaWVsZC5cbiAqXG4gKiAge1xuICogICAgdmVyc2lvbiA6IDMsXG4gKiAgICBmaWxlOiBcImFwcC5qc1wiLFxuICogICAgc2VjdGlvbnM6IFt7XG4gKiAgICAgIG9mZnNldDoge2xpbmU6MTAwLCBjb2x1bW46MTB9LFxuICogICAgICBtYXA6IHtcbiAqICAgICAgICB2ZXJzaW9uIDogMyxcbiAqICAgICAgICBmaWxlOiBcInNlY3Rpb24uanNcIixcbiAqICAgICAgICBzb3VyY2VzOiBbXCJmb28uanNcIiwgXCJiYXIuanNcIl0sXG4gKiAgICAgICAgbmFtZXM6IFtcInNyY1wiLCBcIm1hcHNcIiwgXCJhcmVcIiwgXCJmdW5cIl0sXG4gKiAgICAgICAgbWFwcGluZ3M6IFwiQUFBQSxFOztBQkNERTtcIlxuICogICAgICB9XG4gKiAgICB9XSxcbiAqICB9XG4gKlxuICogWzBdOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFVMVJHQWVoUXdSeXBVVG92RjFLUmxwaU9GemUwYi1fMmdjNmZBSDBLWTBrL2VkaXQjaGVhZGluZz1oLjUzNWVzM3hlcHJndFxuICovXG5mdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXIoYVNvdXJjZU1hcCkge1xuICB2YXIgc291cmNlTWFwID0gYVNvdXJjZU1hcDtcbiAgaWYgKHR5cGVvZiBhU291cmNlTWFwID09PSAnc3RyaW5nJykge1xuICAgIHNvdXJjZU1hcCA9IEpTT04ucGFyc2UoYVNvdXJjZU1hcC5yZXBsYWNlKC9eXFwpXFxdXFx9Jy8sICcnKSk7XG4gIH1cblxuICB2YXIgdmVyc2lvbiA9IHV0aWwuZ2V0QXJnKHNvdXJjZU1hcCwgJ3ZlcnNpb24nKTtcbiAgdmFyIHNlY3Rpb25zID0gdXRpbC5nZXRBcmcoc291cmNlTWFwLCAnc2VjdGlvbnMnKTtcblxuICBpZiAodmVyc2lvbiAhPSB0aGlzLl92ZXJzaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XG4gIH1cblxuICB0aGlzLl9zb3VyY2VzID0gbmV3IEFycmF5U2V0KCk7XG4gIHRoaXMuX25hbWVzID0gbmV3IEFycmF5U2V0KCk7XG5cbiAgdmFyIGxhc3RPZmZzZXQgPSB7XG4gICAgbGluZTogLTEsXG4gICAgY29sdW1uOiAwXG4gIH07XG4gIHRoaXMuX3NlY3Rpb25zID0gc2VjdGlvbnMubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHMudXJsKSB7XG4gICAgICAvLyBUaGUgdXJsIGZpZWxkIHdpbGwgcmVxdWlyZSBzdXBwb3J0IGZvciBhc3luY2hyb25pY2l0eS5cbiAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbW96aWxsYS9zb3VyY2UtbWFwL2lzc3Vlcy8xNlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdXBwb3J0IGZvciB1cmwgZmllbGQgaW4gc2VjdGlvbnMgbm90IGltcGxlbWVudGVkLicpO1xuICAgIH1cbiAgICB2YXIgb2Zmc2V0ID0gdXRpbC5nZXRBcmcocywgJ29mZnNldCcpO1xuICAgIHZhciBvZmZzZXRMaW5lID0gdXRpbC5nZXRBcmcob2Zmc2V0LCAnbGluZScpO1xuICAgIHZhciBvZmZzZXRDb2x1bW4gPSB1dGlsLmdldEFyZyhvZmZzZXQsICdjb2x1bW4nKTtcblxuICAgIGlmIChvZmZzZXRMaW5lIDwgbGFzdE9mZnNldC5saW5lIHx8XG4gICAgICAgIChvZmZzZXRMaW5lID09PSBsYXN0T2Zmc2V0LmxpbmUgJiYgb2Zmc2V0Q29sdW1uIDwgbGFzdE9mZnNldC5jb2x1bW4pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlY3Rpb24gb2Zmc2V0cyBtdXN0IGJlIG9yZGVyZWQgYW5kIG5vbi1vdmVybGFwcGluZy4nKTtcbiAgICB9XG4gICAgbGFzdE9mZnNldCA9IG9mZnNldDtcblxuICAgIHJldHVybiB7XG4gICAgICBnZW5lcmF0ZWRPZmZzZXQ6IHtcbiAgICAgICAgLy8gVGhlIG9mZnNldCBmaWVsZHMgYXJlIDAtYmFzZWQsIGJ1dCB3ZSB1c2UgMS1iYXNlZCBpbmRpY2VzIHdoZW5cbiAgICAgICAgLy8gZW5jb2RpbmcvZGVjb2RpbmcgZnJvbSBWTFEuXG4gICAgICAgIGdlbmVyYXRlZExpbmU6IG9mZnNldExpbmUgKyAxLFxuICAgICAgICBnZW5lcmF0ZWRDb2x1bW46IG9mZnNldENvbHVtbiArIDFcbiAgICAgIH0sXG4gICAgICBjb25zdW1lcjogbmV3IFNvdXJjZU1hcENvbnN1bWVyKHV0aWwuZ2V0QXJnKHMsICdtYXAnKSlcbiAgICB9XG4gIH0pO1xufVxuXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUpO1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNvdXJjZU1hcENvbnN1bWVyO1xuXG4vKipcbiAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBzb3VyY2UgbWFwcGluZyBzcGVjIHRoYXQgd2UgYXJlIGNvbnN1bWluZy5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5fdmVyc2lvbiA9IDM7XG5cbi8qKlxuICogVGhlIGxpc3Qgb2Ygb3JpZ2luYWwgc291cmNlcy5cbiAqL1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lci5wcm90b3R5cGUsICdzb3VyY2VzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fc2VjdGlvbnNbaV0uY29uc3VtZXIuc291cmNlcy5sZW5ndGg7IGorKykge1xuICAgICAgICBzb3VyY2VzLnB1c2godGhpcy5fc2VjdGlvbnNbaV0uY29uc3VtZXIuc291cmNlc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VzO1xuICB9XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UsIGxpbmUsIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnZW5lcmF0ZWRcbiAqIHNvdXJjZSdzIGxpbmUgYW5kIGNvbHVtbiBwb3NpdGlvbnMgcHJvdmlkZWQuIFRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICogd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS4gIFRoZSBsaW5lIG51bWJlclxuICogICAgIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZS4gIFRoZSBjb2x1bW5cbiAqICAgICBudW1iZXIgaXMgMC1iYXNlZC5cbiAqXG4gKiBhbmQgYW4gb2JqZWN0IGlzIHJldHVybmVkIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBzb3VyY2U6IFRoZSBvcmlnaW5hbCBzb3VyY2UgZmlsZSwgb3IgbnVsbC5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZSwgb3IgbnVsbC4gIFRoZVxuICogICAgIGxpbmUgbnVtYmVyIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLCBvciBudWxsLiAgVGhlXG4gKiAgICAgY29sdW1uIG51bWJlciBpcyAwLWJhc2VkLlxuICogICAtIG5hbWU6IFRoZSBvcmlnaW5hbCBpZGVudGlmaWVyLCBvciBudWxsLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLm9yaWdpbmFsUG9zaXRpb25Gb3IgPVxuICBmdW5jdGlvbiBJbmRleGVkU291cmNlTWFwQ29uc3VtZXJfb3JpZ2luYWxQb3NpdGlvbkZvcihhQXJncykge1xuICAgIHZhciBuZWVkbGUgPSB7XG4gICAgICBnZW5lcmF0ZWRMaW5lOiB1dGlsLmdldEFyZyhhQXJncywgJ2xpbmUnKSxcbiAgICAgIGdlbmVyYXRlZENvbHVtbjogdXRpbC5nZXRBcmcoYUFyZ3MsICdjb2x1bW4nKVxuICAgIH07XG5cbiAgICAvLyBGaW5kIHRoZSBzZWN0aW9uIGNvbnRhaW5pbmcgdGhlIGdlbmVyYXRlZCBwb3NpdGlvbiB3ZSdyZSB0cnlpbmcgdG8gbWFwXG4gICAgLy8gdG8gYW4gb3JpZ2luYWwgcG9zaXRpb24uXG4gICAgdmFyIHNlY3Rpb25JbmRleCA9IGJpbmFyeVNlYXJjaC5zZWFyY2gobmVlZGxlLCB0aGlzLl9zZWN0aW9ucyxcbiAgICAgIGZ1bmN0aW9uKG5lZWRsZSwgc2VjdGlvbikge1xuICAgICAgICB2YXIgY21wID0gbmVlZGxlLmdlbmVyYXRlZExpbmUgLSBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lO1xuICAgICAgICBpZiAoY21wKSB7XG4gICAgICAgICAgcmV0dXJuIGNtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAobmVlZGxlLmdlbmVyYXRlZENvbHVtbiAtXG4gICAgICAgICAgICAgICAgc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgIH0pO1xuICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblxuICAgIGlmICghc2VjdGlvbikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICBsaW5lOiBudWxsLFxuICAgICAgICBjb2x1bW46IG51bGwsXG4gICAgICAgIG5hbWU6IG51bGxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb24uY29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7XG4gICAgICBsaW5lOiBuZWVkbGUuZ2VuZXJhdGVkTGluZSAtXG4gICAgICAgIChzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRMaW5lIC0gMSksXG4gICAgICBjb2x1bW46IG5lZWRsZS5nZW5lcmF0ZWRDb2x1bW4gLVxuICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gbmVlZGxlLmdlbmVyYXRlZExpbmVcbiAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgOiAwKSxcbiAgICAgIGJpYXM6IGFBcmdzLmJpYXNcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB3ZSBoYXZlIHRoZSBzb3VyY2UgY29udGVudCBmb3IgZXZlcnkgc291cmNlIGluIHRoZSBzb3VyY2VcbiAqIG1hcCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLmhhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX2hhc0NvbnRlbnRzT2ZBbGxTb3VyY2VzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWN0aW9ucy5ldmVyeShmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMuY29uc3VtZXIuaGFzQ29udGVudHNPZkFsbFNvdXJjZXMoKTtcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzb3VyY2UgY29udGVudC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgdGhlIHVybCBvZiB0aGVcbiAqIG9yaWdpbmFsIHNvdXJjZSBmaWxlLiBSZXR1cm5zIG51bGwgaWYgbm8gb3JpZ2luYWwgc291cmNlIGNvbnRlbnQgaXNcbiAqIGF2YWlsYWJsZS5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5zb3VyY2VDb250ZW50Rm9yID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX3NvdXJjZUNvbnRlbnRGb3IoYVNvdXJjZSwgbnVsbE9uTWlzc2luZykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG5cbiAgICAgIHZhciBjb250ZW50ID0gc2VjdGlvbi5jb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKGFTb3VyY2UsIHRydWUpO1xuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChudWxsT25NaXNzaW5nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTb3VyY2UgKyAnXCIgaXMgbm90IGluIHRoZSBTb3VyY2VNYXAuJyk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBvcmlnaW5hbCBzb3VyY2UsXG4gKiBsaW5lLCBhbmQgY29sdW1uIHBvc2l0aW9ucyBwcm92aWRlZC4gVGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gb2JqZWN0IHdpdGhcbiAqIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gc291cmNlOiBUaGUgZmlsZW5hbWUgb2YgdGhlIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgLSBsaW5lOiBUaGUgbGluZSBudW1iZXIgaW4gdGhlIG9yaWdpbmFsIHNvdXJjZS4gIFRoZSBsaW5lIG51bWJlclxuICogICAgIGlzIDEtYmFzZWQuXG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIG51bWJlciBpbiB0aGUgb3JpZ2luYWwgc291cmNlLiAgVGhlIGNvbHVtblxuICogICAgIG51bWJlciBpcyAwLWJhc2VkLlxuICpcbiAqIGFuZCBhbiBvYmplY3QgaXMgcmV0dXJuZWQgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGxpbmU6IFRoZSBsaW5lIG51bWJlciBpbiB0aGUgZ2VuZXJhdGVkIHNvdXJjZSwgb3IgbnVsbC4gIFRoZVxuICogICAgIGxpbmUgbnVtYmVyIGlzIDEtYmFzZWQuIFxuICogICAtIGNvbHVtbjogVGhlIGNvbHVtbiBudW1iZXIgaW4gdGhlIGdlbmVyYXRlZCBzb3VyY2UsIG9yIG51bGwuXG4gKiAgICAgVGhlIGNvbHVtbiBudW1iZXIgaXMgMC1iYXNlZC5cbiAqL1xuSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyLnByb3RvdHlwZS5nZW5lcmF0ZWRQb3NpdGlvbkZvciA9XG4gIGZ1bmN0aW9uIEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcl9nZW5lcmF0ZWRQb3NpdGlvbkZvcihhQXJncykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG5cbiAgICAgIC8vIE9ubHkgY29uc2lkZXIgdGhpcyBzZWN0aW9uIGlmIHRoZSByZXF1ZXN0ZWQgc291cmNlIGlzIGluIHRoZSBsaXN0IG9mXG4gICAgICAvLyBzb3VyY2VzIG9mIHRoZSBjb25zdW1lci5cbiAgICAgIGlmIChzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZXMuaW5kZXhPZih1dGlsLmdldEFyZyhhQXJncywgJ3NvdXJjZScpKSA9PT0gLTEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgZ2VuZXJhdGVkUG9zaXRpb24gPSBzZWN0aW9uLmNvbnN1bWVyLmdlbmVyYXRlZFBvc2l0aW9uRm9yKGFBcmdzKTtcbiAgICAgIGlmIChnZW5lcmF0ZWRQb3NpdGlvbikge1xuICAgICAgICB2YXIgcmV0ID0ge1xuICAgICAgICAgIGxpbmU6IGdlbmVyYXRlZFBvc2l0aW9uLmxpbmUgK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgLSAxKSxcbiAgICAgICAgICBjb2x1bW46IGdlbmVyYXRlZFBvc2l0aW9uLmNvbHVtbiArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSA9PT0gZ2VuZXJhdGVkUG9zaXRpb24ubGluZVxuICAgICAgICAgICAgID8gc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkQ29sdW1uIC0gMVxuICAgICAgICAgICAgIDogMClcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZTogbnVsbCxcbiAgICAgIGNvbHVtbjogbnVsbFxuICAgIH07XG4gIH07XG5cbi8qKlxuICogUGFyc2UgdGhlIG1hcHBpbmdzIGluIGEgc3RyaW5nIGluIHRvIGEgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggd2UgY2FuIGVhc2lseVxuICogcXVlcnkgKHRoZSBvcmRlcmVkIGFycmF5cyBpbiB0aGUgYHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5nc2AgYW5kXG4gKiBgdGhpcy5fX29yaWdpbmFsTWFwcGluZ3NgIHByb3BlcnRpZXMpLlxuICovXG5JbmRleGVkU291cmNlTWFwQ29uc3VtZXIucHJvdG90eXBlLl9wYXJzZU1hcHBpbmdzID1cbiAgZnVuY3Rpb24gSW5kZXhlZFNvdXJjZU1hcENvbnN1bWVyX3BhcnNlTWFwcGluZ3MoYVN0ciwgYVNvdXJjZVJvb3QpIHtcbiAgICB0aGlzLl9fZ2VuZXJhdGVkTWFwcGluZ3MgPSBbXTtcbiAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc2VjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzZWN0aW9uID0gdGhpcy5fc2VjdGlvbnNbaV07XG4gICAgICB2YXIgc2VjdGlvbk1hcHBpbmdzID0gc2VjdGlvbi5jb25zdW1lci5fZ2VuZXJhdGVkTWFwcGluZ3M7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlY3Rpb25NYXBwaW5ncy5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgbWFwcGluZyA9IHNlY3Rpb25NYXBwaW5nc1tqXTtcblxuICAgICAgICB2YXIgc291cmNlID0gc2VjdGlvbi5jb25zdW1lci5fc291cmNlcy5hdChtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIGlmIChzZWN0aW9uLmNvbnN1bWVyLnNvdXJjZVJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2UgPSB1dGlsLmpvaW4oc2VjdGlvbi5jb25zdW1lci5zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NvdXJjZXMuYWRkKHNvdXJjZSk7XG4gICAgICAgIHNvdXJjZSA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihzb3VyY2UpO1xuXG4gICAgICAgIHZhciBuYW1lID0gc2VjdGlvbi5jb25zdW1lci5fbmFtZXMuYXQobWFwcGluZy5uYW1lKTtcbiAgICAgICAgdGhpcy5fbmFtZXMuYWRkKG5hbWUpO1xuICAgICAgICBuYW1lID0gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKTtcblxuICAgICAgICAvLyBUaGUgbWFwcGluZ3MgY29taW5nIGZyb20gdGhlIGNvbnN1bWVyIGZvciB0aGUgc2VjdGlvbiBoYXZlXG4gICAgICAgIC8vIGdlbmVyYXRlZCBwb3NpdGlvbnMgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBzZWN0aW9uLCBzbyB3ZVxuICAgICAgICAvLyBuZWVkIHRvIG9mZnNldCB0aGVtIHRvIGJlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgY29uY2F0ZW5hdGVkXG4gICAgICAgIC8vIGdlbmVyYXRlZCBmaWxlLlxuICAgICAgICB2YXIgYWRqdXN0ZWRNYXBwaW5nID0ge1xuICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgIGdlbmVyYXRlZExpbmU6IG1hcHBpbmcuZ2VuZXJhdGVkTGluZSArXG4gICAgICAgICAgICAoc2VjdGlvbi5nZW5lcmF0ZWRPZmZzZXQuZ2VuZXJhdGVkTGluZSAtIDEpLFxuICAgICAgICAgIGdlbmVyYXRlZENvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW4gK1xuICAgICAgICAgICAgKHNlY3Rpb24uZ2VuZXJhdGVkT2Zmc2V0LmdlbmVyYXRlZExpbmUgPT09IG1hcHBpbmcuZ2VuZXJhdGVkTGluZVxuICAgICAgICAgICAgPyBzZWN0aW9uLmdlbmVyYXRlZE9mZnNldC5nZW5lcmF0ZWRDb2x1bW4gLSAxXG4gICAgICAgICAgICA6IDApLFxuICAgICAgICAgIG9yaWdpbmFsTGluZTogbWFwcGluZy5vcmlnaW5hbExpbmUsXG4gICAgICAgICAgb3JpZ2luYWxDb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW4sXG4gICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX19nZW5lcmF0ZWRNYXBwaW5ncy5wdXNoKGFkanVzdGVkTWFwcGluZyk7XG4gICAgICAgIGlmICh0eXBlb2YgYWRqdXN0ZWRNYXBwaW5nLm9yaWdpbmFsTGluZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aGlzLl9fb3JpZ2luYWxNYXBwaW5ncy5wdXNoKGFkanVzdGVkTWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBxdWlja1NvcnQodGhpcy5fX2dlbmVyYXRlZE1hcHBpbmdzLCB1dGlsLmNvbXBhcmVCeUdlbmVyYXRlZFBvc2l0aW9uc0RlZmxhdGVkKTtcbiAgICBxdWlja1NvcnQodGhpcy5fX29yaWdpbmFsTWFwcGluZ3MsIHV0aWwuY29tcGFyZUJ5T3JpZ2luYWxQb3NpdGlvbnMpO1xuICB9O1xuXG5leHBvcnRzLkluZGV4ZWRTb3VyY2VNYXBDb25zdW1lciA9IEluZGV4ZWRTb3VyY2VNYXBDb25zdW1lcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL3NvdXJjZS1tYXAtY29uc3VtZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG5leHBvcnRzLkdSRUFURVNUX0xPV0VSX0JPVU5EID0gMTtcbmV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQgPSAyO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZSBpbXBsZW1lbnRhdGlvbiBvZiBiaW5hcnkgc2VhcmNoLlxuICpcbiAqIEBwYXJhbSBhTG93IEluZGljZXMgaGVyZSBhbmQgbG93ZXIgZG8gbm90IGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAqIEBwYXJhbSBhSGlnaCBJbmRpY2VzIGhlcmUgYW5kIGhpZ2hlciBkbyBub3QgY29udGFpbiB0aGUgbmVlZGxlLlxuICogQHBhcmFtIGFOZWVkbGUgVGhlIGVsZW1lbnQgYmVpbmcgc2VhcmNoZWQgZm9yLlxuICogQHBhcmFtIGFIYXlzdGFjayBUaGUgbm9uLWVtcHR5IGFycmF5IGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEZ1bmN0aW9uIHdoaWNoIHRha2VzIHR3byBlbGVtZW50cyBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMS5cbiAqIEBwYXJhbSBhQmlhcyBFaXRoZXIgJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcgb3JcbiAqICAgICAnYmluYXJ5U2VhcmNoLkxFQVNUX1VQUEVSX0JPVU5EJy4gU3BlY2lmaWVzIHdoZXRoZXIgdG8gcmV0dXJuIHRoZVxuICogICAgIGNsb3Nlc3QgZWxlbWVudCB0aGF0IGlzIHNtYWxsZXIgdGhhbiBvciBncmVhdGVyIHRoYW4gdGhlIG9uZSB3ZSBhcmVcbiAqICAgICBzZWFyY2hpbmcgZm9yLCByZXNwZWN0aXZlbHksIGlmIHRoZSBleGFjdCBlbGVtZW50IGNhbm5vdCBiZSBmb3VuZC5cbiAqL1xuZnVuY3Rpb24gcmVjdXJzaXZlU2VhcmNoKGFMb3csIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcykge1xuICAvLyBUaGlzIGZ1bmN0aW9uIHRlcm1pbmF0ZXMgd2hlbiBvbmUgb2YgdGhlIGZvbGxvd2luZyBpcyB0cnVlOlxuICAvL1xuICAvLyAgIDEuIFdlIGZpbmQgdGhlIGV4YWN0IGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAvL1xuICAvLyAgIDIuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYnV0IHdlIGNhbiByZXR1cm4gdGhlIGluZGV4IG9mXG4gIC8vICAgICAgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50LlxuICAvL1xuICAvLyAgIDMuIFdlIGRpZCBub3QgZmluZCB0aGUgZXhhY3QgZWxlbWVudCwgYW5kIHRoZXJlIGlzIG5vIG5leHQtY2xvc2VzdFxuICAvLyAgICAgIGVsZW1lbnQgdGhhbiB0aGUgb25lIHdlIGFyZSBzZWFyY2hpbmcgZm9yLCBzbyB3ZSByZXR1cm4gLTEuXG4gIHZhciBtaWQgPSBNYXRoLmZsb29yKChhSGlnaCAtIGFMb3cpIC8gMikgKyBhTG93O1xuICB2YXIgY21wID0gYUNvbXBhcmUoYU5lZWRsZSwgYUhheXN0YWNrW21pZF0sIHRydWUpO1xuICBpZiAoY21wID09PSAwKSB7XG4gICAgLy8gRm91bmQgdGhlIGVsZW1lbnQgd2UgYXJlIGxvb2tpbmcgZm9yLlxuICAgIHJldHVybiBtaWQ7XG4gIH1cbiAgZWxzZSBpZiAoY21wID4gMCkge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgZ3JlYXRlciB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChhSGlnaCAtIG1pZCA+IDEpIHtcbiAgICAgIC8vIFRoZSBlbGVtZW50IGlzIGluIHRoZSB1cHBlciBoYWxmLlxuICAgICAgcmV0dXJuIHJlY3Vyc2l2ZVNlYXJjaChtaWQsIGFIaWdoLCBhTmVlZGxlLCBhSGF5c3RhY2ssIGFDb21wYXJlLCBhQmlhcyk7XG4gICAgfVxuXG4gICAgLy8gVGhlIGV4YWN0IG5lZWRsZSBlbGVtZW50IHdhcyBub3QgZm91bmQgaW4gdGhpcyBoYXlzdGFjay4gRGV0ZXJtaW5lIGlmXG4gICAgLy8gd2UgYXJlIGluIHRlcm1pbmF0aW9uIGNhc2UgKDMpIG9yICgyKSBhbmQgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSB0aGluZy5cbiAgICBpZiAoYUJpYXMgPT0gZXhwb3J0cy5MRUFTVF9VUFBFUl9CT1VORCkge1xuICAgICAgcmV0dXJuIGFIaWdoIDwgYUhheXN0YWNrLmxlbmd0aCA/IGFIaWdoIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIE91ciBuZWVkbGUgaXMgbGVzcyB0aGFuIGFIYXlzdGFja1ttaWRdLlxuICAgIGlmIChtaWQgLSBhTG93ID4gMSkge1xuICAgICAgLy8gVGhlIGVsZW1lbnQgaXMgaW4gdGhlIGxvd2VyIGhhbGYuXG4gICAgICByZXR1cm4gcmVjdXJzaXZlU2VhcmNoKGFMb3csIG1pZCwgYU5lZWRsZSwgYUhheXN0YWNrLCBhQ29tcGFyZSwgYUJpYXMpO1xuICAgIH1cblxuICAgIC8vIHdlIGFyZSBpbiB0ZXJtaW5hdGlvbiBjYXNlICgzKSBvciAoMikgYW5kIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgdGhpbmcuXG4gICAgaWYgKGFCaWFzID09IGV4cG9ydHMuTEVBU1RfVVBQRVJfQk9VTkQpIHtcbiAgICAgIHJldHVybiBtaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhTG93IDwgMCA/IC0xIDogYUxvdztcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFuIGltcGxlbWVudGF0aW9uIG9mIGJpbmFyeSBzZWFyY2ggd2hpY2ggd2lsbCBhbHdheXMgdHJ5IGFuZCByZXR1cm5cbiAqIHRoZSBpbmRleCBvZiB0aGUgY2xvc2VzdCBlbGVtZW50IGlmIHRoZXJlIGlzIG5vIGV4YWN0IGhpdC4gVGhpcyBpcyBiZWNhdXNlXG4gKiBtYXBwaW5ncyBiZXR3ZWVuIG9yaWdpbmFsIGFuZCBnZW5lcmF0ZWQgbGluZS9jb2wgcGFpcnMgYXJlIHNpbmdsZSBwb2ludHMsXG4gKiBhbmQgdGhlcmUgaXMgYW4gaW1wbGljaXQgcmVnaW9uIGJldHdlZW4gZWFjaCBvZiB0aGVtLCBzbyBhIG1pc3MganVzdCBtZWFuc1xuICogdGhhdCB5b3UgYXJlbid0IG9uIHRoZSB2ZXJ5IHN0YXJ0IG9mIGEgcmVnaW9uLlxuICpcbiAqIEBwYXJhbSBhTmVlZGxlIFRoZSBlbGVtZW50IHlvdSBhcmUgbG9va2luZyBmb3IuXG4gKiBAcGFyYW0gYUhheXN0YWNrIFRoZSBhcnJheSB0aGF0IGlzIGJlaW5nIHNlYXJjaGVkLlxuICogQHBhcmFtIGFDb21wYXJlIEEgZnVuY3Rpb24gd2hpY2ggdGFrZXMgdGhlIG5lZWRsZSBhbmQgYW4gZWxlbWVudCBpbiB0aGVcbiAqICAgICBhcnJheSBhbmQgcmV0dXJucyAtMSwgMCwgb3IgMSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbmVlZGxlIGlzIGxlc3NcbiAqICAgICB0aGFuLCBlcXVhbCB0bywgb3IgZ3JlYXRlciB0aGFuIHRoZSBlbGVtZW50LCByZXNwZWN0aXZlbHkuXG4gKiBAcGFyYW0gYUJpYXMgRWl0aGVyICdiaW5hcnlTZWFyY2guR1JFQVRFU1RfTE9XRVJfQk9VTkQnIG9yXG4gKiAgICAgJ2JpbmFyeVNlYXJjaC5MRUFTVF9VUFBFUl9CT1VORCcuIFNwZWNpZmllcyB3aGV0aGVyIHRvIHJldHVybiB0aGVcbiAqICAgICBjbG9zZXN0IGVsZW1lbnQgdGhhdCBpcyBzbWFsbGVyIHRoYW4gb3IgZ3JlYXRlciB0aGFuIHRoZSBvbmUgd2UgYXJlXG4gKiAgICAgc2VhcmNoaW5nIGZvciwgcmVzcGVjdGl2ZWx5LCBpZiB0aGUgZXhhY3QgZWxlbWVudCBjYW5ub3QgYmUgZm91bmQuXG4gKiAgICAgRGVmYXVsdHMgdG8gJ2JpbmFyeVNlYXJjaC5HUkVBVEVTVF9MT1dFUl9CT1VORCcuXG4gKi9cbmV4cG9ydHMuc2VhcmNoID0gZnVuY3Rpb24gc2VhcmNoKGFOZWVkbGUsIGFIYXlzdGFjaywgYUNvbXBhcmUsIGFCaWFzKSB7XG4gIGlmIChhSGF5c3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgdmFyIGluZGV4ID0gcmVjdXJzaXZlU2VhcmNoKC0xLCBhSGF5c3RhY2subGVuZ3RoLCBhTmVlZGxlLCBhSGF5c3RhY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhQ29tcGFyZSwgYUJpYXMgfHwgZXhwb3J0cy5HUkVBVEVTVF9MT1dFUl9CT1VORCk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICAvLyBXZSBoYXZlIGZvdW5kIGVpdGhlciB0aGUgZXhhY3QgZWxlbWVudCwgb3IgdGhlIG5leHQtY2xvc2VzdCBlbGVtZW50IHRoYW5cbiAgLy8gdGhlIG9uZSB3ZSBhcmUgc2VhcmNoaW5nIGZvci4gSG93ZXZlciwgdGhlcmUgbWF5IGJlIG1vcmUgdGhhbiBvbmUgc3VjaFxuICAvLyBlbGVtZW50LiBNYWtlIHN1cmUgd2UgYWx3YXlzIHJldHVybiB0aGUgc21hbGxlc3Qgb2YgdGhlc2UuXG4gIHdoaWxlIChpbmRleCAtIDEgPj0gMCkge1xuICAgIGlmIChhQ29tcGFyZShhSGF5c3RhY2tbaW5kZXhdLCBhSGF5c3RhY2tbaW5kZXggLSAxXSwgdHJ1ZSkgIT09IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAtLWluZGV4O1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2JpbmFyeS1zZWFyY2guanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzTmF0aXZlTWFwID0gdHlwZW9mIE1hcCAhPT0gXCJ1bmRlZmluZWRcIjtcblxuLyoqXG4gKiBBIGRhdGEgc3RydWN0dXJlIHdoaWNoIGlzIGEgY29tYmluYXRpb24gb2YgYW4gYXJyYXkgYW5kIGEgc2V0LiBBZGRpbmcgYSBuZXdcbiAqIG1lbWJlciBpcyBPKDEpLCB0ZXN0aW5nIGZvciBtZW1iZXJzaGlwIGlzIE8oMSksIGFuZCBmaW5kaW5nIHRoZSBpbmRleCBvZiBhblxuICogZWxlbWVudCBpcyBPKDEpLiBSZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBzZXQgaXMgbm90IHN1cHBvcnRlZC4gT25seVxuICogc3RyaW5ncyBhcmUgc3VwcG9ydGVkIGZvciBtZW1iZXJzaGlwLlxuICovXG5mdW5jdGlvbiBBcnJheVNldCgpIHtcbiAgdGhpcy5fYXJyYXkgPSBbXTtcbiAgdGhpcy5fc2V0ID0gaGFzTmF0aXZlTWFwID8gbmV3IE1hcCgpIDogT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cblxuLyoqXG4gKiBTdGF0aWMgbWV0aG9kIGZvciBjcmVhdGluZyBBcnJheVNldCBpbnN0YW5jZXMgZnJvbSBhbiBleGlzdGluZyBhcnJheS5cbiAqL1xuQXJyYXlTZXQuZnJvbUFycmF5ID0gZnVuY3Rpb24gQXJyYXlTZXRfZnJvbUFycmF5KGFBcnJheSwgYUFsbG93RHVwbGljYXRlcykge1xuICB2YXIgc2V0ID0gbmV3IEFycmF5U2V0KCk7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhQXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzZXQuYWRkKGFBcnJheVtpXSwgYUFsbG93RHVwbGljYXRlcyk7XG4gIH1cbiAgcmV0dXJuIHNldDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhvdyBtYW55IHVuaXF1ZSBpdGVtcyBhcmUgaW4gdGhpcyBBcnJheVNldC4gSWYgZHVwbGljYXRlcyBoYXZlIGJlZW5cbiAqIGFkZGVkLCB0aGFuIHRob3NlIGRvIG5vdCBjb3VudCB0b3dhcmRzIHRoZSBzaXplLlxuICpcbiAqIEByZXR1cm5zIE51bWJlclxuICovXG5BcnJheVNldC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIEFycmF5U2V0X3NpemUoKSB7XG4gIHJldHVybiBoYXNOYXRpdmVNYXAgPyB0aGlzLl9zZXQuc2l6ZSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuX3NldCkubGVuZ3RoO1xufTtcblxuLyoqXG4gKiBBZGQgdGhlIGdpdmVuIHN0cmluZyB0byB0aGlzIHNldC5cbiAqXG4gKiBAcGFyYW0gU3RyaW5nIGFTdHJcbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIEFycmF5U2V0X2FkZChhU3RyLCBhQWxsb3dEdXBsaWNhdGVzKSB7XG4gIHZhciBzU3RyID0gaGFzTmF0aXZlTWFwID8gYVN0ciA6IHV0aWwudG9TZXRTdHJpbmcoYVN0cik7XG4gIHZhciBpc0R1cGxpY2F0ZSA9IGhhc05hdGl2ZU1hcCA/IHRoaXMuaGFzKGFTdHIpIDogaGFzLmNhbGwodGhpcy5fc2V0LCBzU3RyKTtcbiAgdmFyIGlkeCA9IHRoaXMuX2FycmF5Lmxlbmd0aDtcbiAgaWYgKCFpc0R1cGxpY2F0ZSB8fCBhQWxsb3dEdXBsaWNhdGVzKSB7XG4gICAgdGhpcy5fYXJyYXkucHVzaChhU3RyKTtcbiAgfVxuICBpZiAoIWlzRHVwbGljYXRlKSB7XG4gICAgaWYgKGhhc05hdGl2ZU1hcCkge1xuICAgICAgdGhpcy5fc2V0LnNldChhU3RyLCBpZHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZXRbc1N0cl0gPSBpZHg7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIElzIHRoZSBnaXZlbiBzdHJpbmcgYSBtZW1iZXIgb2YgdGhpcyBzZXQ/XG4gKlxuICogQHBhcmFtIFN0cmluZyBhU3RyXG4gKi9cbkFycmF5U2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBBcnJheVNldF9oYXMoYVN0cikge1xuICBpZiAoaGFzTmF0aXZlTWFwKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldC5oYXMoYVN0cik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNTdHIgPSB1dGlsLnRvU2V0U3RyaW5nKGFTdHIpO1xuICAgIHJldHVybiBoYXMuY2FsbCh0aGlzLl9zZXQsIHNTdHIpO1xuICB9XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGluZGV4IG9mIHRoZSBnaXZlbiBzdHJpbmcgaW4gdGhlIGFycmF5P1xuICpcbiAqIEBwYXJhbSBTdHJpbmcgYVN0clxuICovXG5BcnJheVNldC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIEFycmF5U2V0X2luZGV4T2YoYVN0cikge1xuICBpZiAoaGFzTmF0aXZlTWFwKSB7XG4gICAgdmFyIGlkeCA9IHRoaXMuX3NldC5nZXQoYVN0cik7XG4gICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIHJldHVybiBpZHg7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBzU3RyID0gdXRpbC50b1NldFN0cmluZyhhU3RyKTtcbiAgICBpZiAoaGFzLmNhbGwodGhpcy5fc2V0LCBzU3RyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NldFtzU3RyXTtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIGFTdHIgKyAnXCIgaXMgbm90IGluIHRoZSBzZXQuJyk7XG59O1xuXG4vKipcbiAqIFdoYXQgaXMgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4P1xuICpcbiAqIEBwYXJhbSBOdW1iZXIgYUlkeFxuICovXG5BcnJheVNldC5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiBBcnJheVNldF9hdChhSWR4KSB7XG4gIGlmIChhSWR4ID49IDAgJiYgYUlkeCA8IHRoaXMuX2FycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiB0aGlzLl9hcnJheVthSWR4XTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnQgaW5kZXhlZCBieSAnICsgYUlkeCk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgc2V0ICh3aGljaCBoYXMgdGhlIHByb3BlciBpbmRpY2VzXG4gKiBpbmRpY2F0ZWQgYnkgaW5kZXhPZikuIE5vdGUgdGhhdCB0aGlzIGlzIGEgY29weSBvZiB0aGUgaW50ZXJuYWwgYXJyYXkgdXNlZFxuICogZm9yIHN0b3JpbmcgdGhlIG1lbWJlcnMgc28gdGhhdCBubyBvbmUgY2FuIG1lc3Mgd2l0aCBpbnRlcm5hbCBzdGF0ZS5cbiAqL1xuQXJyYXlTZXQucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbiBBcnJheVNldF90b0FycmF5KCkge1xuICByZXR1cm4gdGhpcy5fYXJyYXkuc2xpY2UoKTtcbn07XG5cbmV4cG9ydHMuQXJyYXlTZXQgPSBBcnJheVNldDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2FycmF5LXNldC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICpcbiAqIEJhc2VkIG9uIHRoZSBCYXNlIDY0IFZMUSBpbXBsZW1lbnRhdGlvbiBpbiBDbG9zdXJlIENvbXBpbGVyOlxuICogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jbG9zdXJlLWNvbXBpbGVyL3NvdXJjZS9icm93c2UvdHJ1bmsvc3JjL2NvbS9nb29nbGUvZGVidWdnaW5nL3NvdXJjZW1hcC9CYXNlNjRWTFEuamF2YVxuICpcbiAqIENvcHlyaWdodCAyMDExIFRoZSBDbG9zdXJlIENvbXBpbGVyIEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAqIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmVcbiAqIG1ldDpcbiAqXG4gKiAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZVxuICogICAgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmdcbiAqICAgIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZFxuICogICAgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICogICogTmVpdGhlciB0aGUgbmFtZSBvZiBHb29nbGUgSW5jLiBub3IgdGhlIG5hbWVzIG9mIGl0c1xuICogICAgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkXG4gKiAgICBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICogXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4gKiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVFxuICogT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsXG4gKiBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSxcbiAqIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWVxuICogVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICogKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFXG4gKiBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCcuL2Jhc2U2NCcpO1xuXG4vLyBBIHNpbmdsZSBiYXNlIDY0IGRpZ2l0IGNhbiBjb250YWluIDYgYml0cyBvZiBkYXRhLiBGb3IgdGhlIGJhc2UgNjQgdmFyaWFibGVcbi8vIGxlbmd0aCBxdWFudGl0aWVzIHdlIHVzZSBpbiB0aGUgc291cmNlIG1hcCBzcGVjLCB0aGUgZmlyc3QgYml0IGlzIHRoZSBzaWduLFxuLy8gdGhlIG5leHQgZm91ciBiaXRzIGFyZSB0aGUgYWN0dWFsIHZhbHVlLCBhbmQgdGhlIDZ0aCBiaXQgaXMgdGhlXG4vLyBjb250aW51YXRpb24gYml0LiBUaGUgY29udGludWF0aW9uIGJpdCB0ZWxscyB1cyB3aGV0aGVyIHRoZXJlIGFyZSBtb3JlXG4vLyBkaWdpdHMgaW4gdGhpcyB2YWx1ZSBmb2xsb3dpbmcgdGhpcyBkaWdpdC5cbi8vXG4vLyAgIENvbnRpbnVhdGlvblxuLy8gICB8ICAgIFNpZ25cbi8vICAgfCAgICB8XG4vLyAgIFYgICAgVlxuLy8gICAxMDEwMTFcblxudmFyIFZMUV9CQVNFX1NISUZUID0gNTtcblxuLy8gYmluYXJ5OiAxMDAwMDBcbnZhciBWTFFfQkFTRSA9IDEgPDwgVkxRX0JBU0VfU0hJRlQ7XG5cbi8vIGJpbmFyeTogMDExMTExXG52YXIgVkxRX0JBU0VfTUFTSyA9IFZMUV9CQVNFIC0gMTtcblxuLy8gYmluYXJ5OiAxMDAwMDBcbnZhciBWTFFfQ09OVElOVUFUSU9OX0JJVCA9IFZMUV9CQVNFO1xuXG4vKipcbiAqIENvbnZlcnRzIGZyb20gYSB0d28tY29tcGxlbWVudCB2YWx1ZSB0byBhIHZhbHVlIHdoZXJlIHRoZSBzaWduIGJpdCBpc1xuICogcGxhY2VkIGluIHRoZSBsZWFzdCBzaWduaWZpY2FudCBiaXQuICBGb3IgZXhhbXBsZSwgYXMgZGVjaW1hbHM6XG4gKiAgIDEgYmVjb21lcyAyICgxMCBiaW5hcnkpLCAtMSBiZWNvbWVzIDMgKDExIGJpbmFyeSlcbiAqICAgMiBiZWNvbWVzIDQgKDEwMCBiaW5hcnkpLCAtMiBiZWNvbWVzIDUgKDEwMSBiaW5hcnkpXG4gKi9cbmZ1bmN0aW9uIHRvVkxRU2lnbmVkKGFWYWx1ZSkge1xuICByZXR1cm4gYVZhbHVlIDwgMFxuICAgID8gKCgtYVZhbHVlKSA8PCAxKSArIDFcbiAgICA6IChhVmFsdWUgPDwgMSkgKyAwO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRvIGEgdHdvLWNvbXBsZW1lbnQgdmFsdWUgZnJvbSBhIHZhbHVlIHdoZXJlIHRoZSBzaWduIGJpdCBpc1xuICogcGxhY2VkIGluIHRoZSBsZWFzdCBzaWduaWZpY2FudCBiaXQuICBGb3IgZXhhbXBsZSwgYXMgZGVjaW1hbHM6XG4gKiAgIDIgKDEwIGJpbmFyeSkgYmVjb21lcyAxLCAzICgxMSBiaW5hcnkpIGJlY29tZXMgLTFcbiAqICAgNCAoMTAwIGJpbmFyeSkgYmVjb21lcyAyLCA1ICgxMDEgYmluYXJ5KSBiZWNvbWVzIC0yXG4gKi9cbmZ1bmN0aW9uIGZyb21WTFFTaWduZWQoYVZhbHVlKSB7XG4gIHZhciBpc05lZ2F0aXZlID0gKGFWYWx1ZSAmIDEpID09PSAxO1xuICB2YXIgc2hpZnRlZCA9IGFWYWx1ZSA+PiAxO1xuICByZXR1cm4gaXNOZWdhdGl2ZVxuICAgID8gLXNoaWZ0ZWRcbiAgICA6IHNoaWZ0ZWQ7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYmFzZSA2NCBWTFEgZW5jb2RlZCB2YWx1ZS5cbiAqL1xuZXhwb3J0cy5lbmNvZGUgPSBmdW5jdGlvbiBiYXNlNjRWTFFfZW5jb2RlKGFWYWx1ZSkge1xuICB2YXIgZW5jb2RlZCA9IFwiXCI7XG4gIHZhciBkaWdpdDtcblxuICB2YXIgdmxxID0gdG9WTFFTaWduZWQoYVZhbHVlKTtcblxuICBkbyB7XG4gICAgZGlnaXQgPSB2bHEgJiBWTFFfQkFTRV9NQVNLO1xuICAgIHZscSA+Pj49IFZMUV9CQVNFX1NISUZUO1xuICAgIGlmICh2bHEgPiAwKSB7XG4gICAgICAvLyBUaGVyZSBhcmUgc3RpbGwgbW9yZSBkaWdpdHMgaW4gdGhpcyB2YWx1ZSwgc28gd2UgbXVzdCBtYWtlIHN1cmUgdGhlXG4gICAgICAvLyBjb250aW51YXRpb24gYml0IGlzIG1hcmtlZC5cbiAgICAgIGRpZ2l0IHw9IFZMUV9DT05USU5VQVRJT05fQklUO1xuICAgIH1cbiAgICBlbmNvZGVkICs9IGJhc2U2NC5lbmNvZGUoZGlnaXQpO1xuICB9IHdoaWxlICh2bHEgPiAwKTtcblxuICByZXR1cm4gZW5jb2RlZDtcbn07XG5cbi8qKlxuICogRGVjb2RlcyB0aGUgbmV4dCBiYXNlIDY0IFZMUSB2YWx1ZSBmcm9tIHRoZSBnaXZlbiBzdHJpbmcgYW5kIHJldHVybnMgdGhlXG4gKiB2YWx1ZSBhbmQgdGhlIHJlc3Qgb2YgdGhlIHN0cmluZyB2aWEgdGhlIG91dCBwYXJhbWV0ZXIuXG4gKi9cbmV4cG9ydHMuZGVjb2RlID0gZnVuY3Rpb24gYmFzZTY0VkxRX2RlY29kZShhU3RyLCBhSW5kZXgsIGFPdXRQYXJhbSkge1xuICB2YXIgc3RyTGVuID0gYVN0ci5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSAwO1xuICB2YXIgc2hpZnQgPSAwO1xuICB2YXIgY29udGludWF0aW9uLCBkaWdpdDtcblxuICBkbyB7XG4gICAgaWYgKGFJbmRleCA+PSBzdHJMZW4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIG1vcmUgZGlnaXRzIGluIGJhc2UgNjQgVkxRIHZhbHVlLlwiKTtcbiAgICB9XG5cbiAgICBkaWdpdCA9IGJhc2U2NC5kZWNvZGUoYVN0ci5jaGFyQ29kZUF0KGFJbmRleCsrKSk7XG4gICAgaWYgKGRpZ2l0ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBiYXNlNjQgZGlnaXQ6IFwiICsgYVN0ci5jaGFyQXQoYUluZGV4IC0gMSkpO1xuICAgIH1cblxuICAgIGNvbnRpbnVhdGlvbiA9ICEhKGRpZ2l0ICYgVkxRX0NPTlRJTlVBVElPTl9CSVQpO1xuICAgIGRpZ2l0ICY9IFZMUV9CQVNFX01BU0s7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgKGRpZ2l0IDw8IHNoaWZ0KTtcbiAgICBzaGlmdCArPSBWTFFfQkFTRV9TSElGVDtcbiAgfSB3aGlsZSAoY29udGludWF0aW9uKTtcblxuICBhT3V0UGFyYW0udmFsdWUgPSBmcm9tVkxRU2lnbmVkKHJlc3VsdCk7XG4gIGFPdXRQYXJhbS5yZXN0ID0gYUluZGV4O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2Jhc2U2NC12bHEuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDExIE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgaW50VG9DaGFyTWFwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLnNwbGl0KCcnKTtcblxuLyoqXG4gKiBFbmNvZGUgYW4gaW50ZWdlciBpbiB0aGUgcmFuZ2Ugb2YgMCB0byA2MyB0byBhIHNpbmdsZSBiYXNlIDY0IGRpZ2l0LlxuICovXG5leHBvcnRzLmVuY29kZSA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgaWYgKDAgPD0gbnVtYmVyICYmIG51bWJlciA8IGludFRvQ2hhck1hcC5sZW5ndGgpIHtcbiAgICByZXR1cm4gaW50VG9DaGFyTWFwW251bWJlcl07XG4gIH1cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIk11c3QgYmUgYmV0d2VlbiAwIGFuZCA2MzogXCIgKyBudW1iZXIpO1xufTtcblxuLyoqXG4gKiBEZWNvZGUgYSBzaW5nbGUgYmFzZSA2NCBjaGFyYWN0ZXIgY29kZSBkaWdpdCB0byBhbiBpbnRlZ2VyLiBSZXR1cm5zIC0xIG9uXG4gKiBmYWlsdXJlLlxuICovXG5leHBvcnRzLmRlY29kZSA9IGZ1bmN0aW9uIChjaGFyQ29kZSkge1xuICB2YXIgYmlnQSA9IDY1OyAgICAgLy8gJ0EnXG4gIHZhciBiaWdaID0gOTA7ICAgICAvLyAnWidcblxuICB2YXIgbGl0dGxlQSA9IDk3OyAgLy8gJ2EnXG4gIHZhciBsaXR0bGVaID0gMTIyOyAvLyAneidcblxuICB2YXIgemVybyA9IDQ4OyAgICAgLy8gJzAnXG4gIHZhciBuaW5lID0gNTc7ICAgICAvLyAnOSdcblxuICB2YXIgcGx1cyA9IDQzOyAgICAgLy8gJysnXG4gIHZhciBzbGFzaCA9IDQ3OyAgICAvLyAnLydcblxuICB2YXIgbGl0dGxlT2Zmc2V0ID0gMjY7XG4gIHZhciBudW1iZXJPZmZzZXQgPSA1MjtcblxuICAvLyAwIC0gMjU6IEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXG4gIGlmIChiaWdBIDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDw9IGJpZ1opIHtcbiAgICByZXR1cm4gKGNoYXJDb2RlIC0gYmlnQSk7XG4gIH1cblxuICAvLyAyNiAtIDUxOiBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elxuICBpZiAobGl0dGxlQSA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBsaXR0bGVaKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIGxpdHRsZUEgKyBsaXR0bGVPZmZzZXQpO1xuICB9XG5cbiAgLy8gNTIgLSA2MTogMDEyMzQ1Njc4OVxuICBpZiAoemVybyA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8PSBuaW5lKSB7XG4gICAgcmV0dXJuIChjaGFyQ29kZSAtIHplcm8gKyBudW1iZXJPZmZzZXQpO1xuICB9XG5cbiAgLy8gNjI6ICtcbiAgaWYgKGNoYXJDb2RlID09IHBsdXMpIHtcbiAgICByZXR1cm4gNjI7XG4gIH1cblxuICAvLyA2MzogL1xuICBpZiAoY2hhckNvZGUgPT0gc2xhc2gpIHtcbiAgICByZXR1cm4gNjM7XG4gIH1cblxuICAvLyBJbnZhbGlkIGJhc2U2NCBkaWdpdC5cbiAgcmV0dXJuIC0xO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL2Jhc2U2NC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbi8vIEl0IHR1cm5zIG91dCB0aGF0IHNvbWUgKG1vc3Q/KSBKYXZhU2NyaXB0IGVuZ2luZXMgZG9uJ3Qgc2VsZi1ob3N0XG4vLyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLiBUaGlzIG1ha2VzIHNlbnNlIGJlY2F1c2UgQysrIHdpbGwgbGlrZWx5IHJlbWFpblxuLy8gZmFzdGVyIHRoYW4gSlMgd2hlbiBkb2luZyByYXcgQ1BVLWludGVuc2l2ZSBzb3J0aW5nLiBIb3dldmVyLCB3aGVuIHVzaW5nIGFcbi8vIGN1c3RvbSBjb21wYXJhdG9yIGZ1bmN0aW9uLCBjYWxsaW5nIGJhY2sgYW5kIGZvcnRoIGJldHdlZW4gdGhlIFZNJ3MgQysrIGFuZFxuLy8gSklUJ2QgSlMgaXMgcmF0aGVyIHNsb3cgKmFuZCogbG9zZXMgSklUIHR5cGUgaW5mb3JtYXRpb24sIHJlc3VsdGluZyBpblxuLy8gd29yc2UgZ2VuZXJhdGVkIGNvZGUgZm9yIHRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRoYW4gd291bGQgYmUgb3B0aW1hbC4gSW5cbi8vIGZhY3QsIHdoZW4gc29ydGluZyB3aXRoIGEgY29tcGFyYXRvciwgdGhlc2UgY29zdHMgb3V0d2VpZ2ggdGhlIGJlbmVmaXRzIG9mXG4vLyBzb3J0aW5nIGluIEMrKy4gQnkgdXNpbmcgb3VyIG93biBKUy1pbXBsZW1lbnRlZCBRdWljayBTb3J0IChiZWxvdyksIHdlIGdldFxuLy8gYSB+MzUwMG1zIG1lYW4gc3BlZWQtdXAgaW4gYGJlbmNoL2JlbmNoLmh0bWxgLlxuXG4vKipcbiAqIFN3YXAgdGhlIGVsZW1lbnRzIGluZGV4ZWQgYnkgYHhgIGFuZCBgeWAgaW4gdGhlIGFycmF5IGBhcnlgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIFRoZSBhcnJheS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiAgICAgICAgVGhlIGluZGV4IG9mIHRoZSBmaXJzdCBpdGVtLlxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqICAgICAgICBUaGUgaW5kZXggb2YgdGhlIHNlY29uZCBpdGVtLlxuICovXG5mdW5jdGlvbiBzd2FwKGFyeSwgeCwgeSkge1xuICB2YXIgdGVtcCA9IGFyeVt4XTtcbiAgYXJ5W3hdID0gYXJ5W3ldO1xuICBhcnlbeV0gPSB0ZW1wO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSByYW5kb20gaW50ZWdlciB3aXRoaW4gdGhlIHJhbmdlIGBsb3cgLi4gaGlnaGAgaW5jbHVzaXZlLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBsb3dcbiAqICAgICAgICBUaGUgbG93ZXIgYm91bmQgb24gdGhlIHJhbmdlLlxuICogQHBhcmFtIHtOdW1iZXJ9IGhpZ2hcbiAqICAgICAgICBUaGUgdXBwZXIgYm91bmQgb24gdGhlIHJhbmdlLlxuICovXG5mdW5jdGlvbiByYW5kb21JbnRJblJhbmdlKGxvdywgaGlnaCkge1xuICByZXR1cm4gTWF0aC5yb3VuZChsb3cgKyAoTWF0aC5yYW5kb20oKSAqIChoaWdoIC0gbG93KSkpO1xufVxuXG4vKipcbiAqIFRoZSBRdWljayBTb3J0IGFsZ29yaXRobS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnlcbiAqICAgICAgICBBbiBhcnJheSB0byBzb3J0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyYXRvclxuICogICAgICAgIEZ1bmN0aW9uIHRvIHVzZSB0byBjb21wYXJlIHR3byBpdGVtcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBwXG4gKiAgICAgICAgU3RhcnQgaW5kZXggb2YgdGhlIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcn0gclxuICogICAgICAgIEVuZCBpbmRleCBvZiB0aGUgYXJyYXlcbiAqL1xuZnVuY3Rpb24gZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBwLCByKSB7XG4gIC8vIElmIG91ciBsb3dlciBib3VuZCBpcyBsZXNzIHRoYW4gb3VyIHVwcGVyIGJvdW5kLCB3ZSAoMSkgcGFydGl0aW9uIHRoZVxuICAvLyBhcnJheSBpbnRvIHR3byBwaWVjZXMgYW5kICgyKSByZWN1cnNlIG9uIGVhY2ggaGFsZi4gSWYgaXQgaXMgbm90LCB0aGlzIGlzXG4gIC8vIHRoZSBlbXB0eSBhcnJheSBhbmQgb3VyIGJhc2UgY2FzZS5cblxuICBpZiAocCA8IHIpIHtcbiAgICAvLyAoMSkgUGFydGl0aW9uaW5nLlxuICAgIC8vXG4gICAgLy8gVGhlIHBhcnRpdGlvbmluZyBjaG9vc2VzIGEgcGl2b3QgYmV0d2VlbiBgcGAgYW5kIGByYCBhbmQgbW92ZXMgYWxsXG4gICAgLy8gZWxlbWVudHMgdGhhdCBhcmUgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwaXZvdCB0byB0aGUgYmVmb3JlIGl0LCBhbmRcbiAgICAvLyBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgYXJlIGdyZWF0ZXIgdGhhbiBpdCBhZnRlciBpdC4gVGhlIGVmZmVjdCBpcyB0aGF0XG4gICAgLy8gb25jZSBwYXJ0aXRpb24gaXMgZG9uZSwgdGhlIHBpdm90IGlzIGluIHRoZSBleGFjdCBwbGFjZSBpdCB3aWxsIGJlIHdoZW5cbiAgICAvLyB0aGUgYXJyYXkgaXMgcHV0IGluIHNvcnRlZCBvcmRlciwgYW5kIGl0IHdpbGwgbm90IG5lZWQgdG8gYmUgbW92ZWRcbiAgICAvLyBhZ2Fpbi4gVGhpcyBydW5zIGluIE8obikgdGltZS5cblxuICAgIC8vIEFsd2F5cyBjaG9vc2UgYSByYW5kb20gcGl2b3Qgc28gdGhhdCBhbiBpbnB1dCBhcnJheSB3aGljaCBpcyByZXZlcnNlXG4gICAgLy8gc29ydGVkIGRvZXMgbm90IGNhdXNlIE8obl4yKSBydW5uaW5nIHRpbWUuXG4gICAgdmFyIHBpdm90SW5kZXggPSByYW5kb21JbnRJblJhbmdlKHAsIHIpO1xuICAgIHZhciBpID0gcCAtIDE7XG5cbiAgICBzd2FwKGFyeSwgcGl2b3RJbmRleCwgcik7XG4gICAgdmFyIHBpdm90ID0gYXJ5W3JdO1xuXG4gICAgLy8gSW1tZWRpYXRlbHkgYWZ0ZXIgYGpgIGlzIGluY3JlbWVudGVkIGluIHRoaXMgbG9vcCwgdGhlIGZvbGxvd2luZyBob2xkXG4gICAgLy8gdHJ1ZTpcbiAgICAvL1xuICAgIC8vICAgKiBFdmVyeSBlbGVtZW50IGluIGBhcnlbcCAuLiBpXWAgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwaXZvdC5cbiAgICAvL1xuICAgIC8vICAgKiBFdmVyeSBlbGVtZW50IGluIGBhcnlbaSsxIC4uIGotMV1gIGlzIGdyZWF0ZXIgdGhhbiB0aGUgcGl2b3QuXG4gICAgZm9yICh2YXIgaiA9IHA7IGogPCByOyBqKyspIHtcbiAgICAgIGlmIChjb21wYXJhdG9yKGFyeVtqXSwgcGl2b3QpIDw9IDApIHtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBzd2FwKGFyeSwgaSwgaik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dhcChhcnksIGkgKyAxLCBqKTtcbiAgICB2YXIgcSA9IGkgKyAxO1xuXG4gICAgLy8gKDIpIFJlY3Vyc2Ugb24gZWFjaCBoYWxmLlxuXG4gICAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBwLCBxIC0gMSk7XG4gICAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCBxICsgMSwgcik7XG4gIH1cbn1cblxuLyoqXG4gKiBTb3J0IHRoZSBnaXZlbiBhcnJheSBpbi1wbGFjZSB3aXRoIHRoZSBnaXZlbiBjb21wYXJhdG9yIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyeVxuICogICAgICAgIEFuIGFycmF5IHRvIHNvcnQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJhdG9yXG4gKiAgICAgICAgRnVuY3Rpb24gdG8gdXNlIHRvIGNvbXBhcmUgdHdvIGl0ZW1zLlxuICovXG5leHBvcnRzLnF1aWNrU29ydCA9IGZ1bmN0aW9uIChhcnksIGNvbXBhcmF0b3IpIHtcbiAgZG9RdWlja1NvcnQoYXJ5LCBjb21wYXJhdG9yLCAwLCBhcnkubGVuZ3RoIC0gMSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvcXVpY2stc29ydC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiAtKi0gTW9kZToganM7IGpzLWluZGVudC1sZXZlbDogMjsgLSotICovXG4vKlxuICogQ29weXJpZ2h0IDIwMTEgTW96aWxsYSBGb3VuZGF0aW9uIGFuZCBjb250cmlidXRvcnNcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIGxpY2Vuc2UuIFNlZSBMSUNFTlNFIG9yOlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0JTRC0zLUNsYXVzZVxuICovXG5cbnZhciBiYXNlNjRWTFEgPSByZXF1aXJlKCcuL2Jhc2U2NC12bHEnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgQXJyYXlTZXQgPSByZXF1aXJlKCcuL2FycmF5LXNldCcpLkFycmF5U2V0O1xudmFyIE1hcHBpbmdMaXN0ID0gcmVxdWlyZSgnLi9tYXBwaW5nLWxpc3QnKS5NYXBwaW5nTGlzdDtcblxuLyoqXG4gKiBBbiBpbnN0YW5jZSBvZiB0aGUgU291cmNlTWFwR2VuZXJhdG9yIHJlcHJlc2VudHMgYSBzb3VyY2UgbWFwIHdoaWNoIGlzXG4gKiBiZWluZyBidWlsdCBpbmNyZW1lbnRhbGx5LiBZb3UgbWF5IHBhc3MgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZ1xuICogcHJvcGVydGllczpcbiAqXG4gKiAgIC0gZmlsZTogVGhlIGZpbGVuYW1lIG9mIHRoZSBnZW5lcmF0ZWQgc291cmNlLlxuICogICAtIHNvdXJjZVJvb3Q6IEEgcm9vdCBmb3IgYWxsIHJlbGF0aXZlIFVSTHMgaW4gdGhpcyBzb3VyY2UgbWFwLlxuICovXG5mdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3IoYUFyZ3MpIHtcbiAgaWYgKCFhQXJncykge1xuICAgIGFBcmdzID0ge307XG4gIH1cbiAgdGhpcy5fZmlsZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnZmlsZScsIG51bGwpO1xuICB0aGlzLl9zb3VyY2VSb290ID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2VSb290JywgbnVsbCk7XG4gIHRoaXMuX3NraXBWYWxpZGF0aW9uID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdza2lwVmFsaWRhdGlvbicsIGZhbHNlKTtcbiAgdGhpcy5fc291cmNlcyA9IG5ldyBBcnJheVNldCgpO1xuICB0aGlzLl9uYW1lcyA9IG5ldyBBcnJheVNldCgpO1xuICB0aGlzLl9tYXBwaW5ncyA9IG5ldyBNYXBwaW5nTGlzdCgpO1xuICB0aGlzLl9zb3VyY2VzQ29udGVudHMgPSBudWxsO1xufVxuXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl92ZXJzaW9uID0gMztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFNvdXJjZU1hcEdlbmVyYXRvciBiYXNlZCBvbiBhIFNvdXJjZU1hcENvbnN1bWVyXG4gKlxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgU291cmNlTWFwLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IuZnJvbVNvdXJjZU1hcCA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl9mcm9tU291cmNlTWFwKGFTb3VyY2VNYXBDb25zdW1lcikge1xuICAgIHZhciBzb3VyY2VSb290ID0gYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZVJvb3Q7XG4gICAgdmFyIGdlbmVyYXRvciA9IG5ldyBTb3VyY2VNYXBHZW5lcmF0b3Ioe1xuICAgICAgZmlsZTogYVNvdXJjZU1hcENvbnN1bWVyLmZpbGUsXG4gICAgICBzb3VyY2VSb290OiBzb3VyY2VSb290XG4gICAgfSk7XG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLmVhY2hNYXBwaW5nKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG4gICAgICB2YXIgbmV3TWFwcGluZyA9IHtcbiAgICAgICAgZ2VuZXJhdGVkOiB7XG4gICAgICAgICAgbGluZTogbWFwcGluZy5nZW5lcmF0ZWRMaW5lLFxuICAgICAgICAgIGNvbHVtbjogbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW5cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKG1hcHBpbmcuc291cmNlICE9IG51bGwpIHtcbiAgICAgICAgbmV3TWFwcGluZy5zb3VyY2UgPSBtYXBwaW5nLnNvdXJjZTtcbiAgICAgICAgaWYgKHNvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld01hcHBpbmcuc291cmNlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBuZXdNYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXdNYXBwaW5nLm9yaWdpbmFsID0ge1xuICAgICAgICAgIGxpbmU6IG1hcHBpbmcub3JpZ2luYWxMaW5lLFxuICAgICAgICAgIGNvbHVtbjogbWFwcGluZy5vcmlnaW5hbENvbHVtblxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChtYXBwaW5nLm5hbWUgIT0gbnVsbCkge1xuICAgICAgICAgIG5ld01hcHBpbmcubmFtZSA9IG1hcHBpbmcubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBnZW5lcmF0b3IuYWRkTWFwcGluZyhuZXdNYXBwaW5nKTtcbiAgICB9KTtcbiAgICBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2VGaWxlKSB7XG4gICAgICB2YXIgc291cmNlUmVsYXRpdmUgPSBzb3VyY2VGaWxlO1xuICAgICAgaWYgKHNvdXJjZVJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgc291cmNlUmVsYXRpdmUgPSB1dGlsLnJlbGF0aXZlKHNvdXJjZVJvb3QsIHNvdXJjZUZpbGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWdlbmVyYXRvci5fc291cmNlcy5oYXMoc291cmNlUmVsYXRpdmUpKSB7XG4gICAgICAgIGdlbmVyYXRvci5fc291cmNlcy5hZGQoc291cmNlUmVsYXRpdmUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGVudCA9IGFTb3VyY2VNYXBDb25zdW1lci5zb3VyY2VDb250ZW50Rm9yKHNvdXJjZUZpbGUpO1xuICAgICAgaWYgKGNvbnRlbnQgIT0gbnVsbCkge1xuICAgICAgICBnZW5lcmF0b3Iuc2V0U291cmNlQ29udGVudChzb3VyY2VGaWxlLCBjb250ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9O1xuXG4vKipcbiAqIEFkZCBhIHNpbmdsZSBtYXBwaW5nIGZyb20gb3JpZ2luYWwgc291cmNlIGxpbmUgYW5kIGNvbHVtbiB0byB0aGUgZ2VuZXJhdGVkXG4gKiBzb3VyY2UncyBsaW5lIGFuZCBjb2x1bW4gZm9yIHRoaXMgc291cmNlIG1hcCBiZWluZyBjcmVhdGVkLiBUaGUgbWFwcGluZ1xuICogb2JqZWN0IHNob3VsZCBoYXZlIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gZ2VuZXJhdGVkOiBBbiBvYmplY3Qgd2l0aCB0aGUgZ2VuZXJhdGVkIGxpbmUgYW5kIGNvbHVtbiBwb3NpdGlvbnMuXG4gKiAgIC0gb3JpZ2luYWw6IEFuIG9iamVjdCB3aXRoIHRoZSBvcmlnaW5hbCBsaW5lIGFuZCBjb2x1bW4gcG9zaXRpb25zLlxuICogICAtIHNvdXJjZTogVGhlIG9yaWdpbmFsIHNvdXJjZSBmaWxlIChyZWxhdGl2ZSB0byB0aGUgc291cmNlUm9vdCkuXG4gKiAgIC0gbmFtZTogQW4gb3B0aW9uYWwgb3JpZ2luYWwgdG9rZW4gbmFtZSBmb3IgdGhpcyBtYXBwaW5nLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLmFkZE1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfYWRkTWFwcGluZyhhQXJncykge1xuICAgIHZhciBnZW5lcmF0ZWQgPSB1dGlsLmdldEFyZyhhQXJncywgJ2dlbmVyYXRlZCcpO1xuICAgIHZhciBvcmlnaW5hbCA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnb3JpZ2luYWwnLCBudWxsKTtcbiAgICB2YXIgc291cmNlID0gdXRpbC5nZXRBcmcoYUFyZ3MsICdzb3VyY2UnLCBudWxsKTtcbiAgICB2YXIgbmFtZSA9IHV0aWwuZ2V0QXJnKGFBcmdzLCAnbmFtZScsIG51bGwpO1xuXG4gICAgaWYgKCF0aGlzLl9za2lwVmFsaWRhdGlvbikge1xuICAgICAgdGhpcy5fdmFsaWRhdGVNYXBwaW5nKGdlbmVyYXRlZCwgb3JpZ2luYWwsIHNvdXJjZSwgbmFtZSk7XG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSAhPSBudWxsKSB7XG4gICAgICBzb3VyY2UgPSBTdHJpbmcoc291cmNlKTtcbiAgICAgIGlmICghdGhpcy5fc291cmNlcy5oYXMoc291cmNlKSkge1xuICAgICAgICB0aGlzLl9zb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSk7XG4gICAgICBpZiAoIXRoaXMuX25hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICB0aGlzLl9uYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fbWFwcGluZ3MuYWRkKHtcbiAgICAgIGdlbmVyYXRlZExpbmU6IGdlbmVyYXRlZC5saW5lLFxuICAgICAgZ2VuZXJhdGVkQ29sdW1uOiBnZW5lcmF0ZWQuY29sdW1uLFxuICAgICAgb3JpZ2luYWxMaW5lOiBvcmlnaW5hbCAhPSBudWxsICYmIG9yaWdpbmFsLmxpbmUsXG4gICAgICBvcmlnaW5hbENvbHVtbjogb3JpZ2luYWwgIT0gbnVsbCAmJiBvcmlnaW5hbC5jb2x1bW4sXG4gICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9KTtcbiAgfTtcblxuLyoqXG4gKiBTZXQgdGhlIHNvdXJjZSBjb250ZW50IGZvciBhIHNvdXJjZSBmaWxlLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLnNldFNvdXJjZUNvbnRlbnQgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3Jfc2V0U291cmNlQ29udGVudChhU291cmNlRmlsZSwgYVNvdXJjZUNvbnRlbnQpIHtcbiAgICB2YXIgc291cmNlID0gYVNvdXJjZUZpbGU7XG4gICAgaWYgKHRoaXMuX3NvdXJjZVJvb3QgIT0gbnVsbCkge1xuICAgICAgc291cmNlID0gdXRpbC5yZWxhdGl2ZSh0aGlzLl9zb3VyY2VSb290LCBzb3VyY2UpO1xuICAgIH1cblxuICAgIGlmIChhU291cmNlQ29udGVudCAhPSBudWxsKSB7XG4gICAgICAvLyBBZGQgdGhlIHNvdXJjZSBjb250ZW50IHRvIHRoZSBfc291cmNlc0NvbnRlbnRzIG1hcC5cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBfc291cmNlc0NvbnRlbnRzIG1hcCBpZiB0aGUgcHJvcGVydHkgaXMgbnVsbC5cbiAgICAgIGlmICghdGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAgIHRoaXMuX3NvdXJjZXNDb250ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zb3VyY2VzQ29udGVudHNbdXRpbC50b1NldFN0cmluZyhzb3VyY2UpXSA9IGFTb3VyY2VDb250ZW50O1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc291cmNlc0NvbnRlbnRzKSB7XG4gICAgICAvLyBSZW1vdmUgdGhlIHNvdXJjZSBmaWxlIGZyb20gdGhlIF9zb3VyY2VzQ29udGVudHMgbWFwLlxuICAgICAgLy8gSWYgdGhlIF9zb3VyY2VzQ29udGVudHMgbWFwIGlzIGVtcHR5LCBzZXQgdGhlIHByb3BlcnR5IHRvIG51bGwuXG4gICAgICBkZWxldGUgdGhpcy5fc291cmNlc0NvbnRlbnRzW3V0aWwudG9TZXRTdHJpbmcoc291cmNlKV07XG4gICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fc291cmNlc0NvbnRlbnRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fc291cmNlc0NvbnRlbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbi8qKlxuICogQXBwbGllcyB0aGUgbWFwcGluZ3Mgb2YgYSBzdWItc291cmNlLW1hcCBmb3IgYSBzcGVjaWZpYyBzb3VyY2UgZmlsZSB0byB0aGVcbiAqIHNvdXJjZSBtYXAgYmVpbmcgZ2VuZXJhdGVkLiBFYWNoIG1hcHBpbmcgdG8gdGhlIHN1cHBsaWVkIHNvdXJjZSBmaWxlIGlzXG4gKiByZXdyaXR0ZW4gdXNpbmcgdGhlIHN1cHBsaWVkIHNvdXJjZSBtYXAuIE5vdGU6IFRoZSByZXNvbHV0aW9uIGZvciB0aGVcbiAqIHJlc3VsdGluZyBtYXBwaW5ncyBpcyB0aGUgbWluaW1pdW0gb2YgdGhpcyBtYXAgYW5kIHRoZSBzdXBwbGllZCBtYXAuXG4gKlxuICogQHBhcmFtIGFTb3VyY2VNYXBDb25zdW1lciBUaGUgc291cmNlIG1hcCB0byBiZSBhcHBsaWVkLlxuICogQHBhcmFtIGFTb3VyY2VGaWxlIE9wdGlvbmFsLiBUaGUgZmlsZW5hbWUgb2YgdGhlIHNvdXJjZSBmaWxlLlxuICogICAgICAgIElmIG9taXR0ZWQsIFNvdXJjZU1hcENvbnN1bWVyJ3MgZmlsZSBwcm9wZXJ0eSB3aWxsIGJlIHVzZWQuXG4gKiBAcGFyYW0gYVNvdXJjZU1hcFBhdGggT3B0aW9uYWwuIFRoZSBkaXJuYW1lIG9mIHRoZSBwYXRoIHRvIHRoZSBzb3VyY2UgbWFwXG4gKiAgICAgICAgdG8gYmUgYXBwbGllZC4gSWYgcmVsYXRpdmUsIGl0IGlzIHJlbGF0aXZlIHRvIHRoZSBTb3VyY2VNYXBDb25zdW1lci5cbiAqICAgICAgICBUaGlzIHBhcmFtZXRlciBpcyBuZWVkZWQgd2hlbiB0aGUgdHdvIHNvdXJjZSBtYXBzIGFyZW4ndCBpbiB0aGUgc2FtZVxuICogICAgICAgIGRpcmVjdG9yeSwgYW5kIHRoZSBzb3VyY2UgbWFwIHRvIGJlIGFwcGxpZWQgY29udGFpbnMgcmVsYXRpdmUgc291cmNlXG4gKiAgICAgICAgcGF0aHMuIElmIHNvLCB0aG9zZSByZWxhdGl2ZSBzb3VyY2UgcGF0aHMgbmVlZCB0byBiZSByZXdyaXR0ZW5cbiAqICAgICAgICByZWxhdGl2ZSB0byB0aGUgU291cmNlTWFwR2VuZXJhdG9yLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLmFwcGx5U291cmNlTWFwID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2FwcGx5U291cmNlTWFwKGFTb3VyY2VNYXBDb25zdW1lciwgYVNvdXJjZUZpbGUsIGFTb3VyY2VNYXBQYXRoKSB7XG4gICAgdmFyIHNvdXJjZUZpbGUgPSBhU291cmNlRmlsZTtcbiAgICAvLyBJZiBhU291cmNlRmlsZSBpcyBvbWl0dGVkLCB3ZSB3aWxsIHVzZSB0aGUgZmlsZSBwcm9wZXJ0eSBvZiB0aGUgU291cmNlTWFwXG4gICAgaWYgKGFTb3VyY2VGaWxlID09IG51bGwpIHtcbiAgICAgIGlmIChhU291cmNlTWFwQ29uc3VtZXIuZmlsZSA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS5hcHBseVNvdXJjZU1hcCByZXF1aXJlcyBlaXRoZXIgYW4gZXhwbGljaXQgc291cmNlIGZpbGUsICcgK1xuICAgICAgICAgICdvciB0aGUgc291cmNlIG1hcFxcJ3MgXCJmaWxlXCIgcHJvcGVydHkuIEJvdGggd2VyZSBvbWl0dGVkLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHNvdXJjZUZpbGUgPSBhU291cmNlTWFwQ29uc3VtZXIuZmlsZTtcbiAgICB9XG4gICAgdmFyIHNvdXJjZVJvb3QgPSB0aGlzLl9zb3VyY2VSb290O1xuICAgIC8vIE1ha2UgXCJzb3VyY2VGaWxlXCIgcmVsYXRpdmUgaWYgYW4gYWJzb2x1dGUgVXJsIGlzIHBhc3NlZC5cbiAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICBzb3VyY2VGaWxlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBzb3VyY2VGaWxlKTtcbiAgICB9XG4gICAgLy8gQXBwbHlpbmcgdGhlIFNvdXJjZU1hcCBjYW4gYWRkIGFuZCByZW1vdmUgaXRlbXMgZnJvbSB0aGUgc291cmNlcyBhbmRcbiAgICAvLyB0aGUgbmFtZXMgYXJyYXkuXG4gICAgdmFyIG5ld1NvdXJjZXMgPSBuZXcgQXJyYXlTZXQoKTtcbiAgICB2YXIgbmV3TmFtZXMgPSBuZXcgQXJyYXlTZXQoKTtcblxuICAgIC8vIEZpbmQgbWFwcGluZ3MgZm9yIHRoZSBcInNvdXJjZUZpbGVcIlxuICAgIHRoaXMuX21hcHBpbmdzLnVuc29ydGVkRm9yRWFjaChmdW5jdGlvbiAobWFwcGluZykge1xuICAgICAgaWYgKG1hcHBpbmcuc291cmNlID09PSBzb3VyY2VGaWxlICYmIG1hcHBpbmcub3JpZ2luYWxMaW5lICE9IG51bGwpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQgY2FuIGJlIG1hcHBlZCBieSB0aGUgc291cmNlIG1hcCwgdGhlbiB1cGRhdGUgdGhlIG1hcHBpbmcuXG4gICAgICAgIHZhciBvcmlnaW5hbCA9IGFTb3VyY2VNYXBDb25zdW1lci5vcmlnaW5hbFBvc2l0aW9uRm9yKHtcbiAgICAgICAgICBsaW5lOiBtYXBwaW5nLm9yaWdpbmFsTGluZSxcbiAgICAgICAgICBjb2x1bW46IG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChvcmlnaW5hbC5zb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIENvcHkgbWFwcGluZ1xuICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gb3JpZ2luYWwuc291cmNlO1xuICAgICAgICAgIGlmIChhU291cmNlTWFwUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHV0aWwuam9pbihhU291cmNlTWFwUGF0aCwgbWFwcGluZy5zb3VyY2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gdXRpbC5yZWxhdGl2ZShzb3VyY2VSb290LCBtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWxMaW5lID0gb3JpZ2luYWwubGluZTtcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsQ29sdW1uID0gb3JpZ2luYWwuY29sdW1uO1xuICAgICAgICAgIGlmIChvcmlnaW5hbC5uYW1lICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hcHBpbmcubmFtZSA9IG9yaWdpbmFsLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzb3VyY2UgPSBtYXBwaW5nLnNvdXJjZTtcbiAgICAgIGlmIChzb3VyY2UgIT0gbnVsbCAmJiAhbmV3U291cmNlcy5oYXMoc291cmNlKSkge1xuICAgICAgICBuZXdTb3VyY2VzLmFkZChzb3VyY2UpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmFtZSA9IG1hcHBpbmcubmFtZTtcbiAgICAgIGlmIChuYW1lICE9IG51bGwgJiYgIW5ld05hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICBuZXdOYW1lcy5hZGQobmFtZSk7XG4gICAgICB9XG5cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLl9zb3VyY2VzID0gbmV3U291cmNlcztcbiAgICB0aGlzLl9uYW1lcyA9IG5ld05hbWVzO1xuXG4gICAgLy8gQ29weSBzb3VyY2VzQ29udGVudHMgb2YgYXBwbGllZCBtYXAuXG4gICAgYVNvdXJjZU1hcENvbnN1bWVyLnNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlRmlsZSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBhU291cmNlTWFwQ29uc3VtZXIuc291cmNlQ29udGVudEZvcihzb3VyY2VGaWxlKTtcbiAgICAgIGlmIChjb250ZW50ICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGFTb3VyY2VNYXBQYXRoICE9IG51bGwpIHtcbiAgICAgICAgICBzb3VyY2VGaWxlID0gdXRpbC5qb2luKGFTb3VyY2VNYXBQYXRoLCBzb3VyY2VGaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgICAgc291cmNlRmlsZSA9IHV0aWwucmVsYXRpdmUoc291cmNlUm9vdCwgc291cmNlRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTb3VyY2VDb250ZW50KHNvdXJjZUZpbGUsIGNvbnRlbnQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9O1xuXG4vKipcbiAqIEEgbWFwcGluZyBjYW4gaGF2ZSBvbmUgb2YgdGhlIHRocmVlIGxldmVscyBvZiBkYXRhOlxuICpcbiAqICAgMS4gSnVzdCB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9uLlxuICogICAyLiBUaGUgR2VuZXJhdGVkIHBvc2l0aW9uLCBvcmlnaW5hbCBwb3NpdGlvbiwgYW5kIG9yaWdpbmFsIHNvdXJjZS5cbiAqICAgMy4gR2VuZXJhdGVkIGFuZCBvcmlnaW5hbCBwb3NpdGlvbiwgb3JpZ2luYWwgc291cmNlLCBhcyB3ZWxsIGFzIGEgbmFtZVxuICogICAgICB0b2tlbi5cbiAqXG4gKiBUbyBtYWludGFpbiBjb25zaXN0ZW5jeSwgd2UgdmFsaWRhdGUgdGhhdCBhbnkgbmV3IG1hcHBpbmcgYmVpbmcgYWRkZWQgZmFsbHNcbiAqIGluIHRvIG9uZSBvZiB0aGVzZSBjYXRlZ29yaWVzLlxuICovXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0ZU1hcHBpbmcgPVxuICBmdW5jdGlvbiBTb3VyY2VNYXBHZW5lcmF0b3JfdmFsaWRhdGVNYXBwaW5nKGFHZW5lcmF0ZWQsIGFPcmlnaW5hbCwgYVNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhTmFtZSkge1xuICAgIC8vIFdoZW4gYU9yaWdpbmFsIGlzIHRydXRoeSBidXQgaGFzIGVtcHR5IHZhbHVlcyBmb3IgLmxpbmUgYW5kIC5jb2x1bW4sXG4gICAgLy8gaXQgaXMgbW9zdCBsaWtlbHkgYSBwcm9ncmFtbWVyIGVycm9yLiBJbiB0aGlzIGNhc2Ugd2UgdGhyb3cgYSB2ZXJ5XG4gICAgLy8gc3BlY2lmaWMgZXJyb3IgbWVzc2FnZSB0byB0cnkgdG8gZ3VpZGUgdGhlbSB0aGUgcmlnaHQgd2F5LlxuICAgIC8vIEZvciBleGFtcGxlOiBodHRwczovL2dpdGh1Yi5jb20vUG9seW1lci9wb2x5bWVyLWJ1bmRsZXIvcHVsbC81MTlcbiAgICBpZiAoYU9yaWdpbmFsICYmIHR5cGVvZiBhT3JpZ2luYWwubGluZSAhPT0gJ251bWJlcicgJiYgdHlwZW9mIGFPcmlnaW5hbC5jb2x1bW4gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdvcmlnaW5hbC5saW5lIGFuZCBvcmlnaW5hbC5jb2x1bW4gYXJlIG5vdCBudW1iZXJzIC0tIHlvdSBwcm9iYWJseSBtZWFudCB0byBvbWl0ICcgK1xuICAgICAgICAgICAgJ3RoZSBvcmlnaW5hbCBtYXBwaW5nIGVudGlyZWx5IGFuZCBvbmx5IG1hcCB0aGUgZ2VuZXJhdGVkIHBvc2l0aW9uLiBJZiBzbywgcGFzcyAnICtcbiAgICAgICAgICAgICdudWxsIGZvciB0aGUgb3JpZ2luYWwgbWFwcGluZyBpbnN0ZWFkIG9mIGFuIG9iamVjdCB3aXRoIGVtcHR5IG9yIG51bGwgdmFsdWVzLidcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoYUdlbmVyYXRlZCAmJiAnbGluZScgaW4gYUdlbmVyYXRlZCAmJiAnY29sdW1uJyBpbiBhR2VuZXJhdGVkXG4gICAgICAgICYmIGFHZW5lcmF0ZWQubGluZSA+IDAgJiYgYUdlbmVyYXRlZC5jb2x1bW4gPj0gMFxuICAgICAgICAmJiAhYU9yaWdpbmFsICYmICFhU291cmNlICYmICFhTmFtZSkge1xuICAgICAgLy8gQ2FzZSAxLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIGlmIChhR2VuZXJhdGVkICYmICdsaW5lJyBpbiBhR2VuZXJhdGVkICYmICdjb2x1bW4nIGluIGFHZW5lcmF0ZWRcbiAgICAgICAgICAgICAmJiBhT3JpZ2luYWwgJiYgJ2xpbmUnIGluIGFPcmlnaW5hbCAmJiAnY29sdW1uJyBpbiBhT3JpZ2luYWxcbiAgICAgICAgICAgICAmJiBhR2VuZXJhdGVkLmxpbmUgPiAwICYmIGFHZW5lcmF0ZWQuY29sdW1uID49IDBcbiAgICAgICAgICAgICAmJiBhT3JpZ2luYWwubGluZSA+IDAgJiYgYU9yaWdpbmFsLmNvbHVtbiA+PSAwXG4gICAgICAgICAgICAgJiYgYVNvdXJjZSkge1xuICAgICAgLy8gQ2FzZXMgMiBhbmQgMy5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbWFwcGluZzogJyArIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZ2VuZXJhdGVkOiBhR2VuZXJhdGVkLFxuICAgICAgICBzb3VyY2U6IGFTb3VyY2UsXG4gICAgICAgIG9yaWdpbmFsOiBhT3JpZ2luYWwsXG4gICAgICAgIG5hbWU6IGFOYW1lXG4gICAgICB9KSk7XG4gICAgfVxuICB9O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgYWNjdW11bGF0ZWQgbWFwcGluZ3MgaW4gdG8gdGhlIHN0cmVhbSBvZiBiYXNlIDY0IFZMUXNcbiAqIHNwZWNpZmllZCBieSB0aGUgc291cmNlIG1hcCBmb3JtYXQuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUuX3NlcmlhbGl6ZU1hcHBpbmdzID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3NlcmlhbGl6ZU1hcHBpbmdzKCkge1xuICAgIHZhciBwcmV2aW91c0dlbmVyYXRlZENvbHVtbiA9IDA7XG4gICAgdmFyIHByZXZpb3VzR2VuZXJhdGVkTGluZSA9IDE7XG4gICAgdmFyIHByZXZpb3VzT3JpZ2luYWxDb2x1bW4gPSAwO1xuICAgIHZhciBwcmV2aW91c09yaWdpbmFsTGluZSA9IDA7XG4gICAgdmFyIHByZXZpb3VzTmFtZSA9IDA7XG4gICAgdmFyIHByZXZpb3VzU291cmNlID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIG5leHQ7XG4gICAgdmFyIG1hcHBpbmc7XG4gICAgdmFyIG5hbWVJZHg7XG4gICAgdmFyIHNvdXJjZUlkeDtcblxuICAgIHZhciBtYXBwaW5ncyA9IHRoaXMuX21hcHBpbmdzLnRvQXJyYXkoKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbWFwcGluZ3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG1hcHBpbmcgPSBtYXBwaW5nc1tpXTtcbiAgICAgIG5leHQgPSAnJ1xuXG4gICAgICBpZiAobWFwcGluZy5nZW5lcmF0ZWRMaW5lICE9PSBwcmV2aW91c0dlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgcHJldmlvdXNHZW5lcmF0ZWRDb2x1bW4gPSAwO1xuICAgICAgICB3aGlsZSAobWFwcGluZy5nZW5lcmF0ZWRMaW5lICE9PSBwcmV2aW91c0dlbmVyYXRlZExpbmUpIHtcbiAgICAgICAgICBuZXh0ICs9ICc7JztcbiAgICAgICAgICBwcmV2aW91c0dlbmVyYXRlZExpbmUrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIGlmICghdXRpbC5jb21wYXJlQnlHZW5lcmF0ZWRQb3NpdGlvbnNJbmZsYXRlZChtYXBwaW5nLCBtYXBwaW5nc1tpIC0gMV0pKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCArPSAnLCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcuZ2VuZXJhdGVkQ29sdW1uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uKTtcbiAgICAgIHByZXZpb3VzR2VuZXJhdGVkQ29sdW1uID0gbWFwcGluZy5nZW5lcmF0ZWRDb2x1bW47XG5cbiAgICAgIGlmIChtYXBwaW5nLnNvdXJjZSAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZUlkeCA9IHRoaXMuX3NvdXJjZXMuaW5kZXhPZihtYXBwaW5nLnNvdXJjZSk7XG4gICAgICAgIG5leHQgKz0gYmFzZTY0VkxRLmVuY29kZShzb3VyY2VJZHggLSBwcmV2aW91c1NvdXJjZSk7XG4gICAgICAgIHByZXZpb3VzU291cmNlID0gc291cmNlSWR4O1xuXG4gICAgICAgIC8vIGxpbmVzIGFyZSBzdG9yZWQgMC1iYXNlZCBpbiBTb3VyY2VNYXAgc3BlYyB2ZXJzaW9uIDNcbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcub3JpZ2luYWxMaW5lIC0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHByZXZpb3VzT3JpZ2luYWxMaW5lKTtcbiAgICAgICAgcHJldmlvdXNPcmlnaW5hbExpbmUgPSBtYXBwaW5nLm9yaWdpbmFsTGluZSAtIDE7XG5cbiAgICAgICAgbmV4dCArPSBiYXNlNjRWTFEuZW5jb2RlKG1hcHBpbmcub3JpZ2luYWxDb2x1bW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBwcmV2aW91c09yaWdpbmFsQ29sdW1uKTtcbiAgICAgICAgcHJldmlvdXNPcmlnaW5hbENvbHVtbiA9IG1hcHBpbmcub3JpZ2luYWxDb2x1bW47XG5cbiAgICAgICAgaWYgKG1hcHBpbmcubmFtZSAhPSBudWxsKSB7XG4gICAgICAgICAgbmFtZUlkeCA9IHRoaXMuX25hbWVzLmluZGV4T2YobWFwcGluZy5uYW1lKTtcbiAgICAgICAgICBuZXh0ICs9IGJhc2U2NFZMUS5lbmNvZGUobmFtZUlkeCAtIHByZXZpb3VzTmFtZSk7XG4gICAgICAgICAgcHJldmlvdXNOYW1lID0gbmFtZUlkeDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXN1bHQgKz0gbmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG5Tb3VyY2VNYXBHZW5lcmF0b3IucHJvdG90eXBlLl9nZW5lcmF0ZVNvdXJjZXNDb250ZW50ID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX2dlbmVyYXRlU291cmNlc0NvbnRlbnQoYVNvdXJjZXMsIGFTb3VyY2VSb290KSB7XG4gICAgcmV0dXJuIGFTb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICBpZiAoIXRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChhU291cmNlUm9vdCAhPSBudWxsKSB7XG4gICAgICAgIHNvdXJjZSA9IHV0aWwucmVsYXRpdmUoYVNvdXJjZVJvb3QsIHNvdXJjZSk7XG4gICAgICB9XG4gICAgICB2YXIga2V5ID0gdXRpbC50b1NldFN0cmluZyhzb3VyY2UpO1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9zb3VyY2VzQ29udGVudHMsIGtleSlcbiAgICAgICAgPyB0aGlzLl9zb3VyY2VzQ29udGVudHNba2V5XVxuICAgICAgICA6IG51bGw7XG4gICAgfSwgdGhpcyk7XG4gIH07XG5cbi8qKlxuICogRXh0ZXJuYWxpemUgdGhlIHNvdXJjZSBtYXAuXG4gKi9cblNvdXJjZU1hcEdlbmVyYXRvci5wcm90b3R5cGUudG9KU09OID1cbiAgZnVuY3Rpb24gU291cmNlTWFwR2VuZXJhdG9yX3RvSlNPTigpIHtcbiAgICB2YXIgbWFwID0ge1xuICAgICAgdmVyc2lvbjogdGhpcy5fdmVyc2lvbixcbiAgICAgIHNvdXJjZXM6IHRoaXMuX3NvdXJjZXMudG9BcnJheSgpLFxuICAgICAgbmFtZXM6IHRoaXMuX25hbWVzLnRvQXJyYXkoKSxcbiAgICAgIG1hcHBpbmdzOiB0aGlzLl9zZXJpYWxpemVNYXBwaW5ncygpXG4gICAgfTtcbiAgICBpZiAodGhpcy5fZmlsZSAhPSBudWxsKSB7XG4gICAgICBtYXAuZmlsZSA9IHRoaXMuX2ZpbGU7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3VyY2VSb290ICE9IG51bGwpIHtcbiAgICAgIG1hcC5zb3VyY2VSb290ID0gdGhpcy5fc291cmNlUm9vdDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NvdXJjZXNDb250ZW50cykge1xuICAgICAgbWFwLnNvdXJjZXNDb250ZW50ID0gdGhpcy5fZ2VuZXJhdGVTb3VyY2VzQ29udGVudChtYXAuc291cmNlcywgbWFwLnNvdXJjZVJvb3QpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXA7XG4gIH07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBzb3VyY2UgbWFwIGJlaW5nIGdlbmVyYXRlZCB0byBhIHN0cmluZy5cbiAqL1xuU291cmNlTWFwR2VuZXJhdG9yLnByb3RvdHlwZS50b1N0cmluZyA9XG4gIGZ1bmN0aW9uIFNvdXJjZU1hcEdlbmVyYXRvcl90b1N0cmluZygpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy50b0pTT04oKSk7XG4gIH07XG5cbmV4cG9ydHMuU291cmNlTWFwR2VuZXJhdG9yID0gU291cmNlTWFwR2VuZXJhdG9yO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvc291cmNlLW1hcC1nZW5lcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogLSotIE1vZGU6IGpzOyBqcy1pbmRlbnQtbGV2ZWw6IDI7IC0qLSAqL1xuLypcbiAqIENvcHlyaWdodCAyMDE0IE1vemlsbGEgRm91bmRhdGlvbiBhbmQgY29udHJpYnV0b3JzXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBsaWNlbnNlLiBTZWUgTElDRU5TRSBvcjpcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9CU0QtMy1DbGF1c2VcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIG1hcHBpbmdCIGlzIGFmdGVyIG1hcHBpbmdBIHdpdGggcmVzcGVjdCB0byBnZW5lcmF0ZWRcbiAqIHBvc2l0aW9uLlxuICovXG5mdW5jdGlvbiBnZW5lcmF0ZWRQb3NpdGlvbkFmdGVyKG1hcHBpbmdBLCBtYXBwaW5nQikge1xuICAvLyBPcHRpbWl6ZWQgZm9yIG1vc3QgY29tbW9uIGNhc2VcbiAgdmFyIGxpbmVBID0gbWFwcGluZ0EuZ2VuZXJhdGVkTGluZTtcbiAgdmFyIGxpbmVCID0gbWFwcGluZ0IuZ2VuZXJhdGVkTGluZTtcbiAgdmFyIGNvbHVtbkEgPSBtYXBwaW5nQS5nZW5lcmF0ZWRDb2x1bW47XG4gIHZhciBjb2x1bW5CID0gbWFwcGluZ0IuZ2VuZXJhdGVkQ29sdW1uO1xuICByZXR1cm4gbGluZUIgPiBsaW5lQSB8fCBsaW5lQiA9PSBsaW5lQSAmJiBjb2x1bW5CID49IGNvbHVtbkEgfHxcbiAgICAgICAgIHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQobWFwcGluZ0EsIG1hcHBpbmdCKSA8PSAwO1xufVxuXG4vKipcbiAqIEEgZGF0YSBzdHJ1Y3R1cmUgdG8gcHJvdmlkZSBhIHNvcnRlZCB2aWV3IG9mIGFjY3VtdWxhdGVkIG1hcHBpbmdzIGluIGFcbiAqIHBlcmZvcm1hbmNlIGNvbnNjaW91cyBtYW5uZXIuIEl0IHRyYWRlcyBhIG5lZ2xpYmFibGUgb3ZlcmhlYWQgaW4gZ2VuZXJhbFxuICogY2FzZSBmb3IgYSBsYXJnZSBzcGVlZHVwIGluIGNhc2Ugb2YgbWFwcGluZ3MgYmVpbmcgYWRkZWQgaW4gb3JkZXIuXG4gKi9cbmZ1bmN0aW9uIE1hcHBpbmdMaXN0KCkge1xuICB0aGlzLl9hcnJheSA9IFtdO1xuICB0aGlzLl9zb3J0ZWQgPSB0cnVlO1xuICAvLyBTZXJ2ZXMgYXMgaW5maW11bVxuICB0aGlzLl9sYXN0ID0ge2dlbmVyYXRlZExpbmU6IC0xLCBnZW5lcmF0ZWRDb2x1bW46IDB9O1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgdGhyb3VnaCBpbnRlcm5hbCBpdGVtcy4gVGhpcyBtZXRob2QgdGFrZXMgdGhlIHNhbWUgYXJndW1lbnRzIHRoYXRcbiAqIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgdGFrZXMuXG4gKlxuICogTk9URTogVGhlIG9yZGVyIG9mIHRoZSBtYXBwaW5ncyBpcyBOT1QgZ3VhcmFudGVlZC5cbiAqL1xuTWFwcGluZ0xpc3QucHJvdG90eXBlLnVuc29ydGVkRm9yRWFjaCA9XG4gIGZ1bmN0aW9uIE1hcHBpbmdMaXN0X2ZvckVhY2goYUNhbGxiYWNrLCBhVGhpc0FyZykge1xuICAgIHRoaXMuX2FycmF5LmZvckVhY2goYUNhbGxiYWNrLCBhVGhpc0FyZyk7XG4gIH07XG5cbi8qKlxuICogQWRkIHRoZSBnaXZlbiBzb3VyY2UgbWFwcGluZy5cbiAqXG4gKiBAcGFyYW0gT2JqZWN0IGFNYXBwaW5nXG4gKi9cbk1hcHBpbmdMaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBNYXBwaW5nTGlzdF9hZGQoYU1hcHBpbmcpIHtcbiAgaWYgKGdlbmVyYXRlZFBvc2l0aW9uQWZ0ZXIodGhpcy5fbGFzdCwgYU1hcHBpbmcpKSB7XG4gICAgdGhpcy5fbGFzdCA9IGFNYXBwaW5nO1xuICAgIHRoaXMuX2FycmF5LnB1c2goYU1hcHBpbmcpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX3NvcnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2FycmF5LnB1c2goYU1hcHBpbmcpO1xuICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZsYXQsIHNvcnRlZCBhcnJheSBvZiBtYXBwaW5ncy4gVGhlIG1hcHBpbmdzIGFyZSBzb3J0ZWQgYnlcbiAqIGdlbmVyYXRlZCBwb3NpdGlvbi5cbiAqXG4gKiBXQVJOSU5HOiBUaGlzIG1ldGhvZCByZXR1cm5zIGludGVybmFsIGRhdGEgd2l0aG91dCBjb3B5aW5nLCBmb3JcbiAqIHBlcmZvcm1hbmNlLiBUaGUgcmV0dXJuIHZhbHVlIG11c3QgTk9UIGJlIG11dGF0ZWQsIGFuZCBzaG91bGQgYmUgdHJlYXRlZCBhc1xuICogYW4gaW1tdXRhYmxlIGJvcnJvdy4gSWYgeW91IHdhbnQgdG8gdGFrZSBvd25lcnNoaXAsIHlvdSBtdXN0IG1ha2UgeW91ciBvd25cbiAqIGNvcHkuXG4gKi9cbk1hcHBpbmdMaXN0LnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gTWFwcGluZ0xpc3RfdG9BcnJheSgpIHtcbiAgaWYgKCF0aGlzLl9zb3J0ZWQpIHtcbiAgICB0aGlzLl9hcnJheS5zb3J0KHV0aWwuY29tcGFyZUJ5R2VuZXJhdGVkUG9zaXRpb25zSW5mbGF0ZWQpO1xuICAgIHRoaXMuX3NvcnRlZCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2FycmF5O1xufTtcblxuZXhwb3J0cy5NYXBwaW5nTGlzdCA9IE1hcHBpbmdMaXN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvbWFwcGluZy1saXN0LmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9