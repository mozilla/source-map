/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2012 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
var sourceMap;
try {
  sourceMap = require('../../lib/source-map');
} catch (e) {
  var loader = Components.utils.import("resource://gre/modules/devtools/Loader.jsm", {});
  sourceMap = loader.devtools.require("devtools/toolkit/sourcemap/source-map");
}

exports['test that the api is properly exposed in the top level'] = function (assert, util) {
  assert.equal(typeof sourceMap.SourceMapGenerator, "function");
  assert.equal(typeof sourceMap.SourceMapConsumer, "function");
  assert.equal(typeof sourceMap.SourceNode, "function");
};
