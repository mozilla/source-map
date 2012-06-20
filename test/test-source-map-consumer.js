/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define(function (require, exports, module) {

  var SourceMapConsumer = require('source-map/source-map-consumer').SourceMapConsumer;
  var testUtil = require('./util');

  exports['test that we can instantiate with a string or an objects'] = function (assert) {
    assert.doesNotThrow(function () {
      var map = new SourceMapConsumer(testUtil.testMap);
    });
    assert.doesNotThrow(function () {
      var map = new SourceMapConsumer(JSON.stringify(testUtil.testMap));
    });
  };

  exports['test that the source root is reflected in a mapping\'s source field'] = function (assert) {
    var map = new SourceMapConsumer(testUtil.testMap);
    var mapping;

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
  };

  exports['test mapping tokens back exactly'] = function (assert) {
    var map = new SourceMapConsumer(testUtil.testMap);

    testUtil.assertMapping(1, 1, '/the/root/one.js', 1, 1, null, map, assert);
    testUtil.assertMapping(1, 5, '/the/root/one.js', 1, 5, null, map, assert);
    testUtil.assertMapping(1, 9, '/the/root/one.js', 1, 11, null, map, assert);
    testUtil.assertMapping(1, 18, '/the/root/one.js', 1, 21, 'bar', map, assert);
    testUtil.assertMapping(1, 21, '/the/root/one.js', 2, 3, null, map, assert);
    testUtil.assertMapping(1, 28, '/the/root/one.js', 2, 10, 'baz', map, assert);
    testUtil.assertMapping(1, 32, '/the/root/one.js', 2, 14, 'bar', map, assert);

    testUtil.assertMapping(2, 1, '/the/root/two.js', 1, 1, null, map, assert);
    testUtil.assertMapping(2, 5, '/the/root/two.js', 1, 5, null, map, assert);
    testUtil.assertMapping(2, 9, '/the/root/two.js', 1, 11, null, map, assert);
    testUtil.assertMapping(2, 18, '/the/root/two.js', 1, 21, 'n', map, assert);
    testUtil.assertMapping(2, 21, '/the/root/two.js', 2, 3, null, map, assert);
    testUtil.assertMapping(2, 28, '/the/root/two.js', 2, 10, 'n', map, assert);
  };

  exports['test mapping tokens back fuzzy'] = function (assert) {
    var map = new SourceMapConsumer(testUtil.testMap);

    testUtil.assertMapping(1, 20, '/the/root/one.js', 1, 21, 'bar', map, assert);
    testUtil.assertMapping(1, 30, '/the/root/one.js', 2, 10, 'baz', map, assert);
    testUtil.assertMapping(2, 12, '/the/root/two.js', 1, 11, null, map, assert);
  };

});
