/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define(function (require, exports, module) {

  var assert = require('assert');
  var base64 = require('source-map/base64');

  exports['test out of range encoding'] = function () {
    assert.throws(function () {
      base64.encode(-1);
    });
    assert.throws(function () {
      base64.encode(64);
    });
  };

  exports['test out of range decoding'] = function () {
    assert.throws(function () {
      base64.decode('=');
    });
  };

  exports['test normal encoding and decoding'] = function () {
    for (var i = 0; i < 64; i++) {
      assert.equal(base64.decode(base64.encode(i)), i);
    }
  };

});
