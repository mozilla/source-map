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
  
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;
  
  var SourceMapConsumer = require("./source-map-consumer").SourceMapConsumer;
  
  var SimpleSourceMapConsumer = function() {
    SourceMapConsumer.apply(this, Array.prototype.slice.apply(arguments));
    
    var sources = util.getArg(this._sourceMap, 'sources');
    var names = util.getArg(this._sourceMap, 'names');
    var mappings = util.getArg(this._sourceMap, 'mappings');
    var sourceRoot = util.getArg(this._sourceMap, 'sourceRoot', null);
    
    this._names = ArraySet.fromArray(names);
    this._sources = ArraySet.fromArray(sources);
    this.sourceRoot = sourceRoot;
    this.sourcesContent = util.getArg(this._sourceMap, 'sourcesContent', null);;

    this._parseMappings(mappings, sourceRoot);
  };
  
  SimpleSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  SimpleSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    
  exports.SimpleSourceMapConsumer = SimpleSourceMapConsumer;

});
