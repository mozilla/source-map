"use strict";

let mappingsWasm = null;
let cachedGlue = null;

module.exports = function readWasm() {
  if (
    typeof mappingsWasm !== "string" &&
    !(mappingsWasm instanceof ArrayBuffer)
  ) {
    throw new Error(
      "You must provide the string URL or ArrayBuffer contents " +
        "of lib/mappings.wasm by calling " +
        "SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) " +
        "before using SourceMapConsumer"
    );
  }

  if (cachedGlue) {
    return cachedGlue;
  }

  // The browser glue is an ES module; `import()` keeps this file loadable as
  // CommonJS. `default` is wasm-bindgen's async init, which accepts either a
  // URL to fetch or the module bytes directly.
  cachedGlue = import("./mappings-glue-browser.mjs")
    .then(glue =>
      glue.default({ module_or_path: mappingsWasm }).then(() => glue)
    )
    .catch(e => {
      cachedGlue = null;
      throw e;
    });

  return cachedGlue;
};

module.exports.initialize = input => {
  mappingsWasm = input;
};
