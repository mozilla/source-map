/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var lib_util = require('../../lib/source-map/util');

  exports['test normalize()'] = function (assert, util) {
    assert.equal(lib_util.normalize('/..'), '/');
    assert.equal(lib_util.normalize('/../'), '/');
    assert.equal(lib_util.normalize('/../../../..'), '/');
    assert.equal(lib_util.normalize('/../../../../a/b/c'), '/a/b/c');
    assert.equal(lib_util.normalize('/a/b/c/../../../d/../../e'), '/e');

    assert.equal(lib_util.normalize('..'), '..');
    assert.equal(lib_util.normalize('../'), '../');
    assert.equal(lib_util.normalize('../../a/'), '../../a/');
    assert.equal(lib_util.normalize('a/..'), '.');
    assert.equal(lib_util.normalize('a/../../..'), '../..');

    assert.equal(lib_util.normalize('/.'), '/');
    assert.equal(lib_util.normalize('/./'), '/');
    assert.equal(lib_util.normalize('/./././.'), '/');
    assert.equal(lib_util.normalize('/././././a/b/c'), '/a/b/c');
    assert.equal(lib_util.normalize('/a/b/c/./././d/././e'), '/a/b/c/d/e');

    assert.equal(lib_util.normalize('.'), '.');
    assert.equal(lib_util.normalize('./'), '.');
    assert.equal(lib_util.normalize('././a'), 'a');
    assert.equal(lib_util.normalize('a/./'), 'a/');
    assert.equal(lib_util.normalize('a/././.'), 'a');

    assert.equal(lib_util.normalize('///a/b//c////d/////'), '/a/b/c/d/');
    assert.equal(lib_util.normalize('a/b//c////d'), 'a/b/c/d');

    assert.equal(lib_util.normalize('.///.././../a/b//./..'), '../../a')

    assert.equal(lib_util.normalize('http://www.example.com'), 'http://www.example.com');
    assert.equal(lib_util.normalize('http://www.example.com/'), 'http://www.example.com/');
    assert.equal(lib_util.normalize('http://www.example.com/./..//a/b/c/.././d//'), 'http://www.example.com/a/b/d/');
  };

  exports['test join()'] = function (assert, util) {
    assert.equal(lib_util.join('a', 'b'), 'a/b');
    assert.equal(lib_util.join('a/', 'b'), 'a/b');
    assert.equal(lib_util.join('a//', 'b'), 'a/b');
    assert.equal(lib_util.join('a', 'b/'), 'a/b/');
    assert.equal(lib_util.join('a', 'b//'), 'a/b/');
    assert.equal(lib_util.join('a/', '/b'), 'a/b');
    assert.equal(lib_util.join('a//', '//b'), 'a/b');

    assert.equal(lib_util.join('a', '..'), '.');
    assert.equal(lib_util.join('a', '../b'), 'b');
    assert.equal(lib_util.join('a/b', '../c'), 'a/c');

    assert.equal(lib_util.join('a', '.'), 'a');
    assert.equal(lib_util.join('a', './b'), 'a/b');
    assert.equal(lib_util.join('a/b', './c'), 'a/b/c');

    assert.equal(lib_util.join('a', 'http://www.example.com'), 'http://www.example.com');
    assert.equal(lib_util.join('a', 'data:foo,bar'), 'data:foo,bar');

    assert.equal(lib_util.join('http://', 'www.example.com'), 'http://www.example.com');
  };

});
