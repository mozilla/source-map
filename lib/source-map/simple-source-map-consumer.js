/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {
  
  var SourceMapConsumer = require("./source-map-consumer");

  var SimpleSourceMapConsumer = function() {
    SourceMapConsumer.apply(this, Array.prototype.slice.apply(arguments));
  };
  
  SimpleSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  SimpleSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    
  exports.SimpleSourceMapConsumer = SimpleSourceMapConsumer;

});
