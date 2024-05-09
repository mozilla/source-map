/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2024 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const fs = require('node:fs/promises');
const SourceMapConsumer =
  require("../lib/source-map-consumer").SourceMapConsumer;

const sourceMapSpecTests = require("./source-map-tests/source-map-spec-tests.json");

async function readJSON(path) {
  const file = await fs.open(require.resolve(path));
  const json = JSON.parse(await file.readFile());
  file.close();
  return json;
}

// Known failures due to intentional implementation choices or due to bugs.
const skippedTests = [
  // Versions are explicitly checked a bit loosely.
  "versionNumericString",
  // Stricter sources array checking isn't implemented.
  "sourcesNotStringOrNull",
  "sourcesAndSourcesContentBothNull",
  // Stricter names array checking isn't implemented.
  "namesMissing",
  "namesNotString",
  // This check isn't as strict in this library.
  "invalidMappingNotAString1",
  // A mapping segment with no fields is technically invalid in the spec.
  "invalidMappingSegmentWithZeroFields",
  // These tests fail due to imprecision in the spec about the 32-bit limit.
  "invalidMappingSegmentWithColumnExceeding32Bits",
  "invalidMappingSegmentWithOriginalLineExceeding32Bits",
  "invalidMappingSegmentWithOriginalColumnExceeding32Bits",
  // A large VLQ that should parse, but currently does not.
  "validMappingLargeVLQ",
  // The library currently doesn't check the types of offset lines/columns.
  "indexMapOffsetLineWrongType",
  "indexMapOffsetColumnWrongType",
  // The spec is not totally clear about this case.
  "indexMapInvalidBaseMappings",
  // The spec's definition of overlap can be refined
  "indexMapInvalidOverlap",
  // Not clear if this test makes sense, but spec isn't clear on behavior
  "validMappingNullSources"
]

async function testMappingAction(assert, rawSourceMap, action) {
  return SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
    let mappedPosition = consumer.generatedPositionFor({
      source: action.originalSource,
      line: action.originalLine + 1,
      column: action.originalColumn
    });

    assert.equal(mappedPosition.line, action.generatedLine + 1, `generated line didn't match, expected ${action.generatedLine + 1} got ${mappedPosition.line}`);
    assert.equal(mappedPosition.column, action.generatedColumn, `generated column didn't match, expected ${action.generatedColumn} got ${mappedPosition.column}`);

    mappedPosition = consumer.originalPositionFor({
      line: action.generatedLine + 1,
      column: action.generatedColumn,
    });

    assert.equal(mappedPosition.line, action.originalLine + 1, `original line didn't match, expected ${action.originalLine + 1} got ${mappedPosition.line}`);
    assert.equal(mappedPosition.column, action.originalColumn, `original column didn't match, expected ${action.originalColumn} got ${mappedPosition.column}`);
    assert.equal(mappedPosition.source, action.originalSource, `original source didn't match, expected ${action.originalSource} got ${mappedPosition.source}`);
    if (action.mappedName)
      assert.equal(mappedPosition.name, action.mappedName, `mapped name didn't match, expected ${action.mappedName} got ${mappedPosition.name}`);
  });
}

async function testTransitiveMappingAction(assert, rawSourceMap, action) {
  return SourceMapConsumer.with(rawSourceMap, null, async (consumer) => {
    assert.ok(Array.isArray(action.intermediateMaps), "transitive mapping case requires intermediate maps");

    let mappedPosition = consumer.originalPositionFor({
      line: action.generatedLine + 1,
      column: action.generatedColumn,
    });

    for (let intermediateMapPath of action.intermediateMaps) {
      const intermediateMap = await readJSON(`./source-map-tests/resources/${intermediateMapPath}`);
      await SourceMapConsumer.with(intermediateMap, null, (consumer) => {
        mappedPosition = consumer.originalPositionFor({
          line: mappedPosition.line,
          column: mappedPosition.column,
        });
      });
    }

    assert.equal(mappedPosition.line, action.originalLine + 1, `original line didn't match, expected ${action.originalLine + 1} got ${mappedPosition.line}`);
    assert.equal(mappedPosition.column, action.originalColumn, `original column didn't match, expected ${action.originalColumn} got ${mappedPosition.column}`);
    assert.equal(mappedPosition.source, action.originalSource, `original source didn't match, expected ${action.originalSource} got ${mappedPosition.source}`);
  });
}

for (let testCase of sourceMapSpecTests.tests) {
  if (skippedTests.includes(testCase.name))
    continue;
  exports[`test from source map spec tests, name: ${testCase.name}`] =
    async function (assert) {
      const json = await readJSON(`./source-map-tests/resources/${testCase.sourceMapFile}`);
      let sourceMapFailed = false;
      try {
        const map = await new SourceMapConsumer(json);
        map.eachMapping(() => {});
        map.destroy();
      } catch (exn) {
        if (testCase.sourceMapIsValid)
          assert.fail("Expected valid source map but failed to load successfully: " + exn.message);
        return;
      }
      if (!testCase.sourceMapIsValid)
        assert.fail("Expected invalid source map but loaded successfully");
      if (testCase.testActions) {
        for (let testAction of testCase.testActions) {
          if (testAction.actionType == "checkMapping") {
            await testMappingAction(assert, json, testAction);
          } else if (testAction.actionType == "checkMappingTransitive") {
            await testTransitiveMappingAction(assert, json, testAction);
          }
        }
      }
    };
};
