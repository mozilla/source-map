/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define(function (require, exports, module) {

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
  exports.testMap = {
    version: 3,
    file: 'min.js',
    names: ['bar', 'baz', 'n'],
    sources: ['one.js', 'two.js'],
    sourceRoot: '/the/root',
    mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA'
  };

  function assertMapping(generatedLine, generatedColumn, originalSource,
                         originalLine, originalColumn, name, map, assert) {
    var mapping = map.originalPositionFor({
      line: generatedLine,
      column: generatedColumn
    });
    assert.equal(mapping.name, name,
                 'Incorrect name, expected ' + JSON.stringify(name)
                 + ', got ' + JSON.stringify(mapping.name));
    assert.equal(mapping.line, originalLine,
                 'Incorrect line, expected ' + JSON.stringify(originalLine)
                 + ', got ' + JSON.stringify(mapping.line));
    assert.equal(mapping.column, originalColumn,
                 'Incorrect column, expected ' + JSON.stringify(originalColumn)
                 + ', got ' + JSON.stringify(mapping.column));
    assert.equal(mapping.source, originalSource,
                 'Incorrect source, expected ' + JSON.stringify(originalSource)
                 + ', got ' + JSON.stringify(mapping.source));
  }
  exports.assertMapping = assertMapping;

});
