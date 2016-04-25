/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var quickSort = require('../lib/quick-sort').quickSort;

function numberCompare(a, b) {
  return a - b;
}

exports['test sorting sorted array'] = function (assert) {
  var ary = [0,1,2,3,4,5,6,7,8,9];

  var quickSorted = ary.slice();
  quickSort(quickSorted, numberCompare);

  assert.equal(JSON.stringify(ary),
               JSON.stringify(quickSorted));
};

exports['test sorting reverse-sorted array'] = function (assert) {
  var ary = [9,8,7,6,5,4,3,2,1,0];

  var quickSorted = ary.slice();
  quickSort(quickSorted, numberCompare);

  assert.equal(JSON.stringify(ary.sort(numberCompare)),
               JSON.stringify(quickSorted));
};

exports['test sorting unsorted array'] = function (assert) {
  var ary = [];
  for (var i = 0; i < 10; i++) {
    ary.push(Math.random());
  }

  var quickSorted = ary.slice();
  quickSort(quickSorted, numberCompare);

  assert.equal(JSON.stringify(ary.sort(numberCompare)),
               JSON.stringify(quickSorted));
};
