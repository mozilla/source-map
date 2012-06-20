/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define(function (require, exports, module) {

  var assert = require('assert');
  var util = require('./util');
  var SourceMapConsumer = require('source-map/source-map-consumer').SourceMapConsumer;
  var SourceMapGenerator = require('source-map/source-map-generator').SourceMapGenerator;

  exports['test eating our own dog food'] = function () {
    var smg = new SourceMapGenerator({
      file: 'testing.js',
      sourceRoot: '/wu/tang'
    });

    smg.addMapping({
      source: 'gza.coffee',
      original: { line: 1, column: 0 },
      generated: { line: 2, column: 2 }
    });

    smg.addMapping({
      source: 'gza.coffee',
      original: { line: 2, column: 0 },
      generated: { line: 3, column: 2 }
    });

    smg.addMapping({
      source: 'gza.coffee',
      original: { line: 3, column: 0 },
      generated: { line: 4, column: 2 }
    });

    smg.addMapping({
      source: 'gza.coffee',
      original: { line: 4, column: 0 },
      generated: { line: 5, column: 2 }
    });

    var smc = new SourceMapConsumer(smg.toString());

    // Exact
    util.assertMapping(2, 2, '/wu/tang/gza.coffee', 1, 0, null, smc);
    util.assertMapping(3, 2, '/wu/tang/gza.coffee', 2, 0, null, smc);
    util.assertMapping(4, 2, '/wu/tang/gza.coffee', 3, 0, null, smc);
    util.assertMapping(5, 2, '/wu/tang/gza.coffee', 4, 0, null, smc);

    // Fuzzy
    util.assertMapping(2, 0, null, null, null, null, smc);
    util.assertMapping(2, 9, '/wu/tang/gza.coffee', 1, 0, null, smc);
    util.assertMapping(3, 0, '/wu/tang/gza.coffee', 1, 0, null, smc);
    util.assertMapping(3, 9, '/wu/tang/gza.coffee', 2, 0, null, smc);
    util.assertMapping(4, 0, '/wu/tang/gza.coffee', 2, 0, null, smc);
    util.assertMapping(4, 9, '/wu/tang/gza.coffee', 3, 0, null, smc);
    util.assertMapping(5, 0, '/wu/tang/gza.coffee', 3, 0, null, smc);
    util.assertMapping(5, 9, '/wu/tang/gza.coffee', 4, 0, null, smc);
  };

});
