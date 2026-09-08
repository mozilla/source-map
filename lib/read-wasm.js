"use strict";

// Note: This file is replaced with "read-wasm-browser.js" when this module is
// bundled with a packager that takes package.json#browser fields into account.

const fs = require("fs");
const path = require("path");

let mappingsWasm = null;

module.exports = function readWasm() {
  if (mappingsWasm instanceof ArrayBuffer) {
    return Promise.resolve(mappingsWasm);
  }

  return new Promise((resolve, reject) => {
    const wasmPath = path.join(__dirname, "mappings.wasm");
    fs.readFile(wasmPath, null, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data.buffer);
    });
  });
};

module.exports.initialize = input => {
  mappingsWasm = input;
  if (mappingsWasm instanceof ArrayBuffer) {
    return;
  }
  console.debug(
    "SourceMapConsumer.initialize only supports ArrayBuffer contents in node.js"
  );
};
