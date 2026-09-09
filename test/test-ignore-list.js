/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const { SourceMapConsumer } = require("../source-map");

const cases = [
  ["standard field", { ignoreList: [1] }, [1]],
  ["legacy fallback", { x_google_ignoreList: [0] }, [0]],
  ["standard precedence", { ignoreList: [1], x_google_ignoreList: [0] }, [1]],
  ["empty standard field", { ignoreList: [], x_google_ignoreList: [0] }, []],
  ["absent fields", {}, null],
];

for (const [name, fields, expected] of cases) {
  exports["test ignoreList " + name] = async function (assert) {
    const raw = {
      version: 3,
      sources: ["app.js", "vendor.js"],
      names: [],
      mappings: "AAAA,CCAA",
      ...fields,
    };
    for (const input of [raw, JSON.stringify(raw)]) {
      await SourceMapConsumer.with(input, null, consumer => {
        if (expected === null) {
          assert.strictEqual(consumer.ignoreList, null);
        } else {
          assert.ok(Array.isArray(consumer.ignoreList));
          assert.equal(consumer.ignoreList.length, expected.length);
          expected.forEach((sourceIndex, i) => {
            assert.equal(consumer.ignoreList[i], sourceIndex);
            assert.equal(
              consumer.sources[sourceIndex],
              raw.sources[sourceIndex]
            );
          });
        }
        // The legacy property continues to reflect only the legacy input.
        assert.equal(
          JSON.stringify(consumer.x_google_ignoreList),
          JSON.stringify(fields.x_google_ignoreList || null)
        );
      });
    }
  };
}
