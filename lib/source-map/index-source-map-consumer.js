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
  var SourceMapConsumer = require("./source-map-consumer");

  var IndexSourceMapConsumer = function(sourcemap, fetcher, done) {
    SourceMapConsumer.call(this, sourcemap);
    
    console.log(this);
  };
  
  IndexSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    
  IndexSourceMapConsumer.prototype.fetchSubSourceMaps =
    function IndexSourceMapConsumer_fetchSubSourceMaps(fetcher, callback) {
      if(!fetcher) {
        fetcher = this.fetcher;
      }
      
      if(!callback) {
        callback = this.callback;
      }
      
      var urls;
      
      urls = this.sections.filter(function(section) {
        return section.url;
      }).map(function(section) {
        return section.url;
      });
      
      console.log(urls);
    };
    
  exports.IndexSourceMapConsumer = IndexSourceMapConsumer;

});
