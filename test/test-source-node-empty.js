/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const SourceNode = require("../lib/source-node").SourceNode;

exports["test .replaceRight on an empty node"] = function (assert) {
  const node = new SourceNode();
  assert.equal(node.replaceRight(/$/, "suffix"), node);
  assert.equal(node.toString(), "suffix");
};

exports["test .replaceRight after ignored empty chunks"] = function (assert) {
  const node = new SourceNode(null, null, null, ["", [""]]);
  assert.equal(node.children.length, 0);
  assert.equal(node.replaceRight(/missing/, "replacement"), node);
  assert.equal(node.toString(), "");
};

exports["test .replaceRight on a nested empty node"] = function (assert) {
  const child = new SourceNode();
  const node = new SourceNode(null, null, null, ["prefix", child]);
  assert.equal(node.replaceRight(/$/, "suffix"), node);
  assert.equal(node.toString(), "prefixsuffix");
  assert.equal(node.children[1], child);
  assert.equal(child.toString(), "suffix");
};

exports["test .replaceRight empty string pattern"] = function (assert) {
  const node = new SourceNode();
  assert.equal(node.replaceRight("", "inserted"), node);
  assert.equal(node.toString(), "inserted");
};

exports["test .replaceRight callback on an empty node"] = function (assert) {
  const node = new SourceNode();
  let calls = 0;
  assert.equal(
    node.replaceRight(/$/, function (match, offset, input) {
      calls++;
      assert.equal(match, "");
      assert.equal(offset, 0);
      assert.equal(input, "");
      return "generated";
    }),
    node
  );
  assert.equal(calls, 1);
  assert.equal(node.toString(), "generated");
};

exports["test .replaceRight mapped callback preserves original location"] = function (assert) {
  const node = new SourceNode(4, 2, "input.js", "hello world", "original");
  let calls = 0;
  assert.equal(
    node.replaceRight(/world/, function (match, offset, input) {
      calls++;
      assert.equal(match, "world");
      assert.equal(offset, 6);
      assert.equal(input, "hello world");
      return "universe";
    }),
    node
  );
  assert.equal(calls, 1);
  assert.equal(node.toString(), "hello universe");
  let snippets = 0;
  node.walk(function (text, location) {
    snippets++;
    assert.equal(text, "hello universe");
    assert.equal(location.source, "input.js");
    assert.equal(location.line, 4);
    assert.equal(location.column, 2);
    assert.equal(location.name, "original");
  });
  assert.equal(snippets, 1);
};

exports["test .replaceRight changes only the rightmost unmapped snippet"] = function (assert) {
  const node = new SourceNode(null, null, null, ["left world ", "right world"]);
  assert.equal(node.replaceRight(/world/, "end"), node);
  assert.equal(node.toString(), "left world right end");
  assert.equal(node.children[0], "left world ");
};

exports["test .replaceRight nonmatching pattern preserves text"] = function (assert) {
  const node = new SourceNode(null, null, null, "unchanged");
  let calls = 0;
  assert.equal(
    node.replaceRight(/absent/, function () {
      calls++;
      return "replacement";
    }),
    node
  );
  assert.equal(calls, 0);
  assert.equal(node.toString(), "unchanged");
};
