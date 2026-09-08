/*
 * Copyright 2026 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function freshReadWasm() {
  const modulePath = require.resolve("../lib/read-wasm");
  const cachedModule = require.cache[modulePath];
  delete require.cache[modulePath];
  const readWasm = require(modulePath);
  if (cachedModule) {
    require.cache[modulePath] = cachedModule;
  } else {
    delete require.cache[modulePath];
  }
  return readWasm;
}

exports["test readWasm uses initialized ArrayBuffer contents"] =
  async function (assert) {
    const readWasm = freshReadWasm();
    const contents = new ArrayBuffer(8);
    readWasm.initialize(contents);
    assert.ok(
      (await readWasm()) === contents,
      "uses the provided WASM contents"
    );
  };

exports["test readWasm still loads the bundled wasm by default"] =
  async function (assert) {
    const readWasm = freshReadWasm();
    const expected = fs.readFileSync(
      path.join(__dirname, "../lib/mappings.wasm")
    );
    assert.ok(Buffer.from(await readWasm()).equals(expected));
  };

exports["test Node consumers can initialize without an adjacent wasm file"] =
  function (assert) {
    // Use a fresh process so the shared WebAssembly cache cannot hide a failed
    // initialization. Bundling relocates read-wasm.js away from mappings.wasm.
    const output = execFileSync(
      process.execPath,
      [
        "-e",
        `
          const assert = require("assert");
          const fs = require("fs");
          const { SourceMapConsumer } = require("./source-map");
          const bytes = fs.readFileSync("./lib/mappings.wasm");
          const contents = bytes.buffer.slice(
            bytes.byteOffset, bytes.byteOffset + bytes.byteLength
          );
          fs.readFile = (_path, _options, callback) => {
            callback(new Error("No adjacent mappings.wasm"));
          };
          SourceMapConsumer.initialize({ "lib/mappings.wasm": contents });
          SourceMapConsumer.with({
            version: 3,
            sources: ["original.js"],
            names: [],
            mappings: "AAAA"
          }, null, consumer => {
            assert.deepStrictEqual(
              consumer.originalPositionFor({ line: 1, column: 0 }),
              { source: "original.js", line: 1, column: 0, name: null }
            );
            console.log("initialized");
          }).catch(error => {
            console.error(error);
            process.exitCode = 1;
          });
        `,
      ],
      { cwd: path.join(__dirname, ".."), encoding: "utf8" }
    );
    assert.strictEqual(output.trim(), "initialized");
  };
