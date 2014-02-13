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

  var libUtil = require('../../lib/source-map/util');

  exports['test normalize()'] = function (assert, util) {
    assert.equal(libUtil.normalize('/..'), '/');
    assert.equal(libUtil.normalize('/../'), '/');
    assert.equal(libUtil.normalize('/../../../..'), '/');
    assert.equal(libUtil.normalize('/../../../../a/b/c'), '/a/b/c');
    assert.equal(libUtil.normalize('/a/b/c/../../../d/../../e'), '/e');

    assert.equal(libUtil.normalize('..'), '..');
    assert.equal(libUtil.normalize('../'), '../');
    assert.equal(libUtil.normalize('../../a/'), '../../a/');
    assert.equal(libUtil.normalize('a/..'), '.');
    assert.equal(libUtil.normalize('a/../../..'), '../..');

    assert.equal(libUtil.normalize('/.'), '/');
    assert.equal(libUtil.normalize('/./'), '/');
    assert.equal(libUtil.normalize('/./././.'), '/');
    assert.equal(libUtil.normalize('/././././a/b/c'), '/a/b/c');
    assert.equal(libUtil.normalize('/a/b/c/./././d/././e'), '/a/b/c/d/e');

    assert.equal(libUtil.normalize('.'), '.');
    assert.equal(libUtil.normalize('./'), '.');
    assert.equal(libUtil.normalize('././a'), 'a');
    assert.equal(libUtil.normalize('a/./'), 'a/');
    assert.equal(libUtil.normalize('a/././.'), 'a');

    assert.equal(libUtil.normalize('///a/b//c////d/////'), '/a/b/c/d/');
    assert.equal(libUtil.normalize('a/b//c////d'), 'a/b/c/d');

    assert.equal(libUtil.normalize('.///.././../a/b//./..'), '../../a')

    assert.equal(libUtil.normalize('http://www.example.com'), 'http://www.example.com');
    assert.equal(libUtil.normalize('http://www.example.com/'), 'http://www.example.com/');
    assert.equal(libUtil.normalize('http://www.example.com/./..//a/b/c/.././d//'), 'http://www.example.com/a/b/d/');
  };

  exports['test join()'] = function (assert, util) {
    assert.equal(libUtil.join('a', 'b'), 'a/b');
    assert.equal(libUtil.join('a/', 'b'), 'a/b');
    assert.equal(libUtil.join('a//', 'b'), 'a/b');
    assert.equal(libUtil.join('a', 'b/'), 'a/b/');
    assert.equal(libUtil.join('a', 'b//'), 'a/b/');
    assert.equal(libUtil.join('a/', '/b'), 'a/b');
    assert.equal(libUtil.join('a//', '//b'), 'a/b');

    assert.equal(libUtil.join('a', '..'), '.');
    assert.equal(libUtil.join('a', '../b'), 'b');
    assert.equal(libUtil.join('a/b', '../c'), 'a/c');

    assert.equal(libUtil.join('a', '.'), 'a');
    assert.equal(libUtil.join('a', './b'), 'a/b');
    assert.equal(libUtil.join('a/b', './c'), 'a/b/c');

    assert.equal(libUtil.join('a', 'http://www.example.com'), 'http://www.example.com');
    assert.equal(libUtil.join('a', 'data:foo,bar'), 'data:foo,bar');

    assert.equal(libUtil.join('http://', 'www.example.com'), 'http://www.example.com');
  };

});
