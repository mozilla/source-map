/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define(function (require, exports, module) {

  var SourceMapFileCollector = require('source-map/source-map-file-collector').SourceMapFileCollector;
  var SourceMapGenerator = require('source-map/source-map-generator').SourceMapGenerator;

  // Generate test data for mapping
  var input = [
        'var test = {',
        '  a: "b"',
        '};'
      ].join('\n'),
      output = 'var test={a:"b"};',
      coordmap = {
        0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,
        9:8,10:9,11:10,12:11,14:12,
      },
      sourcemap = [{
        generated: {'line': 1, 'column': 0},
        original:  {'line': 1, 'column': 0},
        source: 'input.js'
      }, {
        generated: {'line': 1, 'column': 1},
        original:  {'line': 1, 'column': 1},
        source: 'input.js'
      }];

  exports['test some simple stuff'] = function (assert, util) {
    var map = new SourceMapFileCollector({
      file: 'foo.js',
      sourceRoot: '.'
    });

    assert.ok(true);
  };

  exports['generates the same mapping as SourceMapGenerator'] = function (assert, util) {
    var map = new SourceMapGenerator({
      file: 'min.js',
      sourceRoot: '/the/root'
    });

    map.addMapping({
      generated: { line: 1, column: 1 },
      original: { line: 1, column: 1 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 5 },
      original: { line: 1, column: 5 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 9 },
      original: { line: 1, column: 11 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 18 },
      original: { line: 1, column: 21 },
      source: 'one.js',
      name: 'bar'
    });
    map.addMapping({
      generated: { line: 1, column: 21 },
      original: { line: 2, column: 3 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 28 },
      original: { line: 2, column: 10 },
      source: 'one.js',
      name: 'baz'
    });
    map.addMapping({
      generated: { line: 1, column: 32 },
      original: { line: 2, column: 14 },
      source: 'one.js',
      name: 'bar'
    });

    map.addMapping({
      generated: { line: 2, column: 1 },
      original: { line: 1, column: 1 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 5 },
      original: { line: 1, column: 5 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 9 },
      original: { line: 1, column: 11 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 18 },
      original: { line: 1, column: 21 },
      source: 'two.js',
      name: 'n'
    });
    map.addMapping({
      generated: { line: 2, column: 21 },
      original: { line: 2, column: 3 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 28 },
      original: { line: 2, column: 10 },
      source: 'two.js',
      name: 'n'
    });

    map = JSON.parse(map.toString());

    assert.equal(map.version, 3);
    assert.equal(map.file, 'min.js');
    assert.equal(map.names.length, 3);
    assert.equal(map.names[0], 'bar');
    assert.equal(map.names[1], 'baz');
    assert.equal(map.names[2], 'n');
    assert.equal(map.sources.length, 2);
    assert.equal(map.sources[0], 'one.js');
    assert.equal(map.sources[1], 'two.js');
    assert.equal(map.sourceRoot, '/the/root');
    assert.equal(map.mappings, 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA');
  };

});
