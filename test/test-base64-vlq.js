/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = require('../lib/base64-vlq');

exports['test normal encoding and decoding'] = function (assert) {
  var result = {};
  for (var i = -255; i < 256; i++) {
    var str = base64VLQ.encode(i);
    base64VLQ.decode(str, 0, result);
    assert.equal(result.value, i);
    assert.equal(result.rest, str.length);
  }
};
